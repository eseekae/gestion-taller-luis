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
      alert("❌ No se pudo sincronizar la entrega.")
    }
  }

  const exportarExcel = () => {
    const reporte: any[] = []
    const formatoMoneda = (monto: number) => `$${Number(monto || 0).toLocaleString('es-CL')}`
    datos.forEach(p => {
      reporte.push({
        'Tipo': 'PEDIDO',
        'ID Pedido': p.id,
        'Fecha': new Date(p.created_at).toLocaleDateString('es-CL'),
        'Cliente': p.c_nombre || 'S/N',
        'Colegio': p.colegio || 'Particular',
        'Total Pedido': formatoMoneda(p.total_final),
        'Abono Pedido': formatoMoneda(p.total_pagado),
        'Saldo Pendiente': formatoMoneda(p.total_final - p.total_pagado)
      })
    })
    const ws = XLSX.utils.json_to_sheet(reporte)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Reporte")
    XLSX.writeFile(wb, `Reporte_Luis_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const agregarPago = async (pedido: any) => {
    const montoInput = prompt('💰 Nuevo Pago\nMonto:', '')
    if (!montoInput) return
    const monto = Number(montoInput.replace(/\D/g, ''))
    if (isNaN(monto) || monto <= 0) return alert('❌ Monto inválido.')

    const snapshot = [...datos]
    setDatos(prev => prev.map(p => {
      if (p.id !== pedido.id) return p
      const totalPagado = Number(p.total_pagado || 0) + monto
      const { estadoMacro, colorEstadoBg, colorEstadoText } = calcularEstadoPedido({ ...p, total_pagado: totalPagado }, p.detalles || [])
      return { ...p, total_pagado: totalPagado, estado_macro: estadoMacro, color_bg: colorEstadoBg, color_text: colorEstadoText }
    }))

    try {
      const { error } = await supabase.from('pagos').insert([{
        pedido_id: pedido.id,
        monto: monto,
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo_pago: 'Transferencia',
        creado_por: sessionStorage.getItem('user_name') || 'Usuario'
      }])

      if (error) throw error

      const ahora = new Date()
      const f = `${ahora.getDate().toString().padStart(2, '0')}/${(ahora.getMonth() + 1).toString().padStart(2, '0')} ${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`
      
      await registrarLog(
        `${sessionStorage.getItem('user_name') || 'Usuario'} registró pago de $${monto.toLocaleString('es-CL')} el ${f}`,
        `Pedido ID: ${pedido.id}`
      )
      cargar()
    } catch (err) {
      setDatos(snapshot)
      alert('❌ Error al guardar el pago en Supabase.')
    }
  }

  const borrarPedido = async (pedidoId: string, detalles: any[], clienteNombre: string) => {
    if(!confirm('⚠️ ¿Borrar pedido?')) return
    try {
      await supabase.from('pagos').delete().eq('pedido_id', pedidoId)
      await supabase.from('pedidos').delete().eq('id', pedidoId)
      await registrarLog(`Eliminó pedido de ${clienteNombre}`, `ID: ${pedidoId}`)
      cargar()
    } catch (err) { alert('❌ Error al eliminar.') }
  }

  useEffect(() => { cargar() }, [cargar])

  const filtrados = datos
    .filter(p => {
      const t = busqueda.toLowerCase()
      return p.c_nombre.toLowerCase().includes(t) || p.c_telefono.includes(t) || (p.colegio && p.colegio.toLowerCase().includes(t))
    })
    .filter(p => filtro === 'Todos' || (filtro === 'Pendientes' && p.estado_macro !== 'Completado') || p.estado_macro === filtro)

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}><ArrowLeft size={20} color="#000" /></button>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#000000' }}>Gestión de Pedidos</h1>
          <button onClick={exportarExcel} style={{ backgroundColor: '#166534', color: '#fff', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', border: '3px solid #000', boxShadow: '4px 4px 0px #000' }}><Download size={18} /> Excel</button>
        </div>

        <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '14px' }} size={20} color="#000" />
            <input placeholder="Buscar..." style={{ width: '100%', padding: '14px 40px', border: '3px solid #000', borderRadius: '12px', fontWeight: '700', boxShadow: '4px 4px 0px #000', color: '#000' }} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Todos', 'Pendientes', 'Completado'].map(f => (
              <button key={f} onClick={() => setFiltro(f)} style={{ backgroundColor: filtro === f ? '#000' : '#fff', color: filtro === f ? '#fff' : '#000', border: '3px solid #000', borderRadius: '8px', padding: '8px 14px', fontWeight: '800', boxShadow: '3px 3px 0px #000' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {filtrados.map(p => {
            const deuda = p.total_final - (p.total_pagado || 0)
            const expandido = !!expandidos[p.id]
            return (
              <div key={p.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '3px solid #000', boxShadow: '8px 8px 0px #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '800', fontSize: '12px', color: '#000000', display: 'flex', alignItems: 'center', gap: '4px' }}><School size={12} color="#000" /> {p.colegio || 'Particular'}</span>
                  <span style={{ backgroundColor: p.color_bg, color: p.color_text, padding: '6px 12px', borderRadius: '8px', fontWeight: '800', border: '2px solid #000' }}>{p.estado_macro}</span>
                </div>
                <h2 style={{ fontWeight: '900', fontSize: '24px', color: '#000000' }}>{p.c_nombre}</h2>
                <button onClick={() => setExpandidos(prev => ({ ...prev, [p.id]: !prev[p.id] }))} style={{ width: '100%', margin: '16px 0', border: '3px solid #000', borderRadius: '10px', padding: '10px', fontWeight: '900', background: '#f1f5f9', color: '#000000' }}>{expandido ? 'Ocultar Detalle' : 'Ver Detalle'}</button>

                {expandido && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {p.detalles?.map((det: any, idx: number) => (
                      <div key={idx} style={{ padding: '12px', border: '2px solid #000', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', background: '#f8fafc' }}>
                        <div><p style={{ fontWeight: '800', color: '#000000' }}>{det.p_nombre}</p><p style={{ fontSize: '12px', color: '#000000' }}>{det.cantidad_entregada || 0} de {det.cantidad}</p></div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => actualizarEntrega(det, -1)} style={{ border: '2px solid #000', borderRadius: '8px', padding: '5px', background: '#ef4444', color: '#ffffff', fontWeight: '900' }}>-</button>
                          <button onClick={() => actualizarEntrega(det, 1)} style={{ background: '#4ade80', color: '#000', borderRadius: '8px', padding: '5px', border: '2px solid #000', fontWeight: '900' }}>+1</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '16px', border: '3px solid #000' }}>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#000000' }}>PAGADO</p>
                    <p style={{ fontSize: '22px', fontWeight: '900', color: '#166534' }}>${Number(p.total_pagado || 0).toLocaleString('es-CL')}</p>
                    <button onClick={() => agregarPago(p)} style={{ background: '#000', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '900', marginTop: '8px', border: '2px solid #000' }}>+ Pago</button>
                  </div>
                  <div style={{ background: deuda > 0 ? '#fef2f2' : '#f0fdf4', padding: '16px', borderRadius: '16px', border: '3px solid #000' }}>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#000000' }}>DEUDA</p>
                    <p style={{ fontSize: '22px', fontWeight: '900', color: deuda > 0 ? '#991b1b' : '#166534' }}>${deuda.toLocaleString('es-CL')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '3px solid #000', paddingTop: '16px' }}>
                  <button onClick={() => borrarPedido(p.id, p.detalles, p.c_nombre)} style={{ color: '#991b1b', fontWeight: '900', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}><Trash2 size={16} /> Borrar</button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => window.open(`https://wa.me/${p.c_telefono}`, '_blank')} style={{ background: '#25D366', color: '#fff', padding: '10px', borderRadius: '10px', border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}><MessageCircle size={16} /></button>
                    <button onClick={() => window.open(`/ticket/${p.id}`, '_blank')} style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '10px', border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}><Printer size={16} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '60px', borderTop: '6px solid #000', paddingTop: '40px', paddingBottom: '80px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '24px', color: '#000000' }}>HISTORIAL DE ACTIVIDAD</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {logs.length === 0 ? <p style={{ color: '#000' }}>Sin registros.</p> : logs.map((log) => (
              <div key={log.id} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '20px', borderRadius: '20px', boxShadow: '6px 6px 0px #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ background: '#000', color: '#fff', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '900' }}>{log.usuario}</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#000000' }}>{new Date(log.fecha).toLocaleString()}</span>
                </div>
                <p style={{ fontWeight: '900', fontSize: '16px', color: '#000000' }}>{log.accion}</p>
                <p style={{ fontSize: '14px', color: '#000000' }}>{log.detalles}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}