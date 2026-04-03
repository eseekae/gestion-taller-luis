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

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <Scissors size={40} color="#000" />
      </motion.div>
      <p style={{ fontWeight: '950', marginTop: '20px', color: '#000' }}>GENERANDO COMPROBANTE...</p>
    </div>
  )
  
  if (!pedido) return <p style={{ textAlign: 'center', marginTop: '50px', fontWeight: '900' }}>Pedido no encontrado.</p>

  const totalBruto = pedido.detalles_pedido?.reduce((acc: number, det: any) => acc + (det.cantidad * det.precio_unitario), 0) || 0
  const montoDescuento = totalBruto - pedido.total_final
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
        style: { margin: '0', padding: '20px' }
      }
      const dataUrl = await htmlToImage.toPng(ticketRef.current, opciones)
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `Ticket_Yovi_${pedido.id}.png`, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Comprobante Creaciones Yovi',
          text: `Hola ${pedido.clientes.nombre}, adjunto el comprobante de tu pedido.`,
        })
      } else {
        alert("Tu navegador no soporta compartir directamente. Prueba descargar la imagen.")
      }
    } catch (err) {
      alert("Error al generar la imagen.")
    } finally {
      setCompartiendo(false)
    }
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
      backgroundSize: '32px 32px',
      padding: '40px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      
      {/* BOTONES DE ACCIÓN NEUBRUTALISTAS */}
      <div className="no-print" style={{ maxWidth: '400px', margin: '0 auto 40px auto', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => router.back()} 
          style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '16px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}
        >
          <ArrowLeft size={22} color="#000" />
        </motion.button>

        <motion.button 
          whileHover={{ y: -4 }} whileTap={{ y: 2, boxShadow: 'none' }}
          onClick={() => window.print()} 
          style={{ flex: 1, backgroundColor: '#000', color: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '16px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '4px 4px 0px #3b82f6', cursor: 'pointer' }}
        >
          <Printer size={18} /> IMPRIMIR
        </motion.button>

        <motion.button 
          whileHover={{ y: -4 }} whileTap={{ y: 2, boxShadow: 'none' }}
          onClick={compartirTicket} 
          disabled={compartiendo} 
          style={{ flex: 1, backgroundColor: '#22c55e', color: '#fff', border: '3px solid #000', padding: '12px', borderRadius: '16px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '4px 4px 0px #000', cursor: 'pointer' }}
        >
          <Smartphone size={18} /> {compartiendo ? '...' : 'ENVIAR'}
        </motion.button>
      </div>

      {/* ÁREA DEL TICKET (75mm) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          maxWidth: '85mm', 
          margin: '0 auto', 
          backgroundColor: '#fff', 
          border: '4px solid #000', 
          borderRadius: '4px', // Esquinas rectas como papel
          boxShadow: '15px 15px 0px #000',
          position: 'relative'
        }}
      >
        <div ref={ticketRef} style={{ 
          padding: '12mm 6mm', 
          fontFamily: 'monospace', 
          color: '#000', 
          fontSize: '13px', 
          boxSizing: 'border-box'
        }} className="ticket-container">
          
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '950', margin: '0 0 5px 0', letterSpacing: '-1px' }}>CREACIONES YOVI</h1>
            <div style={{ background: '#000', color: '#fff', display: 'inline-block', padding: '2px 10px', fontSize: '11px', fontWeight: '900', marginBottom: '10px' }}>
              CONFECCIÓN DE UNIFORMES
            </div>
            <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: '800' }}>VECINAL 5989, SAN JOAQUIN</p>
            <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: '800' }}>IG: @creaciones_yovi</p>
          </div>

          <div style={{ borderTop: '2px dashed #000', margin: '15px 0' }}></div>

          <div style={{ marginBottom: '15px', lineHeight: '1.4' }}>
            <p style={{ margin: '2px 0' }}><b>BOLETA N° :</b> {pedido.id}</p>
            <p style={{ margin: '2px 0' }}><b>FECHA    :</b> {fechaHoy}</p>
            <p style={{ margin: '2px 0' }}><b>CLIENTE  :</b> {pedido.clientes.nombre.toUpperCase()}</p>
            <p style={{ margin: '2px 0' }}><b>COLEGIO  :</b> {pedido.colegio.toUpperCase()}</p>
          </div>

          <div style={{ borderTop: '2px dashed #000', margin: '15px 0' }}></div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <th style={{ textAlign: 'left', paddingBottom: '5px' }}>ITE</th>
                <th style={{ textAlign: 'left', paddingBottom: '5px' }}>PRENDA</th>
                <th style={{ textAlign: 'right', paddingBottom: '5px' }}>TOT</th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalles_pedido?.map((det: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ padding: '8px 0', verticalAlign: 'top' }}>{det.cantidad}</td>
                  <td style={{ padding: '8px 0' }}>
                    {det.inventario?.nombre} <br/>
                    <small>TALLA: {det.talla}</small>
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>
                    ${(det.cantidad * det.precio_unitario).toLocaleString('es-CL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderTop: '2px dashed #000', margin: '15px 0' }}></div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {montoDescuento !== 0 && (
              <>
                <p style={{ margin: 0 }}>SUBTOTAL: ${totalBruto.toLocaleString('es-CL')}</p>
                <p style={{ margin: 0 }}>{montoDescuento > 0 ? 'DESCUENTO' : 'AJUSTE'}: ${Math.abs(montoDescuento).toLocaleString('es-CL')}</p>
              </>
            )}
            <p style={{ margin: '5px 0', fontWeight: '950', fontSize: '18px', borderTop: '1px solid #000', paddingTop: '5px' }}>
              TOTAL: ${pedido.total_final.toLocaleString('es-CL')}
            </p>
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
          body { background: #fff !important; padding: 0 !important; }
          main { background: none !important; padding: 0 !important; }
          .ticket-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; border: none !important; }
        }
      `}</style>
    </main>
  )
}