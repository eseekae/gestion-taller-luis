'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ChevronLeft, ChevronRight, User, School, 
  Package, X, Calendar as CalendarIcon, Clock, 
  CheckCircle, ChevronDown, ChevronUp, Scissors, Info
} from 'lucide-react'

export default function CalendarioLiteral() {
  const router = useRouter()
  const [fechaActual, setFechaActual] = useState(new Date())
  const [pedidos, setPedidos] = useState<any[]>([])
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null)
  const [verEntregados, setVerEntregados] = useState(false)
  const [loading, setLoading] = useState(true)

  // 1. Cargar pedidos (Mantenemos la funcionalidad original)
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

  // 3. Agrupar por fecha y por ESTADO (Mantenemos la lógica de carpetas)
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

  // ESTILOS NEUBRUTALISTAS PULIDOS
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
        
        {/* HEADER CON FACHA */}
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

        {/* LEYENDA RÁPIDA */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '4px', border: '2px solid #000' }} /> PENDIENTES
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', border: '2px solid #000' }} /> ENTREGADOS
          </div>
        </div>

        {/* GRILLA CALENDARIO */}
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
            const dataDia = pedidosAgrupados[fechaKey] || { pendientes: [], entregados: [] }
            const tieneAlgo = dataDia.pendientes.length > 0 || dataDia.entregados.length > 0

            return (
              <motion.div 
                key={idx} 
                whileHover={tieneAlgo ? { scale: 0.98, backgroundColor: '#f1f5f9' } : {}}
                onClick={() => tieneAlgo && (setDiaSeleccionado(fechaKey), setVerEntregados(false))}
                style={{ 
                  ...cellStyle, 
                  backgroundColor: dataDia.pendientes.length > 0 ? '#eff6ff' : '#fff',
                  cursor: tieneAlgo ? 'pointer' : 'default'
                }}
              >
                <span style={{ position: 'absolute', top: '8px', left: '10px', fontWeight: '950', fontSize: '16px', color: '#000' }}>{dia}</span>
                
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  {/* PENDIENTES (Estilo Magnético) */}
                  {dataDia.pendientes.length > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{ backgroundColor: '#3b82f6', color: '#fff', borderRadius: '10px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '950', border: '3px solid #000', boxShadow: '2px 2px 0px #000' }}
                    >
                      {dataDia.pendientes.length}
                    </motion.div>
                  )}
                  {/* ENTREGADOS */}
                  {dataDia.entregados.length > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{ backgroundColor: '#e2e8f0', color: '#64748b', borderRadius: '8px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900', border: '2px solid #000' }}
                    >
                      {dataDia.entregados.length}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* MODAL "CARPETA DE PRODUCCIÓN" */}
        <AnimatePresence>
          {diaSeleccionado && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
              <motion.div 
                initial={{ y: 100, opacity: 0, rotate: -2 }} 
                animate={{ y: 0, opacity: 1, rotate: 0 }} 
                exit={{ y: 100, opacity: 0 }}
                style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '32px', border: '5px solid #000', overflow: 'hidden', boxShadow: '15px 15px 0px #3b82f6' }}
              >
                {/* Header Modal Estilo Ficha */}
                <div style={{ backgroundColor: '#000', color: '#fff', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '5px solid #000' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CalendarIcon size={24} color="#fbbf24" />
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '950', textTransform: 'capitalize' }}>
                      {new Date(diaSeleccionado + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDiaSeleccionado(null)} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}><X size={32} /></motion.button>
                </div>

                <div style={{ padding: '25px', maxHeight: '65vh', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* SECCIÓN PENDIENTES */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Scissors size={18} color="#3b82f6" />
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '950', color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase' }}>PENDIENTES DE ENTREGA ({pedidosAgrupados[diaSeleccionado]?.pendientes.length})</p>
                  </div>
                  
                  {pedidosAgrupados[diaSeleccionado]?.pendientes.length === 0 && (
                    <div style={{ padding: '20px', border: '3px dashed #cbd5e1', borderRadius: '20px', textAlign: 'center', color: '#64748b', fontWeight: '800', fontSize: '14px' }}>
                      Todo al día para esta fecha. 🧵
                    </div>
                  )}
                  
                  {pedidosAgrupados[diaSeleccionado]?.pendientes.map((p: any) => (
                    <motion.div 
                      key={p.id} 
                      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      style={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '24px', padding: '20px', boxShadow: '6px 6px 0px #000' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                        <span style={{ fontWeight: '950', fontSize: '18px', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={18} /> {p.clientes.nombre}
                        </span>
                        <span style={{ background: '#fbbf24', border: '2px solid #000', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '950', color: '#000' }}>ID #{p.id}</span>
                      </div>
                      
                      <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '16px', border: '2px solid #000', marginBottom: '15px' }}>
                        {p.detalles_pedido?.map((det: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                            <span style={{ fontWeight: '800', color: '#000' }}>{det.cantidad}x {det.inventario?.nombre}</span>
                            <span style={{ fontWeight: '950', color: '#3b82f6' }}>TALLA {det.talla}</span>
                          </div>
                        ))}
                      </div>

                      <motion.button 
                        whileHover={{ y: -2 }} whileTap={{ y: 1 }}
                        onClick={() => router.push(`/ticket/${p.id}`)} 
                        style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '950', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Printer size={18} /> VER TICKET DE PRODUCCIÓN
                      </motion.button>
                    </motion.div>
                  ))}

                  {/* PESTAÑA ENTREGADOS (COLAPSABLE) */}
                  <div style={{ marginTop: '10px' }}>
                    <motion.button 
                      whileHover={{ backgroundColor: '#e2e8f0' }}
                      onClick={() => setVerEntregados(!verEntregados)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#fff', border: '3px solid #cbd5e1', borderRadius: '20px', color: '#64748b', fontWeight: '950', fontSize: '13px', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} color={pedidosAgrupados[diaSeleccionado]?.entregados.length > 0 ? "#10b981" : "#cbd5e1"} />
                        <span>YA ENTREGADOS ({pedidosAgrupados[diaSeleccionado]?.entregados.length})</span>
                      </div>
                      {verEntregados ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </motion.button>

                    <AnimatePresence>
                      {verEntregados && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                        >
                          {pedidosAgrupados[diaSeleccionado]?.entregados.map((p: any) => (
                            <div key={p.id} style={{ backgroundColor: '#f0fdf4', border: '2px solid #bcf0da', borderRadius: '18px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: '#166534' }}>{p.clientes.nombre}</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>ID #{p.id} • {p.detalles_pedido.length} items</p>
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

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}