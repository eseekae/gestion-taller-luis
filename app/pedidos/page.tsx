'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Search, School, Phone, Calendar, Printer, Trash2, 
  MessageCircle, MessageSquare, Bell, Package, CheckCircle, 
  X, History, User, CreditCard 
} from 'lucide-react'

export default function VerPedidos() {
  const router = useRouter()
  const [datos, setDatos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({})
  const [logs, setLogs] = useState<any[]>([])

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

  // ESTILOS UNIFICADOS
  const containerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }
  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '28px', border: '4px solid #000', boxShadow: '8px 8px 0px #000' }

  return (
    <main style={containerStyle}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '16px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
            <ArrowLeft size={24} color="#000" />
          </motion.button>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '950', color: '#000', letterSpacing: '-1.5px' }}>GESTIÓN PEDIDOS</h1>
        </motion.div>

        {/* BUSCADOR PRO */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '16px' }} size={22} color="#000" />
            <input 
              placeholder="Buscar por cliente, colegio o ID..." 
              style={{ width: '100%', padding: '16px 16px 16px 50px', border: '4px solid #000', borderRadius: '20px', fontWeight: '800', boxShadow: '6px 6px 0px #000', fontSize: '16px', color: '#000', outline: 'none' }} 
              onChange={(e) => setBusqueda(e.target.value)} 
            />
          </div>
        </motion.div>

        {/* LISTADO DE PEDIDOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {filtrados.map((p, idx) => {
            const deuda = p.total_final - (p.total_pagado || 0)
            const fechaEntrega = p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleDateString('es-CL') : 'S/F'

            return (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.05 }}
                style={cardStyle}
              >
                {/* CABECERA DE FICHA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: '#fbbf24', border: '2px solid #000', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '950' }}>#{p.id}</span>
                      <span style={{ backgroundColor: p.color_bg, color: p.color_text, padding: '4px 12px', borderRadius: '10px', fontWeight: '900', border: '2px solid #000', fontSize: '11px' }}>{p.estado_macro}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000', fontWeight: '800', fontSize: '12px' }}>
                      <Calendar size={14} /> ENTREGA: {fechaEntrega}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: '950', color: '#64748b' }}>COLEGIO</p>
                    <p style={{ margin: 0, fontWeight: '900', fontSize: '13px' }}><School size={14} inline /> {p.colegio || 'Particular'}</p>
                  </div>
                </div>

                {/* NOMBRE Y CONTACTO */}
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontWeight: '950', fontSize: '26px', color: '#000', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>{p.c_nombre}</h2>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {p.c_telefono}</span>
                  </div>
                </div>

                {/* ACCIONES NEUBRUTALISTAS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 2, boxShadow: 'none' }}
                    onClick={() => notificarCliente(p)}
                    disabled={p.itemsEntregados}
                    style={{ backgroundColor: '#3b82f6', color: '#fff', border: '3px solid #000', padding: '14px', borderRadius: '16px', fontWeight: '950', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '4px 4px 0px #000', cursor: 'pointer', opacity: p.itemsEntregados ? 0.3 : 1 }}
                  >
                    <Bell size={18} /> AVISAR
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 2, boxShadow: 'none' }}
                    onClick={() => entregarTodo(p)}
                    disabled={p.itemsEntregados}
                    style={{ backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '14px', borderRadius: '16px', fontWeight: '950', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '4px 4px 0px #000', cursor: 'pointer', opacity: p.itemsEntregados ? 0.3 : 1 }}
                  >
                    <Package size={18} /> ENTREGAR
                  </motion.button>
                </div>

                {/* FINANZAS CON CONTRASTE */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '3px solid #000', position: 'relative' }}>
                    <p style={{ fontSize: '10px', fontWeight: '950', color: '#64748b', margin: 0 }}>PAGADO</p>
                    <p style={{ fontSize: '22px', fontWeight: '950', color: '#166534', margin: 0 }}>${Number(p.total_pagado || 0).toLocaleString('es-CL')}</p>
                    <motion.button 
                       whileTap={{ scale: 0.9 }}
                       onClick={() => setModalPago({ ...modalPago, open: true, pedidoId: p.id, nombreCliente: p.c_nombre })}
                       style={{ position: 'absolute', right: '12px', top: '12px', background: '#000', color: '#fff', padding: '6px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                  <div style={{ background: deuda > 0 ? '#fef2f2' : '#f0fdf4', padding: '16px', borderRadius: '20px', border: '3px solid #000' }}>
                    <p style={{ fontSize: '10px', fontWeight: '950', color: '#64748b', margin: 0 }}>DEUDA</p>
                    <p style={{ fontSize: '22px', fontWeight: '950', color: deuda > 0 ? '#b91c1c' : '#166534', margin: 0 }}>${deuda.toLocaleString('es-CL')}</p>
                  </div>
                </div>

                {/* FOOTER DE CARD */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #f1f5f9', paddingTop: '16px' }}>
                  <button onClick={() => borrarPedido(p.id, p.c_nombre)} style={{ color: '#ef4444', fontWeight: '900', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}><Trash2 size={16} /> ELIMINAR</button>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => window.open(`https://wa.me/${p.c_telefono}`, '_blank')} style={{ background: '#22c55e', color: '#fff', padding: '10px', borderRadius: '14px', border: '2px solid #000', cursor: 'pointer' }}><MessageCircle size={20} /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => window.open(`/ticket/${p.id}`, '_blank')} style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '14px', border: '2px solid #000', cursor: 'pointer' }}><Printer size={20} /></motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* AUDITORÍA ESTILIZADA */}
        <div style={{ marginTop: '60px', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '950', color: '#000', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <History size={26} /> HISTORIAL RECIENTE
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {logs.map((log, idx) => (
              <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '16px', borderRadius: '20px', boxShadow: '4px 4px 0px #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '900', fontSize: '15px' }}>{log.accion}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>{log.detalles}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '900' }}>{new Date(log.fecha).toLocaleDateString('es-CL')}</p>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: '#94a3b8' }}>{new Date(log.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MODAL DE PAGO MEJORADO */}
        <AnimatePresence>
          {modalPago.open && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: '#fff', border: '5px solid #000', borderRadius: '32px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '15px 15px 0px #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: '950', fontSize: '24px', color: '#000', letterSpacing: '-1px' }}>REGISTRAR PAGO</h3>
                  <button onClick={() => setModalPago({...modalPago, open: false})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={28} color="#000" /></button>
                </div>
                <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '16px', border: '2px solid #000' }}>
                  <p style={{ fontSize: '12px', fontWeight: '900', color: '#64748b', margin: 0 }}>CLIENTE</p>
                  <p style={{ fontSize: '18px', fontWeight: '900', color: '#000', margin: 0 }}>{modalPago.nombreCliente}</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '950', display: 'block', marginBottom: '8px' }}>MONTO A RECIBIR ($)</label>
                    <input type="number" style={{ width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontWeight: '900', fontSize: '20px', textAlign: 'center' }} value={modalPago.monto} onChange={e => setModalPago({...modalPago, monto: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '950', display: 'block', marginBottom: '8px' }}>MÉTODO</label>
                    <select style={{ width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontWeight: '900' }} value={modalPago.metodo} onChange={e => setModalPago({...modalPago, metodo: e.target.value})}>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Débito">Débito</option>
                      <option value="Crédito">Crédito</option>
                    </select>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={guardarPago} style={{ width: '100%', backgroundColor: '#4ade80', color: '#000', padding: '20px', borderRadius: '20px', border: '4px solid #000', fontWeight: '950', fontSize: '18px', boxShadow: '6px 6px 0px #000', cursor: 'pointer', marginTop: '10px' }}>
                    CONFIRMAR PAGO
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}