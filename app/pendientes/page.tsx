'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { registrarLog } from '../../lib/auditoria'
import { ArrowLeft, School, CheckCircle, User, Loader2, PackageCheck } from 'lucide-react'

export default function PaginaProduccion() {
  const router = useRouter()
  const [pendientes, setPendientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroColegio, setFiltroColegio] = useState('Todos')
  const [expandirColegio, setExpandirColegio] = useState<string | null>(null)

  const cargarPendientes = async () => {
    setLoading(true)
    const { data: detalles } = await supabase
      .from('detalles_pedido')
      .select(`
        *,
        pedidos (id, colegio, clientes (nombre)),
        inventario (nombre)
      `)
      .neq('estado', 'Entregado')
      .neq('estado', 'Listo para retiro') 

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
            id: item.id,
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

  // FUNCIÓN ACTUALIZADA: MUEVE A STOCK RESERVADO
  const enviarAStockCliente = async (detalleId: number, clienteNombre: string, producto: string) => {
    if (!confirm(`¿Confirmar que la prenda de ${clienteNombre} está terminada y en stock?`)) return

    try {
      const { error } = await supabase
        .from('detalles_pedido')
        .update({ estado: 'Listo para retiro' }) // Este estado indica que está en stock pero es de un cliente
        .eq('id', detalleId)

      if (error) throw error

      await registrarLog(
        `${sessionStorage.getItem('user_name') || 'Don Luis'} movió a STOCK CLIENTE: ${producto}`,
        `Reservado para: ${clienteNombre} (ID: ${detalleId})`
      )

      alert(`✅ ¡Listo! La prenda quedó en stock para ${clienteNombre}.`)
      cargarPendientes() 
    } catch (err) {
      alert("❌ Error al mover a stock.")
    }
  }

  useEffect(() => { cargarPendientes() }, [])

  const colegiosDisponibles = ['Todos', ...Array.from(new Set(pendientes.map(p => p.nombre)))]

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '10px', borderRadius: '12px', boxShadow: '4px 4px 0px #000' }}>
              <ArrowLeft size={20} color="#000" />
            </button>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#000' }}>Producción Taller</h1>
          </div>
          <button onClick={cargarPendientes} style={{ background: '#000', color: '#fff', padding: '10px', borderRadius: '12px', border: 'none' }}>
            <Loader2 size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
          {colegiosDisponibles.map(c => (
            <button key={c} onClick={() => setFiltroColegio(c)} style={{ backgroundColor: filtroColegio === c ? '#000' : '#fff', color: filtroColegio === c ? '#fff' : '#000', border: '3px solid #000', borderRadius: '10px', padding: '10px 18px', fontWeight: '900', whiteSpace: 'nowrap' }}>{c}</button>
          ))}
        </div>

        {loading ? <p style={{ fontWeight: '900', textAlign: 'center', marginTop: '50px' }}>BUSCANDO TELAS...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pendientes
              .filter(col => filtroColegio === 'Todos' || col.nombre === filtroColegio)
              .map(col => (
              <div key={col.nombre} style={{ border: '4px solid #000', borderRadius: '24px', overflow: 'hidden', boxShadow: '8px 8px 0px #000' }}>
                <div 
                  onClick={() => setExpandirColegio(expandirColegio === col.nombre ? null : col.nombre)}
                  style={{ backgroundColor: '#000', color: '#fff', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <span style={{ fontWeight: '900', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <School size={22} /> {col.nombre}
                  </span>
                  <span style={{ background: '#fff', color: '#000', padding: '4px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: '900' }}>
                    {col.productos.length} MODELOS
                  </span>
                </div>

                {expandirColegio === col.nombre && (
                  <div style={{ padding: '20px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {col.productos.map((prod: any, idx: number) => (
                      <div key={idx} style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '18px', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '3px solid #000', paddingBottom: '10px' }}>
                          <div>
                            <p style={{ fontWeight: '900', fontSize: '20px', color: '#000', margin: 0 }}>{prod.nombre}</p>
                            <p style={{ fontSize: '15px', fontWeight: '900', color: '#000', margin: 0 }}>TALLA: {prod.talla}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '11px', fontWeight: '900', color: '#000' }}>PENDIENTES</p>
                            <p style={{ fontSize: '28px', fontWeight: '900', color: '#e11d48', lineHeight: 1 }}>{prod.total}</p>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {prod.clientes.map((cli: any, cIdx: number) => (
                            <div key={cIdx} style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <p style={{ fontSize: '15px', fontWeight: '900', color: '#000', margin: 0 }}>{cli.nombre}</p>
                                <p style={{ fontSize: '13px', fontWeight: '800', color: '#000', margin: 0 }}>CANTIDAD: {cli.cantidad}</p>
                              </div>
                              {/* BOTÓN ACTUALIZADO A "EN STOCK" */}
                              <button 
                                onClick={() => enviarAStockCliente(cli.id, cli.nombre, prod.nombre)}
                                style={{ backgroundColor: '#4ade80', color: '#000', border: '2px solid #000', padding: '10px 14px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '3px 3px 0px #000' }}
                              >
                                <PackageCheck size={16} /> EN STOCK (LISTO)
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