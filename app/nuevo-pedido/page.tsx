'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, Phone, IdCard, School, Calendar, ShoppingBag, Plus, X, CheckCircle, MessageSquare, Rocket, Clock, AlertCircle } from 'lucide-react'

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
  const [telefono, setTelefono] = useState('') // Guardaremos solo los 8 dígitos
  const [colegio, setColegio] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [observaciones, setObservaciones] = useState('') 
  
  const [abono, setAbono] = useState('')
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
  const totalCalculado = useMemo(() => carrito.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0), [carrito])

  const guardar = async (e: any) => {
    e.preventDefault()
    if (carrito.length === 0) return alert("Añade productos al pedido")
    if (telefono.length !== 8) return alert("El teléfono debe tener exactamente 8 números.")
    
    setLoading(true)
    try {
      // Guardamos el teléfono con el prefijo completo para que el link de WhatsApp funcione
      const telefonoCompleto = `+569${telefono}`
      
      const { data: cli, error: cliError } = await supabase.from('clientes').insert([{ 
        nombre: nombreCliente, 
        telefono: telefonoCompleto, 
        rut 
      }]).select().single()
      
      if (cliError || !cli) throw new Error(`Error cliente: ${cliError?.message}`)
      
      const estadoPedido = tipoEntrega === 'inmediata' ? 'Completado' : 'Pendiente'
      const fechaFinalEntrega = tipoEntrega === 'inmediata' ? new Date().toISOString().split('T')[0] : (fechaEntrega || null)

      const { data: ped, error: pedError } = await supabase.from('pedidos').insert([{
        cliente_id: cli.id, 
        total_final: totalCalculado, 
        estado: estadoPedido,
        colegio: colegio || 'Particular', 
        fecha_entrega: fechaFinalEntrega,
        observaciones: observaciones,
        creado_por: usuarioActivo
      }]).select().single()
      
      if (pedError || !ped) throw new Error(`Error pedido: ${pedError?.message}`)

      const detalles = carrito.map(item => ({
        pedido_id: ped.id, 
        producto_id: item.id_inv, 
        cantidad: item.cantidad, 
        cantidad_entregada: tipoEntrega === 'inmediata' ? item.cantidad : 0, 
        talla: item.talla, 
        precio_unitario: item.precio, 
        estado: tipoEntrega === 'inmediata' ? 'Entregado' : 'Pendiente'
      }))
      await supabase.from('detalles_pedido').insert(detalles)

      const montoAPagar = tipoEntrega === 'inmediata' ? totalCalculado : Number(abono)
      
      if (montoAPagar > 0) {
        await supabase.from('pagos').insert([{
          pedido_id: ped.id, 
          monto: montoAPagar, 
          fecha_pago: new Date().toISOString().split('T')[0], 
          metodo_pago: metodoPago, 
          creado_por: usuarioActivo
        }])
      }

      for (const item of carrito) {
        if (item.id_inv) {
          const rpcFunc = tipoEntrega === 'inmediata' ? 'entregar_stock' : 'reservar_stock'
          await supabase.rpc(rpcFunc, { prod_id: item.id_inv, cant: item.cantidad })
        }
      }

      await registrarLog(`${usuarioActivo} creó venta ${tipoEntrega}`, `Pedido ${ped.id}`)
      alert("✅ Venta registrada correctamente."); router.push('/pedidos')
    } catch (err: any) { alert(err.message) }
    finally { setLoading(false) }
  }

  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '3px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '20px' }
  const inputStyle = { width: '100%', padding: '14px', border: '3px solid #000', borderRadius: '12px', fontSize: '16px', fontWeight: '800', color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '13px', fontWeight: '900', color: '#000', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' as const }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <button type="button" onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}><ArrowLeft size={20} color="#000" /></button>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#000' }}>Nueva Venta</h1>
        </div>

        <form onSubmit={guardar}>
          
          {/* MODO DE ENTREGA */}
          <div style={cardStyle}>
            <label style={labelStyle}><Rocket size={16} /> Tipo de Operación</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setTipoEntrega('agendada')} style={{ padding: '14px', borderRadius: '14px', border: '3px solid #000', fontWeight: '900', fontSize: '14px', backgroundColor: tipoEntrega === 'agendada' ? '#fbbf24' : '#fff', color: '#000', boxShadow: tipoEntrega === 'agendada' ? 'inset 4px 4px 0px rgba(0,0,0,0.2)' : '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Clock size={18} /> PEDIDO (Agenda)
              </button>
              <button type="button" onClick={() => setTipoEntrega('inmediata')} style={{ padding: '14px', borderRadius: '14px', border: '3px solid #000', fontWeight: '900', fontSize: '14px', backgroundColor: tipoEntrega === 'inmediata' ? '#4ade80' : '#fff', color: '#000', boxShadow: tipoEntrega === 'inmediata' ? 'inset 4px 4px 0px rgba(0,0,0,0.2)' : '4px 4px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> VENTA (Ahora)
              </button>
            </div>
            {tipoEntrega === 'agendada' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px' }}>
                <label style={labelStyle}><Calendar size={16} /> Fecha de Entrega</label>
                <input type="date" style={inputStyle} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} required={tipoEntrega === 'agendada'} />
              </motion.div>
            )}
          </div>

          {/* DATOS CLIENTE */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={20} /> Cliente</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div><label style={labelStyle}>Nombre Completo</label><input required style={inputStyle} value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}><IdCard size={14} /> RUT (Opcional)</label><input style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} /></div>
                
                {/* TELÉFONO CON PREFIJO AUTOMÁTICO */}
                <div>
                  <label style={labelStyle}><Phone size={14} /> Teléfono</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <div style={{ padding: '14px 10px', border: '3px solid #000', borderRadius: '12px', fontSize: '16px', fontWeight: '900', backgroundColor: '#e2e8f0', color: '#000' }}>+56 9</div>
                    <input 
                      required 
                      type="tel"
                      placeholder="12345678"
                      maxLength={8}
                      style={inputStyle} 
                      value={telefono} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 8); // Solo números, máx 8
                        setTelefono(val);
                      }} 
                    />
                  </div>
                  {telefono.length > 0 && telefono.length < 8 && (
                    <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '900', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> Faltan {8 - telefono.length} números
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label style={labelStyle}><School size={14} /> Colegio</label>
                <select style={inputStyle} value={colegio} onChange={e => setColegio(e.target.value)}>
                  {listaColegios.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingBag size={20} /> Productos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <select style={inputStyle} value={nombreSeleccionado} onChange={e => setNombreSeleccionado(e.target.value)}>{productosUnicos.map(n => <option key={n} value={n}>{n}</option>)}</select>
              <input type="number" min="1" style={inputStyle} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <select style={inputStyle} value={tallaSeleccionada} onChange={e => setTallaSeleccionada(e.target.value)}>
                {tallasDeInventario.map(t => <option key={t.id} value={t.talla}>{t.talla} (${Number(t.precio_base).toLocaleString()})</option>)}
                <option value="ESPECIAL">✨ Talla Especial / Manual</option>
              </select>
              {tallaSeleccionada === 'ESPECIAL' && <input type="number" placeholder="Precio manual $" style={{ ...inputStyle, marginTop: '12px', borderColor: '#3b82f6' }} value={precioManualEspecial} onChange={e => setPrecioManualEspecial(e.target.value)} />}
            </div>
            <button onClick={agregarAlCarrito} type="button" style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Plus size={20} /> AÑADIR AL CARRITO</button>
          </div>

          {/* CARRITO Y CIERRE DE VENTA */}
          <AnimatePresence>
            {carrito.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ ...cardStyle, background: '#f8fafc', borderStyle: 'dashed' }}>
                <p style={labelStyle}>Resumen de Venta:</p>
                {carrito.map((item) => (
                  <div key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '2px solid #e2e8f0' }}>
                    <span style={{ fontWeight: '800', color: '#000' }}>{item.cantidad}x {item.nombre} <br/><small style={{color: '#000', opacity: 0.7}}>Talla {item.talla}</small></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontWeight: '900', color: '#000' }}>${(item.precio * item.cantidad).toLocaleString()}</span>
                      <button onClick={() => quitarDelCarrito(item.tempId)} style={{ color: '#ef4444', border: 'none', background: 'none', padding: '5px' }}><X size={20} /></button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ backgroundColor: '#000', color: '#fff', padding: '30px', borderRadius: '28px', border: '4px solid #000', boxShadow: '10px 10px 0px #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#4ade80' }}>TOTAL A PAGAR</p>
                <p style={{ margin: 0, fontSize: '42px', fontWeight: '900' }}>${totalCalculado.toLocaleString('es-CL')}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {tipoEntrega === 'agendada' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label style={{ color: '#fff', fontSize: '13px', fontWeight: '900' }}>ABONO INICIAL ($)</label>
                  <input type="number" placeholder="Ej: 5000" style={{ ...inputStyle, background: '#fff', marginTop: '8px' }} value={abono} onChange={e => setAbono(e.target.value)} />
                </motion.div>
              )}
              <div>
                <label style={{ color: '#fff', fontSize: '13px', fontWeight: '900' }}>MÉTODO DE PAGO</label>
                <select style={{ ...inputStyle, background: '#fff', marginTop: '8px' }} value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading || carrito.length === 0 || telefono.length !== 8} 
                style={{ 
                  width: '100%', 
                  backgroundColor: (telefono.length === 8 && carrito.length > 0) ? '#4ade80' : '#64748b', 
                  color: '#000', 
                  border: '3px solid #000', 
                  padding: '18px', 
                  borderRadius: '16px', 
                  fontWeight: '900', 
                  fontSize: '20px', 
                  boxShadow: '4px 4px 0px #fff', 
                  cursor: (telefono.length === 8) ? 'pointer' : 'not-allowed', 
                  marginTop: '10px' 
                }}
              >
                {loading ? 'PROCESANDO...' : (tipoEntrega === 'inmediata' ? 'FINALIZAR VENTA' : 'CONFIRMAR PEDIDO')}
              </button>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}><MessageSquare size={16} /> Notas Internas</label>
            <textarea placeholder="Ej: Entregar en bolsa grande..." style={{ ...inputStyle, height: '80px', resize: 'none' }} value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>
        </form>
      </div>
    </main>
  )
}