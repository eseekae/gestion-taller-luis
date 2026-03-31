'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Scissors } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [clave, setClave] = useState('')
  const [usuario, setUsuario] = useState<'Luis' | 'Luisa'>('Luis')
  const [error, setError] = useState('')

  const handleLogin = async (e: any) => {
    e.preventDefault()
    if (clave === '1122') {
      const perfilSesion = { nombre: usuario, permiso_ver_lucas: true }
      sessionStorage.setItem('user_role', JSON.stringify(perfilSesion))
      sessionStorage.setItem('user_name', usuario)
      router.push('/')
    } else {
      setError('❌ Clave incorrecta')
    }
  }

  const inputStyle = { 
    width: '100%', padding: '14px', borderRadius: '12px', border: '3px solid #000', 
    backgroundColor: '#fff', color: '#000', fontWeight: '800', fontSize: '16px', boxSizing: 'border-box' as const 
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '430px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '30px', border: '2px solid #000', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        
        <div style={{ display: 'inline-flex', padding: '15px', backgroundColor: '#000', color: '#fff', borderRadius: '18px', marginBottom: '20px' }}>
          <Scissors size={32} />
        </div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '26px', fontWeight: '900', color: '#000' }}>Acceso Taller</h1>
        <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#000', fontWeight: '700' }}>Selecciona usuario e ingresa clave</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
          <button type="button" onClick={() => setUsuario('Luis')} style={{ padding: '12px', border: '2px solid #000', borderRadius: '12px', backgroundColor: usuario === 'Luis' ? '#000' : '#fff', color: usuario === 'Luis' ? '#fff' : '#000', fontWeight: '900', cursor: 'pointer' }}>
            LUIS
          </button>
          <button type="button" onClick={() => setUsuario('Luisa')} style={{ padding: '12px', border: '2px solid #000', borderRadius: '12px', backgroundColor: usuario === 'Luisa' ? '#000' : '#fff', color: usuario === 'Luisa' ? '#fff' : '#000', fontWeight: '900', cursor: 'pointer' }}>
            LUISA
          </button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
              <Lock size={14} /> CONTRASEÑA
            </label>
            <input type="password" placeholder="••••" style={inputStyle} value={clave} onChange={(e) => setClave(e.target.value)} required />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: '800' }}>{error}</p>}

          <button type="submit" style={{ width: '100%', padding: '18px', backgroundColor: '#000', color: '#fff', border: '2px solid #000', borderRadius: '14px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <ShieldCheck size={20} /> Entrar al Sistema
          </button>
        </form>
      </motion.div>
    </main>
  )
}