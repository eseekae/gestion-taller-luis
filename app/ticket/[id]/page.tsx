'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Printer, ArrowLeft, ReceiptText, Smartphone, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TicketPedido() {
  const { id } = useParams()
  const router = useRouter()
  const ticketRef = useRef<HTMLDivElement>(null)
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      if (!localStorage.getItem('user_role')) return router.push('/login')
      if (!id) return

      try {
        setLoading(true)
        const [pRes, dRes, pgRes, iRes] = await Promise.all([
          supabase.from('pedidos').select('*').eq('id', Number(id)).single(),
          supabase.from('detalles_pedido').select('*').eq('pedido_id', Number(id)),
          supabase.from('pagos').select('*').eq('pedido_id', Number(id)),
          supabase.from('inventario').select('id, nombre')
        ])

        if (pRes.data) {
          const { data: cliente } = await supabase.from('clientes').select('*').eq('id', pRes.data.cliente_id).single()
          const detallesConNombre = dRes.data?.map(d => {
            const prod = iRes.data?.find(inv => inv.id === d.producto_id)
            return { ...d, p_nombre: prod?.nombre || 'Prenda' }
          })

          setPedido({ ...pRes.data, clientes: cliente, detalles_pedido: detallesConNombre, pagos: pgRes.data || [] })
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    cargarDatos()
  }, [id, router])

  // FUNCIÓN MAESTRA PARA COMPARTIR (Abre el menú nativo del celu)
  const compartirTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket Venta #${id} - Creaciones Yovi`,
          text: `Hola ${pedido.clientes.nombre}, aquí tienes el comprobante de tu pedido en Creaciones Yovi.`,
          url: window.location.href, // Comparte el link directo al ticket
        })
      } catch (err) {
        console.log('Error al compartir o el usuario canceló');
      }
    } else {
      alert("Tu navegador no soporta la función de compartir nativa. Copia el link manualmente.")
    }
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontWeight: '950', color: '#000' }}>GENERANDO TICKET...</div>
  if (!pedido) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '950', color: '#000' }}>PEDIDO NO ENCONTRADO</div>

  const subtotalProductos = pedido.detalles_pedido?.reduce((acc: number, d: any) => acc + (d.cantidad * d.precio_unitario), 0) || 0
  const descuentoManual = subtotalProductos - pedido.total_final
  const totalPagado = pedido.pagos?.reduce((acc: number, p: any) => acc + Number(p.monto), 0) || 0
  const saldoPendiente = pedido.total_final - totalPagado
  const fechaHoy = new Date(pedido.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#e2e8f0', padding: '20px', fontFamily: 'monospace', color: '#000' }}>
      
      {/* BOTONES DE ACCIÓN */}
      <div className="no-print" style={{ maxWidth: '400px', margin: '0 auto 20px auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => router.push('/pedidos')} style={{ padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          <ArrowLeft size={18} /> VOLVER
        </button>
        <button onClick={() => window.print()} style={{ padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          <Printer size={18} /> IMPRIMIR
        </button>
        
        {/* BOTÓN COMPARTIR UNIFICADO */}
        <button onClick={compartirTicket} style={{ gridColumn: 'span 2', padding: '15px', background: '#3b82f6', color: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          <Share2 size={20} /> COMPARTIR CON APLICACIONES
        </button>
      </div>

      {/* DISEÑO TICKET 75mm (BLACK ON WHITE) */}
      <div ref={ticketRef} style={{ maxWidth: '280px', margin: '0 auto', backgroundColor: '#ffffff', border: '2px solid #000', padding: '15px', color: '#000' }}>
        
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <ReceiptText size={35} color="#000" style={{ marginBottom: '5px' }} />
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '1000' }}>Creaciones YOVI</h1>
          <p style={{ margin: '2px 0', fontSize: '10px', fontWeight: '900' }}>Dirección: </p>
          <p style={{ margin: '2px 0', fontSize: '10px', fontWeight: '900' }}>WA: +569 | IG: @</p>
        </div>

        <div style={{ fontSize: '10px', fontWeight: '900', borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '8px' }}>
          <p style={{ margin: 0 }}><b>VENTA N° :</b> #{pedido.id.toString().padStart(4, '0')}</p>
          <p style={{ margin: 0 }}><b>FECHA    :</b> {fechaHoy}</p>
          <p style={{ margin: 0 }}><b>CLIENTE  :</b> {pedido.clientes?.nombre?.toUpperCase()}</p>
          <p style={{ margin: 0 }}><b>COLEGIO  :</b> {pedido.colegio?.toUpperCase()}</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #000' }}>
              <th style={{ textAlign: 'left', padding: '4px 0' }}>PRENDA</th>
              <th style={{ textAlign: 'right', padding: '4px 0' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles_pedido?.map((det: any, i: number) => (
              <tr key={i}>
                <td style={{ padding: '4px 0' }}>{det.cantidad}x {det.p_nombre} (T{det.talla})</td>
                <td style={{ textAlign: 'right', padding: '4px 0', fontWeight: '950' }}>${(det.cantidad * det.precio_unitario).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', fontSize: '10px', fontWeight: '950' }}>
          <p style={{ margin: 0 }}>SUBTOTAL: ${subtotalProductos.toLocaleString('es-CL')}</p>
          {descuentoManual > 0 && <p style={{ margin: 0 }}>DESCUENTO: -${descuentoManual.toLocaleString('es-CL')}</p>}
          <div style={{ border: '1px solid #000', padding: '5px', marginTop: '5px', background: '#f8fafc' }}>
            <p style={{ margin: 0, fontSize: '12px' }}>TOTAL: ${pedido.total_final.toLocaleString('es-CL')}</p>
            <p style={{ margin: 0 }}>PAGADO: ${totalPagado.toLocaleString('es-CL')}</p>
            <p style={{ margin: 0, fontWeight: '1000', color: saldoPendiente > 0 ? '#000' : '#000' }}>
               SALDO PENDIENTE: ${saldoPendiente.toLocaleString('es-CL')}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '15px', borderTop: '2px dashed #000', paddingTop: '10px' }}>
          <p style={{ fontSize: '9px', fontWeight: '950', margin: 0 }}>ENTREGA: {pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString('es-CL') : 'A CONVENIR'}</p>
          <p style={{ fontSize: '9px', fontWeight: '950', marginTop: '5px' }}>*** COMPROBANTE DE VENTA INTERNA ***</p>
        </div>
      </div>

      <style jsx global>{` @media print { .no-print { display: none !important; } body, main { background-color: #fff !important; padding: 0 !important; } } `}</style>
    </main>
  )
}