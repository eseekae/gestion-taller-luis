'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx-js-style'
import { ArrowLeft, Search, School, Phone, Calendar, Printer, Trash2, MessageCircle, Download, MessageSquare } from 'lucide-react'

export default function VerPedidos() {
  const router = useRouter()
  const [datos, setDatos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({})
  const [logs, setLogs] = useState<any[]>([])

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
        ...p, c_nombre: cliente?.nombre || 'S/N', c_telefono: cliente?.telefono || '', 
        detalles, pagos, total_pagado: totalPagado, estado_macro: estadoMacro, color_bg: colorEstadoBg, color_text: colorEstadoText
      }
    })
    setDatos(cruzados)
    setLoading(false)
  }, [router])

  useEffect(() => { cargar() }, [cargar])

  const actualizarEntrega = async (det: any, cambio: number) => {
    const actual = det.cantidad_entregada || 0
    const total = det.cantidad
    let nuevaCantidad = actual + cambio
    if (nuevaCantidad < 0 || nuevaCantidad > total) return

    try {
      if (det.producto_id) {
        const rpcName = cambio > 0 ? 'entregar_stock' : 'revertir_entrega_stock'
        await supabase.rpc(rpcName, { prod_id: det.producto_id, cant: Math.abs(cambio) })
      }
      await supabase.from('detalles_pedido').update({ 
        cantidad_entregada: nuevaCantidad, 
        estado: nuevaCantidad === total ? 'Entregado' : 'Pendiente' 
      }).eq('id', det.id)
      cargar()
    } catch (err) { alert("❌ Error en entrega.") }
  }

  const agregarPago = async (pedido: any) => {
    const montoInput = prompt('💰 Nuevo Pago - Monto:', '')
    if (!montoInput) return
    const monto = Number(montoInput.replace(/\D/g, ''))
    if (isNaN(monto) || monto <= 0) return alert('❌ Monto inválido.')

    try {
      await supabase.from('pagos').insert([{
        pedido_id: pedido.id, monto: monto, fecha_pago: new Date().toISOString().split('T')[0], 
        metodo_pago: 'Transferencia', creado_por: sessionStorage.getItem('user_name') || 'Usuario'
      }])
      cargar()
    } catch (err) { alert('❌ Error al guardar el pago.') }
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
  }).filter(p => filtro === 'Todos' || (filtro === 'Pendientes' && p.estado_macro !== 'Completado') || p.estado_macro === filtro)

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}><ArrowLeft size={20} color="#000" /></button>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#000' }}>Pedidos Recientes</h1>
          <button style={{ opacity: 0, pointerEvents: 'none' }}><Download /></button>
        </div>

        {/* BUSCADOR Y FILTROS */}
        <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '14px' }} size={20} color="#000" />
            <input placeholder="Buscar cliente o colegio..." style={{ width: '100%', padding: '14px 40px', border: '3px solid #000', borderRadius: '12px', fontWeight: '700', boxShadow: '4px 4px 0px #000' }} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Todos', 'Pendientes', 'Completado'].map(f => (
              <button key={f} onClick={() => setFiltro(f)} style={{ backgroundColor: filtro === f ? '#000' : '#fff', color: filtro === f ? '#fff' : '#000', border: '3px solid #000', borderRadius: '8px', padding: '8px 14px', fontWeight: '800', boxShadow: '3px 3px 0px #000' }}>{f}</button>
            ))}
          </div>
        </div>

        {/* LISTADO DE PEDIDOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {filtrados.map(p => {
            const deuda = p.total_final - (p.total_pagado || 0)
            const expandido = !!expandidos[p.id]
            const fechaEntrega = p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'POR DEFINIR'

            return (
              <div key={p.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '3px solid #000', boxShadow: '8px 8px 0px #000' }}>
                
                {/* LÍNEA SUPERIOR: COLEGIO Y ESTADO */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '12px', color: '#000', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                      <School size={12} /> {p.colegio || 'Particular'}
                    </span>
                    {/* FECHA DE ENTREGA AÑADIDA AQUÍ */}
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#000', color: '#fff', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '900' }}>
                      <Calendar size={14} /> ENTREGA: {fechaEntrega}
                    </div>
                  </div>
                  <span style={{ backgroundColor: p.color_bg, color: p.color_text, padding: '6px 12px', borderRadius: '8px', fontWeight: '800', border: '2px solid #000', fontSize: '12px' }}>{p.estado_macro}</span>
                </div>

                <h2 style={{ fontWeight: '900', fontSize: '24px', color: '#000', marginBottom: '4px' }}>{p.c_nombre}</h2>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={14} /> {p.c_telefono}
                </p>

                {p.observaciones && (
                  <div style={{ backgroundColor: '#fff7ed', border: '2px solid #ea580c', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: '#ea580c', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}><MessageSquare size={14} /> NOTA:</p>
                    <p style={{ fontSize: '13px', color: '#000', margin: 0, fontWeight: '700' }}>{p.observaciones}</p>
                  </div>
                )}

                <button onClick={() => setExpandidos(prev => ({ ...prev, [p.id]: !prev[p.id] }))} style={{ width: '100%', marginBottom: '16px', border: '3px solid #000', borderRadius: '10px', padding: '10px', fontWeight: '900', background: '#f1f5f9' }}>{expandido ? 'Ocultar Detalle' : 'Ver Detalle'}</button>

                {expandido && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {p.detalles?.map((det: any, idx: number) => (
                      <div key={idx} style={{ padding: '12px', border: '2px solid #000', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', background: '#f8fafc' }}>
                        <div>
                          <p style={{ fontWeight: '800' }}>{det.p_nombre}</p>
                          <p style={{ fontSize: '12px' }}>Talla: {det.talla} | {det.cantidad_entregada || 0} de {det.cantidad}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => actualizarEntrega(det, -1)} style={{ border: '2px solid #000', borderRadius: '8px', padding: '5px', background: '#ef4444', color: '#fff' }}>-</button>
                          <button onClick={() => actualizarEntrega(det, 1)} style={{ background: '#4ade80', borderRadius: '8px', padding: '5px', border: '2px solid #000' }}>+1</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '16px', border: '3px solid #000' }}>
                    <p style={{ fontSize: '10px', fontWeight: '800' }}>PAGADO</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#166534' }}>${Number(p.total_pagado || 0).toLocaleString('es-CL')}</p>
                    <button onClick={() => agregarPago(p)} style={{ background: '#000', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', marginTop: '8px' }}>+ Pago</button>
                  </div>
                  <div style={{ background: deuda > 0 ? '#fef2f2' : '#f0fdf4', padding: '16px', borderRadius: '16px', border: '3px solid #000' }}>
                    <p style={{ fontSize: '10px', fontWeight: '800' }}>DEUDA</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: deuda > 0 ? '#991b1b' : '#166534' }}>${deuda.toLocaleString('es-CL')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '3px solid #000', paddingTop: '16px' }}>
                  <button onClick={() => borrarPedido(p.id, p.c_nombre)} style={{ color: '#991b1b', fontWeight: '900', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}><Trash2 size={16} /> Borrar</button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => window.open(`https://wa.me/${p.c_telefono}`, '_blank')} style={{ background: '#25D366', color: '#fff', padding: '10px', borderRadius: '10px', border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}><MessageCircle size={18} /></button>
                    <button onClick={() => window.open(`/ticket/${p.id}`, '_blank')} style={{ background: '#fff', color: '#000', padding: '10px', borderRadius: '10px', border: '2px solid #000', boxShadow: '3px 3px 0px #000' }}><Printer size={18} /></button>
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