'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, PackagePlus, Trash2, ChevronDown, ChevronUp, AlertCircle, Plus, Minus, PackageOpen } from 'lucide-react'

export default function Inventario() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [nombre, setNombre] = useState('')
  const [talla, setTalla] = useState('14')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [loading, setLoading] = useState(false)
  const [abiertos, setAbiertos] = useState<string[]>([])

  const ordenTallas: { [key: string]: number } = {
    "10": 1, "12": 2, "14": 3, "16": 4, 
    "S": 5, "M": 6, "L": 7, "XL": 8, "Estd": 9, "ESPECIAL": 10
  }

  const cargar = useCallback(async () => {
    const { data } = await supabase.from('inventario').select('*').order('nombre')
    if (data) setItems(data)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const productosAgrupados = items.reduce((acc: any, item) => {
    if (!acc[item.nombre]) acc[item.nombre] = []
    acc[item.nombre].push(item)
    return acc
  }, {})

  const toggleGrupo = (nombreProd: string) => {
    setAbiertos(prev => prev.includes(nombreProd) ? prev.filter(n => n !== nombreProd) : [...prev, nombreProd])
  }

  const agregarVariante = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('inventario').upsert({ 
      nombre: nombre.toUpperCase().trim(), talla, precio_base: Number(precio), stock: Number(stock), stock_reservado: 0 
    }, { onConflict: 'nombre,talla' })

    if (error) alert("❌ ERROR: " + error.message)
    else { setNombre(''); setPrecio(''); setStock(''); cargar() }
    setLoading(false)
  }

  // Ajuste rápido de Stock Físico
  const ajustarStock = (id: string, delta: number) => {
    const itemActual = items.find(i => i.id === id);
    if (!itemActual) return;
    const nuevoStock = itemActual.stock + delta;
    if (nuevoStock < 0) return;

    setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, stock: nuevoStock } : item));
    supabase.from('inventario').update({ stock: nuevoStock }).eq('id', id).then(({ error }) => {
      if (error) { console.error(error); cargar(); }
    });
  }

  // NUEVO: Ajuste rápido de Reservas Manuales
  const ajustarReserva = (id: string, delta: number) => {
    const itemActual = items.find(i => i.id === id);
    if (!itemActual) return;
    const nuevaReserva = (itemActual.stock_reservado || 0) + delta;
    if (nuevaReserva < 0) return;

    setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, stock_reservado: nuevaReserva } : item));
    supabase.from('inventario').update({ stock_reservado: nuevaReserva }).eq('id', id).then(({ error }) => {
      if (error) { console.error(error); cargar(); }
    });
  }

  const eliminarVariante = async (id: string) => {
    if (!confirm("⚠️ ¿Borrar variación?")) return
    await supabase.from('inventario').delete().eq('id', id)
    cargar()
  }

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '14px', color: '#0f172a', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase' as const }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Control de Inventario</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Gestión de prendas, tallas y stock</p>
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          
          <motion.div variants={itemVariants} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PackagePlus size={18} color="#3b82f6" /> Registrar Prenda
            </h2>
            <form onSubmit={agregarVariante} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nombre de la prenda</label>
                <input required placeholder="Ej: PANTALÓN IN" style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Talla</label>
                  <select style={inputStyle} value={talla} onChange={e => setTalla(e.target.value)}>
                    {Object.keys(ordenTallas).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Precio Base $</label>
                  <input required type="number" placeholder="Ej: 15000" style={inputStyle} value={precio} onChange={e => setPrecio(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Stock Físico</label>
                  <input required type="number" placeholder="Ej: 10" style={inputStyle} value={stock} onChange={e => setStock(e.target.value)} />
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px', backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? 'Guardando...' : <><Plus size={18} /> Añadir al Inventario</>}
              </motion.button>
            </form>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.keys(productosAgrupados).map(nombreProd => {
              const variantes = productosAgrupados[nombreProd].sort((a: any, b: any) => (ordenTallas[a.talla] || 99) - (ordenTallas[b.talla] || 99))
              const estaAbierto = abiertos.includes(nombreProd)
              const fisicoTotal = variantes.reduce((acc: number, v: any) => acc + v.stock, 0)
              const reservaTotal = variantes.reduce((acc: number, v: any) => acc + (v.stock_reservado || 0), 0)
              const dispTotal = fisicoTotal - reservaTotal
              const tieneAgotados = variantes.some((v: any) => (v.stock - (v.stock_reservado || 0)) <= 0)

              return (
                <motion.div variants={itemVariants} key={nombreProd} style={{ backgroundColor: '#fff', borderRadius: '20px', border: `1px solid ${tieneAgotados ? '#fecaca' : '#e2e8f0'}`, overflow: 'hidden', boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05)' }}>
                  
                  <div onClick={() => toggleGrupo(nombreProd)} style={{ padding: '20px', backgroundColor: tieneAgotados ? '#fef2f2' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ backgroundColor: tieneAgotados ? '#fee2e2' : '#f1f5f9', color: tieneAgotados ? '#ef4444' : '#64748b', padding: '8px', borderRadius: '10px' }}>
                        {tieneAgotados ? <AlertCircle size={20} /> : <PackageOpen size={20} />}
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 2px 0', fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>{nombreProd}</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Disp: {dispTotal} | Rsv: {reservaTotal}</p>
                      </div>
                    </div>
                    {estaAbierto ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                  </div>

                  <AnimatePresence>
                    {estaAbierto && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {variantes.map((i: any) => {
                            const fisico = i.stock;
                            const reservado = i.stock_reservado || 0;
                            const disponible = fisico - reservado;
                            const agotado = disponible <= 0;

                            return (
                              <div key={i.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', border: `1px solid ${agotado ? '#fca5a5' : '#e2e8f0'}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: '800', fontSize: '18px', color: '#0f172a' }}>{i.talla}</span>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>${Number(i.precio_base).toLocaleString()}</span>
                                  </div>
                                  <button onClick={() => eliminarVariante(i.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                                </div>
                                
                                {/* CONTROLES DE STOCK MANUALES */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  
                                  {/* Fila Stock Físico */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '10px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', width: '60px' }}>FÍSICO:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <button onClick={() => ajustarStock(i.id, -1)} style={{ width: '28px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                                      <span style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a', width: '24px', textAlign: 'center' }}>{fisico}</span>
                                      <button onClick={() => ajustarStock(i.id, 1)} style={{ width: '28px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                                    </div>
                                  </div>

                                  {/* Fila Stock Reservado */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fffbeb', padding: '6px 12px', borderRadius: '10px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#b45309', width: '60px' }}>RESERVA:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <button onClick={() => ajustarReserva(i.id, -1)} style={{ width: '28px', height: '28px', border: '1px solid #fde68a', borderRadius: '6px', backgroundColor: '#fff', color: '#d97706', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                                      <span style={{ fontWeight: '800', fontSize: '15px', color: '#b45309', width: '24px', textAlign: 'center' }}>{reservado}</span>
                                      <button onClick={() => ajustarReserva(i.id, 1)} style={{ width: '28px', height: '28px', border: '1px solid #fde68a', borderRadius: '6px', backgroundColor: '#fff', color: '#d97706', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                                    </div>
                                  </div>

                                </div>

                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '4px', textAlign: 'right' }}>
                                  <span style={{ backgroundColor: agotado ? '#fee2e2' : '#dcfce7', color: agotado ? '#991b1b' : '#166534', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>
                                    DISPONIBLE: {disponible}
                                  </span>
                                </div>

                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </main>
  )
}