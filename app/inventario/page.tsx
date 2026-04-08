'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx-js-style'
import { 
  ArrowLeft, PackagePlus, Trash2, ChevronDown, ChevronUp, Plus, 
  Minus, PackageOpen, School, Search, Download, Settings2, X, Boxes, Tag, AlertCircle, Edit3, DollarSign, UploadCloud
} from 'lucide-react'

export default function Inventario() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [listaColegios, setListaColegios] = useState<any[]>([])
  const [mostrarGestionColegios, setMostrarGestionColegios] = useState(false)
  const [mostrarNuevoArticulo, setMostrarNuevoArticulo] = useState(false)
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

  // NUEVO ESTADO: Controla el modal de edición de artículos
  const [modalEditarArticulo, setModalEditarArticulo] = useState({
    open: false,
    id: null as string | null,
    nombre: '',
    colegio: '',
    talla: '',
    stockFisico: 0,
    stockReserva: 0
  })

  const ordenTallas: { [key: string]: number } = {
    "4": 1, "5":2, "6": 3, "8": 4, "10": 5, 
    "12": 6, "14": 7, "16": 8, "S": 9, "M": 10, "L": 11, "XL": 12, "Estd": 13, "ESPECIAL": 14
  }

  const cargar = useCallback(async () => {
    // 🛡️ BLOQUEO DE SEGURIDAD
    if (!localStorage.getItem('user_role')) {
      router.push('/login')
      return
    }

    const { data: inv } = await supabase.from('inventario').select('*').order('nombre')
    if (inv) setItems(inv)

    const { data: col } = await supabase.from('colegios').select('*').order('nombre')
    if (col) {
      setListaColegios(col)
      if (col.length > 0 && !colegioSeleccionado) setColegioSeleccionado(col[0].nombre)
    }
  }, [colegioSeleccionado, router])

  useEffect(() => { cargar() }, [cargar])

  const agregarColegioMaestro = async () => {
    if (!nuevoNombreColegio) return
    const nombreUpper = nuevoNombreColegio.toUpperCase().trim()
    const { error } = await supabase.from('colegios').insert([{ nombre: nombreUpper }])
    if (error) alert("❌ Error")
    else { 
      setNuevoNombreColegio('')
      await registrarLog(`Agregó nuevo colegio: ${nombreUpper}`, 'Inventario')
      cargar() 
    }
  }

  const guardarNuevoArticulo = async () => {
    if (!nombre || !colegioSeleccionado || !talla || !precio) return alert("Completa todos los campos obligatorios.")
    const nombreFormateado = nombre.toUpperCase().trim()
    const tallaFormateada = talla.toUpperCase().trim()
    
    try {
      const { error } = await supabase.from('inventario').insert([{
        nombre: nombreFormateado,
        colegio: colegioSeleccionado,
        talla: tallaFormateada,
        precio_base: Number(precio.replace(/\D/g, '')),
        stock: stock ? Number(stock) : 0
      }])
      if (error) throw error
      await registrarLog(`Creó artículo: ${nombreFormateado} (T${tallaFormateada}) para ${colegioSeleccionado}`, 'Inventario')
      alert("Artículo creado con éxito")
      setMostrarNuevoArticulo(false)
      setNombre(''); setPrecio(''); setStock('')
      cargar()
    } catch (err: any) { alert("Error al crear artículo: " + err.message) }
  }

  // NUEVA FUNCIÓN: Guarda los cambios editados del artículo
  const guardarEdicionArticulo = async () => {
    const { id, nombre: nNombre, colegio: nColegio, talla: nTalla } = modalEditarArticulo
    if (!nNombre || !nColegio || !nTalla) return alert("Completa los campos.")
    
    const nombreFormateado = nNombre.toUpperCase().trim()
    const tallaFormateada = nTalla.toUpperCase().trim()

    try {
      const { error } = await supabase
        .from('inventario')
        .update({ nombre: nombreFormateado, colegio: nColegio, talla: tallaFormateada })
        .eq('id', id)

      if (error) throw error

      await registrarLog(`Editó artículo ID ${id}: ${nombreFormateado} T${tallaFormateada}`, 'Inventario')
      setModalEditarArticulo({ ...modalEditarArticulo, open: false })
      cargar()
      alert("✅ Artículo actualizado.")
    } catch (err: any) {
      alert("Error al actualizar: " + err.message)
    }
  }

  // NUEVA FUNCIÓN: Elimina artículo si no hay stock ni reservas
  const eliminarArticulo = async () => {
    const { id, stockFisico, stockReserva, nombre: nNombre } = modalEditarArticulo
    
    if (stockFisico > 0 || stockReserva > 0) {
      return alert(`❌ No puedes eliminar un artículo que tiene Stock Físico (${stockFisico}) o Reservas (${stockReserva}). Ajusta el stock a 0 primero.`)
    }

    if (!confirm(`⚠️ ¿Estás completamente seguro de eliminar "${nNombre}"? Esta acción no se puede deshacer.`)) return

    try {
      const { error } = await supabase.from('inventario').delete().eq('id', id)
      if (error) throw error
      
      await registrarLog(`Eliminó artículo del sistema: ${nNombre} (ID ${id})`, 'Inventario')
      setModalEditarArticulo({ ...modalEditarArticulo, open: false })
      cargar()
      alert("🗑️ Artículo eliminado con éxito.")
    } catch (err: any) {
      alert("Error al eliminar: " + err.message)
    }
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

  const anadirStock = async (id: string, nombreItem: string, tallaItem: string) => {
    const valor = prompt(`¿Cuántas unidades nuevas ingresarán de ${nombreItem} Talla ${tallaItem}? (Solo números positivos)`)
    if (!valor) return
    const cantidadIngreso = parseInt(valor.replace(/\D/g, ''), 10)
    
    if (isNaN(cantidadIngreso) || cantidadIngreso <= 0) {
      return alert("Debes ingresar un número válido mayor a 0.")
    }

    const itemActual = items.find(i => i.id === id)
    if (!itemActual) return
    
    const nuevoStock = itemActual.stock + cantidadIngreso
    
    try {
      setItems(prev => prev.map(item => item.id === id ? { ...item, stock: nuevoStock } : item))
      await supabase.from('inventario').update({ stock: nuevoStock }).eq('id', id)
      
      const user = localStorage.getItem('user_name') || 'Don Luis'
      await registrarLog(`${user} INGRESÓ ${cantidadIngreso} unid. a ${nombreItem} (Talla ${tallaItem}). Stock anterior: ${itemActual.stock}, Nuevo: ${nuevoStock}`, `Entrada Inventario`)
      alert(`✅ Ingreso registrado con éxito.`)
    } catch (err) { alert("Error al ingresar stock.") }
  }

  const editarPrecioBase = async (id: string, precioActual: number, nombreItem: string) => {
    const nuevo = prompt(`Nuevo precio base para ${nombreItem}:`, precioActual.toString())
    if (!nuevo) return
    const precioLimpio = Number(nuevo.replace(/\D/g, ''))
    
    if (precioLimpio >= 0) {
      try {
        setItems(prev => prev.map(item => item.id === id ? { ...item, precio_base: precioLimpio } : item))
        await supabase.from('inventario').update({ precio_base: precioLimpio }).eq('id', id)
        await registrarLog(`Modificó precio de ${nombreItem} de $${precioActual} a $${precioLimpio}`, 'Configuración Precios')
      } catch (err) { alert("Error al actualizar precio.") }
    }
  }

  const ajustarReserva = (id: string, delta: number) => {
    const itemActual = items.find(i => i.id === id);
    if (!itemActual) return;
    const nuevaReserva = (itemActual.stock_reservado || 0) + delta;
    if (nuevaReserva < 0) return;
    setItems(prev => prev.map(item => item.id === id ? { ...item, stock_reservado: nuevaReserva } : item));
    supabase.from('inventario').update({ stock_reservado: nuevaReserva }).eq('id', id);
  }

  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '32px', border: '4px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '25px' }
  const inputStyle = { width: '100%', padding: '14px', border: '3px solid #000', borderRadius: '16px', fontSize: '15px', fontWeight: '900', color: '#000', backgroundColor: '#fff' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#000', marginBottom: '8px', display: 'block', textTransform: 'uppercase' as const }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '30px 15px' }}>
      
      {/* 💣 CSS DE ALTO CONTRASTE CORREGIDO */}
      <style jsx global>{`
        :root { color-scheme: light !important; }
        .texto-blanco-fuerza { color: #ffffff !important; }
        .texto-blanco-fuerza * { color: #ffffff !important; }
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setMostrarNuevoArticulo(true)} style={{ backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <PackagePlus size={20} color="#000" /> <span style={{fontSize: '12px', display: 'none'}} className="sm:block">NUEVO</span>
            </button>
            <button onClick={() => setMostrarGestionColegios(true)} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}>
              <Settings2 size={20} color="#000" />
            </button>
          </div>
        </div>

        {/* MODAL GESTIÓN COLEGIOS */}
        <AnimatePresence>
          {mostrarGestionColegios && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '10px 10px 0px #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontWeight: '950', fontSize: '20px', color: '#000' }}>GESTIÓN DE COLEGIOS</h3>
                  <button onClick={() => setMostrarGestionColegios(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#000" /></button>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Agregar Nuevo Colegio</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input style={inputStyle} value={nuevoNombreColegio} onChange={e => setNuevoNombreColegio(e.target.value)} placeholder="Ej: Instituto Nacional" />
                    <button onClick={agregarColegioMaestro} style={{ background: '#000', color: '#fff', padding: '0 20px', borderRadius: '12px', fontWeight: '900', border: 'none' }}><Plus size={20}/></button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL NUEVO ARTÍCULO */}
        <AnimatePresence>
          {mostrarNuevoArticulo && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '10px 10px 0px #000', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontWeight: '950', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#000' }}><PackagePlus size={20} color="#000"/> CREAR PRENDA</h3>
                  <button onClick={() => setMostrarNuevoArticulo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#000" /></button>
                </div>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Colegio</label>
                    <select style={inputStyle} value={colegioSeleccionado} onChange={e => setColegioSeleccionado(e.target.value)}>
                      {listaColegios.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Nombre de la Prenda</label>
                    <input style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: POLERON DE POLAR" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={labelStyle}>Talla</label>
                      <input style={inputStyle} value={talla} onChange={e => setTalla(e.target.value)} placeholder="Ej: 14 o M" />
                    </div>
                    <div>
                      <label style={labelStyle}>Precio Base ($)</label>
                      <input type="number" style={inputStyle} value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Ej: 12500" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Stock Inicial (Físico)</label>
                    <input type="number" style={inputStyle} value={stock} onChange={e => setStock(e.target.value)} placeholder="0" />
                  </div>
                  
                  <button onClick={guardarNuevoArticulo} style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '950', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}>
                    GUARDAR ARTÍCULO
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL EDICIÓN ARTÍCULO */}
        <AnimatePresence>
          {modalEditarArticulo.open && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ backgroundColor: '#fff', border: '4px solid #000', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '10px 10px 0px #000', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontWeight: '950', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#000' }}><Settings2 size={20} color="#000"/> EDITAR ARTÍCULO</h3>
                  <button onClick={() => setModalEditarArticulo({...modalEditarArticulo, open: false})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#000" /></button>
                </div>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Colegio</label>
                    <select style={inputStyle} value={modalEditarArticulo.colegio} onChange={e => setModalEditarArticulo({...modalEditarArticulo, colegio: e.target.value})}>
                      {listaColegios.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Nombre de la Prenda</label>
                    <input style={inputStyle} value={modalEditarArticulo.nombre} onChange={e => setModalEditarArticulo({...modalEditarArticulo, nombre: e.target.value})} placeholder="Ej: POLERON DE POLAR" />
                  </div>
                  <div>
                    <label style={labelStyle}>Talla</label>
                    <input style={inputStyle} value={modalEditarArticulo.talla} onChange={e => setModalEditarArticulo({...modalEditarArticulo, talla: e.target.value})} placeholder="Ej: 14 o M" />
                  </div>
                  
                  <button onClick={guardarEdicionArticulo} style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '950', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}>
                    GUARDAR CAMBIOS
                  </button>

                  <div style={{ marginTop: '10px', paddingTop: '15px', borderTop: '2px dashed #e2e8f0', textAlign: 'center' }}>
                     <button onClick={eliminarArticulo} style={{ width: '100%', padding: '14px', background: '#fef2f2', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '14px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                       <Trash2 size={16} /> ELIMINAR ARTÍCULO
                     </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
                              <span style={{ fontWeight: '950', fontSize: '14px', color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}><School size={16} color="#000" /> {nombreCol}</span>
                              {colAbierto ? <Minus size={18} color="#000" /> : <Plus size={18} color="#000" />}
                            </div>
                            
                            {colAbierto && (
                              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {variantes.map((i: any) => {
                                  const disponible = i.stock - (i.stock_reservado || 0)
                                  return (
                                    <div key={i.id} style={{ border: '3px solid #000', padding: '15px', borderRadius: '20px', backgroundColor: '#fff' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                        {/* MODIFICACIÓN: Añadido botón de configuración para editar el artículo completo */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ fontWeight: '1000', fontSize: '18px', color: '#000' }}>TALLA {i.talla}</span>
                                          <button 
                                            onClick={() => setModalEditarArticulo({
                                              open: true, id: i.id, nombre: i.nombre, colegio: i.colegio, talla: i.talla, stockFisico: i.stock, stockReserva: i.stock_reservado || 0
                                            })}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                                            title="Editar detalles del artículo"
                                          >
                                            <Settings2 size={16} color="#64748b" />
                                          </button>
                                        </div>
                                        
                                        <button 
                                          onClick={() => editarPrecioBase(i.id, i.precio_base, `${nombrePrenda} T${i.talla}`)}
                                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                          <span style={{ fontWeight: '950', color: '#000', fontSize: '16px' }}>${Number(i.precio_base).toLocaleString()}</span>
                                          <Edit3 size={14} color="#000" />
                                        </button>
                                      </div>
                                      
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div style={{ border: '2px solid #000', padding: '10px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: '10px', fontWeight: '950', color: '#000' }}>FÍSICO</span>
                                            <span style={{ fontWeight: '1000', fontSize: '16px', color: '#000' }}>{i.stock}</span>
                                          </div>
                                          <button 
                                            onClick={() => anadirStock(i.id, nombrePrenda, i.talla)}
                                            style={{ width: '100%', background: '#000', color: '#fff', border: '2px solid #000', borderRadius: '8px', padding: '6px', fontWeight: '900', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                          >
                                            <UploadCloud size={12} /> AÑADIR STOCK
                                          </button>
                                        </div>

                                        <div style={{ border: '2px solid #000', padding: '10px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <span style={{ fontSize: '10px', fontWeight: '950', color: '#000' }}>RESERV.</span>
                                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <button onClick={() => ajustarReserva(i.id, -1)} style={{ background: '#fbbf24', color: '#000', border: '2px solid #000', borderRadius: '6px', width: '25px', fontWeight: '900' }}>-</button>
                                            <span style={{ fontWeight: '1000', minWidth: '20px', textAlign: 'center', color: '#000' }}>{i.stock_reservado || 0}</span>
                                            <button onClick={() => ajustarReserva(i.id, 1)} style={{ background: '#fbbf24', color: '#000', border: '2px solid #000', borderRadius: '6px', width: '25px', fontWeight: '900' }}>+</button>
                                          </div>
                                        </div>
                                      </div>
                                      
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
                                            gap: '6px',
                                            color: disponible <= 0 ? '#fff' : '#000'
                                          }}
                                        >
                                          {disponible <= 0 && <AlertCircle size={14} color="#fff" />}
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