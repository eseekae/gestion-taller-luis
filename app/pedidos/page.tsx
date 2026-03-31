'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import { ArrowLeft, Search, School, Phone, IdCard, Calendar, Package, Printer, Trash2, Edit3, CheckCircle2, Clock, RotateCcw, MessageCircle, Download, Plus, Minus, Check } from 'lucide-react'

export default function VerPedidos() {
  const router = useRouter()
  const [datos, setDatos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [ordenarColegio, setOrdenarColegio] = useState(false)

  const cargar = useCallback(async () => {
    if (!sessionStorage.getItem('user_role')) return router.push('/login')

    setLoading(true)
    const [pRes, cRes, iRes, dRes] = await Promise.all([
      supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
      supabase.from('clientes').select('*'),
      supabase.from('inventario').select('*'),
      supabase.from('detalles_pedido').select('*').order('id')
    ])
    
    const cruzados = (pRes.data || []).map(p => {
      const c = (cRes.data || []).find(cl => cl.id === p.cliente_id)
      const detalles = (dRes.data || []).filter(d => d.pedido_id === p.id).map(d => {
        const inv = (iRes.data || []).find(i => i.id === d.producto_id)
        return { ...d, p_nombre: inv?.nombre || 'Producto eliminado', stock: inv?.stock || 0 }
      })
      return { ...p, ...c, detalles }
    })

    setDatos(cruzados)
    setLoading(false)
  }, [router])

  useEffect(() => { cargar() }, [cargar])

  // NUEVA LÓGICA DE ENTREGA PARCIAL
  const actualizarEntrega = async (det: any, cambio: number | 'todo') => {
    const actual = det.cantidad_entregada || 0
    const total = det.cantidad
    let nuevaCantidad = cambio === 'todo' ? total : actual + cambio

    if (nuevaCantidad < 0 || nuevaCantidad > total) return
    const variacion = nuevaCantidad - actual

    try {
      if (det.producto_id && variacion !== 0) {
        const rpcName = variacion > 0 ? 'entregar_stock' : 'revertir_entrega_stock'
        await supabase.rpc(rpcName, { prod_id: det.producto_id, cant: Math.abs(variacion) })
      }

      const nuevoEstado = nuevaCantidad === total ? 'Entregado' : 'Pendiente'
      await supabase.from('detalles_pedido').update({ 
        cantidad_entregada: nuevaCantidad, 
        estado: nuevoEstado 
      }).eq('id', det.id)

      cargar()
    } catch (err: any) {
      alert("Error: " + err.message)
    }
  }

  const borrarPedido = async (id: string, detalles: any[]) => {
    if (!confirm('¿Eliminar este pedido?')) return
    for (const d of detalles) {
      if (d.estado === 'Entregado' && d.producto_id) {
        await supabase.rpc('revertir_entrega_stock', { prod_id: d.producto_id, cant: d.cantidad_entregada || d.cantidad })
      }
    }
    await supabase.from('pedidos').delete().eq('id', id)
    cargar()
  }

  const abrirWhatsApp = (tel: string) => {
    const limpia = tel.replace(/\D/g, '')
    window.open(`https://wa.me/${limpia.startsWith('56') ? limpia : '56' + limpia}`, '_blank')
  }

  const exportarExcel = () => {
    const info = datos.map(p => ({
      Cliente: p.nombre,
      Colegio: p.colegio,
      Fecha: new Date(p.created_at).toLocaleDateString(),
      Estado: p.detalles.every((d: any) => d.estado === 'Entregado') ? 'Listo' : 'Pendiente',
      Total: p.total,
      Abono: p.abono,
      Deuda: p.total - p.abono
    }))
    const ws = XLSX.utils.json_to_sheet(info)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos")
    XLSX.writeFile(wb, "pedidos_taller.xlsx")
  }

  const filtrados = datos
    .filter(p => {
      const match = p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || p.colegio?.toLowerCase().includes(busqueda.toLowerCase())
      const todosEntregados = p.detalles.every((d: any) => d.cantidad_entregada === d.cantidad)
      if (filtro === 'Pendiente') return match && !todosEntregados
      if (filtro === 'Entregado') return match && todosEntregados
      return match
    })
    .sort((a, b) => ordenarColegio ? a.colegio?.localeCompare(b.colegio) : 0)

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl">CARGANDO...</div>

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between my-8">
          <button onClick={() => router.push('/')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-black tracking-tight">PEDIDOS</h1>
          <button onClick={exportarExcel} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-green-600">
            <Download size={24} />
          </button>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o colegio..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-3xl border-none shadow-sm font-bold text-lg outline-none focus:ring-2 ring-black transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['Todos', 'Pendiente', 'Entregado'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${filtro === f ? 'bg-black text-white' : 'bg-white text-slate-500 border border-slate-100'}`}
            >
              {f.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => setOrdenarColegio(!ordenarColegio)}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${ordenarColegio ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-100'}`}
          >
            {ordenarColegio ? 'ORDENADO POR COLEGIO' : 'ORDENAR POR COLEGIO'}
          </button>
        </div>

        {/* Lista de Pedidos */}
        <div className="grid gap-6">
          {filtrados.map((p, i) => {
            const deuda = p.total - p.abono
            const todosListos = p.detalles.every((d: any) => d.cantidad_entregada === d.cantidad)
            const entregadosCount = p.detalles.reduce((acc: number, d: any) => acc + (d.cantidad_entregada || 0), 0)
            const totalCount = p.detalles.reduce((acc: number, d: any) => acc + d.cantidad, 0)

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                key={p.id} 
                className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-200/50"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
                      {p.nombre}
                      {todosListos && <CheckCircle2 className="text-green-500" size={20} />}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-1"><School size={14} /> {p.colegio || 'Sin colegio'}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl font-black text-xs ${todosListos ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {todosListos ? 'LISTO' : 'PENDIENTE'}
                  </div>
                </div>

                {/* Items del pedido con la nueva UI de entrega */}
                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  {p.detalles.map((d: any, idx: number) => {
                    const itemListo = d.cantidad_entregada === d.cantidad
                    return (
                      <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-black text-slate-900">{d.p_nombre}</p>
                          <p className="text-xs font-bold text-slate-500">
                            Talla {d.talla} | <span className="text-black">{d.cantidad_entregada || 0} de {d.cantidad} entregados</span>
                          </p>
                        </div>
                        
                        {/* BOTONERA MINIMALISTA */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => actualizarEntrega(d, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200"
                          >
                            <Minus size={14} />
                          </button>
                          <button 
                            onClick={() => actualizarEntrega(d, 1)}
                            className="px-3 h-8 flex items-center justify-center bg-black text-white rounded-lg font-black text-xs"
                          >
                            +1
                          </button>
                          <button 
                            onClick={() => actualizarEntrega(d, 'todo')}
                            className={`px-3 h-8 flex items-center justify-center rounded-lg font-black text-xs border ${itemListo ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                          >
                            {itemListo ? <Check size={14} /> : 'TODO'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  <div className="pt-2 px-2 flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                    <span>Progreso Total</span>
                    <span>{entregadosCount} / {totalCount} Unidades</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Abonado</p>
                    <p className="text-xl font-black text-blue-600">${p.abono?.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Deuda</p>
                    <p className={`text-xl font-black ${deuda > 0 ? 'text-red-500' : 'text-green-500'}`}>${deuda.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between border-top pt-4 gap-2">
                  <button onClick={() => borrarPedido(p.id, p.detalles)} className="p-4 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => abrirWhatsApp(p.c_telefono)} className="px-6 py-4 bg-[#25D366] text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-green-200">
                      <MessageCircle size={20} /> WHATSAPP
                    </button>
                    <button onClick={() => window.open(`/ticket/${p.id}`, '_blank')} className="px-6 py-4 bg-black text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-slate-200">
                      <Printer size={20} /> TICKET
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}