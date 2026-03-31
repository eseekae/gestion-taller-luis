'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
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

  const metodoPagoIcono = (metodo: string) => {
    if (metodo === 'Transferencia') return <Landmark size={14} />
    if (metodo === 'Efectivo') return <Banknote size={14} />
    return <CreditCard size={14} />
  }

  const cargar = useCallback(async () => {
    if (!sessionStorage.getItem('user_role')) return router.push('/login')

    setLoading(true)
    const [pRes, cRes, iRes, dRes, pagosRes] = await Promise.all([
      supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
      supabase.from('clientes').select('*'),
      supabase.from('inventario').select('*'),
      supabase.from('detalles_pedido').select('*').order('id'),
      supabase.from('pagos').select('*').order('fecha_pago', { ascending: true })
    ])
    
    const cruzados = (pRes.data || []).map(p => {
      const cliente = cRes.data?.find(c => c.id === p.cliente_id)
      const pagos = (pagosRes.data || []).filter(pg => pg.pedido_id === p.id)
      const totalPagado = pagos.reduce((acc, pg) => acc + Number(pg.monto || 0), 0)
      const detalles = dRes.data?.filter(d => d.pedido_id === p.id).map(d => {
        const prod = iRes.data?.find(inv => inv.id === d.producto_id)
        return { ...d, p_nombre: prod?.nombre || 'Producto' }
      })

      // Ahora el estado depende de si las cantidades calzan
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

  // ENTREGA PARCIAL CON OPTIMISTIC UI + ROLLBACK
  const actualizarEntrega = async (det: any, cambio: number | 'todo') => {
    const actual = det.cantidad_entregada || 0
    const total = det.cantidad
    let nuevaCantidad = cambio === 'todo' ? total : actual + cambio

    if (nuevaCantidad < 0 || nuevaCantidad > total) return
    const variacion = nuevaCantidad - actual
    if (variacion === 0) return

    const pedidoObjetivoId = det.pedido_id
    const nuevoEstado = nuevaCantidad === total ? 'Entregado' : 'Pendiente'
    let datosPrevios: any[] = []

    // 1) Actualizamos UI local al instante
    setDatos(prev => {
      datosPrevios = prev
      return prev.map(pedido => {
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
      })
    })

    try {
      // 2) Sincronizamos en background con Supabase
      if (det.producto_id) {
        const rpcName = variacion > 0 ? 'entregar_stock' : 'revertir_entrega_stock'
        await supabase.rpc(rpcName, { prod_id: det.producto_id, cant: Math.abs(variacion) })
      }

      await supabase.from('detalles_pedido').update({ 
        cantidad_entregada: nuevaCantidad, 
        estado: nuevoEstado 
      }).eq('id', det.id)
    } catch (err) {
      // 3) Si falla backend, revertimos UI local y avisamos
      setDatos(datosPrevios)
      alert("❌ No se pudo sincronizar la entrega. Se revirtió el cambio.")
    }
  }

  const abrirWhatsApp = (telefono: string) => {
    const numLimpio = telefono.replace(/\D/g, '')
    const link = `https://wa.me/${numLimpio.startsWith('56') ? numLimpio : '56' + numLimpio}`
    window.open(link, '_blank')
  }

  const exportarExcel = () => {
    const reporte: any[] = []
    const formatoMoneda = (monto: number) => `$${Number(monto || 0).toLocaleString('es-CL')}`
    const rangosPedidos: Array<{ inicio: number; fin: number }> = []

    datos.forEach(p => {
      const inicioBloque = reporte.length + 2 // +1 por header y +1 porque Excel parte en 1
      const totalPedido = Number(p.total_final || 0)
      const abonoPedido = Number(p.total_pagado || 0)
      const saldoPendiente = totalPedido - abonoPedido
      const detalles = p.detalles || []
      const pagos = p.pagos || []

      // Fila encabezado del pedido
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
        'Precio Unitario': '',
        'Total Ítem': '',
        'Total Pedido': formatoMoneda(totalPedido),
        'Abono Pedido': formatoMoneda(abonoPedido),
        'Saldo Pendiente': formatoMoneda(saldoPendiente)
      })

      // Filas detalle por ítem
      detalles.forEach((det: any) => {
        const cantidad = Number(det.cantidad || 0)
        const cantidadEntregada = Number(det.cantidad_entregada || 0)
        const precioUnitarioBase =
          det.precio_unitario ??
          det.precio ??
          (cantidad > 0 ? Number(det.subtotal || 0) / cantidad : 0)
        const precioUnitario = Number(precioUnitarioBase || 0)
        const totalItem = cantidad * precioUnitario

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
          'Precio Unitario': formatoMoneda(precioUnitario),
          'Total Ítem': formatoMoneda(totalItem),
          'Total Pedido': '',
          'Abono Pedido': '',
          'Saldo Pendiente': ''
        })
      })

      // Filas de pagos del pedido
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
          'Precio Unitario': '',
          'Total Ítem': '',
          'Total Pedido': '',
          'Abono Pedido': formatoMoneda(pg.monto || 0),
          'Saldo Pendiente': pg.metodo_pago || ''
        })
      })

      const finBloque = reporte.length + 1
      rangosPedidos.push({ inicio: inicioBloque, fin: finBloque })
    })

    const ws = XLSX.utils.json_to_sheet(reporte)

    const bordeNegro = { rgb: '000000' }
    const columnasTotales = 16 // A..P
    const asegurarCelda = (fila: number, col: number) => {
      const dir = XLSX.utils.encode_cell({ r: fila - 1, c: col })
      if (!ws[dir]) ws[dir] = { t: 's', v: '' }
      return dir
    }
    const aplicarBorde = (fila: number, col: number, borde: any) => {
      const dir = asegurarCelda(fila, col)
      const celda = ws[dir] as any
      celda.s = {
        ...(celda.s || {}),
        border: {
          ...(celda.s?.border || {}),
          ...borde
        }
      }
      ws[dir] = celda
    }

    rangosPedidos.forEach(({ inicio, fin }) => {
      // Separadores internos entre filas del mismo bloque
      for (let fila = inicio + 1; fila <= fin; fila++) {
        for (let col = 0; col < columnasTotales; col++) {
          aplicarBorde(fila, col, { top: { style: 'thin', color: bordeNegro } })
        }
      }

      // Borde exterior oscuro y prominente del bloque
      for (let col = 0; col < columnasTotales; col++) {
        aplicarBorde(inicio, col, { top: { style: 'medium', color: bordeNegro } })
        aplicarBorde(fin, col, { bottom: { style: 'medium', color: bordeNegro } })
      }
      for (let fila = inicio; fila <= fin; fila++) {
        aplicarBorde(fila, 0, { left: { style: 'medium', color: bordeNegro } })
        aplicarBorde(fila, columnasTotales - 1, { right: { style: 'medium', color: bordeNegro } })
      }
    })

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Reporte Detallado")
    XLSX.writeFile(wb, `Reporte_Detallado_Ventas_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const agregarPago = async (pedido: any) => {
    const montoInput = prompt('💰 Nuevo Pago\nMonto:', '')
    if (montoInput === null) return
    const monto = Number(montoInput)
    if (isNaN(monto) || monto <= 0) return alert('❌ Monto inválido.')

    const fechaDefault = new Date().toISOString().split('T')[0]
    const fechaPago = prompt('📅 Fecha de Pago (YYYY-MM-DD):', fechaDefault)
    if (fechaPago === null || !fechaPago.trim()) return

    const metodo = prompt('💳 Método (Transferencia, Efectivo, Débito, Crédito):', 'Transferencia')
    if (metodo === null || !['Transferencia', 'Efectivo', 'Débito', 'Crédito'].includes(metodo)) {
      return alert('❌ Método inválido.')
    }

    const pagoTemp = {
      id: `temp-${Date.now()}`,
      pedido_id: pedido.id,
      monto,
      fecha_pago: fechaPago,
      metodo_pago: metodo
    }

    let snapshot: any[] = []
    setDatos(prev => {
      snapshot = prev
      return prev.map(p => {
        if (p.id !== pedido.id) return p
        const pagosActualizados = [...(p.pagos || []), pagoTemp]
        const totalPagado = Number(p.total_pagado || 0) + monto
        const { estadoMacro, colorEstadoBg, colorEstadoText, itemsCompletos } = calcularEstadoPedido(
          { ...p, total_pagado: totalPagado },
          p.detalles || []
        )
        return {
          ...p,
          pagos: pagosActualizados,
          total_pagado: totalPagado,
          estado_macro: estadoMacro,
          color_bg: colorEstadoBg,
          color_text: colorEstadoText,
          itemsCompletos
        }
      })
    })

    try {
      const { data, error } = await supabase.from('pagos').insert([{
        pedido_id: pedido.id,
        monto,
        fecha_pago: fechaPago,
        metodo_pago: metodo
      }]).select().single()
      if (error) throw error

      setDatos(prev => prev.map(p => {
        if (p.id !== pedido.id) return p
        return {
          ...p,
          pagos: (p.pagos || []).map((pg: any) => (String(pg.id).startsWith('temp-') ? (data || pg) : pg))
        }
      }))
    } catch (err) {
      setDatos(snapshot)
      alert('❌ Error al guardar el pago. Se revirtió el cambio.')
    }
  }

  const borrarPedido = async (pedidoId: string, detalles: any[]) => {
    if(!confirm('⚠️ ¿Borrar pedido completo?')) return
    await supabase.from('pagos').delete().eq('pedido_id', pedidoId)
    for (const det of detalles) {
      if (det.estado === 'Pendiente' && det.producto_id) {
        await supabase.rpc('reservar_stock', { prod_id: det.producto_id, cant: -det.cantidad })
      }
    }
    await supabase.from('pedidos').delete().eq('id', pedidoId)
    cargar()
  }

  useEffect(() => { cargar() }, [cargar])

  const filtrados = datos
    .filter(p => {
      const termino = busqueda.toLowerCase();
      return p.c_nombre.toLowerCase().includes(termino) || p.c_telefono.includes(termino) || p.c_rut.includes(termino) || (p.colegio && p.colegio.toLowerCase().includes(termino))
    })
    .filter(p => filtro === 'Todos' || (filtro === 'Pendientes' && p.estado_macro !== 'Completado') || p.estado_macro === filtro)
    .sort((a, b) => {
      if (ordenarColegio) return (a.colegio || '').localeCompare(b.colegio || '')
      return (a.estado_macro === 'Completado' ? 1 : -1) 
    })

  const inputStyle = { width: '100%', padding: '14px 16px 14px 40px', border: '2px solid #000', borderRadius: '12px', fontSize: '15px', color: '#000', fontWeight: '700', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' as const }
  const btnFiltroStyle = (activo: boolean) => ({ backgroundColor: activo ? '#000' : '#fff', color: activo ? '#fff' : '#000', border: `2px solid #000`, borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' })
  
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '10px', borderRadius: '12px', color: '#000', cursor: 'pointer' }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#000' }}>Gestión de Pedidos</h1>
          </div>
          <button onClick={exportarExcel} style={{ backgroundColor: '#166534', color: '#fff', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <Download size={18} /> Excel
          </button>
        </div>

        <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '14px', color: '#000' }}><Search size={20} /></div>
            <input placeholder="Buscar por Nombre, RUT, Teléfono..." style={inputStyle} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setFiltro('Todos')} style={btnFiltroStyle(filtro === 'Todos')}>Todos</button>
            <button onClick={() => setFiltro('Pendientes')} style={btnFiltroStyle(filtro === 'Pendientes')}>Pendientes</button>
            <button onClick={() => setFiltro('Completado')} style={btnFiltroStyle(filtro === 'Completado')}>Completados</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtrados.map(p => {
            const deuda = p.total_final - (p.total_pagado || 0);
            const expandido = !!expandidos[p.id]
            return (
              <div key={p.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '2px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontWeight: '800', fontSize: '12px', color: '#000', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <School size={12} /> {p.colegio || 'Particular'}
                  </span>
                  <span style={{ backgroundColor: p.color_bg, color: p.color_text, padding: '6px 12px', borderRadius: '8px', fontWeight: '800', fontSize: '12px' }}>
                    {p.estado_macro}
                  </span>
                </div>

                <h2 style={{ margin: '0 0 8px 0', fontWeight: '900', fontSize: '22px', color: '#000' }}>{p.c_nombre}</h2>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', color: '#000', fontWeight: '600', fontSize: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> {p.c_telefono}</span>
                  {p.c_rut && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IdCard size={14} /> {p.c_rut}</span>}
                </div>

                <button
                  onClick={() => setExpandidos(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                  style={{ width: '100%', marginBottom: '16px', border: '2px solid #000', backgroundColor: '#fff', borderRadius: '10px', padding: '10px', fontWeight: '900', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                  {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {expandido ? 'Ocultar Detalle' : 'Ver Detalle'}
                </button>

                {expandido && <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {p.detalles?.map((det: any, idx: number) => {
                    const entregadoTotal = (det.cantidad_entregada || 0) === det.cantidad;
                    return (
                      <div key={idx} style={{ backgroundColor: entregadoTotal ? '#f0fdf4' : '#f8fafc', border: `1px solid ${entregadoTotal ? '#bbf7d0' : '#e2e8f0'}`, padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#000' }}>{det.p_nombre}</p>
                          <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                            Talla: {det.talla} | <span style={{color:'#000'}}>{det.cantidad_entregada || 0} de {det.cantidad} entregados</span>
                          </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => actualizarEntrega(det, -1)} style={{ backgroundColor: '#fff', color: '#000', border: '2px solid #000', padding: '5px 10px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>-</button>
                          <button onClick={() => actualizarEntrega(det, 1)} style={{ backgroundColor: '#000', color: '#fff', border: '2px solid #000', padding: '5px 10px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>+1</button>
                          <button onClick={() => actualizarEntrega(det, 'todo')} style={{ backgroundColor: entregadoTotal ? '#10b981' : '#fff', color: entregadoTotal ? '#fff' : '#000', border: '2px solid #000', padding: '5px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>
                            {entregadoTotal ? '✓' : 'TODO'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>}

                {expandido && (
                  <div style={{ marginBottom: '20px', border: '2px solid #000', borderRadius: '16px', padding: '14px', backgroundColor: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: '#000' }}>Historial de Pagos</p>
                      <button onClick={() => agregarPago(p)} style={{ border: '2px solid #000', background: '#000', color: '#fff', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                        AÑADIR PAGO
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(p.pagos || []).length === 0 && (
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Sin pagos registrados.</p>
                      )}
                      {(p.pagos || []).map((pg: any) => (
                        <div key={pg.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px', backgroundColor: '#f8fafc' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '800', color: '#000' }}>
                            <Calendar size={14} /> {pg.fecha_pago ? new Date(pg.fecha_pago).toLocaleDateString('es-CL') : '-'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '800', color: '#10b981' }}>
                            <CreditCard size={14} /> ${Number(pg.monto || 0).toLocaleString('es-CL')}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '800', color: '#000' }}>
                            {metodoPagoIcono(pg.metodo_pago)} {pg.metodo_pago || '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#000' }}>PAGADO</p>
                    <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '900', color: '#10b981' }}>${Number(p.total_pagado || 0).toLocaleString('es-CL')}</p>
                    <button onClick={() => agregarPago(p)} style={{ border: '2px solid #000', background: '#000', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>Añadir Pago</button>
                  </div>
                  <div style={{ backgroundColor: deuda > 0 ? '#fef2f2' : '#f0fdf4', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#000' }}>DEUDA</p>
                    <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '900', color: deuda > 0 ? '#ef4444' : '#10b981' }}>${deuda.toLocaleString()}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <button onClick={() => borrarPedido(p.id, p.detalles)} style={{ color: '#ef4444', fontWeight: '800', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                    <Trash2 size={16} /> Eliminar
                  </button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => abrirWhatsApp(p.c_telefono)} style={{ backgroundColor: '#25D366', color: '#fff', padding: '10px 16px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageCircle size={16} /> WhatsApp
                    </button>
                    <button onClick={() => window.open(`/ticket/${p.id}`, '_blank')} style={{ backgroundColor: '#000', color: '#fff', padding: '10px 16px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Printer size={16} /> Ticket
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}