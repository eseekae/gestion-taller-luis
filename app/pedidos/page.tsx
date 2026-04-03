'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx-js-style'
import { ArrowLeft, Search, School, Phone, Calendar, Printer, Trash2, MessageCircle, Download, MessageSquare, Bell, Package, CheckCircle, X, Banknote } from 'lucide-react'

export default function VerPedidos() {
  const router = useRouter()
  const [datos, setDatos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({})
  const [logs, setLogs] = useState<any[]>([])

  // ESTADO PARA EL NUEVO MODAL DE PAGO
  const [modalPago, setModalPago] = useState({
    open: false,
    pedidoId: null as string | null,
    nombreCliente: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    metodo: 'Transferencia'
  })

  const cargar = useCallback(async () => {
    if (!sessionStorage.getItem('user_role')) return router.push('/login')
    setLoading(true)

    const [pRes, cRes, iRes, dRes, pagosRes, aRes] = await Promise.all([
      supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
      supabase.from('clientes').select('*'),
      supabase.from('inventario').select('*'),
      supabase.from('detalles_pedido').select('*').order('id'),
      supabase.from('pagos').select('*').order('created_at', { ascending: true }),
      supabase.from('auditoria').select('*').order('fecha', { ascending: false }).limit(20)
    ])
    setLogs(aRes.data || [])
    
    const cruzados = (pRes.data || []).map(p => {
      const cliente = cRes.data?.find(c => c.id === p.cliente_id)
      const pagos = (pagosRes.data || []).filter(pg => pg.pedido_id === p.id)
      const totalPagado = pagos.reduce((acc, pg) => acc + Number(pg.monto || 0), 0)
      const detalles = dRes.data?.filter(d => d.pedido_id === p.id).map(d => {
        const prod = iRes.data?.find(inv => inv.id === d.producto_id)
        return { ...d, p_nombre: prod?.nombre || 'Producto' }
      })

      // LÓGICA DE ESTADOS INDEPENDIENTE DEL PAGO
      const itemsEntregados = detalles?.length > 0 && detalles.every(d => d.estado === 'Entregado')
      const itemsListos = detalles?.length > 0 && detalles.every(d => d.estado === 'Listo para retiro' || d.estado === 'Notificado' || d.estado === 'Entregado')
      const pagoCompleto = totalPagado >= p.total_final
      
      let estadoMacro = ''
      let colorBg = ''
      let colorText = '#000'

      if (itemsEntregados && pagoCompleto) {
        estadoMacro = 'FINALIZADO (OK)'; colorBg = '#4ade80'
      } else if (itemsEntregados && !pagoCompleto) {
        estadoMacro = 'ENTREGADO (DEUDA)'; colorBg = '#fbbf24'
      } else if (itemsListos) {
        estadoMacro = pagoCompleto ? 'LISTO (PAGADO)' : 'LISTO (PEND. PAGO)'; 
        colorBg = '#3b82f6'; colorText = '#fff'
      } else {
        estadoMacro = 'EN TALLER'; colorBg = '#f1f5f9'
      }

      return { 
        ...p, c_nombre: cliente?.nombre || 'S/N', c_telefono: cliente?.telefono || '', 
        detalles, pagos, total_pagado: totalPagado, estado_macro: estadoMacro, color_bg: colorBg, color_text: colorText,
        pagoCompleto, itemsEntregados, itemsListos
      }
    })
    setDatos(cruzados)
    setLoading(false)
  }, [router])

  useEffect(() => { cargar() }, [cargar])

  // --- FUNCIONES DE ACCIÓN ---

  const notificarCliente = async (pedido: any) => {
    if (!confirm(`¿Confirmar aviso a ${pedido.c_nombre}?`)) return
    try {
      await supabase.from('detalles_pedido').update({ estado: 'Notificado' }).eq('pedido_id', pedido.id).neq('estado', 'Entregado')
      await registrarLog(`Avisó a cliente: ${pedido.c_nombre}`, `Pedido ${pedido.id}`)
      cargar()
    } catch (err) { alert("Error al notificar") }
  }

  const entregarTodo = async (pedido: any) => {
    if (!confirm(`¿Marcar pedido como RETIRADO por el cliente?`)) return
    try {
      const promesas = pedido.detalles.map((det: any) => 
        supabase.from('detalles_pedido').update({ estado: 'Entregado', cantidad_entregada: det.cantidad }).eq('id', det.id)
      )
      await Promise.all(promesas)
      await supabase.from('pedidos').update({ estado: 'Completado' }).eq('id', pedido.id)
      await registrarLog(`ENTREGA TOTAL a ${pedido.c_nombre}`, `Pedido ${pedido.id}`)
      cargar()
    } catch (err) { alert("Error al entregar") }
  }

  const guardarPago = async () => {
    const { pedidoId, monto, fecha, metodo, nombreCliente } = modalPago
    if (!monto || Number(monto) <= 0) return alert("Ingresa un monto válido")

    try {
      await supabase.from('pagos').insert([{
        pedido_id: pedidoId, monto: Number(monto), fecha_pago: fecha, 
        metodo_pago: metodo, creado_por: sessionStorage.getItem('user_name') || 'Don Luis'
      }])
      await registrarLog(`Registró pago de $${monto} (${metodo})`, `Cliente: ${nombreCliente}`)
      setModalPago({ ...modalPago, open: false, monto: '' })
      cargar()
    } catch (err) { alert("Error al guardar pago") }
  }

  const borrarPedido = async (id: string, nombre: string) => {
    if(!confirm('⚠️ ¿Borrar pedido?')) return
    try {
      await supabase.from('pagos').delete().eq('pedido_id', id)
      await supabase.from('detalles_pedido').delete().eq('pedido_id', id)
      await supabase.from('pedidos').delete().eq('id', id)
      await registrarLog(`Eliminó pedido de ${nombre}`, `ID: ${id}`)
      cargar()
    } catch (err) { alert('❌ Error.') }
  }

  const filtrados = datos.filter(p => {
    const t = busqueda.toLowerCase()
    return p.c_nombre.toLowerCase().includes(t) || p.c_telefono.includes(t) || (p.colegio && p.colegio.toLowerCase().includes(t))
  }).filter(p => filtro === 'Todos' || (filtro === 'Pendientes' && p.estado_macro !== 'FINALIZADO (OK)') || p.estado_macro === filtro)

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}><ArrowLeft size={20} color="#000" /></button>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#000' }}>Pedidos Recientes</h1>
          <div style={{width: '40px'}}></div>
        </div>

        {/* BUSCADOR */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '14px' }} size={20} color="#000" />
            <input placeholder="Buscar cliente o colegio..." style={{ width: '100%', padding: '14px 40px', border: '3px solid #000', borderRadius: '12px', fontWeight: '700', boxShadow: '4px 4px 0px #000', color: '#000' }} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </div>

        {/* LISTADO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {filtrados.map(p => {
            const deuda = p.total_final - (p.total_pagado || 0)
            const expandido = !!expandidos[p.id]
            const fechaEntrega = p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleDateString('es-CL') : 'POR DEFINIR'

            return (
              <div key={p.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '3px solid #000', boxShadow: '8px 8px 0px #000' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div>
                    {/* ID DEL PEDIDO AÑADIDO AQUÍ */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ background: '#fbbf24', border: '2px solid #000', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', color: '#000' }}>
                        ID #{p.id}
                      </span>
                      <span style={{ fontWeight: '900', fontSize: '11px', color: '#000', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                        <School size={12} /> {p.colegio || 'Particular'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#000', color: '#fff', padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900' }}>
                      <Calendar size={14} /> ENTREGA: {fechaEntrega}
                    </div>
                  </div>
                  <span style={{ backgroundColor: p.color_bg, color: p.color_text, padding: '6px 12px', borderRadius: '8px', fontWeight: '900', border: '2px solid #000', fontSize: '10px' }}>{p.estado_macro}</span>
                </div>

                <h2 style={{ fontWeight: '900', fontSize: '24px', color: '#000', marginBottom: '4px' }}>{p.c_nombre}</h2>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#000', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={14} /> {p.c_telefono}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <button 
                    onClick={() => notificarCliente(p)}
                    disabled={p.itemsEntregados}
                    style={{ backgroundColor: '#3b82f6', color: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '3px 3px 0px #000', opacity: p.itemsEntregados ? 0.4 : 1 }}
                  >
                    <Bell size={16} /> AVISAR CLIENTE
                  </button>
                  <button 
                    onClick={() => entregarTodo(p)}
                    disabled={p.itemsEntregados}
                    style={{ backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '3px 3px 0px #000', opacity: p.itemsEntregados ? 0.4 : 1 }}
                  >
                    <Package size={16} /> ENTREGAR TODO
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '16px', border: '3px solid #000' }}>
                    <p style={{ fontSize: '10px', fontWeight: '900', color: '#000' }}>PAGADO</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#166534' }}>${Number(p.total_pagado || 0).toLocaleString('es-CL')}</p>
                    <button 
                       onClick={() => setModalPago({ ...modalPago, open: true, pedidoId: p.id, nombreCliente: p.c_nombre })}
                       style={{ background: '#000', color: '#fff', padding: '5px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', marginTop: '8px', border: 'none', cursor: 'pointer' }}
                    >
                      + PAGO
                    </button>
                  </div>
                  <div style={{ background: deuda > 0 ? '#fef2f2' : '#f0fdf4', padding: '16px', borderRadius: '16px', border: '3px solid #000' }}>
                    <p style={{ fontSize: '10px', fontWeight: '900', color: '#000' }}>DEUDA</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: deuda > 0 ? '#991b1b' : '#166534' }}>${deuda.toLocaleString('es-CL')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '3px solid #000', paddingTop: '16px' }}>
                  <button onClick={() => borrarPedido(p.id, p.c_nombre)} style={{ color: '#991b1b', fontWeight: '900', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}><Trash2 size={16} /> Borrar</button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => window.open(`https://wa.me/${p.c_telefono}`, '_blank')} style={{ background: '#25D366', color: '#fff', padding: '10px', borderRadius: '12px', border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}><MessageCircle size={18} /></button>
                    <button onClick={() => window.open(`/ticket/${p.id}`, '_blank')} style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '12px', border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}><Printer size={18} /></button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* MODAL DE PAGO */}
        <AnimatePresence>
          {modalPago.open && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '12px 12px 0px #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: '900', fontSize: '20px', color: '#000' }}>Nuevo Pago</h3>
                  <button onClick={() => setModalPago({...modalPago, open: false})} style={{ background: 'none', border: 'none' }}><X color="#000" /></button>
                </div>
                <p style={{ fontSize: '14px', fontWeight: '900', marginBottom: '15px', color: '#000' }}>Cliente: {modalPago.nombreCliente}</p>
                
                <label style={{ fontSize: '11px', fontWeight: '900', display: 'block', marginBottom: '5px', color: '#000' }}>MONTO $</label>
                <input type="number" style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '12px', fontWeight: '900', marginBottom: '15px', color: '#000' }} value={modalPago.monto} onChange={e => setModalPago({...modalPago, monto: e.target.value})} />
                
                <label style={{ fontSize: '11px', fontWeight: '900', display: 'block', marginBottom: '5px', color: '#000' }}>FECHA</label>
                <input type="date" style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '12px', fontWeight: '900', marginBottom: '15px', color: '#000' }} value={modalPago.fecha} onChange={e => setModalPago({...modalPago, fecha: e.target.value})} />
                
                <label style={{ fontSize: '11px', fontWeight: '900', display: 'block', marginBottom: '5px', color: '#000' }}>MÉTODO</label>
                <select style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '12px', fontWeight: '900', marginBottom: '25px', color: '#000' }} value={modalPago.metodo} onChange={e => setModalPago({...modalPago, metodo: e.target.value})}>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                </select>

                <button onClick={guardarPago} style={{ width: '100%', backgroundColor: '#4ade80', color: '#000', padding: '15px', borderRadius: '15px', border: '3px solid #000', fontWeight: '900', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
                  CONFIRMAR PAGO
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}