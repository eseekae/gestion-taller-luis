'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Printer, Share2, ArrowLeft } from 'lucide-react'
import * as htmlToImage from 'html-to-image'

export default function TicketPedido() {
  const { id } = useParams()
  const router = useRouter()
  const ticketRef = useRef<HTMLDivElement>(null)
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [compartiendo, setCompartiendo] = useState(false)

  useEffect(() => {
    const cargarTicket = async () => {
      const { data } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes (*),
          detalles_pedido (*, inventario (nombre)),
          pagos (*)
        `)
        .eq('id', id)
        .single()

      if (data) setPedido(data)
      setLoading(false)
    }
    cargarTicket()
  }, [id])

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Generando ticket...</p>
  if (!pedido) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Pedido no encontrado.</p>

  const totalPagado = pedido.pagos?.reduce((acc: number, p: any) => acc + p.monto, 0) || 0
  const saldoPendiente = pedido.total_final - totalPagado
  const fechaHoy = new Date().toLocaleDateString('es-CL')
  const fechaEntrega = pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString('es-CL') : 'Por definir'

  const compartirTicket = async () => {
    if (!ticketRef.current) return
    setCompartiendo(true)
    try {
      const opciones = {
        backgroundColor: '#fff',
        width: 320,
        style: {
          margin: '0',
          padding: '20px',
        }
      }

      const dataUrl = await htmlToImage.toPng(ticketRef.current, opciones)
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `Ticket_Yovi_${pedido.id}.png`, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Ticket Creaciones Yovi',
          text: `Pedido de ${pedido.clientes.nombre}`,
        })
      } else {
        alert("Tu navegador no soporta compartir archivos. Prueba desde Chrome o Safari en tu celular.")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Hubo un drama al generar la imagen.")
    } finally {
      setCompartiendo(false)
    }
  }

  return (
    <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* BOTONES DE ACCIÓN */}
      <div className="no-print" style={{ maxWidth: '350px', margin: '0 auto 20px auto', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
        <button onClick={() => router.back()} style={{ background: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}>
          <ArrowLeft size={20} color="#000" />
        </button>
        
        <button onClick={() => window.print()} style={{ background: '#000', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '4px 4px 0px #3b82f6' }}>
          <Printer size={18} /> IMPRIMIR
        </button>
        
        <button 
          onClick={compartirTicket} 
          disabled={compartiendo}
          style={{ background: '#25D366', color: '#fff', border: '3px solid #000', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '4px 4px 0px #000' }}
        >
          <Share2 size={18} /> {compartiendo ? 'ESPERA...' : 'WHATSAPP'}
        </button>
      </div>

      {/* ÁREA DEL TICKET */}
      <div ref={ticketRef} style={{ 
        width: '75mm', 
        minWidth: '75mm',
        backgroundColor: '#fff', 
        margin: '0 auto', 
        padding: '10mm 5mm', 
        fontFamily: 'monospace', 
        color: '#000', 
        fontSize: '12px',
        boxSizing: 'border-box'
      }} className="ticket-container">
        
        {/* ENCABEZADO */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>CREACIONES YOVI</h1>
          <p style={{ margin: '0', fontSize: '10px', fontWeight: 'bold' }}>CONFECCIÓN DE UNIFORMES</p>
          <p style={{ margin: '2px 0', fontSize: '10px' }}>VECINAL 5989, SAN JOAQUIN</p>
          <p style={{ margin: '2px 0', fontSize: '10px' }}>IG: @creaciones_yovi</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* INFO CLIENTE ACTUALIZADA */}
        <div style={{ marginBottom: '10px' }}>
          <p style={{ margin: '2px 0' }}><b>TICKET N°:</b> {pedido.id}</p>
          <p style={{ margin: '2px 0' }}><b>EMISIÓN:</b> {fechaHoy}</p>
          <p style={{ margin: '2px 0' }}><b>ENTREGA:</b> {fechaEntrega}</p> {/* FECHA DE ENTREGA AÑADIDA AQUÍ */}
          <p style={{ margin: '2px 0' }}><b>CLIENTE:</b> {pedido.clientes.nombre}</p>
          <p style={{ margin: '2px 0' }}><b>COLEGIO:</b> {pedido.colegio}</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* TABLA DE ITEMS */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '10px' }}>CANT</th>
              <th style={{ textAlign: 'left', fontSize: '10px' }}>ITEM</th>
              <th style={{ textAlign: 'right', fontSize: '10px' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles_pedido?.map((det: any, idx: number) => (
              <tr key={idx}>
                <td style={{ verticalAlign: 'top' }}>{det.cantidad}</td>
                <td style={{ fontSize: '10px' }}>{det.inventario?.nombre} ({det.talla})</td>
                <td style={{ textAlign: 'right' }}>${(det.cantidad * det.precio_unitario).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* TOTALES */}
        <div style={{ textAlign: 'right', fontSize: '14px' }}>
          <p style={{ margin: '3px 0' }}>TOTAL: ${pedido.total_final.toLocaleString('es-CL')}</p>
          <p style={{ margin: '3px 0' }}>ABONADO: ${totalPagado.toLocaleString('es-CL')}</p>
          <p style={{ margin: '3px 0', fontWeight: 'bold', fontSize: '16px' }}>SALDO: ${saldoPendiente.toLocaleString('es-CL')}</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* PIE DE PÁGINA */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <div style={{ background: '#000', color: '#fff', padding: '6px', fontWeight: 'bold', marginBottom: '10px', fontSize: '12px' }}>
            ENTREGA: {fechaEntrega}
          </div>
          {pedido.observaciones && (
            <p style={{ fontSize: '10px', fontStyle: 'italic', marginBottom: '10px' }}>Nota: {pedido.observaciones}</p>
          )}
          <p style={{ fontSize: '9px', fontWeight: 'bold' }}>¡GRACIAS POR SU PREFERENCIA!</p>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; padding: 0 !important; }
          .ticket-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
        }
      `}</style>
    </main>
  )
}