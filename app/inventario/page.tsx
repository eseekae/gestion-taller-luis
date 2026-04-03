'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx-js-style'
import { 
  ArrowLeft, PackagePlus, Trash2, ChevronDown, ChevronUp, Plus, 
  Minus, PackageOpen, School, Search, Download, Settings2, X, Boxes, Tag, AlertCircle 
} from 'lucide-react'

export default function Inventario() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [listaColegios, setListaColegios] = useState<any[]>([])
  const [mostrarGestionColegios, setMostrarGestionColegios] = useState(false)
  const [nuevoNombreColegio, setNuevoNombreColegio] = useState('')

  const [nombre, setNombre] = useState('')
  const [colegioSeleccionado, setColegioSeleccionado] = useState('')
  const [talla, setTalla] = useState('14')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(false)
  const [abiertos, setAbiertos] = useState<string[]>([])
  const [colegiosAbiertos, setColegiosAbiertos] = useState<string[]>([])

  const ordenTallas: { [key: string]: number } = {
    "4": 1, "6": 2, "8": 3, "10": 4, 
    "12": 5, "14": 6, "16": 7, "S": 8, "M": 9, "L": 10, "XL": 11, "Estd": 12, "ESPECIAL": 13
  }

  const cargar = useCallback(async () => {
    const { data: inv } = await supabase.from('inventario').select('*').order('nombre')
    if (inv) setItems(inv)

    const { data: col } = await supabase.from('colegios').select('*').order('nombre')
    if (col) {
      setListaColegios(col)
      if (col.length > 0 && !colegioSeleccionado) setColegioSeleccionado(col[0].nombre)
    }
  }, [colegioSeleccionado])

  useEffect(() => { cargar() }, [cargar])

  // GESTIÓN DE COLEGIOS
  const agregarColegioMaestro = async () => {
    if (!nuevoNombreColegio) return
    const nombreUpper = nuevoNombreColegio.toUpperCase().trim()
    const { error } = await supabase.from('colegios').insert([{ nombre: nombreUpper }])
    if (error) alert("❌ Error al añadir colegio")
    else { setNuevoNombreColegio(''); cargar() }
  }

  const borrarColegioMaestro = async (id: number) => {
    if (!confirm("⚠️ ¿Borrar de la lista maestra?")) return
    await supabase.from('colegios').delete().eq('id', id)
    cargar()
  }

  const itemsFiltrados = useMemo(() => {
    return items.filter(i => 
      i.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      (i.colegio && i.colegio.toLowerCase().includes(busqueda.toLowerCase()))
    )
  }, [items, busqueda])

  const productosAgrupados = useMemo(() => {
    return itemsFiltrados.reduce((acc: any, item) => {
      const prenda = item.nombre
      const col = item.colegio || 'PARTICULAR'
      if (!acc[prenda]) acc[prenda] = {}
      if (!acc[prenda][col]) acc[prenda][col] = []
      acc[prenda][col].push(item)
      return acc
    }, {})
  }, [itemsFiltrados])

  // EXPORTACIÓN EXCEL
  const exportarExcel = () => {
    const reporte = itemsFiltrados.map(i => ({
      'Prenda': i.nombre,
      'Colegio': i.colegio || 'PARTICULAR',
      'Talla': i.talla,
      'Precio': `$${Number(i.precio_base).toLocaleString('es-CL')}`,
      'Stock Físico': i.stock,
      'Reservado': i.stock_reservado || 0,
      'Disponible': i.stock - (i.stock_reservado || 0)
    }))
    const ws = XLSX.utils.json_to_sheet(reporte)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Inventario")
    XLSX.writeFile(wb, `Inventario_Luis_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const toggleGrupo = (nombreProd: string) => {
    setAbiertos(prev => prev.includes(nombreProd) ? prev.filter(n => n !== nombreProd) : [...prev, nombreProd])
  }

  const toggleColegio = (idUnico: string) => {
    setColegiosAbiertos(prev => prev.includes(idUnico) ? prev.filter(n => n !== idUnico) : [...prev, idUnico])
  }

  // AGREGAR VARIANTE
  const agregarVariante = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('inventario').upsert({ 
      nombre: nombre.toUpperCase().trim(), 
      colegio: colegioSeleccionado || 'PARTICULAR',
      talla, 
      precio_base: Number(precio), 
      stock: Number(stock), 
      stock_reservado: 0 
    }, { onConflict: 'nombre,colegio,talla' })

    if (error) alert("❌ ERROR: " + error.message)
    else { setNombre(''); setPrecio(''); setStock(''); cargar() }
    setLoading(false)
  }

  // AJUSTES RÁPIDOS
  const ajustarStock = (id: string, delta: number) => {
    const itemActual = items.find(i => i.id === id);
    if (!itemActual) return;
    const nuevoStock = itemActual.stock + delta;
    if (nuevoStock < 0) return;
    setItems(prev => prev.map(item => item.id === id ? { ...item, stock: nuevoStock } : item));
    supabase.from('inventario').update({ stock: nuevoStock }).eq('id', id).then(({ error }) => { if (error) cargar(); });
  }

  const ajustarReserva = (id: string, delta: number) => {
    const itemActual = items.find(i => i.id === id);
    if (!itemActual) return;
    const nuevaReserva = (itemActual.stock_reservado || 0) + delta;
    if (nuevaReserva < 0) return;
    setItems(prev => prev.map(item => item.id === id ? { ...item, stock_reservado: nuevaReserva } : item));
    supabase.from('inventario').update({ stock_reservado: nuevaReserva }).eq('id', id).then(({ error }) => { if (error) cargar(); });
  }

  const eliminarVariante = async (id: string) => {
    if (!confirm("⚠️ ¿Borrar variación?")) return
    await supabase.from('inventario').delete().eq('id', id)
    cargar()
  }

  // ESTILOS
  const containerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }
  const cardStyle = { backgroundColor: '#fff', padding: '28px', borderRadius: '32px', border: '4px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '32px' }
  const inputStyle = { width: '100%', padding: '14px 16px', border: '3px solid #000', borderRadius: '16px', fontSize: '15px', fontWeight: '800', color: '#000', outline: 'none', backgroundColor: '#fff' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#000', marginBottom: '8px', display: 'block', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }

  return (
    <main style={containerStyle}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        {/* CABECERA PRO */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '16px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
              <ArrowLeft size={24} color="#000" />
            </motion.button>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '950', color: '#000', letterSpacing: '-1.5px' }}>INVENTARIO</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button whileHover={{ y: -2 }} onClick={() => setMostrarGestionColegios(true)} style={{ backgroundColor: '#fff', color: '#000', padding: '12px', borderRadius: '16px', border: '3px solid #000', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
              <Settings2 size={22} />
            </motion.button>
            <motion.button whileHover={{ y: -2 }} onClick={exportarExcel} style={{ backgroundColor: '#166534', color: '#fff', padding: '12px 20px', borderRadius: '16px', fontWeight: '900', border: '3px solid #000', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <Download size={20} /> EXCEL
            </motion.button>
          </div>
        </div>

        {/* MODAL GESTIÓN COLEGIOS */}
        <AnimatePresence>
          {mostrarGestionColegios && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ ...cardStyle, width: '100%', maxWidth: '420px', margin: 0, boxShadow: '12px 12px 0px #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '950', margin: 0, color: '#000', letterSpacing: '-1px' }}>LISTA COLEGIOS</h2>
                  <button onClick={() => setMostrarGestionColegios(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={28}/></button>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                  <input placeholder="Nombre..." style={inputStyle} value={nuevoNombreColegio} onChange={e => setNuevoNombreColegio(e.target.value)} />
                  <motion.button whileTap={{ scale: 0.9 }} onClick={agregarColegioMaestro} style={{ background: '#000', color: '#fff', padding: '12px', borderRadius: '16px', border: 'none', cursor: 'pointer' }}><Plus /></motion.button>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '5px' }}>
                  {listaColegios.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '3px solid #000', borderRadius: '16px', backgroundColor: '#f1f5f9' }}>
                      <span style={{ fontWeight: '900', fontSize: '15px', color: '#000' }}>{c.nombre}</span>
                      <button onClick={() => borrarColegioMaestro(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* BUSCADOR PRO */}
        <div style={{ position: 'relative', marginBottom: '35px' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '16px' }} size={22} color="#000" />
          <input placeholder="Buscar prenda o institución..." style={{ ...inputStyle, paddingLeft: '50px', boxShadow: '6px 6px 0px #000', fontSize: '16px' }} value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        {/* FORMULARIO NUEVA VARIEDAD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
          <h2 style={{ margin: '0 0 25px 0', fontSize: '20px', fontWeight: '950', color: '#000', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PackagePlus size={24} color="#3b82f6" /> NUEVA VARIEDAD
          </h2>
          <form onSubmit={agregarVariante} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Prenda / Artículo</label>
                <input required placeholder="Ej: POLERA" style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Asignar a Colegio</label>
                <select style={inputStyle} value={colegioSeleccionado} onChange={e => setColegioSeleccionado(e.target.value)}>
                  {listaColegios.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div><label style={labelStyle}>Talla</label><select style={inputStyle} value={talla} onChange={e => setTalla(e.target.value)}>{Object.keys(ordenTallas).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label style={labelStyle}>Precio $</label><input required type="number" style={inputStyle} value={precio} onChange={e => setPrecio(e.target.value)} /></div>
              <div><label style={labelStyle}>Stock Inicial</label><input required type="number" style={inputStyle} value={stock} onChange={e => setStock(e.target.value)} /></div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={loading} type="submit" 
              style={{ width: '100%', backgroundColor: '#4ade80', color: '#000', border: '4px solid #000', padding: '18px', borderRadius: '20px', fontWeight: '950', fontSize: '16px', boxShadow: '6px 6px 0px #000', cursor: 'pointer', marginTop: '10px' }}
            >
              {loading ? 'PROCESANDO...' : 'REGISTRAR EN INVENTARIO'}
            </motion.button>
          </form>
        </motion.div>

        {/* LISTADO JERÁRQUICO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {Object.keys(productosAgrupados).map(nombrePrenda => {
            const estaAbierto = abiertos.includes(nombrePrenda)
            return (
              <div key={nombrePrenda} style={{ backgroundColor: '#fff', borderRadius: '32px', border: '4px solid #000', overflow: 'hidden', boxShadow: '8px 8px 0px #000' }}>
                <div onClick={() => toggleGrupo(nombrePrenda)} style={{ padding: '24px', backgroundColor: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><PackageOpen size={28} color="#fbbf24" /><h3 style={{ margin: 0, fontWeight: '950', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>{nombrePrenda}</h3></div>
                  {estaAbierto ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
                </div>
                
                <AnimatePresence>
                  {estaAbierto && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ backgroundColor: '#f1f5f9' }}>
                      {Object.keys(productosAgrupados[nombrePrenda]).map(nombreCol => {
                        const variantes = productosAgrupados[nombrePrenda][nombreCol].sort((a: any, b: any) => (ordenTallas[a.talla] || 99) - (ordenTallas[b.talla] || 99))
                        const idUnicoColegio = `${nombrePrenda}-${nombreCol}`
                        const colAbierto = colegiosAbiertos.includes(idUnicoColegio)
                        return (
                          <div key={nombreCol} style={{ borderBottom: '3px solid #000' }}>
                            <div onClick={() => toggleColegio(idUnicoColegio)} style={{ padding: '18px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: colAbierto ? '#e2e8f0' : 'transparent' }}>
                              <span style={{ fontWeight: '950', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#000' }}><School size={18} /> {nombreCol}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '950', background: '#000', color: '#fff', padding: '4px 10px', borderRadius: '10px' }}>{variantes.length} TALLAS</span>
                                {colAbierto ? <Minus size={20} color="#000" /> : <Plus size={20} color="#000" />}
                              </div>
                            </div>
                            
                            {colAbierto && (
                              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fff' }}>
                                {variantes.map((i: any) => {
                                  const disponible = i.stock - (i.stock_reservado || 0)
                                  return (
                                    <motion.div key={i.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ border: '3px solid #000', padding: '20px', borderRadius: '24px', backgroundColor: disponible <= 0 ? '#fff1f2' : '#fff', boxShadow: '4px 4px 0px #000' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                          <span style={{ fontWeight: '950', fontSize: '20px', color: '#000' }}>Talla {i.talla}</span>
                                          <span style={{ fontWeight: '950', color: '#166534', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '10px', border: '2px solid #166534', fontSize: '14px' }}>${Number(i.precio_base).toLocaleString()}</span>
                                        </div>
                                        <button onClick={() => eliminarVariante(i.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} /></button>
                                      </div>
                                      
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', border: '3px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <span style={{ fontSize: '10px', fontWeight: '950', color: '#000' }}>STOCK FÍSICO</span>
                                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button onClick={() => ajustarStock(i.id, -1)} style={{ background: '#ef4444', color: '#fff', width: '28px', height: '28px', borderRadius: '8px', border: '2px solid #000', fontWeight: '950', cursor: 'pointer' }}>-</button>
                                            <span style={{ fontWeight: '950', width: '20px', textAlign: 'center' }}>{i.stock}</span>
                                            <button onClick={() => ajustarStock(i.id, 1)} style={{ background: '#4ade80', color: '#000', width: '28px', height: '28px', borderRadius: '8px', border: '2px solid #000', fontWeight: '950', cursor: 'pointer' }}>+</button>
                                          </div>
                                        </div>
                                        <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '16px', border: '3px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <span style={{ fontSize: '10px', fontWeight: '950', color: '#000' }}>RESERVADO</span>
                                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button onClick={() => ajustarReserva(i.id, -1)} style={{ background: '#fbbf24', color: '#000', width: '28px', height: '28px', borderRadius: '8px', border: '2px solid #000', fontWeight: '950', cursor: 'pointer' }}>-</button>
                                            <span style={{ fontWeight: '950', width: '20px', textAlign: 'center' }}>{i.stock_reservado || 0}</span>
                                            <button onClick={() => ajustarReserva(i.id, 1)} style={{ background: '#fbbf24', color: '#000', width: '28px', height: '28px', borderRadius: '8px', border: '2px solid #000', fontWeight: '950', cursor: 'pointer' }}>+</button>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div style={{ textAlign: 'right', marginTop: '15px' }}>
                                        <span style={{ 
                                          backgroundColor: disponible <= 0 ? '#000' : '#4ade80', 
                                          color: disponible <= 0 ? '#fff' : '#000', 
                                          padding: '6px 14px', 
                                          borderRadius: '12px', 
                                          fontSize: '12px', 
                                          fontWeight: '950', 
                                          border: '3px solid #000',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px'
                                        }}>
                                          {disponible <= 0 && <AlertCircle size={14} />}
                                          DISPONIBLE: {disponible}
                                        </span>
                                      </div>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}