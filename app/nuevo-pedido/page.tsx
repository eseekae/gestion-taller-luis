'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, User, Phone, IdCard, School, Calendar, 
  ShoppingBag, Plus, X, CheckCircle, MessageSquare, 
  Rocket, Clock, AlertCircle, Tag, Percent, Minus, Banknote, Edit3, History,
  PackageOpen // AÑADIDO PARA EL BOTÓN PARCIAL
} from 'lucide-react'

export default function RegistroPedido() {
  const router = useRouter()
  const [usuarioActivo, setUsuarioActivo] = useState('')
  const [inventario, setInventario] = useState<any[]>([])
  const [listaColegios, setListaColegios] = useState<any[]>([])
  const [carrito, setCarrito] = useState<any[]>([])
  
  // MODIFICACIÓN: Agregado el estado 'parcial' a los tipos de entrega
  const [tipoEntrega, setTipoEntrega] = useState<'agendada' | 'inmediata' | 'antiguo' | 'parcial'>('agendada')
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split('T')[0])

  const [fechaIngresoAntiguo, setFechaIngresoAntiguo] = useState('')
  const [fechaEntregaAntiguo, setFechaEntregaAntiguo] = useState('')

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
    // 🛡️ BLOQUEO DE SEGURIDAD
    if (!localStorage.getItem('user_role')) {
      router.push('/login')
      return
    }

    setUsuarioActivo(localStorage.getItem('user_name') || 'Don Luis')
    const fetch = async () => {
      const { data: inv } = await supabase.from('inventario').select('*').order('nombre')
      if (inv) {
        setInventario(inv)
      }
      const { data: col } = await supabase.from('colegios').select('*').order('nombre')
      if (col) {
        setListaColegios(col)
        if (col.length > 0) setColegio(col[0].nombre)
      }
    }
    fetch()
  }, [router])

  const formatMontoInput = (val: string | number) => {
    const raw = val.toString().replace(/\D/g, '')
    if (!raw) return ''
    return `$${Number(raw).toLocaleString('es-CL')}`
  }

  const formatFechaTexto = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8); 
    if (raw.length >= 5) return `${raw.slice(0,2)}/${raw.slice(2,4)}/${raw.slice(4)}`;
    if (raw.length >= 3) return `${raw.slice(0,2)}/${raw.slice(2)}`;
    return raw;
  }

  const productosUnicos = useMemo(() => {
    const filtrados = inventario.filter(i => i.colegio === colegio)
    return Array.from(new Set(filtrados.map(i => i.nombre)))
  }, [inventario, colegio])

  const tallasDeInventario = useMemo(() => {
    const ordenPrioridad: { [key: string]: number } = {
      '4': 1, '5': 2, '6': 3, '8': 4, '10': 5, '12': 6, '14': 7, '16': 8,
      'S': 9, 'M': 10, 'L': 11, 'XL': 12, '2XL': 13, '3XL': 14
    }

    return inventario
      .filter(i => i.colegio === colegio && i.nombre === nombreSeleccionado)
      .sort((a, b) => (ordenPrioridad[a.talla?.trim()] || 99) - (ordenPrioridad[b.talla?.trim()] || 99))
  }, [colegio, nombreSeleccionado, inventario])

  useEffect(() => {
    if (productosUnicos.length > 0) {
      if (!productosUnicos.includes(nombreSeleccionado)) {
        setNombreSeleccionado(productosUnicos[0])
      }
    } else {
      setNombreSeleccionado('')
    }
  }, [colegio, productosUnicos])

  useEffect(() => {
    if (tallasDeInventario.length > 0) {
      if (!tallasDeInventario.find(t => t.talla === tallaSeleccionada)) {
        setTallaSeleccionada(tallasDeInventario[0].talla)
      }
    } else {
      setTallaSeleccionada('')
    }
  }, [nombreSeleccionado, tallasDeInventario])

  const agregarAlCarrito = () => {
    const cantLimpia = cantidad.toString().replace(/\D/g, '')
    if (cantLimpia === '' || Number(cantLimpia) <= 0) {
      return alert("Tienes que ingresar una cantidad válida antes de añadir al pedido.")
    }

    let item; let precio;
    if (tallaSeleccionada === 'ESPECIAL') {
      const rawPrecio = precioManualEspecial.toString().replace(/\D/g, '')
      if (!rawPrecio) return alert("Ingresa el precio para la talla especial")
      precio = Number(rawPrecio)
      item = { id_inv: tallasDeInventario[0]?.id, nombre: nombreSeleccionado, talla: 'ESPECIAL', precio, cantidad: Number(cantLimpia) }
    } else {
      const invItem = inventario.find(i => i.colegio === colegio && i.nombre === nombreSeleccionado && i.talla === tallaSeleccionada)
      precio = Number(invItem?.precio_base || 0)
      item = { id_inv: invItem?.id, nombre: nombreSeleccionado, talla: tallaSeleccionada, precio, cantidad: Number(cantLimpia) }
    }
    
    if (!item.id_inv && tallaSeleccionada !== 'ESPECIAL') return alert("Error al identificar el producto.")
    
    // MODIFICACIÓN: Se inyecta 'entregados: 0' por defecto para controlar la entrega parcial
    setCarrito([...carrito, { ...item, entregados: 0, tempId: Date.now() }])
    setPrecioManualEspecial('')
    setCantidad('')
  }

  const quitarDelCarrito = (id: number) => setCarrito(carrito.filter(c => c.tempId !== id))
  
  const editarPrecioCarrito = (id: number, precioActual: number) => {
    const nuevo = prompt('Ingresa el precio unitario histórico para este artículo:', precioActual.toString())
    if (nuevo === null) return 
    const precioLimpio = Number(nuevo.replace(/\D/g, ''))
    if (precioLimpio >= 0) {
      setCarrito(carrito.map(c => c.tempId === id ? { ...c, precio: precioLimpio } : c))
    }
  }

  // NUEVA FUNCIÓN: Actualiza el mini contador de "Entregados Hoy" en el carrito
  const actualizarEntregados = (id: number, delta: number) => {
    setCarrito(carrito.map(c => {
      if (c.tempId === id) {
        const nuevoVal = (c.entregados || 0) + delta;
        if (nuevoVal >= 0 && nuevoVal <= c.cantidad) {
          return { ...c, entregados: nuevoVal };
        }
      }
      return c;
    }))
  }
  
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
    
    let finalFechaIngreso = fechaIngreso;
    let finalFechaEntrega = fechaEntrega;

    if (tipoEntrega === 'antiguo') {
      if (fechaIngresoAntiguo.length !== 10) return alert("La fecha de ingreso debe tener el formato completo DD/MM/AAAA.");
      if (fechaEntregaAntiguo.length !== 10) return alert("La fecha de entrega debe tener el formato completo DD/MM/AAAA.");
      
      const [dI, mI, yI] = fechaIngresoAntiguo.split('/');
      const [dE, mE, yE] = fechaEntregaAntiguo.split('/');
      
      finalFechaIngreso = `${yI}-${mI}-${dI}`;
      finalFechaEntrega = `${yE}-${mE}-${dE}`;
    } else if ((tipoEntrega === 'agendada' || tipoEntrega === 'parcial') && !fechaEntrega) {
      return alert("Selecciona una fecha de entrega")
    }
    
    const pagoFinal = Number(montoPagado.toString().replace(/\D/g, ''))
    
    if (pagoFinal > totalConDescuento) {
      return alert(`No puedes abonar más del total de la venta ($${totalConDescuento.toLocaleString('es-CL')})`)
    }

    setLoading(true)
    try {
      const telefonoCompleto = `+569${telefono}`
      const { data: cli, error: cliError } = await supabase.from('clientes').insert([{ nombre: nombreCliente, telefono: telefonoCompleto, rut }]).select().single()
      if (cliError || !cli) throw new Error(`Error cliente: ${cliError?.message}`)
      
      // MODIFICACIÓN: Lógica de estados para el pedido principal
      const estadoPedido = (tipoEntrega === 'inmediata' || tipoEntrega === 'antiguo') ? 'Completado' : 'Pendiente'
      const fechaFinalEntregaDB = tipoEntrega === 'inmediata' ? new Date().toISOString().split('T')[0] : finalFechaEntrega
      
      let obsFinal = observaciones + (descuentoFinal > 0 ? ` [Dscto: $${descuentoFinal.toLocaleString()}]` : '') + (valorAjuste !== 0 ? ` [Ajuste: $${valorAjuste.toLocaleString()}]` : '')
      if (tipoEntrega === 'antiguo') {
        obsFinal = `[PEDIDO ANTIGUO] ` + obsFinal
      } else if (tipoEntrega === 'parcial') {
        obsFinal = `[ENTREGA PARCIAL] ` + obsFinal
      }

      const payloadPedido: any = {
        cliente_id: cli.id, total_final: totalConDescuento, estado: estadoPedido,
        colegio: colegio || 'Particular', fecha_entrega: fechaFinalEntregaDB,
        observaciones: obsFinal,
        creado_por: usuarioActivo
      }
      
      if (tipoEntrega === 'antiguo' && finalFechaIngreso) {
        payloadPedido.created_at = `${finalFechaIngreso}T12:00:00Z`
      }

      const { data: ped, error: pedError } = await supabase.from('pedidos').insert([payloadPedido]).select().single()
      
      if (pedError || !ped) throw new Error(`Error pedido: ${pedError?.message}`)
      
      // MODIFICACIÓN: Cálculo dinámico de lo entregado vs pendiente según el nuevo tipo
      const detalles = carrito.map(item => {
        const cantEntregada = (tipoEntrega === 'inmediata' || tipoEntrega === 'antiguo') 
          ? item.cantidad 
          : (tipoEntrega === 'parcial' ? (item.entregados || 0) : 0);

        return {
          pedido_id: ped.id, producto_id: item.id_inv, cantidad: item.cantidad, 
          cantidad_entregada: cantEntregada, 
          talla: item.talla, precio_unitario: item.precio, 
          estado: cantEntregada === item.cantidad ? 'Entregado' : 'Pendiente'
        }
      })
      await supabase.from('detalles_pedido').insert(detalles)
      
      if (pagoFinal > 0) {
        await supabase.from('pagos').insert([{
          pedido_id: ped.id, monto: pagoFinal, 
          fecha_pago: tipoEntrega === 'antiguo' ? finalFechaIngreso : new Date().toISOString().split('T')[0], 
          metodo_pago: metodoPago, creado_por: usuarioActivo
        }])
      }
      
      // MODIFICACIÓN: Lógica mixta de RPCs para descontar stock físico vs reservar stock
      for (const item of carrito) {
        if (item.id_inv && tipoEntrega !== 'antiguo') {
          if (tipoEntrega === 'inmediata') {
            await supabase.rpc('entregar_stock', { prod_id: item.id_inv, cant: item.cantidad })
          } else if (tipoEntrega === 'agendada') {
            await supabase.rpc('reservar_stock', { prod_id: item.id_inv, cant: item.cantidad })
          } else if (tipoEntrega === 'parcial') {
            const cantEntregada = item.entregados || 0;
            const cantPendiente = item.cantidad - cantEntregada;
            
            // Lo que se lleva hoy, se descuenta de inmediato
            if (cantEntregada > 0) {
              await supabase.rpc('entregar_stock', { prod_id: item.id_inv, cant: cantEntregada })
            }
            // Lo que falta, se manda a reserva (taller)
            if (cantPendiente > 0) {
              await supabase.rpc('reservar_stock', { prod_id: item.id_inv, cant: cantPendiente })
            }
          }
        }
      }
      
      await registrarLog(`${usuarioActivo} creó venta ${tipoEntrega.toUpperCase()} de $${totalConDescuento}`, `Pedido #${ped.id}`)
      alert(`✅ Venta registrada correctamente como Pedido #${ped.id}`); 
      router.push('/pedidos')
    } catch (err: any) { alert(err.message) }
    finally { setLoading(false) }
  }

  const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '28px', border: '4px solid #000', boxShadow: '8px 8px 0px #000', marginBottom: '24px' }
  const inputStyle = { width: '100%', padding: '16px', border: '3px solid #000', borderRadius: '16px', fontSize: '16px', fontWeight: '800', color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' as const, outline: 'none' }
  const labelStyle = { fontSize: '11px', fontWeight: '950', color: '#000', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
      backgroundSize: '32px 32px',
      padding: '30px 15px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <motion.button whileTap={{ scale: 0.9 }} type="button" onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '14px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}>
            <ArrowLeft size={22} color="#000" />
          </motion.button>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '950', color: '#000', letterSpacing: '-1px' }}>NUEVA VENTA</h1>
        </motion.div>

        <form onSubmit={guardar}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={cardStyle}>
            <label style={labelStyle}><Rocket size={16} /> Prioridad de Pedido</label>
            {/* MODIFICACIÓN: Grilla 2x2 para acomodar el 4to botón de Parcial */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px', marginBottom: (tipoEntrega !== 'inmediata') ? '15px' : '0' }}>
              <motion.button type="button" onClick={() => setTipoEntrega('agendada')} style={{ padding: '12px', borderRadius: '16px', border: '4px solid #000', fontWeight: '900', color: '#000', fontSize: '11px', backgroundColor: tipoEntrega === 'agendada' ? '#fbbf24' : '#fff', boxShadow: tipoEntrega === 'agendada' ? 'inset 3px 3px 0px rgba(0,0,0,0.1)' : '3px 3px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                <Clock size={16} /> AGENDAR
              </motion.button>
              <motion.button type="button" onClick={() => setTipoEntrega('inmediata')} style={{ padding: '12px', borderRadius: '16px', border: '4px solid #000', fontWeight: '900', color: '#000', fontSize: '11px', backgroundColor: tipoEntrega === 'inmediata' ? '#4ade80' : '#fff', boxShadow: tipoEntrega === 'inmediata' ? 'inset 3px 3px 0px rgba(0,0,0,0.1)' : '3px 3px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                <CheckCircle size={16} /> INMEDIATA
              </motion.button>
              <motion.button type="button" onClick={() => setTipoEntrega('parcial')} style={{ padding: '12px', borderRadius: '16px', border: '4px solid #000', fontWeight: '900', color: '#000', fontSize: '11px', backgroundColor: tipoEntrega === 'parcial' ? '#a78bfa' : '#fff', boxShadow: tipoEntrega === 'parcial' ? 'inset 3px 3px 0px rgba(0,0,0,0.1)' : '3px 3px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                <PackageOpen size={16} /> PARCIAL
              </motion.button>
              <motion.button type="button" onClick={() => setTipoEntrega('antiguo')} style={{ padding: '12px', borderRadius: '16px', border: '4px solid #000', fontWeight: '900', color: '#000', fontSize: '11px', backgroundColor: tipoEntrega === 'antiguo' ? '#cbd5e1' : '#fff', boxShadow: tipoEntrega === 'antiguo' ? 'inset 3px 3px 0px rgba(0,0,0,0.1)' : '3px 3px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                <History size={16} /> ANTIGUO
              </motion.button>
            </div>
            <AnimatePresence>
              {(tipoEntrega === 'agendada' || tipoEntrega === 'parcial') && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <label style={labelStyle}><Calendar size={16} /> Fecha de Entrega Prometida</label>
                  <input type="date" style={inputStyle} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} required={tipoEntrega === 'agendada' || tipoEntrega === 'parcial'} />
                </motion.div>
              )}
              {tipoEntrega === 'antiguo' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={labelStyle}><Calendar size={16} /> F. Ingreso</label>
                      <input 
                        type="text" 
                        style={inputStyle} 
                        value={fechaIngresoAntiguo} 
                        onChange={e => setFechaIngresoAntiguo(formatFechaTexto(e.target.value))} 
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        required={tipoEntrega === 'antiguo'} 
                      />
                    </div>
                    <div>
                      <label style={labelStyle}><CheckCircle size={16} /> F. Entregado</label>
                      <input 
                        type="text" 
                        style={inputStyle} 
                        value={fechaEntregaAntiguo} 
                        onChange={e => setFechaEntregaAntiguo(formatFechaTexto(e.target.value))} 
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        required={tipoEntrega === 'antiguo'} 
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '900', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> ESTE PEDIDO NO AFECTARÁ EL INVENTARIO</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={cardStyle}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '950', color: '#000', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="#3b82f6" /> FICHA CLIENTE
            </h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Nombre Completo</label>
                <input required style={inputStyle} value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} placeholder="Ej: Eduardo Vargas" />
              </div>
              <div>
                <label style={labelStyle}><IdCard size={14} /> R.U.T</label>
                <input style={inputStyle} value={rut} onChange={e => setRut(e.target.value)} placeholder="12.345.678-9" />
              </div>
              <div>
                <label style={labelStyle}><Phone size={14} /> Teléfono Móvil</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ padding: '16px 10px', border: '3px solid #000', borderRadius: '16px', fontSize: '14px', fontWeight: '950', backgroundColor: '#e2e8f0', color: '#000', display: 'flex', alignItems: 'center' }}>+569</div>
                  <input 
                    required 
                    type="tel" 
                    maxLength={8} 
                    style={inputStyle} 
                    value={telefono} 
                    onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 8))} 
                    placeholder="87654321"
                  />
                </div>
                {telefono.length > 0 && telefono.length < 8 && (
                  <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '900', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> FALTAN {8 - telefono.length} NÚMEROS
                  </p>
                )}
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
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '950', color: '#000', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={20} color="#f472b6" /> PRENDAS
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <select style={inputStyle} value={nombreSeleccionado} onChange={e => setNombreSeleccionado(e.target.value)}>
                {productosUnicos.length > 0 ? (
                  productosUnicos.map(n => <option key={n} value={n}>{n}</option>)
                ) : (
                  <option disabled>Selecciona un colegio con inventario</option>
                )}
              </select>
              <input 
                type="number" 
                placeholder="CANT." 
                style={{...inputStyle, textAlign: 'center'}} 
                value={cantidad} 
                onChange={e => setCantidad(e.target.value === '' ? '' : Number(e.target.value.replace(/\D/g, '')))} 
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <select style={inputStyle} value={tallaSeleccionada} onChange={e => setTallaSeleccionada(e.target.value)}>
                {tallasDeInventario.map(t => <option key={t.id} value={t.talla}>{t.talla} (${Number(t.precio_base).toLocaleString()})</option>)}
                <option value="ESPECIAL">✨ TALLA ESPECIAL</option>
              </select>
              {tallaSeleccionada === 'ESPECIAL' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '12px' }}>
                  <label style={labelStyle}><Banknote size={14} /> Precio Acordado ($)</label>
                  <input 
                    type="text" 
                    style={{...inputStyle, borderColor: '#f472b6'}} 
                    placeholder="Valor especial" 
                    value={formatMontoInput(precioManualEspecial)} 
                    onChange={e => setPrecioManualEspecial(e.target.value.replace(/\D/g, ''))} 
                  />
                </motion.div>
              )}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={agregarAlCarrito} type="button" style={{ width: '100%', backgroundColor: '#000', color: '#fff', border: 'none', padding: '18px', borderRadius: '18px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
              <Plus size={22} /> AÑADIR
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {carrito.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ ...cardStyle, background: '#fff', borderStyle: 'dashed' }}>
                <p style={labelStyle}>Artículos en Carrito</p>
                {carrito.map((item) => (
                  <div key={item.tempId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '900', color: '#000', fontSize: '15px' }}>{item.nombre}</p>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#64748b' }}>{item.cantidad}x Talla {item.talla}</p>
                      
                      {/* MODIFICACIÓN: Pequeño panel de control si es entrega PARCIAL */}
                      {tipoEntrega === 'parcial' && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '8px', width: 'fit-content', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '11px', fontWeight: '950', color: '#000' }}>ENTREGAR HOY:</span>
                          <button type="button" onClick={() => actualizarEntregados(item.tempId, -1)} style={{ background: '#fff', border: '2px solid #000', borderRadius: '6px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', cursor: 'pointer' }}>-</button>
                          <span style={{ fontSize: '13px', fontWeight: '950', color: '#a78bfa' }}>{item.entregados || 0}</span>
                          <button type="button" onClick={() => actualizarEntregados(item.tempId, 1)} style={{ background: '#fff', border: '2px solid #000', borderRadius: '6px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', cursor: 'pointer' }}>+</button>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '950', color: '#000', fontSize: '16px', display: 'block' }}>${(item.precio * item.cantidad).toLocaleString()}</span>
                        <button type="button" onClick={() => editarPrecioCarrito(item.tempId, item.precio)} style={{ color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: '900', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '2px' }}><Edit3 size={12} /> MODIFICAR</button>
                      </div>
                      <button type="button" onClick={() => quitarDelCarrito(item.tempId)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={22} /></button>
                    </div>
                  </div>
                ))}
                
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '4px solid #000', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#64748b' }}>SUBTOTAL PRENDAS</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '950', color: '#000' }}>${totalOriginal.toLocaleString('es-CL')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ backgroundColor: '#000', color: '#fff', padding: '24px', borderRadius: '32px', border: '4px solid #000', boxShadow: '8px 8px 0px #3b82f6' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <motion.button type="button" onClick={() => setMostrarDescuento(!mostrarDescuento)} style={{ width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: '2px solid #fff', padding: '12px', borderRadius: '14px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontSize: '12px' }}>
                <Tag size={16} /> DESC.
              </motion.button>
              <motion.button type="button" onClick={() => setMostrarAjuste(!mostrarAjuste)} style={{ width: '100%', backgroundColor: '#a78bfa', color: '#fff', border: '2px solid #fff', padding: '12px', borderRadius: '14px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontSize: '12px' }}>
                <Edit3 size={16} /> AJUSTE
              </motion.button>
            </div>

            <AnimatePresence>
              {mostrarDescuento && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ marginBottom: '20px', padding: '15px', border: '2px dashed #fff', borderRadius: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <button type="button" onClick={() => setTipoDescuento('monto')} style={{ padding: '10px', borderRadius: '10px', border: '2px solid #fff', fontWeight: '900', background: tipoDescuento === 'monto' ? '#fff' : 'transparent', color: tipoDescuento === 'monto' ? '#000' : '#fff', fontSize: '11px' }}>$ PESOS</button>
                    <button type="button" onClick={() => setTipoDescuento('porcentaje')} style={{ padding: '10px', borderRadius: '10px', border: '2px solid #fff', fontWeight: '900', background: tipoDescuento === 'porcentaje' ? '#fff' : 'transparent', color: tipoDescuento === 'porcentaje' ? '#000' : '#fff', fontSize: '11px' }}>% PORC.</button>
                  </div>
                  <input type="number" style={{ ...inputStyle, textAlign: 'center' }} value={valorDescuento} onChange={(e) => setValorDescuento(Number(e.target.value))} placeholder="0" />
                </motion.div>
              )}
              {mostrarAjuste && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ marginBottom: '20px', padding: '15px', border: '2px dashed #a78bfa', borderRadius: '20px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '900', color: '#fff', marginBottom: '8px', display: 'block' }}>AJUSTE AL TOTAL ($)</label>
                   <input type="number" placeholder="Ej: -2000 o 500" style={{ ...inputStyle, textAlign: 'center', color: '#a78bfa' }} value={valorAjuste} onChange={(e) => setValorAjuste(Number(e.target.value))} />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '950', color: '#4ade80' }}>PRECIO FINAL</p>
              <p style={{ margin: 0, fontSize: '42px', fontWeight: '950', color: '#4ade80', lineHeight: '1' }}>${totalConDescuento.toLocaleString('es-CL')}</p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ color: '#fff', fontSize: '11px', fontWeight: '950', marginBottom: '5px', display: 'block' }}>ABONO RECIBIDO ($)</label>
                <input 
                  type="text" 
                  style={{ ...inputStyle, textAlign: 'center' }} 
                  value={formatMontoInput(montoPagado)} 
                  onChange={e => setMontoPagado(e.target.value.replace(/\D/g, ''))} 
                  placeholder="$0"
                />
              </div>
              <div>
                <label style={{ color: '#fff', fontSize: '11px', fontWeight: '950', marginBottom: '5px', display: 'block' }}>MÉTODO</label>
                <select style={inputStyle} value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                  <option value="Transferencia">Transferencia</option><option value="Efectivo">Efectivo</option>
                  <option value="Débito">Débito</option><option value="Crédito">Crédito</option>
                </select>
              </div>
              <motion.button type="submit" disabled={loading || carrito.length === 0} style={{ width: '100%', backgroundColor: '#4ade80', color: '#000', border: '3px solid #000', padding: '20px', borderRadius: '20px', fontWeight: '950', fontSize: '20px', cursor: 'pointer' }}>
                {loading ? '...' : 'FINALIZAR'}
              </motion.button>
            </div>
          </motion.div>

          <div style={{ marginTop: '25px', marginBottom: '40px' }}>
            <label style={labelStyle}><MessageSquare size={16} /> Notas</label>
            <textarea placeholder="Ej: Bordado especial..." style={{ ...inputStyle, height: '80px', resize: 'none' }} value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>
        </form>
      </div>
    </main>
  )
}