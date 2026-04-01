'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Printer, MessageCircle, ArrowLeft } from 'lucide-react'

export default function TicketPedido() {
  const { id } = useParams()
  const router = useRouter()
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarTicket = async () => {
      const { data, error } = await supabase
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

  // Función para mandar por WhatsApp
  const enviarWhatsApp = () => {
    const mensaje = `*TICKET DE PEDIDO - CREACIONES YOVI*%0A` +
      `Hola ${pedido.clientes.nombre}, aquí tienes el detalle de tu pedido:%0A%0A` +
      `*ID:* ${pedido.id}%0A` +
      `*Total:* $${pedido.total_final.toLocaleString('es-CL')}%0A` +
      `*Abonado:* $${totalPagado.toLocaleString('es-CL')}%0A` +
      `*Saldo Pendiente:* $${saldoPendiente.toLocaleString('es-CL')}%0A` +
      `*Entrega:* ${fechaEntrega}%0A%0A` +
      `¡Gracias por preferir Creaciones Yovi!`;
    
    window.open(`https://wa.me/${pedido.clientes.telefono}?text=${mensaje}`, '_blank')
  }

  return (
    <main style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '20px' }}>
      
      {/* BOTONES DE ACCIÓN (Se ocultan al imprimir) */}
      <div className="no-print" style={{ maxWidth: '300px', margin: '0 auto 20px auto', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => router.back()} style={{ background: '#fff', border: '2px solid #000', padding: '10px', borderRadius: '10px', fontWeight: 'bold' }}><ArrowLeft size={18} /></button>
        <button onClick={() => window.print()} style={{ background: '#000', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Printer size={18} /> Imprimir</button>
        <button onClick={enviarWhatsApp} style={{ background: '#25D366', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={18} /> WhatsApp</button>
      </div>

      {/* ÁREA DEL TICKET (75mm de ancho para térmica) */}
      <div style={{ 
        width: '75mm', 
        backgroundColor: '#fff', 
        margin: '0 auto', 
        padding: '10mm 5mm', 
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        fontFamily: 'monospace',
        color: '#000',
        fontSize: '12px'
      }} className="ticket-container">
        
        {/* ENCABEZADO */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>CREACIONES YOVI</h1>
          <p style={{ margin: '0', fontSize: '10px' }}>Confección de Uniformes Escolares</p>
          <p style={{ margin: '2px 0', fontSize: '10px' }}>VECINAL 5989, SAN JOAQUIN</p>
          <p style={{ margin: '2px 0', fontSize: '10px' }}>WhatsApp: +56 9 XXXX XXXX</p>
          <p style={{ margin: '2px 0', fontSize: '10px' }}>IG: @creaciones_yovi</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* INFO PEDIDO */}
        <div style={{ marginBottom: '10px' }}>
          <p style={{ margin: '2px 0' }}><b>TICKET N°:</b> {pedido.id}</p>
          <p style={{ margin: '2px 0' }}><b>FECHA:</b> {fechaHoy}</p>
          <p style={{ margin: '2px 0' }}><b>CLIENTE:</b> {pedido.clientes.nombre}</p>
          <p style={{ margin: '2px 0' }}><b>TELÉFONO:</b> {pedido.clientes.telefono}</p>
          <p style={{ margin: '2px 0' }}><b>COLEGIO:</b> {pedido.colegio}</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* DETALLE ITEMS */}
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
                <td style={{ textAlign: 'right' }}>${(det.cantidad * det.precio_unitario).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* TOTALES */}
        <div style={{ textAlign: 'right', fontSize: '13px' }}>
          <p style={{ margin: '3px 0' }}>TOTAL: ${pedido.total_final.toLocaleString('es-CL')}</p>
          <p style={{ margin: '3px 0' }}>ABONADO: ${totalPagado.toLocaleString('es-CL')}</p>
          <p style={{ margin: '3px 0', fontWeight: 'bold' }}>SALDO: ${saldoPendiente.toLocaleString('es-CL')}</p>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* ENTREGA Y NOTAS */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <div style={{ background: '#000', color: '#fff', padding: '5px', fontWeight: 'bold', marginBottom: '10px' }}>
            ENTREGA ESTIMADA: {fechaEntrega}
          </div>
          {pedido.observaciones && (
            <p style={{ fontSize: '10px', fontStyle: 'italic' }}>Nota: {pedido.observaciones}</p>
          )}
          <p style={{ marginTop: '15px', fontSize: '10px' }}>¡Gracias por confiar en nosotros!</p>
          <p style={{ fontSize: '9px' }}>Software por: Sebastian Ramirez</p>
        </div>

      </div>

      {/* ESTILOS PARA IMPRESIÓN */}
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