'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Calendar as CalendarIcon, Clock, ChevronRight, School, User } from 'lucide-react'

export default function CalendarioEntregas() {
  const router = useRouter()
  const [pedidosPorFecha, setPedidosPorFecha] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarEntregas = async () => {
      // Traemos pedidos que NO estén completados y tengan fecha de entrega
      const { data, error } = await supabase
        .from('pedidos')
        .select(`*, clientes(nombre)`)
        .not('fecha_entrega', 'is', null)
        .neq('estado', 'Completado')
        .order('fecha_entrega', { ascending: true })

      if (data) {
        // Agrupar por fecha: { "2026-03-31": [pedido1, pedido2], "2026-04-01": [...] }
        const agrupados = data.reduce((acc: any, p: any) => {
          const fecha = p.fecha_entrega
          if (!acc[fecha]) acc[fecha] = []
          acc[fecha].push(p)
          return acc
        }, {})
        setPedidosPorFecha(agrupados)
      }
      setLoading(false)
    }
    cargarEntregas()
  }, [])

  const cardStyle = { backgroundColor: '#fff', padding: '16px', borderRadius: '16px', border: '3px solid #000', boxShadow: '4px 4px 0px #000', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}>
            <ArrowLeft size={20} color="#000" />
          </button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>Agenda de Entregas</h1>
        </div>

        {loading ? <p>Cargando cronograma...</p> : (
          Object.keys(pedidosPorFecha).length === 0 ? <p>No hay entregas programadas.</p> : (
            Object.keys(pedidosPorFecha).map(fecha => (
              <div key={fecha} style={{ marginBottom: '30px' }}>
                {/* ETIQUETA DE FECHA */}
                <div style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '6px 15px', borderRadius: '10px', fontWeight: '900', fontSize: '14px', marginBottom: '15px', textTransform: 'uppercase' }}>
                  <CalendarIcon size={14} style={{ display: 'inline', marginRight: '8px' }} />
                  {new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>

                {/* LISTA DE PEDIDOS PARA ESE DÍA */}
                {pedidosPorFecha[fecha].map((p: any) => (
                  <div key={p.id} onClick={() => router.push(`/ticket/${p.id}`)} style={cardStyle}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '900', background: '#fef3c7', padding: '2px 6px', border: '1px solid #000', borderRadius: '5px' }}>
                          ID: #{p.id}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#666' }}>
                          <School size={12} style={{ display: 'inline', marginRight: '3px' }} /> {p.colegio || 'Particular'}
                        </span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>
                        <User size={16} style={{ display: 'inline', marginRight: '5px' }} /> {p.clientes?.nombre}
                      </h3>
                    </div>
                    <ChevronRight size={24} color="#000" />
                  </div>
                ))}
              </div>
            ))
          )
        )}
      </div>
    </main>
  )
}