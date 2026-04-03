'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, User, School, Package, X, Calendar as CalendarIcon, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function CalendarioLiteral() {
  const router = useRouter()
  const [fechaActual, setFechaActual] = useState(new Date())
  const [pedidos, setPedidos] = useState<any[]>([])
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null)
  const [verEntregados, setVerEntregados] = useState(false)
  const [loading, setLoading] = useState(true)

  // 1. Cargar TODOS los pedidos con fecha (incluyendo completados)
  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('pedidos')
        .select(`*, clientes(nombre), detalles_pedido(*, inventario(nombre))`)
        .not('fecha_entrega', 'is', null)
      
      if (data) setPedidos(data)
      setLoading(false)
    }
    cargar()
  }, [])

  // 2. Lógica del Calendario
  const diasMes = useMemo(() => {
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth()
    const primerDia = new Date(año, mes, 1).getDay()
    const totalDias = new Date(año, mes + 1, 0).getDate()
    const shift = primerDia === 0 ? 6 : primerDia - 1
    const dias = []
    for (let i = 0; i < shift; i++) dias.push(null)
    for (let i = 1; i <= totalDias; i++) dias.push(i)
    return dias
  }, [fechaActual])

  const nombreMes = fechaActual.toLocaleString('es-CL', { month: 'long', year: 'numeric' })

  // 3. Agrupar por fecha y por ESTADO
  const pedidosAgrupados = useMemo(() => {
    return pedidos.reduce((acc: any, p: any) => {
      const fecha = p.fecha_entrega
      if (!acc[fecha]) acc[fecha] = { pendientes: [], entregados: [] }
      
      if (p.estado === 'Completado') {
        acc[fecha].entregados.push(p)
      } else {
        acc[fecha].pendientes.push(p)
      }
      return acc
    }, {})
  }, [pedidos])

  const cambiarMes = (offset: number) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + offset, 1))
  }

  // Estilos
  const cellStyle = { height: '110px', border: '2px solid #000', position: 'relative' as const, cursor: 'pointer', backgroundColor: '#fff' }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '15px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button onClick={() => router.push('/')} style={{ background: '#000', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}>
            <ArrowLeft size={20} color="#fff" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => cambiarMes(-1)} style={{ border: '3px solid #000', borderRadius: '8px', padding: '5px', color: '#000' }}><ChevronLeft /></button>
            <h2 style={{ margin: 0, textTransform: 'uppercase', fontWeight: '900', fontSize: '18px', width: '160px', textAlign: 'center', color: '#000' }}>{nombreMes}</h2>
            <button onClick={() => cambiarMes(1)} style={{ border: '3px solid #000', borderRadius: '8px', padding: '5px', color: '#000' }}><ChevronRight /></button>
          </div>
          <div style={{ width: '45px' }}></div>
        </div>

        {/* GRILLA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #000', boxShadow: '8px 8px 0px #000', backgroundColor: '#000', gap: '1px' }}>
          {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontWeight: '900', fontSize: '12px', padding: '10px 0', backgroundColor: '#f1f5f9', color: '#000', textTransform: 'uppercase' }}>{d}</div>
          ))}
          
          {diasMes.map((dia, idx) => {
            if (!dia) return <div key={`empty-${idx}`} style={{ ...cellStyle, backgroundColor: '#f8fafc' }}></div>
            
            const fechaKey = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
            const dataDia = pedidosAgrupados[fechaKey] || { pendientes: [], entregados: [] }
            const tieneAlgo = dataDia.pendientes.length > 0 || dataDia.entregados.length > 0

            return (
              <div 
                key={idx} 
                onClick={() => tieneAlgo && (setDiaSeleccionado(fechaKey), setVerEntregados(false))}
                style={{ 
                  ...cellStyle, 
                  backgroundColor: dataDia.pendientes.length > 0 ? '#eff6ff' : '#fff',
                  transition: '0.2s'
                }}
              >
                <span style={{ position: 'absolute', top: '5px', left: '8px', fontWeight: '900', fontSize: '14px', color: '#000' }}>{dia}</span>
                
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  {/* PENDIENTES (Llamativo) */}
                  {dataDia.pendientes.length > 0 && (
                    <div style={{ backgroundColor: '#3b82f6', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', border: '2px solid #000' }}>
                      {dataDia.pendientes.length}
                    </div>
                  )}
                  {/* ENTREGADOS (Menos llamativo) */}
                  {dataDia.entregados.length > 0 && (
                    <div style={{ backgroundColor: '#e2e8f0', color: '#64748b', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', border: '1px solid #94a3b8' }}>
                      {dataDia.entregados.length}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* MODAL "CARPETA" */}
        <AnimatePresence>
          {diaSeleccionado && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '24px', border: '4px solid #000', overflow: 'hidden', boxShadow: '12px 12px 0px #3b82f6' }}
              >
                {/* Header Modal */}
                <div style={{ backgroundColor: '#000', color: '#fff', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>{new Date(diaSeleccionado + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                  <button onClick={() => setDiaSeleccionado(null)} style={{ color: '#fff', background: 'none', border: 'none' }}><X size={30} /></button>
                </div>

                <div style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* SECCIÓN PENDIENTES (SIEMPRE ARRIBA) */}
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px' }}>POR ENTREGAR ({pedidosAgrupados[diaSeleccionado]?.pendientes.length})</p>
                  {pedidosAgrupados[diaSeleccionado]?.pendientes.length === 0 && <p style={{ fontSize: '13px', color: '#64748b' }}>No hay pendientes para hoy.</p>}
                  
                  {pedidosAgrupados[diaSeleccionado]?.pendientes.map((p: any) => (
                    <div key={p.id} style={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: '16px', padding: '15px', boxShadow: '4px 4px 0px #000' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '900', fontSize: '15px', color: '#000' }}><User size={16} inline /> {p.clientes.nombre}</span>
                        <span style={{ background: '#fbbf24', border: '2px solid #000', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' }}>ID #{p.id}</span>
                      </div>
                      <div style={{ borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                        {p.detalles_pedido?.map((det: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                            <span style={{ fontWeight: '700', color: '#000' }}>{det.cantidad}x {det.inventario?.nombre}</span>
                            <span style={{ fontWeight: '900', color: '#000' }}>Talla {det.talla}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => router.push(`/ticket/${p.id}`)} style={{ width: '100%', marginTop: '12px', backgroundColor: '#000', color: '#fff', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: '900', fontSize: '12px' }}>VER TICKET</button>
                    </div>
                  ))}

                  {/* PESTAÑA ENTREGADOS (COLAPSABLE) */}
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      onClick={() => setVerEntregados(!verEntregados)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#e2e8f0', border: '2px solid #94a3b8', borderRadius: '12px', color: '#475569', fontWeight: '900', fontSize: '12px' }}
                    >
                      <span>YA ENTREGADOS ({pedidosAgrupados[diaSeleccionado]?.entregados.length})</span>
                      {verEntregados ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {verEntregados && (
                      <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {pedidosAgrupados[diaSeleccionado]?.entregados.map((p: any) => (
                          <div key={p.id} style={{ backgroundColor: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '14px', padding: '12px', opacity: 0.8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '800', fontSize: '13px', color: '#64748b' }}>{p.clientes.nombre}</span>
                              <CheckCircle size={14} color="#10b981" />
                            </div>
                            <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#94a3b8' }}>ID #{p.id} - {p.detalles_pedido.length} items</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}