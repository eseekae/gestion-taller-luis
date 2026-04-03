'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, User, Phone, IdCard, School, Calendar, 
  ShoppingBag, Plus, X, CheckCircle, MessageSquare, 
  Rocket, Clock, Tag, Minus, Banknote, Edit3, Boxes, AlertCircle
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
      if (!precioManualEspecial) return alert("Ingresa el precio especial")
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
    if (carrito.length === 0) return alert("Añade productos")
    if (telefono.length !== 8) return alert("El teléfono debe tener 8 números.")
    
    setLoading(true)
    try {
      const tel = `+569${telefono}`
      const { data: cli } = await supabase.from('clientes').insert([{ nombre: nombreCliente, telefono: tel, rut }]).select().single()
      
      const { data: ped } = await supabase.from('pedidos').insert([{
        cliente_id: cli.id, total_final: totalConDescuento, 
        estado: tipoEntrega === 'inmediata' ? 'Completado' : 'Pendiente',
        colegio: colegio || 'Particular', 
        fecha_entrega: tipoEntrega === 'inmediata' ? new Date().toISOString() : fechaEntrega,
        observaciones: observaciones, creado_por: usuarioActivo
      }]).select().single()
      
      const detalles = carrito.map(item => ({
        pedido_id: ped.id, producto_id: item.id_inv, cantidad: item.cantidad, 
        cantidad_entregada: tipoEntrega === 'inmediata' ? item.cantidad : 0, 
        talla: item.talla, precio_unitario: item.precio, estado: tipoEntrega === 'inmediata' ? 'Entregado' : 'Pendiente'
      }))
      await supabase.from('detalles_pedido').insert(detalles)
      
      if (Number(montoPagado) > 0) {
        await supabase.from('pagos').insert([{
          pedido_id: ped.id, monto: Number(montoPagado), fecha_pago: new Date().toISOString(), 
          metodo_pago: metodoPago, creado_por: usuarioActivo
        }])
      }
      
      for (const item of carrito) {
        if (item.id_inv) {
          const rpc = tipoEntrega === 'inmediata' ? 'entregar_stock' : 'reservar_stock'
          await supabase.rpc(rpc, { prod_id: item.id_inv, cant: item.cantidad })
        }
      }
      
      await registrarLog(`${usuarioActivo} creó pedido de $${totalConDescuento}`, `Pedido ${ped.id}`)
      alert("✅ Venta registrada"); router.push('/pedidos')
    } catch (err) { alert("Error al guardar") }
    finally { setLoading(false) }
  }

  const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '28px', border: '4px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '24px' }
  const inputStyle = { width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontSize: '16px', fontWeight: '950', color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' as const, outline: 'none' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#000', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' as const }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '30px 15px', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
            <ArrowLeft size={20} color="#000" />
          </button>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '950', color: '#000' }}>NUEVA VENTA</h1>
        </div>

        <form onSubmit={guardar}>
          
          <div style={cardStyle}>
            <label style={labelStyle}><Rocket size={16} /> PRIORIDAD</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setTipoEntrega('agendada')} style={{ padding: '14px', borderRadius: '18px', border: '4px solid #000', fontWeight: '900', backgroundColor: tipoEntrega === 'agendada' ? '#fbbf24' : '#fff' }}>AGENDAR</button>
              <button type="button" onClick={() => setTipoEntrega('inmediata')} style={{ padding: '14px', borderRadius: '18px', border: '4px solid #000', fontWeight: '900', backgroundColor: tipoEntrega === 'inmediata' ? '#4ade80' : '#fff' }}>INMEDIATA</button>
            </div>
            {tipoEntrega === 'agendada' && (
              <div style={{ marginTop: '15px' }}>
                <label style={labelStyle}><Calendar size={16} /> FECHA</label>
                <input type="date" style={inputStyle} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} />
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '950', marginBottom: '20px' }}>CLIENTE</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              <input required style={inputStyle} value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} placeholder="NOMBRE COMPLETO" />
              <input style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} placeholder="RUT" />
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ padding: '16px 12px', border: '3px solid #000', borderRadius: '16px', fontWeight: '950', backgroundColor: '#e2e8f0' }}>+569</div>
                <input required type="tel" maxLength={8} style={inputStyle} value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, ''))} placeholder="TELÉFONO" />
              </div>
              <select style={inputStyle} value={colegio} onChange={e => setColegio(e.target.value)}>
                {listaColegios.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          {/* SECCIÓN PRENDAS CON SELECTOR DE TALLAS VISIBLE (EL ARREGLO) */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '950', marginBottom: '20px' }}>PRENDAS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <select style={inputStyle} value={nombreSeleccionado} onChange={e => setNombreSeleccionado(e.target.value)}>
                {productosUnicos.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <input type="number" style={inputStyle} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
            </div>
            
            <label style={labelStyle}><Boxes size={14}/> SELECCIONA TALLA Y REVISA STOCK</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {tallasDeInventario.map(t => {
                const disp = t.stock - (t.stock_reservado || 0);
                const isSelected = tallaSeleccionada === t.talla;
                return (
                  <button 
                    key={t.id} 
                    type="button"
                    onClick={() => setTallaSeleccionada(t.talla)}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '16px', 
                      border: '3px solid #000', 
                      backgroundColor: isSelected ? '#000' : '#fff',
                      color: isSelected ? '#fff' : '#000',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: isSelected ? 'none' : '3px 3px 0px #000'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '950' }}>TALLA {t.talla}</p>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', color: isSelected ? '#4ade80' : '#64748b' }}>
                      STOCK: {disp}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '950' }}>${t.precio_base.toLocaleString()}</p>
                  </button>
                )
              })}
              <button 
                type="button"
                onClick={() => setTallaSeleccionada('ESPECIAL')}
                style={{ padding: '12px', borderRadius: '16px', border: '3px solid #000', backgroundColor: tallaSeleccionada === 'ESPECIAL' ? '#f472b6' : '#fff', fontWeight: '950' }}
              >ESPECIAL</button>
            </div>

            {tallaSeleccionada === 'ESPECIAL' && <input type="number" style={{...inputStyle, marginTop: '15px', borderColor: '#f472b6'}} placeholder="PRECIO ACORDADO $" value={precioManualEspecial} onChange={e => setPrecioManualEspecial(e.target.value)} />}
            
            <button type="button" onClick={agregarAlCarrito} style={{ width: '100%', backgroundColor: '#000', color: '#fff', padding: '18px', borderRadius: '18px', fontWeight: '950', marginTop: '20px', cursor: 'pointer' }}>AÑADIR AL CARRITO</button>
          </div>

          {/* CARRITO */}
          {carrito.length > 0 && (
            <div style={{ ...cardStyle, borderStyle: 'dashed' }}>
              <p style={labelStyle}>RESUMEN PRENDAS</p>
              {carrito.map((item) => (
                <div key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '2px solid #f1f5f9' }}>
                  <div><p style={{ margin: 0, fontWeight: '900' }}>{item.nombre}</p><p style={{ margin: 0, fontSize: '12px' }}>{item.cantidad}x T{item.talla}</p></div>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}><span style={{ fontWeight: '950' }}>${(item.precio * item.cantidad).toLocaleString()}</span><button type="button" onClick={() => quitarDelCarrito(item.tempId)} style={{ color: '#ef4444', border: 'none', background: 'none' }}><X size={20}/></button></div>
                </div>
              ))}
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '4px solid #000', textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '950', color: '#64748b' }}>SUBTOTAL PRENDAS</p>
                <p style={{ margin: 0, fontSize: '26px', fontWeight: '950' }}>${totalOriginal.toLocaleString('es-CL')}</p>
              </div>
            </div>
          )}

          {/* PANEL FINAL */}
          <div style={{ backgroundColor: '#000', color: '#fff', padding: '25px', borderRadius: '32px', border: '4px solid #000', boxShadow: '8px 8px 0px #3b82f6' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button type="button" onClick={() => setMostrarDescuento(!mostrarDescuento)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: '2px solid #fff', padding: '12px', borderRadius: '14px', fontWeight: '900' }}>DESC.</button>
              <button type="button" onClick={() => setMostrarAjuste(!mostrarAjuste)} style={{ backgroundColor: '#a78bfa', color: '#fff', border: '2px solid #fff', padding: '12px', borderRadius: '14px', fontWeight: '900' }}>AJUSTE</button>
            </div>

            <AnimatePresence>
              {mostrarDescuento && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} style={{ overflow: 'hidden', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    <button type="button" onClick={() => setTipoDescuento('monto')} style={{ flex: 1, padding: '10px', background: tipoDescuento === 'monto' ? '#fff' : 'transparent', color: tipoDescuento === 'monto' ? '#000' : '#fff', border: '2px solid #fff', borderRadius: '10px' }}>$</button>
                    <button type="button" onClick={() => setTipoDescuento('porcentaje')} style={{ flex: 1, padding: '10px', background: tipoDescuento === 'porcentaje' ? '#fff' : 'transparent', color: tipoDescuento === 'porcentaje' ? '#000' : '#fff', border: '2px solid #fff', borderRadius: '10px' }}>%</button>
                  </div>
                  <input type="number" style={{...inputStyle, textAlign: 'center'}} value={valorDescuento} onChange={e => setValorDescuento(Number(e.target.value))} />
                </motion.div>
              )}
              {mostrarAjuste && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} style={{ overflow: 'hidden', marginBottom: '15px' }}>
                  <input type="number" placeholder="SUMAR/RESTAR $" style={{...inputStyle, textAlign: 'center', color: '#a78bfa'}} value={valorAjuste} onChange={e => setValorAjuste(Number(e.target.value))} />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ textAlign: 'right', marginBottom: '25px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#4ade80', fontWeight: '950' }}>TOTAL FINAL</p>
              <p style={{ margin: 0, fontSize: '42px', color: '#4ade80', fontWeight: '950' }}>${totalConDescuento.toLocaleString('es-CL')}</p>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              <input type="number" placeholder="ABONO $" style={{...inputStyle, textAlign: 'center'}} value={montoPagado} onChange={e => setMontoPagado(e.target.value)} />
              <select style={inputStyle} value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
              </select>
              <button type="submit" disabled={loading || carrito.length === 0} style={{ backgroundColor: '#4ade80', color: '#000', padding: '20px', borderRadius: '20px', fontWeight: '950', fontSize: '20px', border: 'none', cursor: 'pointer' }}>{loading ? '...' : 'FINALIZAR REGISTRO'}</button>
            </div>
          </div>

          <textarea style={{ ...inputStyle, marginTop: '25px', height: '100px', resize: 'none' }} placeholder="NOTAS" value={observaciones} onChange={e => setObservaciones(e.target.value)} />
        </form>
      </div>
    </main>
  )
}