'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Phone, IdCard, School, Calendar, ShoppingBag, Plus, X, CreditCard, CheckCircle } from 'lucide-react'

export default function RegistroPedido() {
  const router = useRouter()
  const [inventario, setInventario] = useState<any[]>([])
  const [carrito, setCarrito] = useState<any[]>([])
  
  const [nombreSeleccionado, setNombreSeleccionado] = useState('')
  const [tallaSeleccionada, setTallaSeleccionada] = useState('')
  const [precioManualEspecial, setPrecioManualEspecial] = useState('')
  const [cantidad, setCantidad] = useState(1)

  // DATOS CLIENTE Y PEDIDO
  const [nombreCliente, setNombreCliente] = useState('')
  const [rut, setRut] = useState('')
  const [telefono, setTelefono] = useState('')
  const [colegio, setColegio] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  
  const [abono, setAbono] = useState('')
  const [metodoPagoInicial, setMetodoPagoInicial] = useState('Transferencia')
  const [fechaPagoInicial, setFechaPagoInicial] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('inventario').select('*').order('nombre')
      if (data) {
        setInventario(data)
        if (data.length > 0) {
          setNombreSeleccionado(data[0].nombre)
          setTallaSeleccionada(data[0].talla)
        }
      }
    }
    fetch()
  }, [])

  const productosUnicos = useMemo(() => Array.from(new Set(inventario.map(i => i.nombre))), [inventario])
  const tallasDeInventario = useMemo(() => inventario.filter(i => i.nombre === nombreSeleccionado), [nombreSeleccionado, inventario])

  const agregarAlCarrito = () => {
    let item; let precio;
    if (tallaSeleccionada === 'ESPECIAL') {
      precio = Number(precioManualEspecial)
      item = { id_inv: tallasDeInventario[0]?.id, nombre: nombreSeleccionado, talla: 'ESPECIAL', precio, cantidad }
    } else {
      const invItem = inventario.find(i => i.nombre === nombreSeleccionado && i.talla === tallaSeleccionada)
      precio = Number(invItem?.precio_base || 0)
      item = { id_inv: invItem.id, nombre: nombreSeleccionado, talla: tallaSeleccionada, precio, cantidad }
    }
    setCarrito([...carrito, { ...item, tempId: Date.now() }])
    setPrecioManualEspecial('')
  }

  const quitarDelCarrito = (id: number) => setCarrito(carrito.filter(c => c.tempId !== id))
  const totalCalculado = useMemo(() => carrito.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0), [carrito])

  const guardar = async (e: any) => {
    e.preventDefault()
    if (carrito.length === 0) return alert("Añade algo al pedido primero")
    setLoading(true)
    try {
      const { data: cli } = await supabase.from('clientes').insert([{ nombre: nombreCliente, telefono, rut }]).select().single()
      const { data: ped } = await supabase.from('pedidos').insert([{
        cliente_id: cli.id, total_final: totalCalculado, abono: 0, estado: 'Pendiente',
        colegio: colegio || 'Particular', fecha_entrega: fechaEntrega || null
      }]).select().single()

      const detalles = carrito.map(item => ({
        pedido_id: ped.id, producto_id: item.id_inv, cantidad: item.cantidad, talla: item.talla, precio_unitario: item.precio, estado: 'Pendiente'
      }))
      await supabase.from('detalles_pedido').insert(detalles)

      if (Number(abono) > 0) {
        await supabase.from('pagos').insert([{
          pedido_id: ped.id,
          monto: Number(abono),
          fecha_pago: fechaPagoInicial,
          metodo_pago: metodoPagoInicial
        }])
      }

      void registrarLog(
        `${sessionStorage.getItem('user_name') || 'Usuario'} creó el pedido de ${nombreCliente}`,
        `Pedido ${ped.id} por ${Number(totalCalculado).toLocaleString('es-CL')}`
      )

      // Reservar stock
      for (const item of carrito) {
        if (item.id_inv) await supabase.rpc('reservar_stock', { prod_id: item.id_inv, cant: item.cantidad })
      }

      alert("✅ Venta registrada con éxito."); router.push('/pedidos')
    } catch (err: any) { alert(err.message) }
    finally { setLoading(false) }
  }

  // Estilos limpios y modernos
  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }
  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', outline: 'none', backgroundColor: '#f8fafc', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' as const }

  // Animaciones
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '550px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Nueva Venta</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Registra los datos del cliente y los productos</p>
          </div>
        </motion.div>

        <form onSubmit={guardar}>
          
          {/* DATOS DEL CLIENTE */}
          <motion.div variants={itemVariants} style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#3b82f6" /> Información del Cliente
            </h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nombre Completo</label>
                <input required placeholder="Ej: Juan Pérez" style={inputStyle} value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}><IdCard size={14} /> RUT</label>
                  <input placeholder="Ej: 12345678-9" style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}><Phone size={14} /> Teléfono</label>
                  <input required placeholder="912345678" style={inputStyle} value={telefono} onChange={e => setTelefono(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}><School size={14} /> Colegio / Inst.</label>
                  <input placeholder="Ej: Liceo 1" style={inputStyle} value={colegio} onChange={e => setColegio(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}><Calendar size={14} /> Entrega</label>
                  <input type="date" style={inputStyle} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARRITO Y PRENDAS */}
          <motion.div variants={itemVariants} style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} color="#10b981" /> Selección de Productos
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Prenda</label>
                <select style={inputStyle} value={nombreSeleccionado} onChange={e => { setNombreSeleccionado(e.target.value); setTallaSeleccionada(inventario.find(i => i.nombre === e.target.value)?.talla || '') }}>
                  {productosUnicos.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Cant.</label>
                <input type="number" min="1" style={inputStyle} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Talla</label>
              <select style={inputStyle} value={tallaSeleccionada} onChange={e => setTallaSeleccionada(e.target.value)}>
                {tallasDeInventario.map(t => <option key={t.id} value={t.talla}>{t.talla} (${Number(t.precio_base).toLocaleString()})</option>)}
                <option value="ESPECIAL">✨ Talla Especial (Manual)</option>
              </select>
              {tallaSeleccionada === 'ESPECIAL' && (
                <motion.input initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} type="number" placeholder="Precio unitario $" style={{ ...inputStyle, marginTop: '12px', border: '1px solid #3b82f6', backgroundColor: '#eff6ff' }} value={precioManualEspecial} onChange={e => setPrecioManualEspecial(e.target.value)} />
              )}
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={agregarAlCarrito} type="button" style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '14px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Plus size={18} /> Agregar al Pedido
            </motion.button>
          </motion.div>

          {/* LISTA DEL PEDIDO */}
          {carrito.length > 0 && (
            <motion.div variants={itemVariants} initial="hidden" animate="visible" style={{ ...cardStyle, border: '1px solid #10b981' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase' }}>Resumen del Pedido</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {carrito.map((item, index) => (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{item.cantidad}x {item.nombre} <span style={{ color: '#3b82f6' }}>[{item.talla}]</span></p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Subtotal: ${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <button onClick={() => quitarDelCarrito(item.tempId)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex' }}>
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TOTAL Y CONFIRMAR */}
          <motion.div variants={itemVariants} style={{ backgroundColor: '#0f172a', color: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Total a Cobrar</p>
            <p style={{ margin: '0 0 20px 0', fontSize: '36px', fontWeight: '800', color: '#10b981', letterSpacing: '-1px' }}>${totalCalculado.toLocaleString('es-CL')}</p>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ ...labelStyle, color: '#94a3b8' }}><CreditCard size={14} /> Abono Inicial $</label>
              <input required type="number" placeholder="Ej: 10000" style={{ ...inputStyle, backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }} value={abono} onChange={e => setAbono(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' }}>
              <div>
                <label style={{ ...labelStyle, color: '#94a3b8' }}>Método de Pago</label>
                <select style={{ ...inputStyle, backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }} value={metodoPagoInicial} onChange={e => setMetodoPagoInicial(e.target.value)}>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, color: '#94a3b8' }}>Fecha de Pago</label>
                <input type="date" style={{ ...inputStyle, backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }} value={fechaPagoInicial} onChange={e => setFechaPagoInicial(e.target.value)} />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02, backgroundColor: '#059669' }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
              {loading ? 'Procesando...' : <><CheckCircle size={20} /> Confirmar Pedido</>}
            </motion.button>
          </motion.div>

        </form>
      </motion.div>
    </main>
  )
}