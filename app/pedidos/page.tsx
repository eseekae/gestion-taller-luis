'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx-js-style'
import { ArrowLeft, Search, School, Phone, IdCard, Calendar, Package, Printer, Trash2, CreditCard, MessageCircle, Download, Landmark, Banknote, ChevronDown, ChevronUp } from 'lucide-react'

export default function VerPedidos() {
  const router = useRouter()
  const [datos, setDatos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [ordenarColegio, setOrdenarColegio] = useState(false)
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({})
  const [usuarioActivo, setUsuarioActivo] = useState('')
  const [logs, setLogs] = useState<any[]>([])

  const metodoPagoIcono = (metodo: string) => {
    if (metodo === 'Transferencia') return <Landmark size={14} />
    if (metodo === 'Efectivo') return <Banknote size={14} />
    return <CreditCard size={14} />
  }

  const cargar = useCallback(async () => {
    if (!sessionStorage.getItem('user_role')) return router.push('/login')
    setUsuarioActivo(sessionStorage.getItem('user_name') || '')
    setLoading(true)

    const [pRes, cRes, iRes, dRes, pagosRes, aRes] = await Promise.all([
      supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
      supabase.from('clientes').select('*'),
      supabase.from('inventario').select('*'),
      supabase.from('detalles_pedido').select('*').order('id'),
      supabase.from('pagos').select('*').order('fecha_pago', { ascending: true }),
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

      const itemsCompletos = detalles?.length > 0 && detalles.every(d => (d.cantidad_entregada || 0) === d.cantidad)
      const pagoCompleto = totalPagado >= p.total_final
      
      let estadoMacro = ''
      let colorEstadoBg = ''
      let colorEstadoText = ''

      if (itemsCompletos && pagoCompleto) {
        estadoMacro = 'Completado'; colorEstadoBg = '#dcfce7'; colorEstadoText = '#166534'
      } else if (!itemsCompletos && pagoCompleto) {
        estadoMacro = 'Pend. Entrega'; colorEstadoBg = '#dbeafe'; colorEstadoText = '#1e40af'
      } else if (itemsCompletos && !pagoCompleto) {
        estadoMacro = 'Pend. Pago'; colorEstadoBg = '#ffedd5'; colorEstadoText = '#c2410c'
      } else {
        estadoMacro = 'Pend. Entrega y Pago'; colorEstadoBg = '#fef3c7'; colorEstadoText = '#b45309'
      }

      return { 
        ...p, c_nombre: cliente?.nombre || 'S/N', c_telefono: cliente?.telefono || '', c_rut: cliente?.rut || '', 
        detalles, pagos, total_pagado: totalPagado, estado_macro: estadoMacro, color_bg: colorEstadoBg, color_text: colorEstadoText, itemsCompletos
      }
    })
    setDatos(cruzados)
    setLoading(false)
  }, [router])

  const calcularEstadoPedido = (pedido: any, detallesActualizados: any[]) => {
    const itemsCompletos = detallesActualizados?.length > 0 && detallesActualizados.every(d => (d.cantidad_entregada || 0) === d.cantidad)
    const pagoCompleto = Number(pedido.total_pagado || 0) >= Number(pedido.total_final || 0)

    let estadoMacro = ''
    let colorEstadoBg = ''
    let colorEstadoText = ''

    if (itemsCompletos && pagoCompleto) {
      estadoMacro = 'Completado'; colorEstadoBg = '#dcfce7'; colorEstadoText = '#166534'
    } else if (!itemsCompletos && pagoCompleto) {
      estadoMacro = 'Pend. Entrega'; colorEstadoBg = '#dbeafe'; colorEstadoText = '#1e40af'
    } else if (itemsCompletos && !pagoCompleto) {
      estadoMacro = 'Pend. Pago'; colorEstadoBg = '#ffedd5'; colorEstadoText = '#c2410c'
    } else {
      estadoMacro = 'Pend. Entrega y Pago'; colorEstadoBg = '#fef3c7'; colorEstadoText = '#b45309'
    }

    return { estadoMacro, colorEstadoBg, colorEstadoText, itemsCompletos }
  }

  const actualizarEntrega = async (det: any, cambio: number | 'todo') => {
    const actual = det.cantidad_entregada || 0
    const total = det.cantidad
    let nuevaCantidad = cambio === 'todo' ? total : actual + cambio

    if (nuevaCantidad < 0 || nuevaCantidad > total) return
    const variacion = nuevaCantidad - actual
    if (variacion === 0) return

    const pedidoObjetivoId = det.pedido_id
    const nuevoEstado = nuevaCantidad === total ? 'Entregado' : 'Pendiente'
    let datosPrevios = [...datos]

    setDatos(prev => prev.map(pedido => {
      const perteneceAlPedido = pedido.id === pedidoObjetivoId || pedido.detalles?.some((d: any) => d.id === det.id)
      if (!perteneceAlPedido) return pedido

      const detallesActualizados = (pedido.detalles || []).map((d: any) =>
        d.id === det.id ? { ...d, cantidad_entregada: nuevaCantidad, estado: nuevoEstado } : d
      )
      const { estadoMacro, colorEstadoBg, colorEstadoText, itemsCompletos } = calcularEstadoPedido(pedido, detallesActualizados)

      return {
        ...pedido,
        detalles: detallesActualizados,
        estado_macro: estadoMacro,
        color_bg: colorEstadoBg,
        color_text: colorEstadoText,
        itemsCompletos
      }
    }))

    try {
      if (det.producto_id) {
        const rpcName = variacion > 0 ? 'entregar_stock' : 'revertir_entrega_stock'
        await supabase.rpc(rpcName, { prod_id: det.producto_id, cant: Math.abs(variacion) })
      }

      await supabase.from('detalles_pedido').update({ 
        cantidad_entregada: nuevaCantidad, 
        estado: nuevoEstado 
      }).eq('id', det.id)

      const ahora = new Date()
      const fechaFormateada = `${ahora.getDate().toString().padStart(2, '0')}/${(ahora.getMonth() + 1).toString().padStart(2, '0')} ${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`
      
      await registrarLog(
        `${sessionStorage.getItem('user_name') || 'Usuario'} entregó ${Math.abs(variacion)} de ${det.p_nombre || 'Producto'} el ${fechaFormateada}`,
        `Cantidad entregada: ${actual} -> ${nuevaCantidad}`
      )
    } catch (err) {
      setDatos(datosPrevios)
      alert("❌ No se pudo sincronizar la entrega. Se revirtió el cambio.")
    }
  }

  const exportarExcel = () => {
    const reporte: any[] = []
    const formatoMoneda = (monto: number) => `$${Number(monto || 0).toLocaleString('es-CL')}`
    const rangosPedidos: Array<{ inicio: number; fin: number }> = []

    datos.forEach(p => {
      const inicioBloque = reporte.length + 2
      const totalPedido = Number(p.total_final || 0)
      const abonoPedido = Number(p.total_pagado || 0)
      const saldoPendiente = totalPedido - abonoPedido
      const detalles = p.detalles || []
      const pagos = p.pagos || []

      let ultimaActividad = 'Sin actividad'
      const logsPedido = logs.filter(log => 
        log.accion.includes(p.id.toString()) || log.accion.includes(p.c_nombre || '')
      )
      if (logsPedido.length > 0) {
        ultimaActividad = new Date(logsPedido[0].fecha).toLocaleDateString('es-CL')
      }

      reporte.push({
        'Tipo': 'PEDIDO',
        'ID Pedido': p.id,
        'Fecha': new Date(p.created_at).toLocaleDateString('es-CL'),
        'Cliente': p.c_nombre || 'S/N',
        'RUT': p.c_rut || '',
        'Teléfono': p.c_telefono || '',
        'Colegio': p.colegio || 'Particular',
        'Ítem': '',
        'Talla': '',
        'Cantidad': '',
        'Cantidad Entregada': '',
        'Fecha de Entrega': '',
        'Última Actividad': ultimaActividad,
        'Precio Unitario': '',
        'Total Ítem': '',
        'Total Pedido': formatoMoneda(totalPedido),
        'Abono Pedido': formatoMoneda(abonoPedido),
        'Saldo Pendiente': formatoMoneda(saldoPendiente),
        'Usuario': p.creado_por || ''
      })

      detalles.forEach((det: any) => {
        const cantidad = Number(det.cantidad || 0)
        const cantidadEntregada = Number(det.cantidad_entregada || 0)
        const totalItem = cantidad * Number(det.precio_unitario || 0)

        let fechaEntrega = 'Pendiente'
        if (cantidadEntregada > 0) {
          const logEntrega = logs.find(log => 
            log.accion.includes('entregó') && log.accion.includes(det.p_nombre || 'Producto')
          )
          if (logEntrega) {
            const match = logEntrega.accion.match(/el (\d{2}\/\d{2} \d{2}:\d{2})/)
            fechaEntrega = match ? match[1] : new Date(logEntrega.fecha).toLocaleDateString('es-CL')
          }
        }

        reporte.push({
          'Tipo': 'ÍTEM',
          'ID Pedido': '',
          'Fecha': '',
          'Cliente': '',
          'RUT': '',
          'Teléfono': '',
          'Colegio': '',
          'Ítem': det.p_nombre || 'Producto',
          'Talla': det.talla || '',
          'Cantidad': cantidad,
          'Cantidad Entregada': cantidadEntregada,
          'Fecha de Entrega': fechaEntrega,
          'Última Actividad': '',
          'Precio Unitario': formatoMoneda(det.precio_unitario || 0),
          'Total Ítem': formatoMoneda(totalItem),
          'Total Pedido': '',
          'Abono Pedido': '',
          'Saldo Pendiente': '',
          'Usuario': ''
        })
      })

      pagos.forEach((pg: any) => {
        reporte.push({
          'Tipo': 'PAGO',
          'ID Pedido': '',
          'Fecha': pg.fecha_pago ? new Date(pg.fecha_pago).toLocaleDateString('es-CL') : '',
          'Cliente': '',
          'RUT': '',
          'Teléfono': '',
          'Colegio': '',
          'Ítem': '',
          'Talla': '',
          'Cantidad': '',
          'Cantidad Entregada': '',
          'Fecha de Entrega': '',
          'Última Actividad': '',
          'Precio Unitario': '',
          'Total Ítem': '',
          'Total Pedido': '',
          'Abono Pedido': formatoMoneda(pg.monto || 0),
          'Saldo Pendiente': pg.metodo_pago || '',
          'Usuario': pg.creado_por || ''
        })
      })
      rangosPedidos.push({ inicio: inicioBloque, fin: reporte.length + 1 })
    })

    const ws = XLSX.utils.json_to_sheet(reporte)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Reporte Detallado")
    XLSX.writeFile(wb, `Reporte_Luis_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const agregarPago = async (pedido: any) => {
    const montoInput = prompt('💰 Nuevo Pago\nMonto:', '')
    if (!montoInput) return
    const monto = Number(montoInput.replace(/\D/g, ''))
    if (isNaN(monto) || monto <= 0) return alert('❌ Monto inválido.')

    const fechaPago = prompt('📅 Fecha (YYYY-MM-DD):', new Date().toISOString().split('T')[0]) || new Date().toISOString().split('T')[0]
    const metodo = prompt('💳 Método (Transferencia, Efectivo, Débito, Crédito):', 'Transferencia') || 'Transferencia'

    // Guardamos estado previo por si hay que revertir la UI
    const snapshot = [...datos]
    
    // Actualización optimista de la interfaz
    setDatos(prev => prev.map(p => {
      if (p.id !== pedido.id) return p
      const totalPagado = Number(p.total_pagado || 0) + monto
      const { estadoMacro, colorEstadoBg, colorEstadoText } = calcularEstadoPedido({ ...p, total_pagado: totalPagado }, p.detalles || [])
      return { ...p, total_pagado: totalPagado, estado_macro: estadoMacro, color_bg: colorEstadoBg, color_text: colorEstadoText }
    }))

    try {
      // 1. Intentar insertar el pago
      const { error: errorPago } = await supabase.from('pagos').insert([{
        pedido_id: pedido.id,
        monto: monto,
        fecha_pago: fechaPago,
        metodo_pago: metodo,
        creado_por: sessionStorage.getItem('user_name') || 'Usuario'
      }])

      if (errorPago) {
        console.error("Error de Supabase al insertar pago:", errorPago)
        throw errorPago
      }

      // 2. Registrar en el historial (si falla esto, no importa, el pago ya se hizo)
      try {
        const ahora = new Date()
        const fechaFormateada = `${ahora.getDate().toString().padStart(2, '0')}/${(ahora.getMonth() + 1).toString().padStart(2, '0')} ${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`
        
        await registrarLog(
          `${sessionStorage.getItem('user_name') || 'Usuario'} registró pago de $${monto.toLocaleString('es-CL')} el ${fechaFormateada}`,
          `Pedido ID: ${pedido.id}`
        )
      } catch (logErr) {
        console.warn("No se pudo registrar el log, pero el pago se guardó.", logErr)
      }

      // 3. Recargar datos para estar sincronizados
      await cargar()
      
    } catch (err: any) {
      setDatos(snapshot)
      console.error("Error completo del proceso:", err)
      alert(`❌ Error al guardar: ${err.message || 'Error desconocido'}`)
    }
  }

  const borrarPedido = async (pedidoId: string, detalles: any[], clienteNombre: string) => {
    if(!confirm('⚠️ ¿Borrar pedido completo?')) return
    const usuario = sessionStorage.getItem('user_name') || ''
    if (usuario !== 'Admin') {
      const clave = prompt('🔒 Ingresa clave para borrar:')
      if (clave !== '1122') return alert('❌ Clave incorrecta.')
    }
    try {
      await supabase.from('pagos').delete().eq('pedido_id', pedidoId)
      for (const det of detalles) {
        if (det.estado === 'Pendiente' && det.producto_id) {
          await supabase.rpc('reservar_stock', { prod_id: det.producto_id, cant: -det.cantidad })
        }
      }
      await supabase.from('pedidos').delete().eq('id', pedidoId)
      await registrarLog(`${usuario} eliminó pedido de ${clienteNombre}`, `ID: ${pedidoId}`)
      cargar()
    } catch (err) {
      alert('❌ Error al eliminar.')
    }
  }

  useEffect(() => { cargar() }, [cargar])

  const filtrados = datos
    .filter(p => {
      const t = busqueda.toLowerCase()
      return p.c_nombre.toLowerCase().includes(t) || p.c_telefono.includes(t) || (p.colegio && p.colegio.toLowerCase().includes(t))
    })
    .filter(p => filtro === 'Todos' || (filtro === 'Pendientes' && p.estado_macro !== 'Completado') || p.estado_macro === filtro)

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '10px', borderRadius: '12px' }}><ArrowLeft size={20} /></button>
          <h1 style={{ fontSize: '24px', fontWeight: '900' }}>Gestión de Pedidos</h1>
          <button onClick={exportarExcel} style={{ backgroundColor: '#166534', color: '#fff', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', border: 'none' }}><Download size={18} /> Excel</button>
        </div>

        <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '14px' }} size={20} />
            <input placeholder="Buscar..." style={{ width: '100%', padding: '14px 40px', border: '2px solid #000', borderRadius: '12px', fontWeight: '700' }} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Todos', 'Pendientes', 'Completado'].map(f => (
              <button key={f} onClick={() => setFiltro(f)} style={{ backgroundColor: filtro === f ? '#000' : '#fff', color: filtro === f ? '#fff' : '#000', border: '2px solid #000', borderRadius: '8px', padding: '8px 14px', fontWeight: '800' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtrados.map(p => {
            const deuda = p.total_final - (p.total_pagado || 0)
            const expandido = !!expandidos[p.id]
            return (
              <div key={p.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '800', fontSize: '12px' }}><School size={12} /> {p.colegio || 'Particular'}</span>
                  <span style={{ backgroundColor: p.color_bg, color: p.color_text, padding: '6px 12px', borderRadius: '8px', fontWeight: '800', fontSize: '12px' }}>{p.estado_macro}</span>
                </div>
                <h2 style={{ fontWeight: '900', fontSize: '22px' }}>{p.c_nombre}</h2>
                <button onClick={() => setExpandidos(prev => ({ ...prev, [p.id]: !prev[p.id] }))} style={{ width: '100%', margin: '16px 0', border: '2px solid #000', borderRadius: '10px', padding: '10px', fontWeight: '900' }}>{expandido ? 'Ocultar' : 'Ver Detalle'}</button>

                {expandido && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {p.detalles?.map((det: any, idx: number) => (
                      <div key={idx} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <div><p style={{ fontWeight: '800' }}>{det.p_nombre}</p><p style={{ fontSize: '12px' }}>{det.cantidad_entregada || 0} de {det.cantidad}</p></div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => actualizarEntrega(det, -1)} style={{ border: '2px solid #000', borderRadius: '8px', padding: '5px' }}>-</button>
                          <button onClick={() => actualizarEntrega(det, 1)} style={{ background: '#000', color: '#fff', borderRadius: '8px', padding: '5px' }}>+1</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '12px', fontWeight: '800' }}>PAGADO</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#10b981' }}>${Number(p.total_pagado || 0).toLocaleString('es-CL')}</p>
                    <button onClick={() => agregarPago(p)} style={{ background: '#000', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>+ Pago</button>
                  </div>
                  <div style={{ background: deuda > 0 ? '#fef2f2' : '#f0fdf4', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '12px', fontWeight: '800' }}>DEUDA</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: deuda > 0 ? '#ef4444' : '#10b981' }}>${deuda.toLocaleString('es-CL')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button onClick={() => borrarPedido(p.id, p.detalles, p.c_nombre)} style={{ color: '#ef4444', fontWeight: '800', border: 'none', background: 'none' }}><Trash2 size={16} /> Borrar</button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => abrirWhatsApp(p.c_telefono)} style={{ background: '#25D366', color: '#fff', padding: '10px', borderRadius: '10px', border: 'none' }}><MessageCircle size={16} /></button>
                    <button onClick={() => window.open(`/ticket/${p.id}`, '_blank')} style={{ background: '#000', color: '#fff', padding: '10px', borderRadius: '10px', border: 'none' }}><Printer size={16} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '50px', borderTop: '4px solid #000', paddingTop: '30px', paddingBottom: '60px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '24px' }}>HISTORIAL DE ACTIVIDAD</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {logs.length === 0 ? <p>Sin registros.</p> : logs.map((log) => (
              <div key={log.id} style={{ border: '2px solid #000', padding: '16px', borderRadius: '16px', boxShadow: '4px 4px 0px #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ background: '#000', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '900' }}>{log.usuario}</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b' }}>{new Date(log.fecha).toLocaleString()}</span>
                </div>
                <p style={{ fontWeight: '900' }}>{log.accion}</p>
                <p style={{ fontSize: '13px', color: '#475569' }}>{log.detalles}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}