'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Printer, ArrowLeft, ReceiptText, Smartphone, Share2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
// Herramientas de generación pro
import { jsPDF } from 'jspdf'
import * as htmlToImage from 'html-to-image'

export default function TicketPedido() {
  const { id } = useParams()
  const router = useRouter()
  const ticketRef = useRef<HTMLDivElement>(null)
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generando, setGenerando] = useState(false)

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

  // FIX: Función de PDF "Infinito" para que no se corte nunca
  const compartirTicketPDF = async () => {
    if (!ticketRef.current || !pedido) return
    setGenerando(true)
    
    try {
      const node = ticketRef.current;
      
      // 1. Captura de alta resolución (4x) para que se vea nítido en el celu
      const dataUrl = await htmlToImage.toPng(node, { 
        backgroundColor: '#ffffff',
        pixelRatio: 4,
        cacheBust: true,
      })

      const img = new Image()
      img.src = dataUrl
      await new Promise((resolve) => (img.onload = resolve))

      // 2. Cálculo dinámico de altura (75mm de ancho estándar)
      const pdfWidth = 75 
      const pdfHeight = (img.height * pdfWidth) / img.width 

      const pdf = new jsPDF({
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
        compress: true // Comprimimos para que el envío por WhatsApp sea instantáneo
      })

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST') 
      
      const pdfBlob = pdf.output('blob')
      const fileName = `Ticket_Yovi_#${pedido.id.toString().padStart(4, '0')}.pdf`
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' })

      // 3. Menú de compartir nativo
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Ticket Creaciones Yovi #${pedido.id}`,
          text: `¡Hola! Aquí tienes el comprobante de tu pedido. ✨`
        })
      } else {
        pdf.save(fileName)
      }
    } catch (err) {
      console.error('Error:', err)
      alert("Hubo un drama al generar el PDF. Revisa tu conexión.")
    } finally {
      setGenerando(false)
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
      
      {/* PANEL DE ACCIONES NEUBRUTALISTA */}
      <div className="no-print" style={{ maxWidth: '400px', margin: '0 auto 20px auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => router.push('/pedidos')} style={{ padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          <ArrowLeft size={18} /> VOLVER
        </button>
        <button onClick={() => window.print()} style={{ padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}>
          <Printer size={18} /> IMPRIMIR
        </button>
        
        <button 
          onClick={compartirTicketPDF} 
          disabled={generando}
          style={{ gridColumn: 'span 2', padding: '15px', background: '#3b82f6', color: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }}
        >
          {generando ? <Sparkles size={20} className="animate-pulse" /> : <Share2 size={20} />} 
          {generando ? 'PREPARANDO ARCHIVO...' : 'ENVIAR TICKET AL CLIENTE'}
        </button>
      </div>

      {/* DISEÑO DEL TICKET PULIDO (SIN DIRECCIÓN) */}
      <div ref={ticketRef} style={{ maxWidth: '280px', margin: '0 auto', backgroundColor: '#ffffff', border: '2px solid #000', padding: '20px', color: '#000' }}>
        
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '12px', marginBottom: '12px' }}>
          <ReceiptText size={38} color="#000" style={{ marginBottom: '8px' }} />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '1000', letterSpacing: '-1px' }}>Creaciones YOVI</h1>
          <p style={{ margin: '4px 0', fontSize: '10px', fontWeight: '900', color: '#444' }}>WA: +569 7913 3576 | IG: @creacionesyovi</p>
        </div>

        <div style={{ fontSize: '10px', fontWeight: '900', borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px', lineHeight: '1.4' }}>
          <p style={{ margin: 0 }}><b>VENTA N° :</b> #{pedido.id.toString().padStart(4, '0')}</p>
          <p style={{ margin: 0 }}><b>FECHA    :</b> {fechaHoy}</p>
          <p style={{ margin: 0 }}><b>CLIENTE  :</b> {pedido.clientes?.nombre?.toUpperCase()}</p>
          <p style={{ margin: 0 }}><b>COLEGIO  :</b> {pedido.colegio?.toUpperCase()}</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #000' }}>
              <th style={{ textAlign: 'left', padding: '6px 0' }}>DESCRIPCIÓN</th>
              <th style={{ textAlign: 'right', padding: '6px 0' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles_pedido?.map((det: any, i: number) => (
              <tr key={i}>
                <td style={{ padding: '6px 0', fontWeight: '800' }}>{det.cantidad}x {det.p_nombre} (T{det.talla})</td>
                <td style={{ textAlign: 'right', padding: '6px 0', fontWeight: '1000' }}>${(det.cantidad * det.precio_unitario).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', fontSize: '10px', fontWeight: '950', lineHeight: '1.5' }}>
          <p style={{ margin: 0, opacity: 0.7 }}>SUBTOTAL: ${subtotalProductos.toLocaleString('es-CL')}</p>
          {descuentoManual > 0 && <p style={{ margin: 0, color: '#ef4444' }}>DESCUENTO: -${descuentoManual.toLocaleString('es-CL')}</p>}
          
          <div style={{ border: '2px solid #000', padding: '8px', marginTop: '8px', background: '#f8fafc', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '1000' }}>TOTAL VENTA: ${pedido.total_final.toLocaleString('es-CL')}</p>
            <p style={{ margin: 0, color: '#166534' }}>ABONADO: ${totalPagado.toLocaleString('es-CL')}</p>
            <div style={{ margin: '4px 0', borderTop: '1px solid #000' }}></div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: '1000', color: saldoPendiente > 0 ? '#ef4444' : '#166534' }}>
               SALDO PENDIENTE: ${saldoPendiente.toLocaleString('es-CL')}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '18px', borderTop: '2px dashed #000', paddingTop: '12px' }}>
          <div style={{ backgroundColor: '#000', color: '#fff', padding: '8px', marginBottom: '10px', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', fontWeight: '1000', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
              ENTREGA: {pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString('es-CL') : 'A CONVENIR'}
            </p>
          </div>
          <p style={{ fontSize: '9px', fontWeight: '950', margin: 0, letterSpacing: '0.5px' }}>GRACIAS POR PREFERIR CREACIONES YOVI</p>
          <p style={{ fontSize: '8px', marginTop: '4px', opacity: 0.6 }}>COMPROBANTE DE VENTA INTERNA</p>
        </div>
      </div>

      <style jsx global>{` @media print { .no-print { display: none !important; } body, main { background-color: #fff !important; padding: 0 !important; } } `}</style>
    </main>
  )
}