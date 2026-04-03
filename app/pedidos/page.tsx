'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Search, School, Phone, Calendar, Printer, Trash2, 
  MessageCircle, MessageSquare, Bell, Package, CheckCircle, 
  X, History, User, CreditCard, Plus, Clock, Minus, ChevronDown, ChevronUp, Tag, Boxes
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
    metodo: 'Transferencia',
    esCorreccion: false 
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

  // --- ACCIONES DE ENTREGA PARCIAL / TOTAL ---
  
  const actualizarEntregaItem = async (det: any, cambio: number) => {
    const actual = det.cantidad_entregada || 0
    const nuevaCantidad = actual + cambio
    if (nuevaCantidad < 0 || nuevaCantidad > det.cantidad) return

    try {
      // Actualizar stock mediante RPC
      const rpcFunc = cambio > 0 ? 'entregar_stock' : 'revertir_entrega_stock'
      await supabase.rpc(rpcFunc, { prod_id: det.producto_id, cant: Math.abs(cambio) })

      // Actualizar el detalle
      const nuevoEstado = nuevaCantidad === det.cantidad ? 'Entregado' : 'Pendiente'
      await supabase.from('detalles_pedido').update({
        cantidad_entregada: nuevaCantidad,
        estado: nuevoEstado
      }).eq('id', det.id)

      await registrarLog(`${cambio > 0 ? 'Entregó' : 'Restó'} ${Math.abs(cambio)} unidad(es) de ${det.p_nombre}`, `Pedido ${det.pedido_id}`)
      cargar()
    } catch (err) { alert("Error al actualizar entrega") }
  }

  const notificarCliente = async (pedido: any) => {
    if (!confirm(`¿Confirmar aviso a ${pedido.c_nombre}?`)) return
    try {
      await supabase.from('detalles_pedido').update({ estado: 'Notificado' }).eq('pedido_id', pedido.id).neq('estado', 'Entregado')
      await registrarLog(`Avisó a cliente: ${pedido.c_nombre}`, `Pedido ${pedido.id}`)
      cargar()
    } catch (err) { alert("Error al notificar") }
  }

  const entregarTodo = async (pedido: any) => {
    if (!confirm(`¿Marcar TODO el pedido como RETIRADO?`)) return
    try {
      for (const det of pedido.detalles) {
        const faltante = det.cantidad - det.cantidad_entregada
        if (faltante > 0) {
          await supabase.rpc('entregar_stock', { prod_id: det.producto_id, cant: faltante })
          await supabase.from('detalles_pedido').update({
            cantidad_entregada: det.cantidad,
            estado: 'Entregado'
          }).eq('id', det.id)
        }
      }
      await supabase.from('pedidos').update({ estado: 'Completado' }).eq('id', pedido.id)
      await registrarLog(`ENTREGA TOTAL a ${pedido.c_nombre}`, `Pedido ${pedido.id}`)
      cargar()
    } catch (err) { alert("Error al entregar") }
  }

  const guardarPago = async () => {
    const { pedidoId, monto, fecha, metodo, nombreCliente, esCorreccion } = modalPago
    const valorNum = Number(monto)
    if (!monto || valorNum <= 0) return alert("Ingresa un monto válido")
    const montoFinal = esCorreccion ? valorNum * -1 : valorNum

    try {
      await supabase.from('pagos').insert([{
        pedido_id: pedidoId, monto: montoFinal, fecha_pago: fecha, 
        metodo_pago: metodo, creado_por: sessionStorage.getItem('user_name') || 'Don Luis'
      }])
      const tipoMsg = esCorreccion ? "CORRIGIÓ/DESCONTÓ" : "Registró"
      await registrarLog(`${tipoMsg} pago de $${valorNum} (${metodo})`, `Cliente: ${nombreCliente}`)
      setModalPago({ ...modalPago, open: false, monto: '', esCorreccion: false })
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

  const toggleExpandir = (id: string) => {
    setExpandidos(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filtrados = datos.filter(p => {
    const t = busqueda.toLowerCase()
    return p.c_nombre.toLowerCase().includes(t) || p.c_telefono.includes(t) || (p.colegio && p.colegio.toLowerCase().includes(t))
  }).filter(p => filtro === 'Todos' || (filtro === 'Pendientes' && p.estado_macro !== 'FINALIZADO (OK)') || p.estado_macro === filtro)

  // ESTILOS
  const containerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }
  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '28px', border: '4px solid #000', boxShadow: '8px 8px 0px #000' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' as const }
  const inputStyle = { width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontWeight: '900', fontSize: '16px', color: '#000', outline: 'none' }

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

        {/* BUSCADOR */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '16px' }} size={22} color="#000" />
            <input placeholder="Buscar por cliente, colegio o ID..." style={{ ...inputStyle, paddingLeft: '50px', boxShadow: '6px 6px 0px #000' }} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </motion.div>

        {/* LISTADO DE PEDIDOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {filtrados.map((p, idx) => {
            const deuda = p.total_final - (p.total_pagado || 0)
            const fechaEntrega = p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleDateString('es-CL') : 'S/F'
            const expandido = !!expandidos[p.id]

            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} style={cardStyle}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: '#fbbf24', border: '2px solid #000', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '950', color: '#000' }}>#{p.id}</span>
                      <span style={{ backgroundColor: p.color_bg, color: p.color_text, padding: '4px 12px', borderRadius: '10px', fontWeight: '900', border: '2px solid #000', fontSize: '11px' }}>{p.estado_macro}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000', fontWeight: '900', fontSize: '12px' }}><Calendar size={14} /> ENTREGA: {fechaEntrega}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={labelStyle}>Institución</p>
                    <p style={{ margin: 0, fontWeight: '950', fontSize: '14px', color: '#000' }}><School size={14} inline /> {p.colegio || 'Particular'}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ fontWeight: '950', fontSize: '26px', color: '#000', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>{p.c_nombre}</h2>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {p.c_telefono}</span>
                </div>

                <motion.button 
                  onClick={() => toggleExpandir(p.id)}
                  style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '14px', marginBottom: '16px', backgroundColor: '#f1f5f9', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: '#000' }}
                >
                  {expandido ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  {expandido ? 'OCULTAR DETALLES' : 'VER ARTÍCULOS Y NOTAS'}
                </motion.button>

                <AnimatePresence>
                  {expandido && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                      <div style={{ padding: '20px', border: '3px solid #000', borderRadius: '20px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000' }}>
                        <p style={labelStyle}><Boxes size={12} inline/> Artículos y Entregas:</p>
                        {p.detalles?.map((det: any, i: number) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === p.detalles.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: '900', fontSize: '15px', color: '#000' }}>{det.cantidad}x {det.p_nombre}</p>
                              <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#64748b' }}>Talla: {det.talla} • ${Number(det.precio_unitario).toLocaleString()} c/u</p>
                              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '900', backgroundColor: det.cantidad_entregada === det.cantidad ? '#4ade80' : '#f1f5f9', padding: '2px 8px', borderRadius: '6px', border: '1px solid #000' }}>
                                  ENTREGADO: {det.cantidad_entregada || 0} de {det.cantidad}
                                </span>
                              </div>
                            </div>
                            {/* BOTONES DE CONTROL INDIVIDUAL */}
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => actualizarEntregaItem(det, -1)} style={{ background: '#ef4444', color: '#fff', border: '2px solid #000', borderRadius: '8px', width: '30px', height: '30px', fontWeight: '950', cursor: 'pointer' }}>-</button>
                              <button onClick={() => actualizarEntregaItem(det, 1)} style={{ background: '#4ade80', color: '#000', border: '2px solid #000', borderRadius: '8px', width: '30px', height: '30px', fontWeight: '950', cursor: 'pointer' }}>+</button>
                            </div>
                          </div>
                        ))}
                        
                        {p.observaciones && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px dashed #000' }}>
                            <p style={labelStyle}><MessageSquare size={12} inline/> Notas Especiales:</p>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#000' }}>{p.observaciones}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <motion.button whileTap={{ y: 2 }} onClick={() => notificarCliente(p)} disabled={p.itemsEntregados} style={{ backgroundColor: '#3b82f6', color: '#fff', border: '3px solid #000', padding: '14px', borderRadius: '16px', fontWeight: '950', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '4px 4px 0px #000', cursor: 'pointer', opacity: p.itemsEntregados ? 0.3 : 1 }}><Bell size={18} /> AVISAR</motion.button>
                  <motion.button whileTap={{ y: 2 }} onClick={() => entregarTodo(p)} disabled={p.itemsEntregados} style={{ backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '14px', borderRadius: '16px', fontWeight: '950', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '4px 4px 0px #000', cursor: 'pointer', opacity: p.itemsEntregados ? 0.3 : 1 }}><Package size={18} /> ENTREGAR TODO</motion.button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '16px', border: '3px solid #000' }}>
                    <p style={labelStyle}>VALOR TOTAL</p>
                    <p style={{ fontSize: '16px', fontWeight: '950', color: '#000', margin: 0 }}>${Number(p.total_final).toLocaleString('es-CL')}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', border: '3px solid #000', position: 'relative' }}>
                    <p style={labelStyle}>PAGADO</p>
                    <p style={{ fontSize: '16px', fontWeight: '950', color: '#166534', margin: 0 }}>${Number(p.total_pagado || 0).toLocaleString('es-CL')}</p>
                    <div style={{ position: 'absolute', right: '5px', top: '15px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                       <button onClick={() => setModalPago({ ...modalPago, open: true, pedidoId: p.id, nombreCliente: p.c_nombre, esCorreccion: false })} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Plus size={12} /></button>
                       <button onClick={() => setModalPago({ ...modalPago, open: true, pedidoId: p.id, nombreCliente: p.c_nombre, esCorreccion: true })} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Minus size={12} /></button>
                    </div>
                  </div>
                  <div style={{ background: deuda > 0 ? '#fef2f2' : '#f0fdf4', padding: '12px', borderRadius: '16px', border: '3px solid #000' }}>
                    <p style={labelStyle}>DEUDA</p>
                    <p style={{ fontSize: '16px', fontWeight: '950', color: deuda > 0 ? '#b91c1c' : '#166534', margin: 0 }}>${deuda.toLocaleString('es-CL')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #f1f5f9', paddingTop: '16px' }}>
                  <button onClick={() => borrarPedido(p.id, p.c_nombre)} style={{ color: '#ef4444', fontWeight: '900', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}><Trash2 size={16} /> ELIMINAR</button>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => window.open(`https://wa.me/${p.c_telefono}`, '_blank')} style={{ background: '#22c55e', color: '#fff', padding: '10px', borderRadius: '14px', border: '2px solid #000', cursor: 'pointer' }}><MessageCircle size={20} /></button>
                    <button onClick={() => window.open(`/ticket/${p.id}`, '_blank')} style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '14px', border: '2px solid #000', cursor: 'pointer' }}><Printer size={20} /></button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* AUDITORÍA */}
        <div style={{ marginTop: '60px', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '950', color: '#000', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><History size={26} /> HISTORIAL RECIENTE</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '16px', borderRadius: '20px', boxShadow: '4px 4px 0px #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '900', fontSize: '15px', color: '#000' }}>{log.accion}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: '700', color: '#475569' }}>{log.detalles}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', color: '#000' }}>{new Date(log.fecha).toLocaleDateString('es-CL')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL DE PAGO */}
        <AnimatePresence>
          {modalPago.open && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ backgroundColor: '#fff', border: '5px solid #000', borderRadius: '32px', padding: '35px', width: '100%', maxWidth: '420px', boxShadow: '15px 15px 0px #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                  <h3 style={{ fontWeight: '950', fontSize: '24px', color: '#000' }}>{modalPago.esCorreccion ? 'CORREGIR PAGO' : 'NUEVO PAGO'}</h3>
                  <button onClick={() => setModalPago({...modalPago, open: false})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={28} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Monto ($)</label>
                    <input type="number" style={{...inputStyle, borderColor: modalPago.esCorreccion ? '#ef4444' : '#000'}} value={modalPago.monto} onChange={e => setModalPago({...modalPago, monto: e.target.value})} />
                  </div>
                  <div>
                    <label style={labelStyle}>Fecha</label>
                    <input type="date" style={inputStyle} value={modalPago.fecha} onChange={e => setModalPago({...modalPago, fecha: e.target.value})} />
                  </div>
                  <div>
                    <label style={labelStyle}>Método</label>
                    <select style={inputStyle} value={modalPago.metodo} onChange={e => setModalPago({...modalPago, metodo: e.target.value})}>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Débito">Débito</option>
                      <option value="Crédito">Crédito</option>
                    </select>
                  </div>
                  <button onClick={guardarPago} style={{ width: '100%', backgroundColor: modalPago.esCorreccion ? '#ef4444' : '#4ade80', color: modalPago.esCorreccion ? '#fff' : '#000', padding: '20px', borderRadius: '20px', border: '4px solid #000', fontWeight: '950', fontSize: '18px', cursor: 'pointer' }}>
                    {modalPago.esCorreccion ? 'CONFIRMAR CORRECCIÓN' : 'CONFIRMAR PAGO'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}