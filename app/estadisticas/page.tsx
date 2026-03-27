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
      const mesAnio = `${anio}-${(mes + 1).toString().padStart(2, '0')}` // Ej: 2026-03

      // Tendencia Mensual (Gráfico de Área)
      ventasPorMes[mesAnio] = (ventasPorMes[mesAnio] || 0) + p.total_final

      // KPIs
      if (anio === anioActual && mes === mesActual) tActual += p.total_final
      else if ((mesActual === 0 && anio === anioActual - 1 && mes === 11) || (mesActual > 0 && anio === anioActual && mes === mesActual - 1)) {
        tAnterior += p.total_final
      }

      deudaTotal += (p.total_final - p.abono)

      // Ranking Colegios
      const col = p.colegio?.trim() ? p.colegio.toUpperCase() : 'PARTICULAR'
      conteoColegios[col] = (conteoColegios[col] || 0) + p.total_final
    })

    // 2. Procesar Detalles (Solo mes actual para prendas)
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

    // Formatear Data para Recharts
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

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }
  const cardStyle = { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }

  if (loading) return <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p style={{ color: '#64748b', fontWeight: '600' }}>Generando reportes...</p></main>

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Dashboard Financiero</h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Métricas de producción y ventas</p>
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          
          {/* KPIs (TARJETAS SUPERIORES) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            
            <motion.div variants={itemVariants} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Ingresos del Mes</p>
                <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '10px', color: '#0f172a' }}><DollarSign size={18} /></div>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>${ventasMesActual.toLocaleString('es-CL')}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: tendenciaPositiva ? '#10b981' : '#ef4444' }}>
                {tendenciaPositiva ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{tendenciaPositiva ? '+' : ''}{porcentajeCrecimiento}% vs mes anterior</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Cuentas por Cobrar</p>
                <div style={{ backgroundColor: '#fef2f2', padding: '8px', borderRadius: '10px', color: '#ef4444' }}><AlertCircle size={18} /></div>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>${plataEnCalle.toLocaleString('es-CL')}</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Capital pendiente de ingreso</p>
            </motion.div>

            <motion.div variants={itemVariants} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Volumen (Mes)</p>
                <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '10px', color: '#3b82f6' }}><ShoppingBag size={18} /></div>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{totalPrendasMes} <span style={{ fontSize: '18px', color: '#94a3b8' }}>unds.</span></p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Prendas procesadas este mes</p>
            </motion.div>

          </div>

          {/* GRÁFICO PRINCIPAL: TENDENCIA DE VENTAS */}
          <motion.div variants={itemVariants} style={{ ...cardStyle, marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="#8b5cf6" /> Curva de Crecimiento (Ingresos)
            </h2>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tendenciaMeses} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString('es-CL')}`, 'Ingresos']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* GRÁFICOS SECUNDARIOS: COLEGIOS Y PRENDAS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            <motion.div variants={itemVariants} style={cardStyle}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Ingresos por Colegio (Top 5)</h2>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingColegios} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="nombre" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 600 }} width={90} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(value: number) => [`$${value.toLocaleString('es-CL')}`, 'Total']} />
                    <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={24}>
                      {rankingColegios.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} style={cardStyle}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Volumen por Prenda (Top 5)</h2>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingPrendas} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(value: number) => [`${value} unidades`, 'Vendidas']} />
                    <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} barSize={32}>
                      {rankingPrendas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#cbd5e1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </main>
  )
}