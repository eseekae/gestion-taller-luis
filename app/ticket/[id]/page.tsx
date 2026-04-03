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
    const cargarTicket = async () => {
      // FIX: Forzamos que el ID sea un número para que coincida con el BIGINT de la DB
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes (*),
          detalles_pedido (*),
          pagos (*)
        `)
        .eq('id', Number(id)) // <-- Cambio clave aquí
        .single()

      if (data) {
        setPedido(data)
      } else {
        console.error("Error al cargar ticket:", error)
      }
      setLoading(false)
    }
    if (id) cargarTicket()
  }, [id])

  const exportarImagen = async () => {
    if (!ticketRef.current) return
    setCompartiendo(true)
    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        backgroundColor: '#fff',
        quality: 1,
        pixelRatio: 2
      })
      const link = document.createElement('a')
      link.download = `Ticket_${pedido?.clientes?.nombre || 'Pedido'}_${pedido?.id || id}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error al generar imagen', err)
    } finally {
      setCompartiendo(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Scissors size={40} color="#000" />
      </motion.div>
      <p style={{ fontWeight: '950', marginTop: '15px' }}>GENERANDO TICKET...</p>
    </div>
  )

  if (!pedido) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '20px' }}>
      <div style={{ padding: '50px', textAlign: 'center', fontWeight: '950', border: '4px solid #000', backgroundColor: '#fff', boxShadow: '8px 8px 0px #000' }}>
        PEDIDO NO ENCONTRADO
      </div>
      <button onClick={() => router.back()} style={{ padding: '12px 24px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
        VOLVER ATRÁS
      </button>
    </div>
  )

  const totalPagado = pedido.pagos?.reduce((acc: number, p: any) => acc + Number(p.monto), 0) || 0
  const saldoPendiente = pedido.total_final - totalPagado
  const fechaHoy = new Date(pedido.created_at).toLocaleDateString('es-CL', { 
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
  const fechaEntrega = pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString('es-CL') : 'A CONVENIR'

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#e2e8f0', padding: '40px 20px', fontFamily: 'monospace' }}>
      
      <div className="no-print" style={{ maxWidth: '400px', margin: '0 auto 20px auto', display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()} style={{ flex: 1, padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          <ArrowLeft size={18} /> VOLVER
        </button>
        <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          <Printer size={18} /> IMPRIMIR
        </button>
        <button onClick={exportarImagen} disabled={compartiendo} style={{ flex: 1, padding: '12px', background: '#fbbf24', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          <Share2 size={18} /> {compartiendo ? '...' : 'PNG'}
        </button>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} ref={ticketRef} style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#fff', border: '4px solid #000', padding: '30px', boxShadow: '12px 12px 0px #000', position: 'relative' }}>
        
        <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#000', color: '#fff', padding: '5px 20px', borderRadius: '10px', fontSize: '10px', fontWeight: '950' }}>
          COPIA CLIENTE
        </div>

        <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <ReceiptText size={40} color="#000" />
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '1000', letterSpacing: '-1px' }}>TALLER YOVI</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '11px', fontWeight: '800' }}>CONFECCIONES Y BORDADOS</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '5px', fontSize: '10px', fontWeight: '900' }}>
             <Smartphone size={12} /> +569 8450 7104
          </div>
        </div>

        <div style={{ fontSize: '12px', fontWeight: '800' }}>
          <div style={{ marginBottom: '15px', lineHeight: '1.4' }}>
            {/* ID formateado para Luis */}
            <p style={{ margin: '2px 0' }}>
              <b>TICKET DE VENTA N° :</b> #{pedido.id.toString().padStart(4, '0')}
            </p>
            <p style={{ margin: '2px 0' }}><b>FECHA    :</b> {fechaHoy}</p>
            <p style={{ margin: '2px 0' }}><b>CLIENTE  :</b> {pedido.clientes.nombre.toUpperCase()}</p>
            <p style={{ margin: '2px 0' }}><b>COLEGIO  :</b> {pedido.colegio.toUpperCase()}</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>DESCRIPCIÓN</th>
                <th style={{ textAlign: 'right', padding: '8px 0' }}>TALLA</th>
                <th style={{ textAlign: 'right', padding: '8px 0' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalles_pedido.map((det: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: '8px 0' }}>{det.cantidad}x PRENDA</td>
                  <td style={{ textAlign: 'right', padding: '8px 0' }}>{det.talla}</td>
                  <td style={{ textAlign: 'right', padding: '8px 0', fontWeight: '950' }}>${(det.cantidad * det.precio_unitario).toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: 'right', borderTop: '2px solid #000', paddingTop: '15px' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '1000' }}>TOTAL VENTA: ${pedido.total_final.toLocaleString('es-CL')}</p>
            <div style={{ backgroundColor: '#f1f5f9', padding: '8px', border: '1px solid #000', marginTop: '5px' }}>
              <p style={{ margin: 0 }}>PAGADO: ${totalPagado.toLocaleString('es-CL')}</p>
              <p style={{ margin: 0, fontWeight: '950', color: saldoPendiente > 0 ? '#ef4444' : '#166534' }}>
                SALDO : ${saldoPendiente.toLocaleString('es-CL')}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '2px dashed #000', margin: '20px 0' }}></div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '10px', fontWeight: '950', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px' }}>
              ENTREGA: {fechaEntrega}
            </div>
            <p style={{ fontSize: '10px', fontWeight: '950', margin: 0 }}>*** GRACIAS POR SU COMPRA ***</p>
            <p style={{ fontSize: '9px', marginTop: '5px' }}>COMPROBANTE DE VENTA INTERNA</p>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: #fff !important; padding: 0 !important; }
          main { background-color: #fff !important; padding: 0 !important; }
        }
      `}</style>
    </main>
  )
}