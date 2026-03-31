'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import { ArrowLeft, Search, School, Phone, IdCard, Calendar, Package, Printer, Trash2, Edit3, CheckCircle2, Clock, RotateCcw, MessageCircle, Download } from 'lucide-react'

export default function VerPedidos() {
  const router = useRouter()
  const [datos, setDatos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [ordenarColegio, setOrdenarColegio] = useState(false)

  const cargar = useCallback(async () => {
    if (!sessionStorage.getItem('user_role')) return router.push('/login')

    setLoading(true)
    const [pRes, cRes, iRes, dRes] = await Promise.all([
      supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
      supabase.from('clientes').select('*'),
      supabase.from('inventario').select('*'),
      supabase.from('detalles_pedido').select('*').order('id')
    ])
    
    const cruzados = (pRes.data || []).map(p => {
      const cliente = cRes.data?.find(c => c.id === p.cliente_id)
      const detalles = dRes.data?.filter(d => d.pedido_id === p.id).map(d => {
        const prod = iRes.data?.find(inv => inv.id === d.producto_id)
        return { ...d, p_nombre: prod?.nombre || 'Producto' }
      })

      // Ahora el estado depende de si las cantidades calzan
      const itemsCompletos = detalles?.length > 0 && detalles.every(d => (d.cantidad_entregada || 0) === d.cantidad)
      const pagoCompleto = p.abono >= p.total_final
      
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
        detalles, estado_macro: estadoMacro, color_bg: colorEstadoBg, color_text: colorEstadoText, itemsCompletos
      }
    })
    setDatos(cruzados)
    setLoading(false)
  }, [router])

  // NUEVA FUNCIÓN DE ENTREGA PARCIAL
  const actualizarEntrega = async (det: any, cambio: number | 'todo') => {
    const actual = det.cantidad_entregada || 0
    const total = det.cantidad
    let nuevaCantidad = cambio === 'todo' ? total : actual + cambio

    if (nuevaCantidad < 0 || nuevaCantidad > total) return
    const variacion = nuevaCantidad - actual

    try {
      if (det.producto_id && variacion !== 0) {
        // Usamos tus funciones RPC originales
        const rpcName = variacion > 0 ? 'entregar_stock' : 'revertir_entrega_stock'
        await supabase.rpc(rpcName, { prod_id: det.producto_id, cant: Math.abs(variacion) })
      }

      const nuevoEstado = nuevaCantidad === total ? 'Entregado' : 'Pendiente'
      await supabase.from('detalles_pedido').update({ 
        cantidad_entregada: nuevaCantidad, 
        estado: nuevoEstado 
      }).eq('id', det.id)

      cargar()
    } catch (err) { alert("Error: " + err) }
  }

  const abrirWhatsApp = (telefono: string) => {
    const numLimpio = telefono.replace(/\D/g, '')
    const link = `https://wa.me/${numLimpio.startsWith('56') ? numLimpio : '56' + numLimpio}`
    window.open(link, '_blank')
  }

  const exportarExcel = () => {
    const reporte = datos.map(p => ({
      Fecha: new Date(p.created_at).toLocaleDateString('es-CL'),
      Cliente: p.c_nombre,
      Telefono: p.c_telefono,
      RUT: p.c_rut,
      Colegio: p.colegio || 'Particular',
      Total: p.total_final,
      Abono: p.abono,
      Saldo: p.total_final - p.abono,
      Estado: p.estado_macro
    }))
    const ws = XLSX.utils.json_to_sheet(reporte)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Ventas")
    XLSX.writeFile(wb, `Respaldo_Ventas_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const actualizarAbono = async (pedidoId: string, totalFinal: number, abonoActual: number) => {
    const input = prompt(`💰 Modificar Pago\nTotal: $${totalFinal}\nPagado: $${abonoActual}\n\nNUEVO MONTO TOTAL pagado:`, abonoActual.toString());
    if (input === null) return;
    const nuevoAbono = Number(input);
    if (isNaN(nuevoAbono) || nuevoAbono < 0) return alert("❌ Monto inválido.");
    try {
      await supabase.from('pedidos').update({ abono: nuevoAbono }).eq('id', pedidoId);
      cargar(); 
    } catch (err) { alert("Error al actualizar pago: " + err); }
  }

  const borrarPedido = async (pedidoId: string, detalles: any[]) => {
    if(!confirm('⚠️ ¿Borrar pedido completo?')) return
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
            const deuda = p.total_final - p.abono;
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

                {/* ITEMS DEL PEDIDO CON BOTONES DE ENTREGA PARCIAL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
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
                          <button onClick={() => actualizarEntrega(det, -1)} style={{ backgroundColor: '#fff', border: '1px solid #000', padding: '5px 10px', borderRadius: '6px', fontWeight: '900', cursor: 'pointer' }}>-</button>
                          <button onClick={() => actualizarEntrega(det, 1)} style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontWeight: '900', cursor: 'pointer' }}>+1</button>
                          <button onClick={() => actualizarEntrega(det, 'todo')} style={{ backgroundColor: entregadoTotal ? '#10b981' : '#fff', color: entregadoTotal ? '#fff' : '#000', border: '1px solid #000', padding: '5px 10px', borderRadius: '6px', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>
                            {entregadoTotal ? '✓' : 'TODO'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#000' }}>PAGADO</p>
                    <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '900', color: '#10b981' }}>${p.abono.toLocaleString()}</p>
                    <button onClick={() => actualizarAbono(p.id, p.total_final, p.abono)} style={{ border: '1px solid #000', background: '#000', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>Modificar</button>
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