'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, User, Phone, IdCard, School, Calendar, 
  ShoppingBag, Plus, X, CheckCircle, MessageSquare, 
  Rocket, Clock, Tag, Minus, Banknote, Edit3, Boxes
} from 'lucide-react'

export default function RegistroPedido() {
  const router = useRouter()
  const [usuarioActivo, setUsuarioActivo] = useState('')
  const [inventario, setInventario] = useState<any[]>([])
  const [listaColegios, setListaColegios] = useState<any[]>([])
  const [carrito, setCarrito] = useState<any[]>([])
  
  const [tipoEntrega, setTipoEntrega] = useState<'agendada' | 'inmediata'>('agendada')

  // ESTADOS DEL FORMULARIO
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
  
  // DESCUENTOS Y AJUSTES
  const [mostrarDescuento, setMostrarDescuento] = useState(false)
  const [tipoDescuento, setTipoDescuento] = useState<'monto' | 'porcentaje'>('monto')
  const [valorDescuento, setValorDescuento] = useState(0)
  
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

  // ESTILOS NEUBRUTALISTAS
  const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '28px', border: '4px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '24px' }
  const inputStyle = { width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontSize: '16px', fontWeight: '950', color: '#000000', backgroundColor: '#ffffff', boxSizing: 'border-box' as const, outline: 'none' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#000', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px', padding: '30px 15px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 💣 ELIMINADOR DE GRISES: ESTO FUERZA EL NEGRO EN CUALQUIER PC O CELULAR */}
      <style jsx global>{`
        :root { color-scheme: light !important; }
        input, select, option, textarea {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          background-color: #ffffff !important;
          opacity: 1 !important;
          font-weight: 950 !important;
        }
        select {
          appearance: none !important;
          -webkit-appearance: none !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 15px center;
          background-size: 18px;
        }
      `}</style>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <motion.button whileTap={{ scale: 0.9 }} type="button" onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '14px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
            <ArrowLeft size={22} color="#000" />
          </motion.button>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '950', color: '#000', letterSpacing: '-1px' }}>NUEVA VENTA</h1>
        </motion.div>

        <form onSubmit={guardar}>
          
          {/* PRIORIDAD */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
            <label style={labelStyle}><Rocket size={16} /> PRIORIDAD</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px', marginBottom: tipoEntrega === 'agendada' ? '15px' : '0' }}>
              <motion.button type="button" onClick={() => setTipoEntrega('agendada')} style={{ padding: '14px', borderRadius: '18px', border: '4px solid #000', fontWeight: '900', color: '#000', fontSize: '13px', backgroundColor: tipoEntrega === 'agendada' ? '#fbbf24' : '#fff', cursor: 'pointer' }}>AGENDAR</motion.button>
              <motion.button type="button" onClick={() => setTipoEntrega('inmediata')} style={{ padding: '14px', borderRadius: '18px', border: '4px solid #000', fontWeight: '900', color: '#000', fontSize: '13px', backgroundColor: tipoEntrega === 'inmediata' ? '#4ade80' : '#fff', cursor: 'pointer' }}>INMEDIATA</motion.button>
            </div>
            {tipoEntrega === 'agendada' && (
              <div style={{ marginTop: '15px' }}>
                <label style={labelStyle}><Calendar size={16} /> FECHA DE ENTREGA</label>
                <input type="date" style={inputStyle} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} />
              </div>
            )}
          </motion.div>

          {/* CLIENTE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '950', color: '#000' }}>CLIENTE</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              <input required style={inputStyle} value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} placeholder="NOMBRE COMPLETO" />
              <input style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} placeholder="RUT (OPCIONAL)" />
              <div>
                <label style={labelStyle}><Phone size={14} /> TELÉFONO</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ padding: '16px 12px', border: '3px solid #000', borderRadius: '16px', fontWeight: '950', backgroundColor: '#e2e8f0', color: '#000' }}>+569</div>
                  <input required type="tel" maxLength={8} style={inputStyle} value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, ''))} placeholder="12345678" />
                </div>
              </div>
              <select style={inputStyle} value={colegio} onChange={e => setColegio(e.target.value)}>
                {listaColegios.map(c => <option key={c.id} value={c.nombre} style={{color: '#000'}}>{c.nombre}</option>)}
              </select>
            </div>
          </motion.div>

          {/* PRENDAS - STOCK AL PRINCIPIO Y NEGRO */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '950', color: '#000' }}>PRENDAS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <select style={inputStyle} value={nombreSeleccionado} onChange={e => setNombreSeleccionado(e.target.value)}>
                {productosUnicos.map(n => <option key={n} value={n} style={{color: '#000'}}>{n}</option>)}
              </select>
              <input type="number" min="1" style={inputStyle} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
            </div>
            <select style={inputStyle} value={tallaSeleccionada} onChange={e => setTallaSeleccionada(e.target.value)}>
              {tallasDeInventario.map(t => {
                const disponible = t.stock - (t.stock_reservado || 0);
                return (
                  <option key={t.id} value={t.talla} style={{ color: '#000000', backgroundColor: '#ffffff', fontWeight: '950' }}>
                    [{disponible} EN STOCK] — TALLA {t.talla} (${Number(t.precio_base).toLocaleString()})
                  </option>
                )
              })}
              <option value="ESPECIAL" style={{color: '#000'}}>✨ TALLA ESPECIAL</option>
            </select>
            {tallaSeleccionada === 'ESPECIAL' && (
              <input type="number" style={{...inputStyle, marginTop: '10px', borderColor: '#f472b6'}} placeholder="PRECIO ACORDADO $" value={precioManualEspecial} onChange={e => setPrecioManualEspecial(e.target.value)} />
            )}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={agregarAlCarrito} type="button" style={{ width: '100%', backgroundColor: '#000', color: '#fff', padding: '18px', borderRadius: '18px', fontWeight: '950', marginTop: '15px', cursor: 'pointer' }}>
              <Plus size={22} /> AÑADIR AL CARRITO
            </motion.button>
          </motion.div>

          {/* CARRITO Y SUBTOTAL PRENDAS */}
          <AnimatePresence>
            {carrito.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ ...cardStyle, borderStyle: 'dashed' }}>
                <p style={labelStyle}><Boxes size={14}/> RESUMEN PRENDAS</p>
                {carrito.map((item) => (
                  <div key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: '900', color: '#000' }}>{item.nombre}</p><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{item.cantidad}x T{item.talla}</p></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontWeight: '950', color: '#000' }}>${(item.precio * item.cantidad).toLocaleString()}</span><button onClick={() => quitarDelCarrito(item.tempId)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
                  </div>
                ))}
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '4px solid #000', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: '950', color: '#64748b' }}>SUBTOTAL PRENDAS</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '950', color: '#000' }}>${totalOriginal.toLocaleString('es-CL')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PANEL FINAL */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ backgroundColor: '#000', color: '#fff', padding: '24px', borderRadius: '32px', border: '4px solid #000', boxShadow: '8px 8px 0px #3b82f6' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button type="button" onClick={() => setMostrarDescuento(!mostrarDescuento)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: '2px solid #fff', padding: '12px', borderRadius: '14px', fontWeight: '900', fontSize: '11px', cursor: 'pointer' }}>DESCUENTO</button>
              <button type="button" onClick={() => setMostrarAjuste(!mostrarAjuste)} style={{ backgroundColor: '#a78bfa', color: '#fff', border: '2px solid #fff', padding: '12px', borderRadius: '14px', fontWeight: '900', fontSize: '11px', cursor: 'pointer' }}>AJUSTE (+/-)</button>
            </div>

            <AnimatePresence>
              {mostrarDescuento && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    <button type="button" onClick={() => setTipoDescuento('monto')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #fff', background: tipoDescuento === 'monto' ? '#fff' : 'transparent', color: tipoDescuento === 'monto' ? '#000' : '#fff', fontWeight: '950' }}>$ PESOS</button>
                    <button type="button" onClick={() => setTipoDescuento('porcentaje')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #fff', background: tipoDescuento === 'porcentaje' ? '#fff' : 'transparent', color: tipoDescuento === 'porcentaje' ? '#000' : '#fff', fontWeight: '950' }}>% PORC.</button>
                  </div>
                  <input type="number" style={{...inputStyle, textAlign: 'center'}} value={valorDescuento} onChange={e => setValorDescuento(Number(e.target.value))} />
                </motion.div>
              )}
              {mostrarAjuste && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', marginBottom: '15px' }}>
                  <input type="number" placeholder="SUMAR O RESTAR $" style={{...inputStyle, textAlign: 'center', color: '#a78bfa'}} value={valorAjuste} onChange={e => setValorAjuste(Number(e.target.value))} />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ textAlign: 'right', marginBottom: '25px' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '950', color: '#4ade80' }}>PRECIO FINAL</p>
              <p style={{ margin: 0, fontSize: '42px', fontWeight: '950', color: '#4ade80', lineHeight: '1' }}>${totalConDescuento.toLocaleString('es-CL')}</p>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              <input type="number" placeholder="ABONO RECIBIDO $" style={{...inputStyle, textAlign: 'center'}} value={montoPagado} onChange={e => setMontoPagado(e.target.value)} />
              <select style={inputStyle} value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
              </select>
              <button type="submit" disabled={loading || carrito.length === 0} style={{ backgroundColor: '#4ade80', color: '#000', padding: '20px', borderRadius: '20px', fontWeight: '950', fontSize: '20px', border: 'none', cursor: 'pointer' }}>
                {loading ? '...' : 'FINALIZAR REGISTRO'}
              </button>
            </div>
          </motion.div>

          <textarea style={{ ...inputStyle, marginTop: '25px', height: '100px', resize: 'none' }} placeholder="OBSERVACIONES O NOTAS ESPECIALES" value={observaciones} onChange={e => setObservaciones(e.target.value)} />
        </form>
      </div>
    </main>
  )
}