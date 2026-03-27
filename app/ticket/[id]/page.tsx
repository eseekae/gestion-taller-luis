'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function TicketCarta() {
  const params = useParams()
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const cargarTicket = useCallback(async () => {
    const { data: ped } = await supabase.from('pedidos').select('*').eq('id', params.id).single()
    if (!ped) return
    const { data: cli } = await supabase.from('clientes').select('*').eq('id', ped.cliente_id).single()
    const { data: detalles } = await supabase.from('detalles_pedido').select('*').eq('pedido_id', ped.id)
    const { data: inventario } = await supabase.from('inventario').select('id, nombre')
    
    const detallesCompletos = detalles?.map(d => {
      const prod = inventario?.find(i => i.id === d.producto_id)
      return { ...d, p_nombre: prod?.nombre || 'Producto' }
    })

    setPedido({ ...ped, cliente: cli, detalles: detallesCompletos })
    setLoading(false)

    setTimeout(() => { window.print() }, 1000)
  }, [params.id])

  useEffect(() => { cargarTicket() }, [cargarTicket])

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Generando documento...</p>
  if (!pedido) return <p style={{ fontFamily: 'sans-serif' }}>Pedido no encontrado</p>

  const deuda = pedido.total_final - pedido.abono;
  const estaPagado = deuda <= 0;

  return (
    <main style={{ backgroundColor: '#fff', color: '#000', padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* CABECERA DOCUMENTO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '4px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px', fontWeight: '900', textTransform: 'uppercase' }}>CONFECCIONES</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>Comprobante de Ingreso / Taller de Costura</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '900' }}>Nº ORDEN: {pedido.id.split('-')[0].toUpperCase()}</p>
          <p style={{ margin: 0, fontSize: '14px' }}>FECHA: {new Date(pedido.created_at).toLocaleDateString('es-CL')}</p>
        </div>
      </div>

      {/* DATOS CLIENTE Y ESTADO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div style={{ border: '2px solid #000', padding: '15px', borderRadius: '10px', width: '60%' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Datos del Cliente</h3>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>NOMBRE:</strong> {pedido.cliente?.nombre}</p>
          {pedido.cliente?.rut && <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>RUT:</strong> {pedido.cliente?.rut}</p>}
          <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>TELÉFONO:</strong> {pedido.cliente?.telefono}</p>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>COLEGIO/INST.:</strong> {pedido.colegio || 'Particular'}</p>
        </div>

        <div style={{ width: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: estaPagado ? '4px solid #166534' : '4px solid #991b1b', borderRadius: '10px', padding: '15px', backgroundColor: estaPagado ? '#dcfce7' : '#fee2e2' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '900' }}>ESTADO DE PAGO</p>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: estaPagado ? '#166534' : '#991b1b' }}>
            {estaPagado ? 'PAGADO ✅' : 'PENDIENTE ⏳'}
          </h2>
          {pedido.fecha_entrega && !estaPagado && (
             <p style={{ margin: '10px 0 0 0', fontSize: '12px', fontWeight: '900', color: '#000' }}>ENTREGA: {new Date(pedido.fecha_entrega).toLocaleDateString('es-CL')}</p>
          )}
        </div>
      </div>

      {/* DETALLES DEL PEDIDO */}
      <table style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse', border: '2px solid #000' }}>
        <thead>
          <tr style={{ backgroundColor: '#000', color: '#fff' }}>
            <th style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid #fff' }}>CANT</th>
            <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #fff' }}>DESCRIPCIÓN</th>
            <th style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid #fff' }}>TALLA</th>
            <th style={{ padding: '12px', textAlign: 'right', borderRight: '1px solid #fff' }}>P. UNITARIO</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          {pedido.detalles?.map((det: any, i: number) => (
            <tr key={i} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px', textAlign: 'center', fontWeight: '900' }}>{det.cantidad}</td>
              <td style={{ padding: '12px', textAlign: 'left' }}>{det.p_nombre}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>{det.talla}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>${Number(det.precio_unitario).toLocaleString('es-CL')}</td>
              <td style={{ padding: '12px', textAlign: 'right', fontWeight: '900' }}>${(det.cantidad * det.precio_unitario).toLocaleString('es-CL')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALES */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '300px', border: '2px solid #000', borderRadius: '10px', padding: '15px', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '900' }}>TOTAL:</span>
            <span style={{ fontSize: '16px', fontWeight: '900' }}>${pedido.total_final.toLocaleString('es-CL')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#444' }}>
            <span style={{ fontSize: '14px' }}>ABONO:</span>
            <span style={{ fontSize: '14px' }}>${pedido.abono.toLocaleString('es-CL')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: '900' }}>SALDO PENDIENTE:</span>
            <span style={{ fontSize: '20px', fontWeight: '900', color: deuda > 0 ? '#991b1b' : '#166534' }}>${deuda.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      {/* PIE DE PÁGINA */}
      <div style={{ textAlign: 'center', marginTop: '50px', borderTop: '2px solid #000', paddingTop: '20px', color: '#444' }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '900', color: '#000' }}>¡Gracias por su preferencia!</p>
        <p style={{ margin: 0, fontSize: '12px' }}>Documento válido como comprobante interno de taller. Por favor, presente este documento para retirar su pedido.</p>
      </div>

      {/* REGLAS DE IMPRESIÓN */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: white !important; -webkit-print-color-adjust: exact; }
          @page { size: letter; margin: 15mm; }
        }
      `}} />
    </main>
  )
}