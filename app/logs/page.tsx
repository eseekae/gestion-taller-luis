'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Calendar, User, ClipboardList } from 'lucide-react'

export default function LogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usuarioActivo, setUsuarioActivo] = useState('')

  const cargarLogs = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('auditoria')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    setLogs(data || [])
    setLoading(false)
  }

  const limpiarLogsAdmin = async () => {
    if (usuarioActivo !== 'Admin') return
    if (!confirm('¿Eliminar todos los logs del usuario Admin?')) return
    await supabase.from('auditoria').delete().eq('usuario', 'Admin')
    await cargarLogs()
  }

  useEffect(() => {
    const iniciar = async () => {
      if (!sessionStorage.getItem('user_role')) {
        router.push('/login')
        return
      }
      setUsuarioActivo(sessionStorage.getItem('user_name') || '')
      await cargarLogs()
    }
    iniciar()
  }, [router])

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => router.push('/')} style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '10px', borderRadius: '12px', color: '#000', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#000' }}>Historial de Auditoría</h1>
        </div>

        {usuarioActivo === 'Admin' && (
          <div style={{ marginBottom: '14px' }}>
            <button onClick={limpiarLogsAdmin} style={{ border: '2px solid #000', backgroundColor: '#fff', color: '#000', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>
              Limpiar mis Pruebas
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading && <p style={{ fontSize: '14px', fontWeight: '900', color: '#000' }}>Cargando movimientos...</p>}
          {!loading && logs.length === 0 && <p style={{ fontSize: '14px', fontWeight: '900', color: '#000' }}>No hay registros aún.</p>}

          {logs.map(log => (
            <div key={log.id} style={{ backgroundColor: '#fff', border: '2px solid #000', borderRadius: '16px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '900', color: '#000' }}>
                  <Calendar size={14} /> {log.created_at ? new Date(log.created_at).toLocaleString('es-CL') : '-'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '900', color: '#000' }}>
                  <User size={14} /> {log.usuario || 'Desconocido'}
                </span>
              </div>
              <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ClipboardList size={14} /> {log.accion || '-'}
              </p>
              {log.detalles && <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#334155' }}>{log.detalles}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
