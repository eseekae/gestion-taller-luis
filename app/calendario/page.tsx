'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ChevronLeft, ChevronRight, User, School, 
  Package, X, Calendar as CalendarIcon, Clock, 
  CheckCircle, ChevronDown, ChevronUp, Scissors, Info, Printer, MessageCircle, Phone
} from 'lucide-react'

export default function CalendarioLiteral() {
  const router = useRouter()
  const [fechaActual, setFechaActual] = useState(new Date())
  const [pedidos, setPedidos] = useState<any[]>([])
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null)
  const [colegioSeleccionado, setColegioSeleccionado] = useState<string | null>(null)
  const [verEntregados, setVerEntregados] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('pedidos')
        .select(`*, clientes(nombre, telefono), detalles_pedido(*, inventario(nombre))`)
        .not('fecha_entrega', 'is', null)
      
      if (data) setPedidos(data)
      setLoading(false)
    }
    cargar()
  }, [])

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

  const pedidosAgrupados = useMemo(() => {
    return pedidos.reduce((acc: any, p: any) => {
      const fecha = p.fecha_entrega
      const col = p.colegio || 'PARTICULAR'
      
      if (!acc[fecha]) acc[fecha] = {}
      if (!acc[fecha][col]) acc[fecha][col] = { pendientes: [], entregados: [] }
      
      if (p.estado === 'Completado') {
        acc[fecha][col].entregados.push(p)
      } else {
        acc[fecha][col].pendientes.push(p)
      }
      return acc
    }, {})
  }, [pedidos])

  const cambiarMes = (offset: number) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + offset, 1))
  }

  const shadowStyle = "8px 8px 0px #000"
  const cellStyle = { 
    height: '115px', 
    border: '3px solid #000', 
    position: 'relative' as const, 
    cursor: 'pointer', 
    backgroundColor: '#fff',
    transition: 'all 0.1s ease'
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
      backgroundSize: '32px 32px',
      padding: '40px 15px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px' }}>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/')} 
            style={{ backgroundColor: '#fff', border: '4px solid #000', padding: '12px', borderRadius: '16px', boxShadow: '5px 5px 0px #000', cursor: 'pointer' }}
          >
            <ArrowLeft size={24} color="#000" />
          </motion.button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#fff', padding: '10px 25px', borderRadius: '24px', border: '4px solid #000', boxShadow: '6px 6px 0px #000' }}>
            <motion.button whileTap={{ x: -2 }} onClick={() => cambiarMes(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}><ChevronLeft size={28} /></motion.button>
            <h2 style={{ margin: 0, textTransform: 'uppercase', fontWeight: '950', fontSize: '20px', width: '180px', textAlign: 'center', color: '#000', letterSpacing: '-1px' }}>{nombreMes}</h2>
            <motion.button whileTap={{ x: 2 }} onClick={() => cambiarMes(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}><ChevronRight size={28} /></motion.button>
          </div>
          
          <div style={{ width: '50px' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#000' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '4px', border: '2px solid #000' }} /> PENDIENTES
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#000' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', border: '2px solid #000' }} /> ENTREGADOS
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          backgroundColor: '#000', 
          gap: '4px', 
          border: '4px solid #000', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          boxShadow: '12px 12px 0px #000' 
        }}>
          {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontWeight: '950', fontSize: '12px', padding: '15px 0', backgroundColor: '#f1f5f9', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '4px solid #000' }}>{d}</div>
          ))}
          
          {diasMes.map((dia, idx) => {
            if (!dia) return <div key={`empty-${idx}`} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}></div>
            
            const fechaKey = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
            const dataDia = pedidosAgrupados[fechaKey] || {}
            const colegiosEnDia = Object.keys(dataDia)
            
            const totalPendientes = colegiosEnDia.reduce((sum, col) => sum + dataDia[col].pendientes.length, 0)
            const totalEntregados = colegiosEnDia.reduce((sum, col) => sum + dataDia[col].entregados.length, 0)
            const tieneAlgo = totalPendientes > 0 || totalEntregados > 0

            return (
              <motion.div 
                key={idx} 
                whileHover={tieneAlgo ? { scale: 0.98, backgroundColor: '#f1f5f9' } : {}}
                onClick={() => tieneAlgo && (setDiaSeleccionado(fechaKey), setColegioSeleccionado(null), setVerEntregados(false))}
                style={{ 
                  ...cellStyle, 
                  backgroundColor: totalPendientes > 0 ? '#eff6ff' : '#fff',
                  cursor: tieneAlgo ? 'pointer' : 'default'
                }}
              >
                <span style={{ position: 'absolute', top: '8px', left: '10px', fontWeight: '950', fontSize: '16px', color: '#000' }}>{dia}</span>
                
                <div style={{ position: 'absolute', bottom: '5px', left: '5px', right: '5px', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
                  {colegiosEnDia.slice(0, 3).map((col, cIdx) => (
                    <div key={cIdx} style={{ fontSize: '9px', fontWeight: '900', background: dataDia[col].pendientes.length > 0 ? '#3b82f6' : '#e2e8f0', color: dataDia[col].pendientes.length > 0 ? '#fff' : '#64748b', padding: '2px 4px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', border: '1px solid #000' }}>
                      {col}
                    </div>
                  ))}
                  {colegiosEnDia.length > 3 && <div style={{ fontSize: '9px', fontWeight: '900', color: '#000' }}>+{colegiosEnDia.length - 3}</div>}
                </div>
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {diaSeleccionado && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
              <motion.div 
                initial={{ y: 100, opacity: 0, rotate: -2 }} 
                animate={{ y: 0, opacity: 1, rotate: 0 }} 
                exit={{ y: 100, opacity: 0 }}
                style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '32px', border: '5px solid #000', overflow: 'hidden', boxShadow: '15px 15px 0px #3b82f6' }}
              >
                <div style={{ backgroundColor: '#000', color: '#fff', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '5px solid #000' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {colegioSeleccionado ? (
                      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setColegioSeleccionado(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><ArrowLeft size={24} /></motion.button>
                    ) : (
                      <CalendarIcon size={24} color="#fbbf24" />
                    )}
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '950', textTransform: 'capitalize' }}>
                      {colegioSeleccionado || new Date(diaSeleccionado + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => { setDiaSeleccionado(null); setColegioSeleccionado(null); }} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}><X size={32} /></motion.button>
                </div>

                <div style={{ padding: '25px', maxHeight: '65vh', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {!colegioSeleccionado ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ margin: 0, fontSize: '11px', fontWeight: '950', color: '#64748b', letterSpacing: '1px' }}>SELECCIONA UN COLEGIO</p>
                      {Object.keys(pedidosAgrupados[diaSeleccionado] || {}).map(col => (
                        <motion.button 
                          key={col} whileHover={{ x: 5 }} onClick={() => setColegioSeleccionado(col)}
                          style={{ padding: '18px', backgroundColor: '#fff', border: '3px solid #000', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <School size={20} color="#3b82f6" />
                            <span style={{ fontWeight: '950', fontSize: '15px', color: '#000' }}>{col}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '5px' }}>
                             {pedidosAgrupados[diaSeleccionado][col].pendientes.length > 0 && <span style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', border: '1px solid #000' }}>{pedidosAgrupados[diaSeleccionado][col].pendientes.length} PEND</span>}
                             {pedidosAgrupados[diaSeleccionado][col].entregados.length > 0 && <span style={{ backgroundColor: '#e2e8f0', color: '#64748b', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', border: '1px solid #000' }}>{pedidosAgrupados[diaSeleccionado][col].entregados.length} ENT</span>}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Scissors size={18} color="#3b82f6" />
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '950', color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase' }}>PENDIENTES DE ENTREGA ({pedidosAgrupados[diaSeleccionado]?.[colegioSeleccionado]?.pendientes.length || 0})</p>
                      </div>
                      
                      {(!pedidosAgrupados[diaSeleccionado]?.[colegioSeleccionado]?.pendientes || pedidosAgrupados[diaSeleccionado][colegioSeleccionado].pendientes.length === 0) && (
                        <div style={{ padding: '20px', border: '3px dashed #cbd5e1', borderRadius: '20px', textAlign: 'center', color: '#64748b', fontWeight: '800', fontSize: '14px' }}>
                          Todo al día para esta fecha. 🧵
                        </div>
                      )}
                      
                      {pedidosAgrupados[diaSeleccionado]?.[colegioSeleccionado]?.pendientes?.map((p: any) => (
                        <motion.div 
                          key={p.id} 
                          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                          style={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '24px', padding: '20px', boxShadow: '6px 6px 0px #000' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                            <span style={{ fontWeight: '950', fontSize: '18px', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <User size={18} /> 
                              {p.clientes?.nombre || 'Cliente sin nombre'} 
                            </span>
                            <span style={{ background: '#fbbf24', border: '2px solid #000', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '950', color: '#000' }}>ID #{p.id}</span>
                          </div>
                          
                          <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '16px', border: '2px solid #000', marginBottom: '15px' }}>
                            {p.detalles_pedido?.map((det: any, idx: number) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                                <span style={{ fontWeight: '800', color: '#000' }}>{det.cantidad}x {det.inventario?.nombre || 'Producto'}</span>
                                <span style={{ fontWeight: '950', color: '#3b82f6' }}>TALLA {det.talla}</span>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            {p.clientes?.telefono && (
                              <motion.button 
                                whileHover={{ y: -2 }} whileTap={{ y: 1 }}
                                onClick={() => window.open(`https://wa.me/${p.clientes.telefono.replace('+', '')}`, '_blank')} 
                                style={{ flex: 1, backgroundColor: '#22c55e', color: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '14px', fontWeight: '950', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                              >
                                <MessageCircle size={16} /> WHATSAPP
                              </motion.button>
                            )}
                            <motion.button 
                              whileHover={{ y: -2 }} whileTap={{ y: 1 }}
                              onClick={() => router.push(`/ticket/${p.id}`)} 
                              style={{ flex: 1, backgroundColor: '#000', color: '#fff', border: 'none', padding: '12px', borderRadius: '14px', fontWeight: '950', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <Printer size={16} /> TICKET
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}

                      <div style={{ marginTop: '10px' }}>
                        <motion.button 
                          whileHover={{ backgroundColor: '#e2e8f0' }}
                          onClick={() => setVerEntregados(!verEntregados)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#fff', border: '3px solid #cbd5e1', borderRadius: '20px', color: '#64748b', fontWeight: '950', fontSize: '13px', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={18} color={(pedidosAgrupados[diaSeleccionado]?.[colegioSeleccionado]?.entregados?.length > 0) ? "#10b981" : "#cbd5e1"} />
                            <span>YA ENTREGADOS ({pedidosAgrupados[diaSeleccionado]?.[colegioSeleccionado]?.entregados?.length || 0})</span>
                          </div>
                          {verEntregados ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </motion.button>

                        <AnimatePresence>
                          {verEntregados && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              style={{ overflow: 'hidden', marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                            >
                              {pedidosAgrupados[diaSeleccionado]?.[colegioSeleccionado]?.entregados?.map((p: any) => (
                                <div key={p.id} style={{ backgroundColor: '#f0fdf4', border: '2px solid #bcf0da', borderRadius: '18px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: '#166534' }}>{p.clientes?.nombre || 'S/N'}</p>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>ID #{p.id} • {p.detalles_pedido?.length || 0} items</p>
                                  </div>
                                  <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '10px', border: '2px solid #166534' }}>
                                    <CheckCircle size={16} color="#166534" />
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}