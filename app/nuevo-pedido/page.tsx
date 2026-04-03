'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, User, Phone, IdCard, School, Calendar, 
  ShoppingBag, Plus, X, CheckCircle, MessageSquare, 
  Rocket, Clock, AlertCircle, Tag, Percent, Minus, Banknote, Edit3
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
  
  // NUEVO: AJUSTE MANUAL DE PRECIO FINAL
  const [mostrarAjuste, setMostrarAjuste] = useState(false)
  const [valorAjuste, setValorAjuste] = useState(0)

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
      if (!precioManualEspecial) return alert("Ingresa el precio para la talla especial")
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
  
  // CÁLCULO FINAL CON AJUSTE MANUAL
  const totalConDescuento = (totalOriginal - descuentoFinal) + Number(valorAjuste)

  const guardar = async (e: any) => {
    e.preventDefault()
    if (carrito.length === 0) return alert("Añade productos al pedido")
    if (telefono.length !== 8) return alert("El teléfono debe tener exactamente 8 números.")
    if (tipoEntrega === 'agendada' && !fechaEntrega) return alert("Selecciona una fecha de entrega")
    
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
        observaciones: observaciones + (descuentoFinal > 0 ? ` [Dscto: $${descuentoFinal.toLocaleString()}]` : '') + (valorAjuste !== 0 ? ` [Ajuste: $${valorAjuste.toLocaleString()}]` : ''),
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
      
      await registrarLog(`${usuarioActivo} creó venta de $${totalConDescuento}`, `Pedido ${ped.id}`)
      alert("✅ Venta registrada correctamente."); router.push('/pedidos')
    } catch (err: any) { alert(err.message) }
    finally { setLoading(false) }
  }

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
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '16px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
            <ArrowLeft size={24} color="#000" />
          </motion.button>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '950', color: '#000', letterSpacing: '-1px' }}>NUEVA VENTA</h1>
        </motion.div>

        <form onSubmit={guardar}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
            <label style={labelStyle}><Rocket size={16} /> Prioridad de Pedido</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px', marginBottom: tipoEntrega === 'agendada' ? '20px' : '0' }}>
              <motion.button type="button" onClick={() => setTipoEntrega('agendada')} style={{ padding: '16px', borderRadius: '20px', border: '4px solid #000', fontWeight: '900', fontSize: '14px', backgroundColor: tipoEntrega === 'agendada' ? '#fbbf24' : '#fff', boxShadow: tipoEntrega === 'agendada' ? 'inset 4px 4px 0px rgba(0,0,0,0.1)' : '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <Clock size={20} /> AGENDAR
              </motion.button>
              <motion.button type="button" onClick={() => setTipoEntrega('inmediata')} style={{ padding: '16px', borderRadius: '20px', border: '4px solid #000', fontWeight: '900', fontSize: '14px', backgroundColor: tipoEntrega === 'inmediata' ? '#4ade80' : '#fff', boxShadow: tipoEntrega === 'inmediata' ? 'inset 4px 4px 0px rgba(0,0,0,0.1)' : '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <CheckCircle size={20} /> INMEDIATA
              </motion.button>
            </div>
            
            {/* FIX: CALENDARIO DE ENTREGA */}
            <AnimatePresence>
              {tipoEntrega === 'agendada' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <label style={labelStyle}><Calendar size={16} /> Fecha de Entrega Prometida</label>
                  <input type="date" style={inputStyle} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} required={tipoEntrega === 'agendada'} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

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
                <div><label style={labelStyle}><IdCard size={14} /> RUT</label><input style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} placeholder="12.345.678-9" /></div>
                <div>
                  <label style={labelStyle}><Phone size={14} /> Teléfono</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ padding: '16px 12px', border: '3px solid #000', borderRadius: '16px', fontSize: '15px', fontWeight: '950', backgroundColor: '#e2e8f0', color: '#000' }}>+569</div>
                    <input required type="tel" maxLength={8} style={inputStyle} value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 8))} />
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
              
              {/* FIX: PRECIO TALLA ESPECIAL */}
              {tallaSeleccionada === 'ESPECIAL' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '15px' }}>
                  <label style={labelStyle}><Banknote size={14} /> Precio para esta prenda ($)</label>
                  <input type="number" style={{...inputStyle, borderColor: '#f472b6'}} placeholder="Ingresa valor acordado" value={precioManualEspecial} onChange={e => setPrecioManualEspecial(e.target.value)} />
                </motion.div>
              )}
            </div>
            <motion.button whileHover={{ y: -4, boxShadow: '8px 8px 0px #000' }} whileTap={{ y: 2, boxShadow: 'none' }} onClick={agregarAlCarrito} type="button" style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: 'none', padding: '18px', borderRadius: '18px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
              <Plus size={22} /> AÑADIR AL CARRITO
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {carrito.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ ...cardStyle, background: '#fff', borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
                <p style={labelStyle}>Resumen de Pedido</p>
                {carrito.map((item) => (
                  <div key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '2px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: '900', color: '#000', fontSize: '16px' }}>{item.nombre}</p><p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#64748b' }}>{item.cantidad}x Talla {item.talla} • ${item.precio.toLocaleString()}</p></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><span style={{ fontWeight: '950', color: '#000', fontSize: '18px' }}>${(item.precio * item.cantidad).toLocaleString()}</span><button onClick={() => quitarDelCarrito(item.tempId)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={22} /></button></div>
                  </div>
                ))}
                <div style={{ marginTop: '24px', textAlign: 'right', borderTop: '4px solid #000', paddingTop: '16px' }}><p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#64748b' }}>TOTAL BRUTO</p><p style={{ margin: 0, fontSize: '32px', fontWeight: '950', color: '#000' }}>${totalOriginal.toLocaleString('es-CL')}</p></div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ backgroundColor: '#000', color: '#fff', padding: '32px', borderRadius: '32px', border: '4px solid #000', boxShadow: '12px 12px 0px #3b82f6' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <motion.button type="button" onClick={() => setMostrarDescuento(!mostrarDescuento)} style={{ width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: '2px solid #fff', padding: '14px', borderRadius: '16px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <Tag size={18} /> DESCUENTO
              </motion.button>
              
              {/* BOTÓN AJUSTE MANUAL */}
              <motion.button type="button" onClick={() => setMostrarAjuste(!mostrarAjuste)} style={{ width: '100%', backgroundColor: '#a78bfa', color: '#fff', border: '2px solid #fff', padding: '14px', borderRadius: '16px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <Edit3 size={18} /> AJUSTE +/-
              </motion.button>
            </div>

            <AnimatePresence>
              {mostrarDescuento && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ marginBottom: '24px', padding: '16px', border: '2px dashed #fff', borderRadius: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <button type="button" onClick={() => setTipoDescuento('monto')} style={{ padding: '12px', borderRadius: '12px', border: '2px solid #fff', fontWeight: '900', background: tipoDescuento === 'monto' ? '#fff' : 'transparent', color: tipoDescuento === 'monto' ? '#000' : '#fff' }}>$ PESOS</button>
                    <button type="button" onClick={() => setTipoDescuento('porcentaje')} style={{ padding: '12px', borderRadius: '12px', border: '2px solid #fff', fontWeight: '900', background: tipoDescuento === 'porcentaje' ? '#fff' : 'transparent', color: tipoDescuento === 'porcentaje' ? '#000' : '#fff' }}>% PORC.</button>
                  </div>
                  <input type="number" style={{ ...inputStyle, textAlign: 'center' }} value={valorDescuento} onChange={(e) => setValorDescuento(Number(e.target.value))} />
                </motion.div>
              )}
              
              {mostrarAjuste && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ marginBottom: '24px', padding: '16px', border: '2px dashed #a78bfa', borderRadius: '20px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '900', color: '#fff', marginBottom: '8px', display: 'block' }}>AJUSTE MANUAL AL TOTAL ($)</label>
                   <input type="number" placeholder="Ej: -2000 o 500" style={{ ...inputStyle, textAlign: 'center', color: '#a78bfa' }} value={valorAjuste} onChange={(e) => setValorAjuste(Number(e.target.value))} />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '950', color: '#4ade80' }}>PRECIO FINAL</p>
                <p style={{ margin: 0, fontSize: '48px', fontWeight: '950', color: '#4ade80', lineHeight: '1' }}>${totalConDescuento.toLocaleString('es-CL')}</p>
              </div>
              <div>
                <label style={{ color: '#fff', fontSize: '13px', fontWeight: '950', marginBottom: '8px', display: 'block' }}>ABONO RECIBIDO ($)</label>
                <input type="number" placeholder="Ej: 10000" style={{ ...inputStyle, background: '#fff', textAlign: 'center', fontSize: '20px' }} value={montoPagado} onChange={e => setMontoPagado(e.target.value)} />
              </div>
              <div>
                <label style={{ color: '#fff', fontSize: '13px', fontWeight: '950', marginBottom: '8px', display: 'block' }}>MÉTODO</label>
                <select style={{ ...inputStyle, background: '#fff' }} value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                </select>
              </div>
              <motion.button type="submit" disabled={loading || carrito.length === 0} style={{ width: '100%', backgroundColor: '#4ade80', color: '#000', border: '4px solid #000', padding: '24px', borderRadius: '24px', fontWeight: '950', fontSize: '22px', boxShadow: '0px 8px 0px #fff', cursor: 'pointer' }}>
                {loading ? 'GUARDANDO...' : 'FINALIZAR REGISTRO'}
              </motion.button>
            </div>
          </motion.div>

          <div style={{ marginTop: '32px', marginBottom: '40px' }}>
            <label style={labelStyle}><MessageSquare size={16} /> Instrucciones Especiales</label>
            {/* FIX: setObservaciones corregido */}
            <textarea placeholder="Ej: Bordado especial..." style={{ ...inputStyle, height: '100px', resize: 'none' }} value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>
        </form>
      </div>
    </main>
  )
}