'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx-js-style'
import { 
  ArrowLeft, Search, School, Phone, Calendar, Printer, Trash2, 
  MessageCircle, MessageSquare, Bell, Package, CheckCircle, 
  X, History, User, CreditCard, Plus, Clock, Minus, ChevronDown, ChevronUp, Tag, Boxes, Download, FileText
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
    pedidoId: null as number | null, 
    nombreCliente: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    metodo: 'Transferencia',
    esCorreccion: false,
    deudaMaxima: 0 as number 
  })

  const cargar = useCallback(async () => {
    if (!localStorage.getItem('user_role')) return router.push('/login')
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

      // NUEVA LÓGICA DE ESTADOS (Pilar 4 de la propuesta)
      const todoEntregado = detalles?.length > 0 && detalles.every(d => (d.cantidad_entregada || 0) >= d.cantidad)
      const algoEntregado = detalles?.some(d => (d.cantidad_entregada || 0) > 0)
      const todoListo = detalles?.length > 0 && detalles.every(d => d.estado === 'Listo para retiro' || d.estado === 'Notificado' || d.estado === 'Entregado')
      const pagoCompleto = totalPagado >= p.total_final
      
      let estadoMacro = ''
      let colorBg = ''
      let colorText = '#000'

      if (todoEntregado && pagoCompleto) {
        estadoMacro = 'FINALIZADO'; colorBg = '#4ade80'
      } else if (todoEntregado && !pagoCompleto) {
        estadoMacro = 'ENTREGADO (DEUDA)'; colorBg = '#fbbf24'
      } else if (todoListo && !todoEntregado) {
        estadoMacro = 'LISTO PARA RETIRO'; colorBg = '#3b82f6'; colorText = '#fff'
      } else if (algoEntregado) {
        estadoMacro = 'ENTREGA PARCIAL'; colorBg = '#a78bfa'; colorText = '#fff'
      } else {
        estadoMacro = 'EN TALLER'; colorBg = '#f1f5f9'
      }

      return { 
        ...p, c_nombre: cliente?.nombre || 'S/N', c_telefono: cliente?.telefono || '', 
        detalles, pagos, total_pagado: totalPagado, estado_macro: estadoMacro, color_bg: colorBg, color_text: colorText,
        pagoCompleto, todoEntregado
      }
    })
    setDatos(cruzados)
    setLoading(false)
  }, [router])

  useEffect(() => { cargar() }, [cargar])

  const exportarExcel = () => {
    const dataFilas: any[] = []
    const headers = [
      'ID PEDIDO', 'FECHA REG.', 'HORA REG.', 'CLIENTE', 'TELEFONO', 'COLEGIO',
      'PRODUCTO', 'TALLA', 'CANT.', 'ENTREGADO', 'VALOR UNIT.', 'SUBTOTAL',
      'TOTAL ORDEN', 'TOTAL ABONADO', 'SALDO PENDIENTE', 'ESTADO', 'DETALLE PAGOS', 'OBSERVACIONES'
    ]

    datos.forEach(p => {
      const fechaObj = new Date(p.created_at)
      const fecha = fechaObj.toLocaleDateString('es-CL')
      const hora = fechaObj.toLocaleTimeString('es-CL')
      const deuda = p.total_final - p.total_pagado
      
      const historialPagos = p.pagos.map((pg: any) => 
        `[${new Date(pg.fecha_pago).toLocaleDateString('es-CL')}] $${Number(pg.monto).toLocaleString()} (${pg.metodo_pago})`
      ).join(' | ')

      p.detalles?.forEach((d: any, index: number) => {
        dataFilas.push({
          'ID PEDIDO': p.id,
          'FECHA REG.': fecha,
          'HORA REG.': hora,
          'CLIENTE': p.c_nombre,
          'TELEFONO': p.c_telefono,
          'COLEGIO': p.colegio || 'Particular',
          'PRODUCTO': d.p_nombre,
          'TALLA': d.talla,
          'CANT.': d.cantidad,
          'ENTREGADO': d.cantidad_entregada || 0,
          'VALOR UNIT.': d.precio_unitario,
          'SUBTOTAL': d.cantidad * d.precio_unitario,
          'TOTAL ORDEN': index === 0 ? p.total_final : '',
          'TOTAL ABONADO': index === 0 ? p.total_pagado : '',
          'SALDO PENDIENTE': index === 0 ? deuda : '',
          'ESTADO': p.estado_macro,
          'DETALLE PAGOS': index === 0 ? historialPagos : '',
          'OBSERVACIONES': index === 0 ? p.observaciones || '' : ''
        })
      })
      dataFilas.push(Object.fromEntries(headers.map(h => [h, '---'])))
    })

    const ws = XLSX.utils.json_to_sheet(dataFilas)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "PEDIDOS YOVI")
    XLSX.writeFile(wb, `Reporte_Taller_Yovi_${new Date().toISOString().split('T')[0]}.xlsx`)
    registrarLog("Exportó Excel de pedidos", "Reporte detallado con pagos y horas")
  }

  const actualizarEntregaItem = async (det: any, cambio: number) => {
    const actual = det.cantidad_entregada || 0
    const nuevaCantidad = actual + cambio
    if (nuevaCantidad < 0 || nuevaCantidad > det.cantidad) return
    try {
      const rpcFunc = cambio > 0 ? 'entregar_stock' : 'revertir_entrega_stock'
      await supabase.rpc(rpcFunc, { prod_id: det.producto_id, cant: Math.abs(cambio) })
      
      const nuevoEstado = nuevaCantidad === det.cantidad ? 'Entregado' : (nuevaCantidad > 0 ? 'Parcial' : 'Listo para retiro')
      
      await supabase.from('detalles_pedido').update({ cantidad_entregada: nuevaCantidad, estado: nuevoEstado }).eq('id', det.id)
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
        const faltante = det.cantidad - (det.cantidad_entregada || 0)
        if (faltante > 0) {
          await supabase.rpc('entregar_stock', { prod_id: det.producto_id, cant: faltante })
          await supabase.from('detalles_pedido').update({ cantidad_entregada: det.cantidad, estado: 'Entregado' }).eq('id', det.id)
        }
      }
      await supabase.from('pedidos').update({ estado: 'Completado' }).eq('id', pedido.id)
      await registrarLog(`ENTREGA TOTAL a ${pedido.c_nombre}`, `Pedido ${pedido.id}`)
      cargar()
    } catch (err) { alert("Error al entregar") }
  }

  const guardarPago = async () => {
    const { pedidoId, monto, fecha, metodo, nombreCliente, esCorreccion, deudaMaxima } = modalPago
    const valorNum = Number(monto.toString().replace(/\D/g, ''))
    
    if (valorNum <= 0) return alert("Ingresa un monto válido")
    
    if (valorNum > deudaMaxima) {
      const msg = esCorreccion 
        ? `No puedes descontar más de lo que el cliente ya pagó ($${deudaMaxima.toLocaleString('es-CL')})`
        : `No puedes cobrar más de lo que el cliente debe ($${deudaMaxima.toLocaleString('es-CL')})`;
      return alert(msg)
    }
    
    const montoFinal = esCorreccion ? valorNum * -1 : valorNum
    
    try {
      const { error } = await supabase.from('pagos').insert([{ 
        pedido_id: pedidoId, 
        monto: montoFinal, 
        fecha_pago: fecha, 
        metodo_pago: metodo, 
        creado_por: localStorage.getItem('user_name') || 'Don Luis' 
      }])

      if (error) throw error

      const tipoMsg = esCorreccion ? "CORRIGIÓ/DESCONTÓ" : "Registró"
      await registrarLog(`${tipoMsg} pago de $${valorNum} (${metodo})`, `Cliente: ${nombreCliente}`)
      
      setModalPago({ ...modalPago, open: false, monto: '', esCorreccion: false, pedidoId: null })
      await cargar() 

    } catch (err: any) { 
      alert("Error al guardar pago: " + err.message) 
    }
  }

  const formatMontoInput = (val: string | number) => {
    const raw = val.toString().replace(/\D/g, '')
    if (!raw) return ''
    return `$${Number(raw).toLocaleString('es-CL')}`
  }

  const borrarPedido = async (id: number, nombre: string) => {
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
    return p.c_nombre.toLowerCase().includes(t) || p.c_telefono.includes(t) || (p.colegio && p.colegio.toLowerCase().includes(t)) || p.id.toString().includes(t)
  }).filter(p => filtro === 'Todos' || p.estado_macro === filtro)

  // ESTILOS
  const containerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }
  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '28px', border: '4px solid #000', boxShadow: '8px 8px 0px #000' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' as const }
  const inputStyle = { width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontWeight: '900', fontSize: '16px', color: '#000', outline: 'none' }

  return (
    <main style={containerStyle}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '16px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
              <ArrowLeft size={24} color="#000" />
            </motion.button>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '950', color: '#000', letterSpacing: '-1.5px' }}>GESTIÓN PEDIDOS</h1>
          </div>
          <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95, y: 0 }} onClick={exportarExcel} style={{ backgroundColor: '#166534', color: '#fff', border: '3px solid #000', padding: '12px 18px', borderRadius: '16px', boxShadow: '4px 4px 0px #000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900' }}>
            <Download size={20} /> <span style={{fontSize: '13px'}}>REPORTE VENTAS</span>
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '16px' }} size={22} color="#000" />
            <input placeholder="Buscar por cliente, colegio o ID..." style={{ ...inputStyle, paddingLeft: '50px', boxShadow: '6px 6px 0px #000' }} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {filtrados.map((p, idx) => {
            const deuda = p.total_final - (p.total_pagado || 0)
            const fechaEntrega = p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleDateString('es-CL') : 'S/F'
            const expandido = !!expandidos[p.id]
            const idFormateado = p.id.toString().padStart(4, '0')

            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: '#fbbf24', border: '2px solid #000', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '950', color: '#000' }}>#{idFormateado}</span>
                      <span style={{ backgroundColor: p.color_bg, color: p.color_text, padding: '4px 12px', borderRadius: '10px', fontWeight: '900', border: '2px solid #000', fontSize: '11px' }}>{p.estado_macro}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000', fontWeight: '900', fontSize: '12px' }}><Calendar size={14} /> ENTREGA: {fechaEntrega}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     <button onClick={() => window.open(`/ticket/${p.id}`, '_blank')} title="Imprimir Ticket" style={{ background: '#fff', border: '2px solid #000', borderRadius: '10px', padding: '5px', cursor: 'pointer' }}><Printer size={18} color="#000" /></button>
                     {/* BOTÓN NUEVO: VALE DE ENTREGA (Pilar 2) */}
                     <button onClick={() => window.open(`/vale-entrega/${p.id}`, '_blank')} title="Generar Vale de Entrega" style={{ background: '#000', color: '#fff', border: '2px solid #000', borderRadius: '10px', padding: '5px', cursor: 'pointer' }}>
                        <FileText size={18} />
                     </button>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ fontWeight: '950', fontSize: '26px', color: '#000', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>{p.c_nombre}</h2>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {p.c_telefono}</span>
                </div>

                <motion.button onClick={() => toggleExpandir(p.id)} style={{ width: '100%', padding: '12px', border: '3px solid #000', borderRadius: '14px', marginBottom: '16px', backgroundColor: '#f1f5f9', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: '#000' }}>
                  {expandido ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  {expandido ? 'OCULTAR DETALLES' : 'VER ARTÍCULOS Y NOTAS'}
                </motion.button>

                <AnimatePresence>
                  {expandido && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                      <div style={{ padding: '20px', border: '3px solid #000', borderRadius: '20px', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000' }}>
                        <p style={labelStyle}><Boxes size={12}/> Artículos y Entregas:</p>
                        {p.detalles?.map((det: any, i: number) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === p.detalles.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: '900', fontSize: '15px', color: '#000' }}>{det.cantidad}x {det.p_nombre}</p>
                              <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#64748b' }}>Talla: {det.talla} • ${Number(det.precio_unitario).toLocaleString()} c/u</p>
                              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '900', color: '#000', backgroundColor: (det.cantidad_entregada || 0) >= det.cantidad ? '#4ade80' : '#f1f5f9', padding: '2px 8px', borderRadius: '6px', border: '1px solid #000' }}>
                                  ENTREGADO: {det.cantidad_entregada || 0} de {det.cantidad}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => actualizarEntregaItem(det, -1)} style={{ background: '#ef4444', color: '#fff', border: '2px solid #000', borderRadius: '8px', width: '30px', height: '30px', fontWeight: '950', cursor: 'pointer' }}>-</button>
                              <button onClick={() => actualizarEntregaItem(det, 1)} style={{ background: '#4ade80', color: '#000', border: '2px solid #000', borderRadius: '8px', width: '30px', height: '30px', fontWeight: '950', cursor: 'pointer' }}>+</button>
                            </div>
                          </div>
                        ))}
                        {p.observaciones && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px dashed #000' }}>
                            <p style={labelStyle}><MessageSquare size={12}/> Notas Especiales:</p>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#000' }}>{p.observaciones}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    whileTap={{ scale: 0.98, y: 0 }} 
                    onClick={() => notificarCliente(p)} 
                    style={{ backgroundColor: '#3b82f6', color: '#fff', border: '3px solid #000', padding: '16px', borderRadius: '18px', fontWeight: '950', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '6px 6px 0px #000', cursor: 'pointer' }}
                  >
                    <Bell size={20} /> AVISAR AL CLIENTE
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    whileTap={{ scale: 0.98, y: 0 }} 
                    onClick={() => entregarTodo(p)} 
                    style={{ backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '16px', borderRadius: '18px', fontWeight: '950', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '6px 6px 0px #000', cursor: 'pointer' }}
                  >
                    <Package size={20} /> ENTREGA TOTAL
                  </motion.button>
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
                       <button onClick={() => setModalPago({ ...modalPago, open: true, pedidoId: p.id, nombreCliente: p.c_nombre, esCorreccion: false, deudaMaxima: deuda })} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Plus size={12} /></button>
                       <button onClick={() => setModalPago({ ...modalPago, open: true, pedidoId: p.id, nombreCliente: p.c_nombre, esCorreccion: true, deudaMaxima: p.total_pagado })} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Minus size={12} /></button>
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
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

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

        {/* MODAL DE PAGO / CORRECCIÓN */}
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
                    <label style={labelStyle}>Monto a {modalPago.esCorreccion ? 'Descontar' : 'Abonar'}</label>
                    <input 
                      type="text" 
                      style={{...inputStyle, borderColor: modalPago.esCorreccion ? '#ef4444' : '#000'}} 
                      value={formatMontoInput(modalPago.monto)} 
                      onChange={e => setModalPago({...modalPago, monto: e.target.value.replace(/\D/g, '')})} 
                      placeholder="$0"
                    />
                  </div>
                  <div><label style={labelStyle}>Fecha</label><input type="date" style={inputStyle} value={modalPago.fecha} onChange={e => setModalPago({...modalPago, fecha: e.target.value})} /></div>
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