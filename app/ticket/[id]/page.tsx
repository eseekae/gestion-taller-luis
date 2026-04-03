'use client'
import { useEffect, useState, useRef } from 'react' // Añadimos useRef
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Printer, MessageCircle, ArrowLeft, Share2 } from 'lucide-react'
import * as htmlToImage from 'html-to-image' // Importamos la librería

export default function TicketPedido() {
  const { id } = useParams()
  const router = useRouter()
  const ticketRef = useRef<HTMLDivElement>(null) // Referencia para capturar el ticket
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [compartiendo, setCompartiendo] = useState(false)

  useEffect(() => {
    const cargarTicket = async () => {
      const { data } = await supabase
        .from('pedidos')
        .select(`*, clientes (*), detalles_pedido (*, inventario (nombre)), pagos (*)`)
        .eq('id', id).single()
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

  // --- LA MAGIA PARA MANDAR EL ARCHIVO ---
  const compartirTicket = async () => {
    if (!ticketRef.current) return
    setCompartiendo(true)
    try {
      // 1. Convertimos el div del ticket en una imagen (PNG)
      const dataUrl = await htmlToImage.toPng(ticketRef.current, { backgroundColor: '#fff' })
      
      // 2. Convertimos ese dataUrl en un archivo real
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `Ticket_Yovi_${pedido.id}.png`, { type: 'image/png' })

      // 3. Usamos la API de compartir del celular
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Ticket Creaciones Yovi',
          text: `Detalle pedido de ${pedido.clientes.nombre}`,
        })
      } else {
        alert("Tu navegador no permite compartir archivos directamente. ¡Prueba desde el celular!")
      }
    } catch (err) {
      console.error("Error compartiendo:", err)
      alert("Hubo un drama al generar la imagen.")
    } finally {
      setCompartiendo(false)
    }
  }

  return (
    <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '20px' }}>
      
      <div className="no-print" style={{ maxWidth: '350px', margin: '0 auto 20px auto', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => router.back()} style={{ background: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}><ArrowLeft size={18} /></button>
        <button onClick={() => window.print()} style={{ background: '#000', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '4px 4px 0px #3b82f6' }}><Printer size={18} /> Imprimir</button>
        
        {/* BOTÓN NUEVO: COMPARTIR IMAGEN */}
        <button 
          onClick={compartirTicket} 
          disabled={compartiendo}
          style={{ background: '#25D366', color: '#fff', border: '3px solid #000', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '4px 4px 0px #000' }}
        >
          <Share2 size={18} /> {compartiendo ? 'Generando...' : 'WhatsApp'}
        </button>
      </div>

      {/* AGREGAMOS LA REFERENCIA ticketRef PARA CAPTURAR ESTE DIV */}
      <div ref={ticketRef} style={{ 
        width: '75mm', backgroundColor: '#fff', margin: '0 auto', padding: '10mm 5mm', 
        fontFamily: 'monospace', color: '#000', fontSize: '12px'
      }} className="ticket-container">
        
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>CREACIONES YOVI</h1>
          <p style={{ margin: '0', fontSize: '10px' }}>Confección de Uniformes Escolares</p>
          <p style={{ margin: '2px 0', fontSize: '10px' }}>VECINAL 5989, SAN JOAQUIN</p>
          <p style={{ margin: '2px 0', fontSize: '10px' }}>WhatsApp: +56 9 XXXX XXXX</p>
          <p style={{ margin: '2px 0', fontSize: '10px' }}>IG: @creaciones_yovi</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        <div>
          <p style={{ margin: '2px 0' }}><b>TICKET N°:</b> {pedido.id}</p>
          <p style={{ margin: '2px 0' }}><b>FECHA:</b> {fechaHoy}</p>
          <p style={{ margin: '2px 0' }}><b>CLIENTE:</b> {pedido.clientes.nombre}</p>
          <p style={{ margin: '2px 0' }}><b>COLEGIO:</b> {pedido.colegio}</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <td>{det.cantidad}</td>
                <td style={{ fontSize: '10px' }}>{det.inventario?.nombre} ({det.talla})</td>
                <td style={{ textAlign: 'right' }}>${(det.cantidad * det.precio_unitario).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        <div style={{ textAlign: 'right', fontSize: '13px' }}>
          <p style={{ margin: '3px 0' }}>TOTAL: ${pedido.total_final.toLocaleString('es-CL')}</p>
          <p style={{ margin: '3px 0' }}>ABONADO: ${totalPagado.toLocaleString('es-CL')}</p>
          <p style={{ margin: '3px 0', fontWeight: 'bold' }}>SALDO: ${saldoPendiente.toLocaleString('es-CL')}</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <div style={{ background: '#000', color: '#fff', padding: '5px', fontWeight: 'bold', marginBottom: '10px' }}>
            ENTREGA ESTIMADA: {fechaEntrega}
          </div>
          <p style={{ fontSize: '9px' }}>¡Gracias por confiar en nosotros!</p>
          <p style={{ fontSize: '8px', marginTop: '10px' }}>Software por: Sebastian Ramirez</p>
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
