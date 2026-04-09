'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, School, CheckCircle, User, Loader2, 
  PackageCheck, Scissors, ChevronDown, ChevronUp, Boxes, 
  AlertTriangle, RefreshCw, Calendar, Hash, ListOrdered
} from 'lucide-react'

export default function PaginaProduccion() {
  const router = useRouter()
  // MODIFICACIÓN: Separamos los datos en dos vistas distintas
  const [pendientesColegio, setPendientesColegio] = useState<any[]>([])
  const [pendientesFecha, setPendientesFecha] = useState<any[]>([])
  const [vista, setVista] = useState<'colegio' | 'fecha'>('colegio')
  
  const [loading, setLoading] = useState(true)
  const [filtroActivo, setFiltroActivo] = useState('Todos')
  const [expandirGrupo, setExpandirGrupo] = useState<string | null>(null)

  const cargarPendientes = async () => {
    setLoading(true)
    const { data: detalles } = await supabase
      .from('detalles_pedido')
      .select(`
        *,
        pedidos (id, colegio, fecha_entrega, clientes (nombre)),
        inventario (nombre)
      `)
      .neq('estado', 'Entregado')
      .neq('estado', 'Listo para retiro')

    if (detalles) {
      // --- 1. AGRUPACIÓN ORIGINAL: POR COLEGIO ---
      const agrupadoCol = detalles.reduce((acc: any, item: any) => {
        const col = item.pedidos?.colegio || 'Particular'
        const prodNombre = item.inventario?.nombre || 'Producto'
        const talla = item.talla
        const claveProd = `${prodNombre}-${talla}`

        if (!acc[col]) acc[col] = {}
        if (!acc[col][claveProd]) {
          acc[col][claveProd] = { nombre: prodNombre, talla: talla, total: 0, clientes: [] }
        }

        const faltan = item.cantidad - (item.cantidad_entregada || 0)
        if (faltan > 0) {
          acc[col][claveProd].total += faltan
          acc[col][claveProd].clientes.push({
            id: item.id, nombre: item.pedidos?.clientes?.nombre,
            cantidad: faltan, pedido_id: item.pedidos?.id,
            fecha: item.pedidos?.fecha_entrega 
          })
        }
        return acc
      }, {})

      const listaCol = Object.keys(agrupadoCol).map(col => {
        const productos = Object.values(agrupadoCol[col]) as any[]
        // Ordenamos los clientes por urgencia de fecha dentro del colegio
        productos.forEach(p => p.clientes.sort((a: any, b: any) => new Date(a.fecha || '2999-01-01').getTime() - new Date(b.fecha || '2999-01-01').getTime()))
        return { nombre: col, productos, esFecha: false }
      })
      setPendientesColegio(listaCol)

      // --- 2. NUEVA AGRUPACIÓN: POR FECHA ---
      const agrupadoFecha = detalles.reduce((acc: any, item: any) => {
        const rawDate = item.pedidos?.fecha_entrega
        const fechaKey = rawDate ? rawDate : 'S/F'
        const col = item.pedidos?.colegio || 'Particular'
        const prodNombre = item.inventario?.nombre || 'Producto'
        const talla = item.talla
        const claveProd = `${col}-${prodNombre}-${talla}`

        if (!acc[fechaKey]) acc[fechaKey] = {}
        if (!acc[fechaKey][claveProd]) {
          acc[fechaKey][claveProd] = { 
            nombre: prodNombre, talla: talla, colegioInfo: col, total: 0, clientes: [] 
          }
        }

        const faltan = item.cantidad - (item.cantidad_entregada || 0)
        if (faltan > 0) {
          acc[fechaKey][claveProd].total += faltan
          acc[fechaKey][claveProd].clientes.push({
            id: item.id, nombre: item.pedidos?.clientes?.nombre,
            cantidad: faltan, pedido_id: item.pedidos?.id,
            fecha: item.pedidos?.fecha_entrega 
          })
        }
        return acc
      }, {})

      const listaFecha = Object.keys(agrupadoFecha).sort((a,b) => {
        if (a === 'S/F') return 1; if (b === 'S/F') return -1;
        return new Date(a).getTime() - new Date(b).getTime()
      }).map(f => {
        const fechaText = f === 'S/F' ? 'SIN FECHA ASIGNADA' : new Date(f + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();
        return { nombre: fechaText, productos: Object.values(agrupadoFecha[f]), esFecha: true }
      })
      setPendientesFecha(listaFecha)
    }
    setLoading(false)
  }

  const enviarAStockCliente = async (detalleId: number, clienteNombre: string, producto: string) => {
    if (!confirm(`¿Confirmar que la prenda de ${clienteNombre} está terminada y lista para retiro?`)) return
    try {
      const { error } = await supabase.from('detalles_pedido').update({ estado: 'Listo para retiro' }).eq('id', detalleId)
      if (error) throw error
      await registrarLog(`${localStorage.getItem('user_name') || 'Don Luis'} pasó a LISTO PARA RETIRO: ${producto}`, `Pedido #${detalleId} - Cliente: ${clienteNombre}`)
      cargarPendientes() 
    } catch (err) { alert("❌ Error al actualizar el estado de producción.") }
  }

  useEffect(() => { 
    if (!localStorage.getItem('user_role')) { router.push('/login'); return; }
    cargarPendientes() 
  }, [router])

  const dataActiva = vista === 'colegio' ? pendientesColegio : pendientesFecha;
  const filtrosDisponibles = ['Todos', ...Array.from(new Set(dataActiva.map(p => p.nombre)))]

  const containerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }
  const cardStyle = { border: '4px solid #000', borderRadius: '28px', overflow: 'hidden', boxShadow: '8px 8px 0px #000', backgroundColor: '#fff', marginBottom: '25px' }

  return (
    <main style={containerStyle}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '16px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
              <ArrowLeft size={24} color="#000" />
            </motion.button>
            <h1 style={{ fontSize: '32px', fontWeight: '950', color: '#000', margin: 0, letterSpacing: '-1.5px' }}>PRODUCCIÓN</h1>
          </div>
          <motion.button 
            whileTap={{ rotate: 180 }} onClick={cargarPendientes} 
            style={{ backgroundColor: '#000', color: '#fff', padding: '12px', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: '4px 4px 0px #4ade80' }}
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </motion.button>
        </div>

        {/* MODIFICACIÓN: Switcher de Vistas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <button 
            onClick={() => { setVista('colegio'); setFiltroActivo('Todos'); setExpandirGrupo(null); }} 
            style={{ backgroundColor: vista === 'colegio' ? '#fbbf24' : '#fff', color: '#000', border: '3px solid #000', borderRadius: '16px', padding: '14px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: vista === 'colegio' ? 'inset 3px 3px 0px rgba(0,0,0,0.1)' : '4px 4px 0px #000', fontSize: '13px' }}
          >
            <School size={18} /> POR COLEGIO
          </button>
          <button 
            onClick={() => { setVista('fecha'); setFiltroActivo('Todos'); setExpandirGrupo(null); }} 
            style={{ backgroundColor: vista === 'fecha' ? '#4ade80' : '#fff', color: '#000', border: '3px solid #000', borderRadius: '16px', padding: '14px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: vista === 'fecha' ? 'inset 3px 3px 0px rgba(0,0,0,0.1)' : '4px 4px 0px #000', fontSize: '13px' }}
          >
            <ListOrdered size={18} /> POR FECHA
          </button>
        </div>

        <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px' }}>
          {filtrosDisponibles.map(c => (
            <motion.button 
              key={c} whileTap={{ y: 2 }} onClick={() => setFiltroActivo(c)} 
              style={{ backgroundColor: filtroActivo === c ? '#000' : '#fff', color: filtroActivo === c ? '#fff' : '#000', border: '3px solid #000', borderRadius: '14px', padding: '12px 20px', fontWeight: '900', whiteSpace: 'nowrap', boxShadow: filtroActivo === c ? 'none' : '4px 4px 0px #000', cursor: 'pointer', fontSize: '13px' }}
            >
              {c.toUpperCase()}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Scissors size={60} color="#000" />
            </motion.div>
            <p style={{ fontWeight: '950', fontSize: '18px', color: '#000', marginTop: '20px', letterSpacing: '1px' }}>BUSCANDO TELAS...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {dataActiva
              .filter(grupo => filtroActivo === 'Todos' || grupo.nombre === filtroActivo)
              .map((grupo, idx) => (
              <motion.div key={grupo.nombre} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} style={cardStyle}>
                <div 
                  onClick={() => setExpandirGrupo(expandirGrupo === grupo.nombre ? null : grupo.nombre)}
                  style={{ backgroundColor: '#000', color: '#fff', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <span style={{ fontWeight: '950', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
                    {grupo.esFecha ? <Calendar size={22} color="#4ade80" /> : <School size={22} color="#fbbf24" />}
                    {grupo.nombre}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: '#fff', color: '#000', padding: '6px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '950', border: '2px solid #fff' }}>
                      {grupo.productos.length} ITEMS
                    </span>
                    {expandirGrupo === grupo.nombre ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandirGrupo === grupo.nombre && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {grupo.productos.map((prod: any, pIdx: number) => (
                          <div key={pIdx} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '20px', borderRadius: '24px', boxShadow: '5px 5px 0px #000' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '3px solid #f1f5f9', paddingBottom: '15px' }}>
                              <div>
                                <p style={{ fontWeight: '950', fontSize: '22px', color: '#000', margin: 0, letterSpacing: '-0.5px' }}>{prod.nombre}</p>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                                  <p style={{ fontSize: '14px', fontWeight: '900', color: '#3b82f6', margin: 0 }}>TALLA: {prod.talla}</p>
                                  {grupo.esFecha && <p style={{ fontSize: '11px', fontWeight: '900', color: '#64748b', margin: 0, border: '2px solid #cbd5e1', padding: '2px 8px', borderRadius: '8px' }}>{prod.colegioInfo}</p>}
                                </div>
                              </div>
                              <div style={{ textAlign: 'right', backgroundColor: '#fff1f2', padding: '8px 15px', borderRadius: '16px', border: '2px solid #e11d48' }}>
                                <p style={{ fontSize: '10px', fontWeight: '950', color: '#e11d48', margin: 0 }}>TOTAL</p>
                                <p style={{ fontSize: '28px', fontWeight: '950', color: '#e11d48', lineHeight: 1, margin: 0 }}>{prod.total}</p>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {prod.clientes.map((cli: any, cIdx: number) => (
                                <div key={cIdx} style={{ backgroundColor: '#f8fafc', border: '2.5px solid #000', padding: '16px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                      <span style={{ backgroundColor: '#000', color: '#fff', padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '950' }}>
                                        #{cli.pedido_id.toString().padStart(4, '0')}
                                      </span>
                                      <p style={{ fontSize: '15px', fontWeight: '900', color: '#000', margin: 0 }}>{cli.nombre}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Boxes size={14} color="#64748b" />
                                        <p style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', margin: 0 }}>{cli.cantidad} UNID.</p>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} color="#ef4444" />
                                        <p style={{ fontSize: '12px', fontWeight: '950', color: '#ef4444', margin: 0 }}>
                                          PARA: {cli.fecha ? new Date(cli.fecha).toLocaleDateString('es-CL') : 'S/F'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <motion.button 
                                    whileHover={{ y: -3, boxShadow: '5px 5px 0px #000' }} whileTap={{ y: 1, boxShadow: 'none' }}
                                    onClick={() => enviarAStockCliente(cli.id, cli.nombre, prod.nombre)}
                                    style={{ backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '12px 18px', borderRadius: '14px', fontWeight: '950', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '3px 3px 0px #000' }}
                                  >
                                    <PackageCheck size={18} /> LISTO
                                  </motion.button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '50px', textAlign: 'center', opacity: 0.5 }}>
          <p style={{ fontSize: '11px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Creaciones Yovi • Gestión de Taller v2.0
          </p>
        </div>

      </div>
    </main>
  )
}