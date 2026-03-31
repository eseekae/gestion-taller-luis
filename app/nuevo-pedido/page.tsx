'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Phone, IdCard, School, Calendar, ShoppingBag, Plus, X, CreditCard, CheckCircle, MessageSquare } from 'lucide-react'

export default function RegistroPedido() {
  const router = useRouter()
  const [usuarioActivo, setUsuarioActivo] = useState('')
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
  const [observaciones, setObservaciones] = useState('') // NUEVA VARIABLE
  
  const [abono, setAbono] = useState('')
  const [metodoPagoInicial, setMetodoPagoInicial] = useState('Transferencia')
  const [fechaPagoInicial, setFechaPagoInicial] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUsuarioActivo(sessionStorage.getItem('user_name') || '')
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
      
      // INSERTAMOS CON LA NUEVA COLUMNA OBSERVACIONES
      const { data: ped } = await supabase.from('pedidos').insert([{
        cliente_id: cli.id, 
        total_final: totalCalculado, 
        abono: 0, 
        estado: 'Pendiente',
        colegio: colegio || 'Particular', 
        fecha_entrega: fechaEntrega || null,
        observaciones: observaciones, // SE GUARDA AQUÍ
        creado_por: sessionStorage.getItem('user_name') || ''
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
          metodo_pago: metodoPagoInicial,
          creado_por: sessionStorage.getItem('user_name') || ''
        }])
      }

      await registrarLog(
        `${sessionStorage.getItem('user_name') || 'Usuario'} creó el pedido de ${nombreCliente}`,
        `Pedido ${ped.id} - Obs: ${observaciones.substring(0, 20)}...`
      )

      for (const item of carrito) {
        if (item.id_inv) await supabase.rpc('reservar_stock', { prod_id: item.id_inv, cant: item.cantidad })
      }

      alert("✅ Venta registrada con éxito."); router.push('/pedidos')
    } catch (err: any) { alert(err.message) }
    finally { setLoading(false) }
  }

  // ESTILOS DE ALTO CONTRASTE (NEUBRUTALISM)
  const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '3px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '20px' }
  const inputStyle = { width: '100%', padding: '12px 16px', border: '3px solid #000', borderRadius: '12px', fontSize: '15px', color: '#000', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '12px', fontWeight: '900', color: '#000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' as const }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', color: '#000', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#000' }}>Nueva Venta</h1>
          </div>
        </div>

        <form onSubmit={guardar}>
          
          {/* DATOS DEL CLIENTE */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> Información del Cliente
            </h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nombre Completo</label>
                <input required style={inputStyle} value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}><IdCard size={14} /> RUT</label>
                  <input style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}><Phone size={14} /> Teléfono</label>
                  <input required style={inputStyle} value={telefono} onChange={e => setTelefono(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}><School size={14} /> Colegio</label>
                  <input style={inputStyle} value={colegio} onChange={e => setColegio(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}><Calendar size={14} /> Entrega</label>
                  <input type="date" style={inputStyle} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} />
                </div>
              </div>

              {/* CAMPO DE OBSERVACIONES */}
              <div>
                <label style={labelStyle}><MessageSquare size={14} /> Observaciones (Don Luis)</label>
                <textarea 
                  style={{ ...inputStyle, height: '80px', resize: 'none', fontFamily: 'sans-serif' }} 
                  placeholder="Ej: Entregar en portería..." 
                  value={observaciones} 
                  onChange={e => setObservaciones(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SELECCIÓN PRENDAS */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} /> Productos
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <select style={inputStyle} value={nombreSeleccionado} onChange={e => setNombreSeleccionado(e.target.value)}>
                {productosUnicos.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <input type="number" min="1" style={inputStyle} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <select style={inputStyle} value={tallaSeleccionada} onChange={e => setTallaSeleccionada(e.target.value)}>
                {tallasDeInventario.map(t => <option key={t.id} value={t.talla}>{t.talla} (${Number(t.precio_base).toLocaleString()})</option>)}
                <option value="ESPECIAL">✨ Talla Especial</option>
              </select>
              {tallaSeleccionada === 'ESPECIAL' && (
                <input type="number" placeholder="Precio $" style={{ ...inputStyle, marginTop: '12px', border: '3px solid #3b82f6' }} value={precioManualEspecial} onChange={e => setPrecioManualEspecial(e.target.value)} />
              )}
            </div>
            <button onClick={agregarAlCarrito} type="button" style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Plus size={18} /> AGREGAR AL CARRITO
            </button>
          </div>

          {/* RESUMEN */}
          {carrito.length > 0 && (
            <div style={{ ...cardStyle, background: '#f0fdf4' }}>
              <h3 style={labelStyle}>Resumen</h3>
              {carrito.map((item) => (
                <div key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #000' }}>
                  <span style={{ fontWeight: '800' }}>{item.cantidad}x {item.nombre} ({item.talla})</span>
                  <button onClick={() => quitarDelCarrito(item.tempId)} style={{ color: 'red', border: 'none', background: 'none', fontWeight: '900' }}>X</button>
                </div>
              ))}
            </div>
          )}

          {/* TOTAL Y PAGO */}
          <div style={{ backgroundColor: '#000', color: '#fff', padding: '30px', borderRadius: '24px', border: '3px solid #000', boxShadow: '8px 8px 0px #3b82f6' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '900' }}>TOTAL</p>
            <p style={{ margin: '0 0 20px 0', fontSize: '36px', fontWeight: '900', color: '#4ade80' }}>${totalCalculado.toLocaleString('es-CL')}</p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}>ABONO INICIAL $</label>
              <input type="number" style={{ ...inputStyle, background: '#fff', marginTop: '5px' }} value={abono} onChange={e => setAbono(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '16px', borderRadius: '14px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: '4px 4px 0px #fff' }}>
              {loading ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}