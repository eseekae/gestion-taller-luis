'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { ClipboardCheck, ArrowLeft, Share2, Sparkles, AlertTriangle, Printer } from 'lucide-react'
import { jsPDF } from 'jspdf'

export default function ValeEntrega() {
  const { id } = useParams()
  const router = useRouter()
  const valeRef = useRef<HTMLDivElement>(null)
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generando, setGenerando] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      if (!localStorage.getItem('user_role')) return router.push('/login')
      if (!id) return

      try {
        setLoading(true)
        const { data: pRes } = await supabase.from('pedidos').select('*').eq('id', Number(id)).single()
        
        if (pRes) {
          const [cRes, dRes, iRes] = await Promise.all([
            supabase.from('clientes').select('*').eq('id', pRes.cliente_id).single(),
            supabase.from('detalles_pedido').select('*').eq('pedido_id', Number(id)),
            supabase.from('inventario').select('id, nombre')
          ])

          const detallesProcesados = dRes.data?.map(d => {
            const prod = iRes.data?.find(inv => inv.id === d.producto_id)
            return { ...d, p_nombre: prod?.nombre || 'Prenda' }
          })

          setPedido({ ...pRes, clientes: cRes.data, detalles: detallesProcesados })
        }
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [id, router])

  const compartirVale = async () => {
    if (!valeRef.current || !pedido) return
    setGenerando(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(valeRef.current, { scale: 3, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')
      
      const pdfWidth = 75
      const pdfHeight = ((canvas.height * pdfWidth) / canvas.width) + 10
      const pdf = new jsPDF({ unit: 'mm', format: [pdfWidth, pdfHeight] })
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width)
      const pdfBlob = pdf.output('blob')
      const file = new File([pdfBlob], `Vale_Entrega_#${pedido.id}.pdf`, { type: 'application/pdf' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Vale de Entrega #${pedido.id}`,
          text: `Hola ${pedido.clientes?.nombre}, aquí tienes el comprobante de retiro de tus prendas.`
        })
      } else {
        pdf.save(`Vale_Entrega_${pedido.id}.pdf`)
      }
    } catch (err) {
      alert("Error al generar el vale")
    } finally {
      setGenerando(false)
    }
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontWeight: '900' }}>GENERANDO VALE...</div>

  if (!pedido) return <div style={{ textAlign: 'center', padding: '50px' }}><AlertTriangle size={50} /><p>No se encontró el pedido</p></div>

  const fechaHoy = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px', color: '#000', fontFamily: 'monospace' }}>
      
      <div className="no-print" style={{ maxWidth: '300px', margin: '0 auto 20px auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => router.back()} style={{ padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', cursor: 'pointer' }}>VOLVER</button>
        <button onClick={() => window.print()} style={{ padding: '12px', background: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', cursor: 'pointer' }}><Printer size={18} /></button>
        <button onClick={compartirVale} disabled={generando} style={{ gridColumn: 'span 2', padding: '15px', background: '#000', color: '#fff', border: '3px solid #000', borderRadius: '12px', fontWeight: '950', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
          {generando ? <Sparkles size={20} className="animate-spin" /> : <Share2 size={20} />} 
          COMPARTIR COMPROBANTE
        </button>
      </div>

      <div ref={valeRef} style={{ maxWidth: '280px', margin: '0 auto', backgroundColor: '#fff', border: '2px solid #000', padding: '20px' }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
          <ClipboardCheck size={40} style={{ marginBottom: '10px' }} />
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '1000' }}>COMPROBANTE DE RETIRO</h1>
          <p style={{ fontSize: '10px', fontWeight: '800', margin: '5px 0' }}>Creaciones YOVI</p>
        </div>

        <div style={{ fontSize: '11px', marginBottom: '15px', lineHeight: '1.4' }}>
          <p style={{ margin: 0 }}><b>N° VENTA :</b> #{pedido.id.toString().padStart(4, '0')}</p>
          <p style={{ margin: 0 }}><b>FECHA    :</b> {fechaHoy}</p>
          <p style={{ margin: 0 }}><b>CLIENTE  :</b> {pedido.clientes?.nombre.toUpperCase()}</p>
        </div>

        <div style={{ border: '2px solid #000', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '1000', textAlign: 'center', backgroundColor: '#000', color: '#fff' }}>ARTÍCULOS ENTREGADOS</p>
          {pedido.detalles.map((d: any, i: number) => d.cantidad_entregada > 0 && (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span>{d.cantidad_entregada}x {d.p_nombre} (T{d.talla})</span>
              <span style={{ fontWeight: '1000' }}>OK</span>
            </div>
          ))}
        </div>

        {pedido.detalles.some((d: any) => d.cantidad - d.cantidad_entregada > 0) && (
          <div style={{ border: '2px dashed #000', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '1000', textAlign: 'center' }}>PENDIENTE EN TALLER</p>
            {pedido.detalles.map((d: any, i: number) => {
              const pendiente = d.cantidad - d.cantidad_entregada;
              return pendiente > 0 ? (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', opacity: 0.7 }}>
                  <span>{pendiente}x {d.p_nombre} (T{d.talla})</span>
                  <span>FALTA</span>
                </div>
              ) : null;
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #000' }}>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ fontSize: '10px', margin: '0 0 20px 0' }}>Firma Conforme Cliente</p>
            <div style={{ borderBottom: '1px solid #000', width: '150px', margin: '0 auto' }}></div>
          </div>
          <p style={{ fontSize: '9px', fontWeight: '800' }}>Gracias por confiar en nosotros.</p>
        </div>
      </div>
      
      <style jsx global>{` @media print { .no-print { display: none !important; } body { background: #fff !important; } } `}</style>
    </main>
  )
}