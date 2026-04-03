'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Printer, Share2, ArrowLeft, Scissors, ReceiptText, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import * as htmlToImage from 'html-to-image'

export default function TicketPedido() {
  const { id } = useParams()
  const router = useRouter()
  const ticketRef = useRef<HTMLDivElement>(null)
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [compartiendo, setCompartiendo] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      // 1. Validar sesión
      if (!localStorage.getItem('user_role')) return router.push('/login')
      if (!id) return

      try {
        setLoading(true)
        // 2. Traer los datos por separado (INFALIBLE)
        const [pRes, dRes, pgRes, iRes] = await Promise.all([
          supabase.from('pedidos').select('*').eq('id', Number(id)).single(),
          supabase.from('detalles_pedido').select('*').eq('pedido_id', Number(id)),
          supabase.from('pagos').select('*').eq('pedido_id', Number(id)),
          supabase.from('inventario').select('id, nombre')
        ])

        if (pRes.data) {
          // 3. Traer el cliente específico
          const { data: cliente } = await supabase
            .from('clientes')
            .select('*')
            .eq('id', pRes.data.cliente_id)
            .single()

          // 4. Cruzar los datos a mano para evitar errores de relación de Supabase
          const detallesConNombre = dRes.data?.map(d => {
            const prod = iRes.data?.find(inv => inv.id === d.producto_id)
            return { ...d, p_nombre: prod?.nombre || 'Prenda' }
          })

          setPedido({
            ...pRes.data,
            clientes: cliente,
            detalles_pedido: detallesConNombre,
            pagos: pgRes.data || []
          })
        }
      } catch (err) {
        console.error("Error cargando ticket:", err)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [id, router])

  const exportarImagen = async () => {
    if (!ticketRef.current || !pedido) return
    setCompartiendo(true)
    try {
      // Ajuste de pixelRatio para que se vea nítido
      const dataUrl = await htmlToImage.toPng(ticketRef.current, { backgroundColor: '#fff', pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `Ticket_${pedido.clientes?.nombre || 'Venta'}_${id}.png`
      link.href = dataUrl
      link.click()
    } catch (err) { console.error(err) } finally { setCompartiendo(false) }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontWeight: '950' }}>
      GENERANDO TICKET...
    </div>
  )

  if (!pedido) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '20px', padding: '20px' }}>
      <div style={{ padding: '40px', textAlign: 'center', border: '4px solid #000', backgroundColor: '#fff', boxShadow: '8px 8px 0px #000' }}>
        <h2 style={{ fontWeight: '950', margin: 0 }}>PEDIDO NO ENCONTRADO</h2>
        <p style={{ fontWeight: '800', color: '#ef4444' }}>ID Buscado: {id}</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>Revisa que el pedido exista en Supabase.</p>
      </div>
      <button onClick={() => router.push('/pedidos')} style={{ padding: '12px 24px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>VOLVER ATRÁS</button>
    </div>
  )

  // CÁLCULOS DE TOTALES Y DESCUENTOS
  const subtotalProductos = pedido.detalles_pedido?.reduce((acc: number, d: any) => acc + (d.cantidad * d.precio_unitario), 0) || 0
  const descuentoManual = subtotalProductos - pedido.total_final
  const totalPagado = pedido.pagos?.reduce((acc: number, p: any) => acc + Number(p.monto), 0) || 0
  const saldoPendiente = pedido.total_final - totalPagado
  const fechaHoy = new Date(pedido.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const fechaEntrega = pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString('es-CL') : 'POR DEFINIR'

  // ESTILOS MONOCHROME THERMAL-FRIENDLY (TEXTO NEGRO)
  const containerStyle = { minHeight: '100vh', backgroundColor: '#e2e8f0', padding: '40px 20px', fontFamily: 'monospace', color: '#000' } // <- TEXTO NEGRO AQUÍ
  const ticketStyle = { maxWidth: '280px', margin: '0 auto', backgroundColor: '#fff', border: '2px solid #000', padding: '15px', color: '#000', position: 'relative' } // <- 75mm approx (280px)

  return (
    <main style={containerStyle}>
      <div className="no-print" style={{ maxWidth: '400px', margin: '0 auto 20px auto', display: 'flex', gap: '10px' }}>
        <button onClick={() => router.push('/pedidos')} style={{ flex: 1, padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>VOLVER</button>
        <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>LISTO</button>
        <button onClick={exportarImagen} style={{ flex: 1, padding: '12px', background: '#fbbf24', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>{compartiendo ? '...' : 'PNG'}</button>
      </div>

      <div ref={ticketRef} style={ticketStyle}>
        {/* ENCABEZADO PRO DON LUIS */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '15px', marginBottom: '15px' }}>
          <ReceiptText size={40} color="#000" style={{ marginBottom: '10px' }} />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '1000', letterSpacing: '-1px' }}>TALLER YOVI</h1>
          <p style={{ margin: '3px 0', fontSize: '10px', fontWeight: '800' }}>Calle Falsa 123, San Joaquín, Santiago</p>
          <div style={{ fontSize: '10px', fontWeight: '900', display: 'flex', justifyContent: 'center', gap: '5px' }}><Smartphone size={11} /> +569 8450 7104</div>
          <div style={{ fontSize: '10px', fontWeight: '900' }}>Instagram: @taller_yovi</div>
        </div>

        {/* DATOS DE LA VENTA */}
        <div style={{ fontSize: '11px', fontWeight: '800', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '10px', lineHeight: '1.3' }}>
          {/* ID formateado a #0001 */}
          <p style={{ margin: 0 }}><b>VENTA N° :</b> #{pedido.id.toString().padStart(4, '0')}</p>
          <p style={{ margin: 0 }}><b>FECHA    :</b> {fechaHoy}</p>
          <p style={{ margin: 0 }}><b>CLIENTE  :</b> {pedido.clientes?.nombre?.toUpperCase() || 'S/N'}</p>
          <p style={{ margin: 0 }}><b>COLEGIO  :</b> {pedido.colegio?.toUpperCase() || 'PARTICULAR'}</p>
        </div>

        {/* DETALLE DE ARTÍCULOS (TABLA MONOCHROME) */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000' }}>
              <th style={{ textAlign: 'left', padding: '5px 0' }}>PRENDA/TALLA</th>
              <th style={{ textAlign: 'right', padding: '5px 0' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles_pedido?.map((det: any, i: number) => (
              <tr key={i}>
                <td style={{ padding: '5px 0' }}>{det.cantidad}x {det.p_nombre} (T{det.talla})</td>
                <td style={{ textAlign: 'right', padding: '5px 0', fontWeight: '950' }}>${(det.cantidad * det.precio_unitario).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALES Y DESCUENTOS ( thermal ready) */}
        <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: '800', lineHeight: '1.4' }}>
          <p style={{ margin: 0 }}>SUBTOTAL VENTA: ${subtotalProductos.toLocaleString('es-CL')}</p>
          {descuentoManual > 0 && (
            <p style={{ margin: 0, color: '#ef4444' }}>DESCUENTO: -${descuentoManual.toLocaleString('es-CL')}</p> // <- DESCUENTO AQUÍ
          )}
          <div style={{ backgroundColor: '#f1f5f9', padding: '6px', border: '1px solid #000', marginTop: '5px' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '1000' }}>TOTAL A PAGAR: ${pedido.total_final.toLocaleString('es-CL')}</p>
            <p style={{ margin: 0 }}>ABONADO: ${totalPagado.toLocaleString('es-CL')}</p>
            <p style={{ margin: 0, fontWeight: '1000', color: saldoPendiente > 0 ? '#ef4444' : '#166534' }}>SALDO: ${saldoPendiente.toLocaleString('es-CL')}</p>
          </div>
        </div>

        <div style={{ borderTop: '2px dashed #000', margin: '15px 0' }}></div>

        {/* PIE DE PÁGINA */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ backgroundColor: '#000', color: '#fff', padding: '8px', fontWeight: '1000', marginBottom: '12px', fontSize: '13px', letterSpacing: '1px' }}>
            ENTREGA: {fechaEntrega}
          </div>
          <p style={{ fontSize: '10px', fontWeight: '950', margin: 0 }}>*** GRACIAS POR SU COMPRA ***</p>
          <p style={{ fontSize: '9px', marginTop: '5px' }}>COMPROBANTE DE VENTA INTERNA</p>
        </div>
      </div>

      <style jsx global>{` @media print { .no-print { display: none !important; } body, main { background-color: #fff !important; padding: 0 !important; } } `}</style>
    </main>
  )
}