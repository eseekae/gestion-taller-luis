'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx-js-style'
import { ArrowLeft, PackagePlus, Trash2, ChevronDown, ChevronUp, Plus, Minus, PackageOpen, School, Search, Download, Settings2, X } from 'lucide-react'

export default function Inventario() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [listaColegios, setListaColegios] = useState<any[]>([]) // NUEVA LISTA MAESTRA
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
    "10": 1, "12": 2, "14": 3, "16": 4, 
    "S": 5, "M": 6, "L": 7, "XL": 8, "Estd": 9, "ESPECIAL": 10
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

  // GESTIÓN DE COLEGIOS MAESTROS
  const agregarColegioMaestro = async () => {
    if (!nuevoNombreColegio) return
    const nombreUpper = nuevoNombreColegio.toUpperCase().trim()
    const { error } = await supabase.from('colegios').insert([{ nombre: nombreUpper }])
    if (error) alert("❌ Error: Ya existe o fallo de red")
    else { setNuevoNombreColegio(''); cargar() }
  }

  const borrarColegioMaestro = async (id: number) => {
    if (!confirm("⚠️ ¿Borrar de la lista maestra? No borrará ítems del inventario, pero ya no aparecerá en el menú.")) return
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
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({ c: C, r: R })
        if (!ws[cell]) continue
        ws[cell].s = { border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } } } }
      }
    }
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

  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '3px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '25px' }
  const inputStyle = { width: '100%', padding: '12px 16px', border: '3px solid #000', borderRadius: '12px', fontSize: '14px', color: '#000', outline: 'none', backgroundColor: '#fff' }
  const labelStyle = { fontSize: '12px', fontWeight: '900', color: '#000', marginBottom: '6px', display: 'block', textTransform: 'uppercase' as const }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', color: '#000', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#000', letterSpacing: '-1px' }}>Inventario</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setMostrarGestionColegios(true)} style={{ backgroundColor: '#fff', color: '#000', padding: '10px', borderRadius: '12px', border: '3px solid #000', boxShadow: '4px 4px 0px #000' }}>
              <Settings2 size={20} />
            </button>
            <button onClick={exportarExcel} style={{ backgroundColor: '#166534', color: '#fff', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', border: '3px solid #000', boxShadow: '4px 4px 0px #000', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} /> Excel
            </button>
          </div>
        </div>

        {/* MODAL GESTIÓN COLEGIOS */}
        <AnimatePresence>
          {mostrarGestionColegios && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ ...cardStyle, width: '100%', maxWidth: '400px', margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#000' }}>Lista de Colegios</h2>
                  <button onClick={() => setMostrarGestionColegios(false)}><X /></button>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input placeholder="Nombre Colegio..." style={inputStyle} value={nuevoNombreColegio} onChange={e => setNuevoNombreColegio(e.target.value)} />
                  <button onClick={agregarColegioMaestro} style={{ background: '#000', color: '#fff', padding: '10px', borderRadius: '12px' }}><Plus /></button>
                </div>
                <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {listaColegios.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '2px solid #000', borderRadius: '10px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px' }}>{c.nombre}</span>
                      <button onClick={() => borrarColegioMaestro(c.id)} style={{ color: 'red' }}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div style={{ position: 'relative', marginBottom: '25px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '14px' }} size={20} color="#000" />
          <input placeholder="Buscar por Prenda o Colegio..." style={{ ...inputStyle, paddingLeft: '45px', boxShadow: '4px 4px 0px #000' }} value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        {/* FORMULARIO MEJORADO CON SELECT */}
        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PackagePlus size={20} /> Nueva Variedad
          </h2>
          <form onSubmit={agregarVariante} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Prenda</label>
                <input required placeholder="Ej: POLERA" style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Elegir Colegio</label>
                <select style={inputStyle} value={colegioSeleccionado} onChange={e => setColegioSeleccionado(e.target.value)}>
                  {listaColegios.length === 0 ? <option>Primero añade colegios...</option> : 
                    listaColegios.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div><label style={labelStyle}>Talla</label><select style={inputStyle} value={talla} onChange={e => setTalla(e.target.value)}>{Object.keys(ordenTallas).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label style={labelStyle}>Precio $</label><input required type="number" style={inputStyle} value={precio} onChange={e => setPrecio(e.target.value)} /></div>
              <div><label style={labelStyle}>Stock</label><input required type="number" style={inputStyle} value={stock} onChange={e => setStock(e.target.value)} /></div>
            </div>
            <button disabled={loading} type="submit" style={{ width: '100%', backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '14px', borderRadius: '12px', fontWeight: '900', boxShadow: '4px 4px 0px #000' }}>
              {loading ? 'GUARDANDO...' : 'AÑADIR AL INVENTARIO'}
            </button>
          </form>
        </div>

        {/* LISTADO JERÁRQUICO (Se mantiene igual) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.keys(productosAgrupados).map(nombrePrenda => {
            const estaAbierto = abiertos.includes(nombrePrenda)
            return (
              <div key={nombrePrenda} style={{ backgroundColor: '#fff', borderRadius: '24px', border: '3px solid #000', overflow: 'hidden', boxShadow: '6px 6px 0px #000' }}>
                <div onClick={() => toggleGrupo(nombrePrenda)} style={{ padding: '20px', backgroundColor: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><PackageOpen size={24} /><h3 style={{ margin: 0, fontWeight: '900', fontSize: '18px', textTransform: 'uppercase' }}>{nombrePrenda}</h3></div>
                  {estaAbierto ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                <AnimatePresence>
                  {estaAbierto && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ backgroundColor: '#f1f5f9' }}>
                      {Object.keys(productosAgrupados[nombrePrenda]).map(nombreCol => {
                        const variantes = productosAgrupados[nombrePrenda][nombreCol].sort((a: any, b: any) => (ordenTallas[a.talla] || 99) - (ordenTallas[b.talla] || 99))
                        const idUnicoColegio = `${nombrePrenda}-${nombreCol}`
                        const colAbierto = colegiosAbiertos.includes(idUnicoColegio)
                        return (
                          <div key={nombreCol} style={{ borderBottom: '2px solid #000' }}>
                            <div onClick={() => toggleColegio(idUnicoColegio)} style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                              <span style={{ fontWeight: '900', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#000' }}><School size={16} /> {nombreCol}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '11px', fontWeight: '800', background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>{variantes.length} TALLAS</span>{colAbierto ? <Minus size={16} color="#000" /> : <Plus size={16} color="#000" />}</div>
                            </div>
                            {colAbierto && (
                              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#fff' }}>
                                {variantes.map((i: any) => {
                                  const disponible = i.stock - (i.stock_reservado || 0)
                                  return (
                                    <div key={i.id} style={{ border: '2px solid #000', padding: '15px', borderRadius: '15px', backgroundColor: disponible <= 0 ? '#ff0101' : '#fff', boxShadow: '4px 4px 0px #000' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontWeight: '900', fontSize: '18px', color: '#000' }}>Talla {i.talla}</span><span style={{ fontWeight: '800', color: '#166534' }}>${Number(i.precio_base).toLocaleString()}</span></div>
                                        <button onClick={() => eliminarVariante(i.id)} style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                                      </div>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '10px', border: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '10px', fontWeight: '900', color: '#000' }}>FÍSICO:</span><div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><button onClick={() => ajustarStock(i.id, -1)} style={{ background: '#ef4444', color: '#fff', width: '24px' }}>-</button><span style={{ fontWeight: '900' }}>{i.stock}</span><button onClick={() => ajustarStock(i.id, 1)} style={{ background: '#4ade80', width: '24px' }}>+</button></div></div>
                                        <div style={{ background: '#fffbeb', padding: '8px', borderRadius: '10px', border: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '10px', fontWeight: '900', color: '#000' }}>RSV:</span><div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><button onClick={() => ajustarReserva(i.id, -1)} style={{ background: '#f59e0b', color: '#fff', width: '24px' }}>-</button><span style={{ fontWeight: '900' }}>{i.stock_reservado || 0}</span><button onClick={() => ajustarReserva(i.id, 1)} style={{ background: '#f59e0b', color: '#fff', width: '24px' }}>+</button></div></div>
                                      </div>
                                      <div style={{ textAlign: 'right', marginTop: '10px' }}><span style={{ backgroundColor: disponible <= 0 ? '#000' : '#4ade80', color: disponible <= 0 ? '#fff' : '#000', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '900', border: '2px solid #000' }}>DISPONIBLE: {disponible}</span></div>
                                    </div>
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