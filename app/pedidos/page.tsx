'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'Pendiente' | 'Entregado' | 'Todos'>('Pendiente')
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null)

  useEffect(() => {
    cargar()
  }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          detalles:detalles_pedido(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPedidos(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // FUNCIÓN CLAVE: Actualiza las cantidades entregadas una por una
  const actualizarEntrega = async (detalleId: string, cambio: number | 'todo', productoId: string, total: number, actual: number) => {
    let nuevaCantidad = 0
    let variacionStock = 0

    if (cambio === 'todo') {
      nuevaCantidad = total
      variacionStock = total - actual
    } else {
      nuevaCantidad = actual + cambio
      variacionStock = cambio
    }

    // Validaciones básicas
    if (nuevaCantidad < 0 || nuevaCantidad > total) return
    if (variacionStock === 0) return

    try {
      // 1. Actualizar Stock en Inventario usando las funciones RPC que ya tienes
      if (productoId) {
        const rpcName = variacionStock > 0 ? 'entregar_stock' : 'revertir_entrega_stock'
        const { error: stockError } = await supabase.rpc(rpcName, {
          prod_id: productoId,
          cant: Math.abs(variacionStock)
        })
        if (stockError) throw stockError
      }

      // 2. Actualizar el detalle del pedido
      const nuevoEstado = nuevaCantidad === total ? 'Entregado' : 'Pendiente'
      const { error: updateError } = await supabase
        .from('detalles_pedido')
        .update({ 
          cantidad_entregada: nuevaCantidad,
          estado: nuevoEstado 
        })
        .eq('id', detalleId)

      if (updateError) throw updateError

      cargar() // Refrescar lista
    } catch (err: any) {
      alert("Error al actualizar: " + err.message)
    }
  }

  const entregarPedidoCompleto = async (p: any) => {
    const confirmacion = confirm(`¿Entregar todos los items del pedido de ${p.cliente}?`)
    if (!confirmacion) return

    try {
      for (const det of p.detalles) {
        if (det.cantidad_entregada < det.cantidad) {
          await actualizarEntrega(det.id, 'todo', det.producto_id, det.cantidad, det.cantidad_entregada || 0)
        }
      }
      cargar()
    } catch (err: any) {
      alert("Error: " + err.message)
    }
  }

  const pedidosFiltrados = pedidos.filter(p => {
    const todosEntregados = p.detalles?.every((d: any) => d.cantidad_entregada === d.cantidad)
    if (filtro === 'Pendiente') return !todosEntregados
    if (filtro === 'Entregado') return todosEntregados
    return true
  })

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontWeight: 'bold' }}>Cargando pedidos...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '20px' }}>Gestión de Pedidos</h1>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', backgroundColor: '#f1f5f9', padding: '5px', borderRadius: '12px' }}>
        {['Pendiente', 'Entregado', 'Todos'].map((f: any) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: filtro === f ? '#fff' : 'transparent',
              boxShadow: filtro === f ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >{f}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {pedidosFiltrados.map(p => {
          const itemsEntregados = p.detalles?.filter((d: any) => d.cantidad_entregada === d.cantidad).length
          const totalItems = p.detalles?.length
          const esCompleto = itemsEntregados === totalItems

          return (
            <div key={p.id} style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              {/* Cabecera del Pedido */}
              <div 
                onClick={() => setPedidoExpandido(pedidoExpandido === p.id ? null : p.id)}
                style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{p.cliente}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                    {new Date(p.created_at).toLocaleDateString()} | {itemsEntregados}/{totalItems} items listos
                  </p>
                </div>
                <div style={{
                  backgroundColor: esCompleto ? '#dcfce7' : '#fef9c3',
                  color: esCompleto ? '#166534' : '#854d0e',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '800'
                }}>
                  {esCompleto ? 'Listo' : 'En proceso'}
                </div>
              </div>

              {/* Detalles Expandidos */}
              {pedidoExpandido === p.id && (
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ marginBottom: '15px' }}>
                    {p.detalles?.map((det: any, idx: number) => {
                      const entregado = det.cantidad_entregada === det.cantidad
                      return (
                        <div key={idx} style={{ 
                          backgroundColor: entregado ? '#f0fdf4' : '#fff', 
                          border: `1px solid ${entregado ? '#bbf7d0' : '#e2e8f0'}`, 
                          padding: '12px', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginBottom: '8px' 
                        }}>
                          <div>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '800' }}>{det.p_nombre}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                              Talla: {det.talla} | <strong>{det.cantidad_entregada || 0} de {det.cantidad}</strong> entregados
                            </p>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {/* BOTÓN DESHACER (-1) */}
                            <button 
                              onClick={() => actualizarEntrega(det.id, -1, det.producto_id, det.cantidad, det.cantidad_entregada || 0)}
                              style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            >-</button>

                            {/* BOTÓN SUMAR (+1) */}
                            <button 
                              onClick={() => actualizarEntrega(det.id, 1, det.producto_id, det.cantidad, det.cantidad_entregada || 0)}
                              style={{ backgroundColor: '#000', color: '#fff', border: 'none', width: '40px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            >+1</button>

                            {/* BOTÓN TODO */}
                            <button 
                              onClick={() => actualizarEntrega(det.id, 'todo', det.producto_id, det.cantidad, det.cantidad_entregada || 0)}
                              style={{ 
                                backgroundColor: entregado ? '#22c55e' : '#fff', 
                                color: entregado ? '#fff' : '#000', 
                                border: '1px solid #e2e8f0', 
                                padding: '0 10px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontSize: '11px', 
                                fontWeight: 'bold' 
                              }}
                            >{entregado ? '✓' : 'Todo'}</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {!esCompleto && (
                    <button 
                      onClick={() => entregarPedidoCompleto(p)}
                      style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                    >Entregar Todo el Pedido</button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}