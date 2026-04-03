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
    "4": 1, "5":2, "6": 3, "8": 4, "10": 5, 
    "12": 6, "14": 7, "16": 8, "S": 9, "M": 10, "L": 11, "XL": 12, "Estd": 13, "ESPECIAL": 14
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

  const agregarColegioMaestro = async () => {
    if (!nuevoNombreColegio) return
    const nombreUpper = nuevoNombreColegio.toUpperCase().trim()
    const { error } = await supabase.from('colegios').insert([{ nombre: nombreUpper }])
    if (error) alert("❌ Error")
    else { setNuevoNombreColegio(''); cargar() }
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

  const toggleGrupo = (nombreProd: string) => {
    setAbiertos(prev => prev.includes(nombreProd) ? prev.filter(n => n !== nombreProd) : [...prev, nombreProd])
  }

  const toggleColegio = (idUnico: string) => {
    setColegiosAbiertos(prev => prev.includes(idUnico) ? prev.filter(n => n !== idUnico) : [...prev, idUnico])
  }

  const ajustarStock = (id: string, delta: number) => {
    const itemActual = items.find(i => i.id === id);
    if (!itemActual) return;
    const nuevoStock = itemActual.stock + delta;
    if (nuevoStock < 0) return;
    setItems(prev => prev.map(item => item.id === id ? { ...item, stock: nuevoStock } : item));
    supabase.from('inventario').update({ stock: nuevoStock }).eq('id', id);
  }

  const ajustarReserva = (id: string, delta: number) => {
    const itemActual = items.find(i => i.id === id);
    if (!itemActual) return;
    const nuevaReserva = (itemActual.stock_reservado || 0) + delta;
    if (nuevaReserva < 0) return;
    setItems(prev => prev.map(item => item.id === id ? { ...item, stock_reservado: nuevaReserva } : item));
    supabase.from('inventario').update({ stock_reservado: nuevaReserva }).eq('id', id);
  }

  // ESTILOS
  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '32px', border: '4px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '25px' }
  const inputStyle = { width: '100%', padding: '14px', border: '3px solid #000', borderRadius: '16px', fontSize: '15px', fontWeight: '900', color: '#000', backgroundColor: '#fff' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#000', marginBottom: '8px', display: 'block', textTransform: 'uppercase' as const }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '30px 15px' }}>
      
      {/* 💣 CSS DE ALTO CONTRASTE CORREGIDO */}
      <style jsx global>{`
        :root { color-scheme: light !important; }
        /* Forzamos negro en casi todo, MENOS donde el fondo sea negro */
        span, p, h1, h2, input, select, option {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
        }
        /* Excepciones para texto blanco en fondos negros */
        .texto-blanco-fuerza, .texto-blanco-fuerza * {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }
      `}</style>

      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '14px', boxShadow: '4px 4px 0px #000' }}>
              <ArrowLeft size={24} color="#000" />
            </button>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '950', color: '#000' }}>INVENTARIO</h1>
          </div>
          <button onClick={() => setMostrarGestionColegios(true)} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}>
            <Settings2 size={20} />
          </button>
        </div>

        {/* BUSCADOR */}
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '16px' }} size={20} color="#000" />
          <input placeholder="Buscar prenda o colegio..." style={{ ...inputStyle, paddingLeft: '45px', boxShadow: '4px 4px 0px #000' }} value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        {/* LISTADO DINÁMICO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.keys(productosAgrupados).map(nombrePrenda => {
            const estaAbierto = abiertos.includes(nombrePrenda)
            return (
              <div key={nombrePrenda} style={{ backgroundColor: '#fff', borderRadius: '28px', border: '4px solid #000', overflow: 'hidden', boxShadow: '6px 6px 0px #000' }}>
                
                {/* BARRA NEGRA: TEXTO BLANCO */}
                <div 
                  onClick={() => toggleGrupo(nombrePrenda)} 
                  className="texto-blanco-fuerza"
                  style={{ padding: '20px', backgroundColor: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <PackageOpen size={24} color="#fbbf24" />
                    <h3 style={{ margin: 0, fontWeight: '950', fontSize: '18px' }}>{nombrePrenda}</h3>
                  </div>
                  {estaAbierto ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                <AnimatePresence>
                  {estaAbierto && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                      {Object.keys(productosAgrupados[nombrePrenda]).map(nombreCol => {
                        const variantes = productosAgrupados[nombrePrenda][nombreCol].sort((a: any, b: any) => (ordenTallas[a.talla] || 99) - (ordenTallas[b.talla] || 99))
                        const idCol = `${nombrePrenda}-${nombreCol}`
                        const colAbierto = colegiosAbiertos.includes(idCol)
                        return (
                          <div key={nombreCol} style={{ borderTop: '2px solid #000' }}>
                            <div onClick={() => toggleColegio(idCol)} style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', background: '#f8fafc', cursor: 'pointer' }}>
                              <span style={{ fontWeight: '950', fontSize: '14px' }}><School size={16} /> {nombreCol}</span>
                              {colAbierto ? <Minus size={18} /> : <Plus size={18} />}
                            </div>
                            
                            {colAbierto && (
                              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {variantes.map((i: any) => {
                                  const disponible = i.stock - (i.stock_reservado || 0)
                                  return (
                                    <div key={i.id} style={{ border: '3px solid #000', padding: '15px', borderRadius: '20px', backgroundColor: '#fff' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: '1000', fontSize: '18px' }}>TALLA {i.talla}</span>
                                        <span style={{ fontWeight: '950', color: '#166534' }}>${Number(i.precio_base).toLocaleString()}</span>
                                      </div>
                                      
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {/* STOCK FÍSICO (NEGRO) */}
                                        <div style={{ border: '2px solid #000', padding: '10px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <span style={{ fontSize: '10px', fontWeight: '950' }}>FÍSICO</span>
                                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <button onClick={() => ajustarStock(i.id, -1)} style={{ background: '#ef4444', color: '#fff', border: '2px solid #000', borderRadius: '6px', width: '25px', fontWeight: '900' }}>-</button>
                                            <span style={{ fontWeight: '1000', minWidth: '20px', textAlign: 'center' }}>{i.stock}</span>
                                            <button onClick={() => ajustarStock(i.id, 1)} style={{ background: '#4ade80', color: '#000', border: '2px solid #000', borderRadius: '6px', width: '25px', fontWeight: '900' }}>+</button>
                                          </div>
                                        </div>
                                        {/* RESERVADO (NEGRO) */}
                                        <div style={{ border: '2px solid #000', padding: '10px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <span style={{ fontSize: '10px', fontWeight: '950' }}>RESERV.</span>
                                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <button onClick={() => ajustarReserva(i.id, -1)} style={{ background: '#fbbf24', border: '2px solid #000', borderRadius: '6px', width: '25px', fontWeight: '900' }}>-</button>
                                            <span style={{ fontWeight: '1000', minWidth: '20px', textAlign: 'center' }}>{i.stock_reservado || 0}</span>
                                            <button onClick={() => ajustarReserva(i.id, 1)} style={{ background: '#fbbf24', border: '2px solid #000', borderRadius: '6px', width: '25px', fontWeight: '900' }}>+</button>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* DISPONIBLE: TEXTO BLANCO SI ES FONDO NEGRO */}
                                      <div style={{ textAlign: 'right', marginTop: '12px' }}>
                                        <span 
                                          className={disponible <= 0 ? "texto-blanco-fuerza" : ""}
                                          style={{ 
                                            backgroundColor: disponible <= 0 ? '#000' : '#4ade80', 
                                            padding: '6px 12px', 
                                            borderRadius: '10px', 
                                            fontSize: '12px', 
                                            fontWeight: '950', 
                                            border: '2px solid #000',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                          }}
                                        >
                                          {disponible <= 0 && <AlertCircle size={14} />}
                                          DISPONIBLE: {disponible}
                                        </span>
                                      </div>
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