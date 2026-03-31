'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { ArrowLeft, School, Scissors, CheckCircle, User, MessageSquare, Loader2 } from 'lucide-react'

export default function PaginaProduccion() {
  const router = useRouter()
  const [pendientes, setPendientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroColegio, setFiltroColegio] = useState('Todos')
  const [expandirColegio, setExpandirColegio] = useState<string | null>(null)

  const cargarPendientes = async () => {
    setLoading(true)
    // Traemos detalles, pedidos, clientes e inventario (para el nombre)
    const { data: detalles, error } = await supabase
      .from('detalles_pedido')
      .select(`
        *,
        pedidos (id, colegio, clientes (nombre)),
        inventario (nombre)
      `)
      .neq('estado', 'Entregado')
      .neq('estado', 'Listo para retiro') // Solo lo que REALMENTE falta fabricar

    if (detalles) {
      const agrupado = detalles.reduce((acc: any, item: any) => {
        const col = item.pedidos?.colegio || 'Particular'
        const prodNombre = item.inventario?.nombre || 'Producto'
        const talla = item.talla
        const claveProd = `${prodNombre}-${talla}`

        if (!acc[col]) acc[col] = {}
        if (!acc[col][claveProd]) {
          acc[col][claveProd] = { 
            nombre: prodNombre,
            talla: talla,
            total: 0,
            clientes: []
          }
        }

        const faltan = item.cantidad - (item.cantidad_entregada || 0)
        if (faltan > 0) {
          acc[col][claveProd].total += faltan
          acc[col][claveProd].clientes.push({
            id: item.id, // El ID del detalle para poder actualizarlo
            nombre: item.pedidos?.clientes?.nombre,
            cantidad: faltan,
            pedido_id: item.pedidos?.id
          })
        }
        return acc
      }, {})

      const listaFinal = Object.keys(agrupado).map(col => ({
        nombre: col,
        productos: Object.values(agrupado[col])
      }))

      setPendientes(listaFinal)
    }
    setLoading(false)
  }

  const marcarComoListo = async (detalleId: number, clienteNombre: string, producto: string) => {
    if (!confirm(`¿Confirmar que la prenda de ${clienteNombre} está lista?`)) return

    try {
      const { error } = await supabase
        .from('detalles_pedido')
        .update({ estado: 'Listo para retiro' })
        .eq('id', detalleId)

      if (error) throw error

      await registrarLog(
        `${sessionStorage.getItem('user_name') || 'Don Luis'} marcó como LISTO: ${producto}`,
        `Cliente: ${clienteNombre} (ID Detalle: ${detalleId})`
      )

      alert("✅ Marcado como listo. Se quitó de la lista de producción.")
      cargarPendientes() // Recargamos la lista
    } catch (err) {
      alert("❌ Error al actualizar.")
    }
  }

  useEffect(() => { cargarPendientes() }, [])

  const colegiosDisponibles = ['Todos', ...Array.from(new Set(pendientes.map(p => p.nombre)))]

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}>
              <ArrowLeft size={20} color="#000" />
            </button>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#000' }}>Producción</h1>
          </div>
          <button onClick={cargarPendientes} style={{ background: '#000', color: '#fff', padding: '10px', borderRadius: '12px', border: 'none' }}>
            <Loader2 size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* FILTRO RÁPIDO */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
          {colegiosDisponibles.map(c => (
            <button 
              key={c} 
              onClick={() => setFiltroColegio(c)}
              style={{ 
                backgroundColor: filtroColegio === c ? '#000' : '#fff', 
                color: filtroColegio === c ? '#fff' : '#000', 
                border: '3px solid #000', borderRadius: '10px', padding: '8px 15px', fontWeight: '800', whiteSpace: 'nowrap'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? <p style={{ fontWeight: '800' }}>Buscando telas y tijeras...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pendientes
              .filter(col => filtroColegio === 'Todos' || col.nombre === filtroColegio)
              .map(col => (
              <div key={col.nombre} style={{ border: '3px solid #000', borderRadius: '20px', overflow: 'hidden', boxShadow: '8px 8px 0px #000' }}>
                <div 
                  onClick={() => setExpandirColegio(expandirColegio === col.nombre ? null : col.nombre)}
                  style={{ backgroundColor: '#000', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <span style={{ fontWeight: '900', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <School size={20} /> {col.nombre}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: '#fff', color: '#000', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '900' }}>
                      {col.productos.length} Modelos
                    </span>
                  </div>
                </div>

                {expandirColegio === col.nombre && (
                  <div style={{ padding: '15px', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {col.productos.map((prod: any, idx: number) => (
                      <div key={idx} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '15px', borderRadius: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                          <div>
                            <p style={{ fontWeight: '900', fontSize: '18px', color: '#000', margin: 0 }}>{prod.nombre}</p>
                            <p style={{ fontSize: '14px', fontWeight: '800', color: '#475569', margin: 0 }}>Talla: {prod.talla}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#64748b' }}>TOTAL FALTANTE</p>
                            <p style={{ fontSize: '24px', fontWeight: '900', color: '#e11d48', lineHeight: 1 }}>{prod.total}</p>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {prod.clientes.map((cli: any, cIdx: number) => (
                            <div key={cIdx} style={{ backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: '900', color: '#000', margin: 0 }}>{cli.nombre}</p>
                                <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', margin: 0 }}>Cantidad: {cli.cantidad}</p>
                              </div>
                              <button 
                                onClick={() => marcarComoListo(cli.id, cli.nombre, prod.nombre)}
                                style={{ backgroundColor: '#4ade80', color: '#000', border: '2px solid #000', padding: '8px 12px', borderRadius: '10px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '2px 2px 0px #000' }}
                              >
                                <CheckCircle size={14} /> TERMINADO
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}