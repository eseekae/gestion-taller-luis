'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, AlertCircle, ShoppingBag, BarChart3 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

export default function Estadisticas() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // KPIs
  const [ventasMesActual, setVentasMesActual] = useState(0)
  const [ventasMesAnterior, setVentasMesAnterior] = useState(0)
  const [plataEnCalle, setPlataEnCalle] = useState(0)
  const [totalPrendasMes, setTotalPrendasMes] = useState(0)

  // Data para gráficos
  const [tendenciaMeses, setTendenciaMeses] = useState<any[]>([])
  const [rankingColegios, setRankingColegios] = useState<any[]>([])
  const [rankingPrendas, setRankingPrendas] = useState<any[]>([])

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    const [pRes, iRes, dRes] = await Promise.all([
      supabase.from('pedidos').select('*'),
      supabase.from('inventario').select('id, nombre'),
      supabase.from('detalles_pedido').select('*')
    ])

    const pedidos = pRes.data || []
    const inventario = iRes.data || []
    const detalles = dRes.data || []

    const ahora = new Date()
    const mesActual = ahora.getMonth()
    const anioActual = ahora.getFullYear()

    let tActual = 0; let tAnterior = 0; let deudaTotal = 0; let prendasMes = 0;
    
    const ventasPorMes: { [key: string]: number } = {}
    const conteoColegios: { [key: string]: number } = {}
    const conteoPrendas: { [key: string]: number } = {}

    // 1. Procesar Pedidos
    pedidos.forEach(p => {
      const fecha = new Date(p.created_at)
      const mes = fecha.getMonth()
      const anio = fecha.getFullYear()
      const mesAnio = `${anio}-${(mes + 1).toString().padStart(2, '0')}`

      ventasPorMes[mesAnio] = (ventasPorMes[mesAnio] || 0) + p.total_final

      if (anio === anioActual && mes === mesActual) tActual += p.total_final
      else if ((mesActual === 0 && anio === anioActual - 1 && mes === 11) || (mesActual > 0 && anio === anioActual && mes === mesActual - 1)) {
        tAnterior += p.total_final
      }

      deudaTotal += (p.total_final - p.abono)

      const col = p.colegio?.trim() ? p.colegio.toUpperCase() : 'PARTICULAR'
      conteoColegios[col] = (conteoColegios[col] || 0) + p.total_final
    })

    // 2. Procesar Detalles
    detalles.forEach(d => {
      const pedidoReal = pedidos.find(p => p.id === d.pedido_id)
      if (pedidoReal) {
        const fecha = new Date(pedidoReal.created_at)
        if (fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual) {
          prendasMes += d.cantidad
        }
      }
      const prod = inventario.find(i => i.id === d.producto_id)
      const nombreProd = prod ? prod.nombre : 'Eliminado'
      conteoPrendas[nombreProd] = (conteoPrendas[nombreProd] || 0) + d.cantidad
    })

    const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const chartTendencia = Object.keys(ventasPorMes).sort().map(key => {
      const [y, m] = key.split('-');
      return { mes: `${mesesNombres[parseInt(m)-1]} ${y.slice(2)}`, total: ventasPorMes[key] }
    })

    const chartColegios = Object.keys(conteoColegios)
      .map(nombre => ({ nombre, total: conteoColegios[nombre] }))
      .sort((a, b) => b.total - a.total).slice(0, 5)

    const chartPrendas = Object.keys(conteoPrendas)
      .map(nombre => ({ nombre, cantidad: conteoPrendas[nombre] }))
      .sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)

    setVentasMesActual(tActual)
    setVentasMesAnterior(tAnterior)
    setPlataEnCalle(deudaTotal)
    setTotalPrendasMes(prendasMes)
    setTendenciaMeses(chartTendencia)
    setRankingColegios(chartColegios)
    setRankingPrendas(chartPrendas)
    setLoading(false)
  }, [])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  const crecimientoCrudo = ventasMesAnterior === 0 ? 100 : (((ventasMesActual - ventasMesAnterior) / ventasMesAnterior) * 100)
  const porcentajeCrecimiento = Math.round(crecimientoCrudo)
  const tendenciaPositiva = porcentajeCrecimiento >= 0

  const cardStyle = { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }

  if (loading) return <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p style={{ color: '#000', fontWeight: '800' }}>Cargando estadísticas...</p></main>

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '10px', borderRadius: '12px', color: '#000', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#000' }}>Dashboard Financiero</h1>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={cardStyle}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#64748b' }}>INGRESOS MES</p>
              <p style={{ margin: '10px 0', fontSize: '28px', fontWeight: '900', color: '#000' }}>${ventasMesActual.toLocaleString('es-CL')}</p>
              <span style={{ fontSize: '13px', fontWeight: '700', color: tendenciaPositiva ? '#10b981' : '#ef4444' }}>
                {tendenciaPositiva ? '↑' : '↓'} {porcentajeCrecimiento}% vs anterior
              </span>
            </div>

            <div style={cardStyle}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#64748b' }}>CUENTAS POR COBRAR</p>
              <p style={{ margin: '10px 0', fontSize: '28px', fontWeight: '900', color: '#ef4444' }}>${plataEnCalle.toLocaleString('es-CL')}</p>
            </div>

            <div style={cardStyle}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#64748b' }}>PRENDAS (MES)</p>
              <p style={{ margin: '10px 0', fontSize: '28px', fontWeight: '900', color: '#3b82f6' }}>{totalPrendasMes} uds.</p>
            </div>
          </div>

          {/* GRÁFICO TENDENCIA */}
          <div style={{ ...cardStyle, marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '900', color: '#000' }}>Crecimiento de Ingresos</h2>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tendenciaMeses}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: '#000', fontWeight: 700, fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${v/1000}k`} tick={{ fill: '#000', fontWeight: 700 }} />
                  {/* CORRECCIÓN 1 */}
                  <Tooltip 
                    formatter={(value: any) => [`$${Number(value).toLocaleString('es-CL')}`, 'Ingresos']}
                    contentStyle={{ borderRadius: '12px', border: '2px solid #000', fontWeight: '800' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#000" strokeWidth={4} fill="#e2e8f0" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* GRÁFICO COLEGIOS */}
            <div style={cardStyle}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '900', color: '#000' }}>TOP COLEGIOS ($)</h2>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingColegios} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="nombre" type="category" tick={{ fill: '#000', fontWeight: 700, fontSize: 10 }} width={80} />
                    {/* CORRECCIÓN 2 */}
                    <Tooltip 
                      formatter={(value: any) => [`$${Number(value).toLocaleString('es-CL')}`, 'Total']}
                      contentStyle={{ borderRadius: '12px', border: '2px solid #000', fontWeight: '800' }}
                    />
                    <Bar dataKey="total" fill="#000" radius={[0, 5, 5, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GRÁFICO PRENDAS */}
            <div style={cardStyle}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '900', color: '#000' }}>TOP PRENDAS (UDS)</h2>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingPrendas}>
                    <XAxis dataKey="nombre" tick={{ fill: '#000', fontWeight: 700, fontSize: 10 }} />
                    <YAxis tick={{ fill: '#000', fontWeight: 700 }} />
                    {/* CORRECCIÓN 3 */}
                    <Tooltip 
                      formatter={(value: any) => [`${Number(value)} unidades`, 'Vendidas']}
                      contentStyle={{ borderRadius: '12px', border: '2px solid #000', fontWeight: '800' }}
                    />
                    <Bar dataKey="cantidad" fill="#000" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </main>
  )
}