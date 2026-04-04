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
  
  const [cantidad, setCantidad] = useState<number | string>('')

  const [nombreCliente, setNombreCliente] = useState('')
  const [rut, setRut] = useState('')
  const [telefono, setTelefono] = useState('') 
  const [colegio, setColegio] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [observaciones, setObservaciones] = useState('') 
  
  const [mostrarDescuento, setMostrarDescuento] = useState(false)
  const [tipoDescuento, setTipoDescuento] = useState<'monto' | 'porcentaje'>('monto')
  const [valorDescuento, setValorDescuento] = useState(0)
  
  const [mostrarAjuste, setMostrarAjuste] = useState(false)
  const [valorAjuste, setValorAjuste] = useState(0)

  const [montoPagado, setMontoPagado] = useState('') 
  const [metodoPago, setMetodoPago] = useState('Transferencia')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUsuarioActivo(localStorage.getItem('user_name') || 'Don Luis')
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

  // Función para formatear separadores de mil en tiempo real
  const formatMontoInput = (val: string | number) => {
    const raw = val.toString().replace(/\D/g, '')
    if (!raw) return ''
    return `$${Number(raw).toLocaleString('es-CL')}`
  }

  const productosUnicos = useMemo(() => Array.from(new Set(inventario.map(i => i.nombre))), [inventario])
  const tallasDeInventario = useMemo(() => inventario.filter(i => i.nombre === nombreSeleccionado), [nombreSeleccionado, inventario])

  const agregarAlCarrito = () => {
    const cantNum = Number(cantidad.toString().replace(/\D/g, ''))
    if (cantidad === '' || cantNum <= 0) {
      return alert("Ingresa una cantidad válida.")
    }

    let item; let precio;
    if (tallaSeleccionada === 'ESPECIAL') {
      const rawPrecio = precioManualEspecial.toString().replace(/\D/g, '')
      if (!rawPrecio) return alert("Ingresa el precio para la talla especial")
      precio = Number(rawPrecio)
      item = { id_inv: tallasDeInventario[0]?.id, nombre: nombreSeleccionado, talla: 'ESPECIAL', precio, cantidad: cantNum }
    } else {
      const invItem = inventario.find(i => i.nombre === nombreSeleccionado && i.talla === tallaSeleccionada)
      precio = Number(invItem?.precio_base || 0)
      item = { id_inv: invItem.id, nombre: nombreSeleccionado, talla: tallaSeleccionada, precio, cantidad: cantNum }
    }
    setCarrito([...carrito, { ...item, tempId: Date.now() }])
    setPrecioManualEspecial('')
    setCantidad('')
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
    if (telefono.length !== 8) return alert("El teléfono debe tener 8 números.")
    if (tipoEntrega === 'agendada' && !fechaEntrega) return alert("Selecciona fecha de entrega")
    
    // Limpieza de abono y validación de tope máximo
    const pagoFinal = Number(montoPagado.toString().replace(/\D/g, ''))
    
    if (pagoFinal > totalConDescuento) {
      return alert(`No puedes abonar más del total ($${totalConDescuento.toLocaleString('es-CL')})`)
    }

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
        talla: item.talla, precio_unitario: item.precio, 
        estado: tipoEntrega === 'inmediata' ? 'Entregado' : 'Pendiente'
      }))
      await supabase.from('detalles_pedido').insert(detalles)
      
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
      
      await registrarLog(`${usuarioActivo} creó venta ${tipoEntrega.toUpperCase()} de $${totalConDescuento}`, `Pedido #${ped.id}`)
      alert(`Venta registrada como Pedido #${ped.id}`); 
      router.push('/pedidos')
    } catch (err: any) { alert(err.message) }
    finally { setLoading(false) }
  }

  // Estilos originales preservados
  const containerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`, backgroundSize: '32px 32px', padding: '30px 15px', fontFamily: 'system-ui, sans-serif' }
  const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '28px', border: '4px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '24px' }
  const inputStyle = { width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontSize: '16px', fontWeight: '800', color: '#000', backgroundColor: '#fff', outline: 'none' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#000', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' as const }

  return (
    <main style={containerStyle}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <button type="button" onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '14px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
            <ArrowLeft size={22} color="#000" />
          </button>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '950', color: '#000', letterSpacing: '-1px' }}>NUEVA VENTA</h1>
        </div>

        <form onSubmit={guardar}>
          <div style={cardStyle}>
            <label style={labelStyle}><Rocket size={16} /> Prioridad del Pedido</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setTipoEntrega('agendada')} style={{ padding: '14px', borderRadius: '18px', border: '4px solid #000', fontWeight: '900', backgroundColor: tipoEntrega === 'agendada' ? '#fbbf24' : '#fff', cursor: 'pointer' }}>
                <Clock size={18} /> AGENDAR
              </button>
              <button type="button" onClick={() => setTipoEntrega('inmediata')} style={{ padding: '14px', borderRadius: '18px', border: '4px solid #000', fontWeight: '900', backgroundColor: tipoEntrega === 'inmediata' ? '#4ade80' : '#fff', cursor: 'pointer' }}>
                <CheckCircle size={18} /> INMEDIATA
              </button>
            </div>
            {tipoEntrega === 'agendada' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '15px' }}>
                <label style={labelStyle}><Calendar size={16} /> Fecha de Entrega</label>
                <input type="date" style={inputStyle} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} required />
              </motion.div>
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '950', marginBottom: '15px' }}><User size={18} /> DATOS CLIENTE</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              <input required style={inputStyle} value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} placeholder="Nombre" />
              <input style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} placeholder="R.U.T" />
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ padding: '16px', border: '3px solid #000', borderRadius: '16px', fontWeight: '950', backgroundColor: '#e2e8f0' }}>+569</div>
                <input required style={inputStyle} value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="Teléfono" />
              </div>
              <select style={inputStyle} value={colegio} onChange={e => setColegio(e.target.value)}>
                {listaColegios.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '950', marginBottom: '15px' }}><ShoppingBag size={18} /> PRODUCTO</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <select style={inputStyle} value={nombreSeleccionado} onChange={e => setNombreSeleccionado(e.target.value)}>
                {productosUnicos.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <input type="text" placeholder="CANT." style={{...inputStyle, textAlign: 'center'}} value={cantidad} onChange={e => setCantidad(e.target.value.replace(/\D/g, ''))} />
            </div>
            <select style={inputStyle} value={tallaSeleccionada} onChange={e => setTallaSeleccionada(e.target.value)}>
              {tallasDeInventario.map(t => <option key={t.id} value={t.talla}>{t.talla} (${Number(t.precio_base).toLocaleString()})</option>)}
              <option value="ESPECIAL">TALLA ESPECIAL</option>
            </select>
            {tallaSeleccionada === 'ESPECIAL' && (
              <div style={{ marginTop: '10px' }}>
                <input type="text" style={inputStyle} placeholder="Precio Especial" value={formatMontoInput(precioManualEspecial)} onChange={e => setPrecioManualEspecial(e.target.value.replace(/\D/g, ''))} />
              </div>
            )}
            <button onClick={agregarAlCarrito} type="button" style={{ width: '100%', backgroundColor: '#000', color: '#fff', padding: '15px', borderRadius: '15px', fontWeight: '950', marginTop: '15px', cursor: 'pointer' }}>AÑADIR</button>
          </div>

          <AnimatePresence>
            {carrito.length > 0 && (
              <div style={{ ...cardStyle, borderStyle: 'dashed' }}>
                {carrito.map((item) => (
                  <div key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div><p style={{ margin: 0, fontWeight: '900' }}>{item.nombre} (T{item.talla})</p><p style={{ margin: 0, fontSize: '12px' }}>{item.cantidad} unidades</p></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span>${(item.precio * item.cantidad).toLocaleString()}</span><button onClick={() => quitarDelCarrito(item.tempId)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
                  </div>
                ))}
              </div>
            )}
          </AnimatePresence>

          <div style={{ backgroundColor: '#000', color: '#fff', padding: '25px', borderRadius: '30px', border: '4px solid #000' }}>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '950', color: '#4ade80' }}>PRECIO FINAL</p>
              <p style={{ margin: 0, fontSize: '42px', fontWeight: '950', color: '#4ade80', lineHeight: '1' }}>${totalConDescuento.toLocaleString('es-CL')}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#fff', fontSize: '11px', fontWeight: '900' }}>ABONO RECIBIDO</label>
              <input type="text" style={{...inputStyle, textAlign: 'center'}} value={formatMontoInput(montoPagado)} onChange={e => setMontoPagado(e.target.value.replace(/\D/g, ''))} placeholder="$0" />
            </div>
            <select style={inputStyle} value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>
            <button type="submit" disabled={loading || carrito.length === 0} style={{ width: '100%', backgroundColor: '#4ade80', color: '#000', padding: '18px', borderRadius: '15px', fontWeight: '950', fontSize: '18px', marginTop: '15px', cursor: 'pointer' }}>
              {loading ? 'FINALIZANDO...' : 'FINALIZAR'}
            </button>
          </div>

          <div style={{ marginTop: '20px', marginBottom: '40px' }}>
            <label style={labelStyle}><MessageSquare size={16} /> Notas</label>
            <textarea style={{ ...inputStyle, height: '80px', resize: 'none' }} value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>
        </form>
      </div>
    </main>
  )
}