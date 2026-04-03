'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, User, Phone, IdCard, School, Calendar, 
  ShoppingBag, Plus, X, CheckCircle, MessageSquare, 
  Rocket, Clock, AlertCircle, Tag, Percent, Minus, Banknote 
} from 'lucide-react'

export default function RegistroPedido() {
  const router = useRouter()
  const [usuarioActivo, setUsuarioActivo] = useState('')
  const [inventario, setInventario] = useState<any[]>([])
  const [listaColegios, setListaColegios] = useState<any[]>([])
  const [carrito, setCarrito] = useState<any[]>([])
  
  const [tipoEntrega, setTipoEntrega] = useState<'agendada' | 'inmediata'>('agendada')

  const [nombreSeleccionado, setNombreSeleccionado] = useState('')
  const [tallaSeleccionada, setTallaSeleccionada] = useState('')
  const [precioManualEspecial, setPrecioManualEspecial] = useState('')
  const [cantidad, setCantidad] = useState(1)

  const [nombreCliente, setNombreCliente] = useState('')
  const [rut, setRut] = useState('')
  const [telefono, setTelefono] = useState('') 
  const [colegio, setColegio] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [observaciones, setObservaciones] = useState('') 
  
  const [mostrarDescuento, setMostrarDescuento] = useState(false)
  const [tipoDescuento, setTipoDescuento] = useState<'monto' | 'porcentaje'>('monto')
  const [valorDescuento, setValorDescuento] = useState(0)

  const [montoPagado, setMontoPagado] = useState('') 
  const [metodoPago, setMetodoPago] = useState('Transferencia')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUsuarioActivo(sessionStorage.getItem('user_name') || '')
    const fetch = async () => {
      const { data: inv } = await supabase.from('inventario').select('*').order('nombre')
      if (inv) {
        setInventario(inv)
        if (inv.length > 0) {
          setNombreSeleccionado(inv[0].nombre)
          setTallaSeleccionada(inv[0].talla)
        }
      }
      const { data: col } = await supabase.from('colegios').select('*').order('nombre')
      if (col) {
        setListaColegios(col)
        if (col.length > 0) setColegio(col[0].nombre)
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
  
  const totalOriginal = useMemo(() => carrito.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0), [carrito])
  const descuentoFinal = useMemo(() => {
    if (tipoDescuento === 'monto') return valorDescuento
    return (totalOriginal * (valorDescuento / 100))
  }, [totalOriginal, tipoDescuento, valorDescuento])
  const totalConDescuento = totalOriginal - descuentoFinal

  const guardar = async (e: any) => {
    e.preventDefault()
    if (carrito.length === 0) return alert("Añade productos al pedido")
    if (telefono.length !== 8) return alert("El teléfono debe tener exactamente 8 números.")
    setLoading(true)
    try {
      const telefonoCompleto = `+569${telefono}`
      const { data: cli, error: cliError } = await supabase.from('clientes').insert([{ nombre: nombreCliente, telefono: telefonoCompleto, rut }]).select().single()
      if (cliError || !cli) throw new Error(`Error cliente: ${cliError?.message}`)
      const estadoPedido = tipoEntrega === 'inmediata' ? 'Completado' : 'Pendiente'
      const fechaFinalEntrega = tipoEntrega === 'inmediata' ? new Date().toISOString().split('T')[0] : (fechaEntrega || null)
      const { data: ped, error: pedError } = await supabase.from('pedidos').insert([{
        cliente_id: cli.id, total_final: totalConDescuento, estado: estadoPedido,
        colegio: colegio || 'Particular', fecha_entrega: fechaFinalEntrega,
        observaciones: observaciones + (descuentoFinal > 0 ? ` [Dscto: $${descuentoFinal.toLocaleString()}]` : ''),
        creado_por: usuarioActivo
      }]).select().single()
      if (pedError || !ped) throw new Error(`Error pedido: ${pedError?.message}`)
      const detalles = carrito.map(item => ({
        pedido_id: ped.id, producto_id: item.id_inv, cantidad: item.cantidad, 
        cantidad_entregada: tipoEntrega === 'inmediata' ? item.cantidad : 0, 
        talla: item.talla, precio_unitario: item.precio, estado: tipoEntrega === 'inmediata' ? 'Entregado' : 'Pendiente'
      }))
      await supabase.from('detalles_pedido').insert(detalles)
      const pagoFinal = Number(montoPagado)
      if (pagoFinal > 0) {
        await supabase.from('pagos').insert([{
          pedido_id: ped.id, monto: pagoFinal, fecha_pago: new Date().toISOString().split('T')[0], 
          metodo_pago: metodoPago, creado_por: usuarioActivo
        }])
      }
      for (const item of carrito) {
        if (item.id_inv) {
          const rpcFunc = tipoEntrega === 'inmediata' ? 'entregar_stock' : 'reservar_stock'
          await supabase.rpc(rpcFunc, { prod_id: item.id_inv, cant: item.cantidad })
        }
      }
      await registrarLog(`${usuarioActivo} creó venta con descuento`, `Pedido ${ped.id}`)
      alert("✅ Venta registrada correctamente."); router.push('/pedidos')
    } catch (err: any) { alert(err.message) }
    finally { setLoading(false) }
  }

  // ESTILOS UNIFICADOS
  const cardStyle = { backgroundColor: '#fff', padding: '28px', borderRadius: '32px', border: '4px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '24px' }
  const inputStyle = { width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontSize: '16px', fontWeight: '800', color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' as const, outline: 'none' }
  const labelStyle = { fontSize: '12px', fontWeight: '900', color: '#000', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
      backgroundSize: '32px 32px',
      padding: '40px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* HEADER ANIMADO */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button" 
            onClick={() => router.push('/')} 
            style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '16px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}
          >
            <ArrowLeft size={24} color="#000" />
          </motion.button>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '950', color: '#000', letterSpacing: '-1px' }}>NUEVA VENTA</h1>
        </motion.div>

        <form onSubmit={guardar}>
          
          {/* MODO DE REGISTRO TÁCTIL */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
            <label style={labelStyle}><Rocket size={16} /> Prioridad de Pedido</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
              <motion.button 
                whileTap={{ y: 2 }}
                type="button" 
                onClick={() => setTipoEntrega('agendada')} 
                style={{ 
                  padding: '16px', borderRadius: '20px', border: '4px solid #000', fontWeight: '900', fontSize: '14px', 
                  backgroundColor: tipoEntrega === 'agendada' ? '#fbbf24' : '#fff', 
                  color: '#000', 
                  boxShadow: tipoEntrega === 'agendada' ? 'inset 4px 4px 0px rgba(0,0,0,0.1)' : '4px 4px 0px #000', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                }}
              >
                <Clock size={20} /> AGENDAR
              </motion.button>
              <motion.button 
                whileTap={{ y: 2 }}
                type="button" 
                onClick={() => setTipoEntrega('inmediata')} 
                style={{ 
                  padding: '16px', borderRadius: '20px', border: '4px solid #000', fontWeight: '900', fontSize: '14px', 
                  backgroundColor: tipoEntrega === 'inmediata' ? '#4ade80' : '#fff', 
                  color: '#000', 
                  boxShadow: tipoEntrega === 'inmediata' ? 'inset 4px 4px 0px rgba(0,0,0,0.1)' : '4px 4px 0px #000', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                }}
              >
                <CheckCircle size={20} /> INMEDIATA
              </motion.button>
            </div>
          </motion.div>

          {/* DATOS CLIENTE CON FACHA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={cardStyle}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '950', color: '#000', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={22} color="#3b82f6" /> FICHA CLIENTE
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Nombre Completo</label>
                <input required style={inputStyle} value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} placeholder="Ej: Sebastian Ramirez" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}><IdCard size={14} /> RUT</label>
                  <input style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} placeholder="12.345.678-9" />
                </div>
                <div>
                  <label style={labelStyle}><Phone size={14} /> Teléfono</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ padding: '16px 12px', border: '3px solid #000', borderRadius: '16px', fontSize: '15px', fontWeight: '950', backgroundColor: '#e2e8f0', color: '#000' }}>+569</div>
                    <input required type="tel" maxLength={8} style={inputStyle} value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="88887777" />
                  </div>
                </div>
              </div>
              <div>
                <label style={labelStyle}><School size={16} /> Institución / Colegio</label>
                <select style={inputStyle} value={colegio} onChange={e => setColegio(e.target.value)}>
                  {listaColegios.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
          </motion.div>

          {/* SELECCIÓN PRODUCTOS PRO */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={cardStyle}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '950', color: '#000', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={22} color="#f472b6" /> SELECCIÓN PRENDAS
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <select style={inputStyle} value={nombreSeleccionado} onChange={e => setNombreSeleccionado(e.target.value)}>
                {productosUnicos.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <input type="number" min="1" style={inputStyle} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <select style={inputStyle} value={tallaSeleccionada} onChange={e => setTallaSeleccionada(e.target.value)}>
                {tallasDeInventario.map(t => <option key={t.id} value={t.talla}>{t.talla} (${Number(t.precio_base).toLocaleString()})</option>)}
                <option value="ESPECIAL">✨ TALLA ESPECIAL / MEDIDA</option>
              </select>
            </div>
            <motion.button 
              whileHover={{ y: -4, boxShadow: '8px 8px 0px #000' }}
              whileTap={{ y: 2, boxShadow: 'none' }}
              onClick={agregarAlCarrito} 
              type="button" 
              style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: 'none', padding: '18px', borderRadius: '18px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px' }}
            >
              <Plus size={22} /> AÑADIR AL CARRITO
            </motion.button>
          </motion.div>

          {/* RESUMEN CARRITO TIPO BOLETA */}
          <AnimatePresence>
            {carrito.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ ...cardStyle, background: '#fff', borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
                <p style={labelStyle}>Resumen de Pedido</p>
                {carrito.map((item) => (
                  <div key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '2px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '900', color: '#000', fontSize: '16px' }}>{item.nombre}</p>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#64748b' }}>{item.cantidad}x Talla {item.talla} • ${item.precio.toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: '950', color: '#000', fontSize: '18px' }}>${(item.precio * item.cantidad).toLocaleString()}</span>
                      <motion.button whileHover={{ scale: 1.2 }} onClick={() => quitarDelCarrito(item.tempId)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={22} /></motion.button>
                    </div>
                  </div>
                ))}
                
                <div style={{ marginTop: '24px', textAlign: 'right', borderTop: '4px solid #000', paddingTop: '16px' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#64748b' }}>TOTAL BRUTO</p>
                  <p style={{ margin: 0, fontSize: '32px', fontWeight: '950', color: '#000' }}>${totalOriginal.toLocaleString('es-CL')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BLOQUE DE CIERRE "HIGH-CONTRAST" */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ backgroundColor: '#000', color: '#fff', padding: '32px', borderRadius: '32px', border: '4px solid #000', boxShadow: '12px 12px 0px #3b82f6' }}>
            
            <motion.button 
              type="button" 
              onClick={() => setMostrarDescuento(!mostrarDescuento)}
              style={{ width: '100%', marginBottom: '24px', backgroundColor: '#3b82f6', color: '#fff', border: '3px solid #fff', padding: '14px', borderRadius: '16px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <Tag size={20} /> {mostrarDescuento ? 'CERRAR DESCUENTOS' : '¿APLICAR DESCUENTO?'}
            </motion.button>

            <AnimatePresence>
              {mostrarDescuento && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ marginBottom: '24px', padding: '16px', border: '2px dashed #fff', borderRadius: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <button type="button" onClick={() => setTipoDescuento('monto')} style={{ padding: '12px', borderRadius: '12px', border: '2px solid #fff', fontWeight: '900', background: tipoDescuento === 'monto' ? '#fff' : 'transparent', color: tipoDescuento === 'monto' ? '#000' : '#fff' }}><Minus size={16} /> FIJO ($)</button>
                    <button type="button" onClick={() => setTipoDescuento('porcentaje')} style={{ padding: '12px', borderRadius: '12px', border: '2px solid #fff', fontWeight: '900', background: tipoDescuento === 'porcentaje' ? '#fff' : 'transparent', color: tipoDescuento === 'porcentaje' ? '#000' : '#fff' }}><Percent size={16} /> PORC. (%)</button>
                  </div>
                  <input type="number" style={{ ...inputStyle, textAlign: 'center', fontSize: '20px' }} value={valorDescuento} onChange={(e) => setValorDescuento(Number(e.target.value))} />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                {descuentoFinal > 0 && (
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#94a3b8', textDecoration: 'line-through' }}>Bruto: ${totalOriginal.toLocaleString()}</p>
                )}
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '950', color: '#4ade80' }}>PRECIO FINAL</p>
                <p style={{ margin: 0, fontSize: '48px', fontWeight: '950', color: '#4ade80', lineHeight: '1' }}>${totalConDescuento.toLocaleString('es-CL')}</p>
              </div>

              <div>
                <label style={{ color: '#fff', fontSize: '13px', fontWeight: '950', marginBottom: '8px', display: 'block' }}>EFECTIVO / ABONO RECIBIDO ($)</label>
                <input type="number" placeholder="Ej: 10000" style={{ ...inputStyle, background: '#fff', textAlign: 'center', fontSize: '20px' }} value={montoPagado} onChange={e => setMontoPagado(e.target.value)} />
              </div>
              
              <div>
                <label style={{ color: '#fff', fontSize: '13px', fontWeight: '950', marginBottom: '8px', display: 'block' }}>MÉTODO DE PAGO</label>
                <select style={{ ...inputStyle, background: '#fff' }} value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                </select>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: '#22c55e' }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading || carrito.length === 0} 
                style={{ 
                  width: '100%', backgroundColor: '#4ade80', color: '#000', border: '4px solid #000', 
                  padding: '24px', borderRadius: '24px', fontWeight: '950', fontSize: '22px', 
                  boxShadow: '0px 8px 0px #fff', cursor: 'pointer', marginTop: '12px' 
                }}
              >
                {loading ? 'PROCESANDO...' : 'FINALIZAR REGISTRO'}
              </motion.button>
            </div>
          </motion.div>

          {/* NOTAS FINALES */}
          <div style={{ marginTop: '32px', marginBottom: '40px' }}>
            <label style={labelStyle}><MessageSquare size={16} /> Instrucciones Especiales</label>
            <textarea placeholder="Ej: Bordado especial en la manga izquierda..." style={{ ...inputStyle, height: '100px', resize: 'none' }} value={observaciones} onChange={e => setObservations(e.target.value)} />
          </div>

        </form>
      </div>
    </main>
  )
}