'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ShieldCheck, Scissors, User as UserIcon } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [clave, setClave] = useState('')
  const [usuario, setUsuario] = useState<'Luis' | 'Luisa' | 'Admin'>('Luis')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    // Simulamos un delay para que la animación de carga se vea pro
    setTimeout(() => {
      const claveEsperada = usuario === 'Admin' ? '1212' : '1122'
      if (clave === claveEsperada) {
        const perfilSesion = { nombre: usuario, permiso_ver_lucas: true }
        sessionStorage.setItem('user_role', JSON.stringify(perfilSesion))
        sessionStorage.setItem('user_name', usuario)
        router.push('/')
      } else {
        setError('❌ Clave incorrecta, intenta de nuevo')
        setIsSubmitting(false)
      }
    }, 800)
  }

  // ESTILOS NEUBRUTALISTAS PULIDOS
  const shadowStyle = "8px 8px 0px #000"
  const activeShadow = "2px 2px 0px #000"

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f1f5f9', 
      backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
      backgroundSize: '30px 30px', // Efecto mesa de corte
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{ 
          maxWidth: '420px', 
          width: '100%', 
          backgroundColor: '#fff', 
          padding: '40px', 
          borderRadius: '32px', 
          border: '4px solid #000', 
          boxShadow: shadowStyle,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* DECORACIÓN SUPERIOR */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '12px', background: 'linear-gradient(90deg, #fbbf24, #3b82f6, #4ade80)' }} />

        {/* LOGO ANIMADO */}
        <motion.div 
          whileHover={{ rotate: 15 }}
          style={{ 
            display: 'inline-flex', 
            padding: '20px', 
            backgroundColor: '#000', 
            color: '#fff', 
            borderRadius: '24px', 
            marginBottom: '24px',
            border: '4px solid #000',
            boxShadow: '4px 4px 0px #3b82f6'
          }}
        >
          <Scissors size={38} />
        </motion.div>

        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '950', color: '#000', letterSpacing: '-1px' }}>CREACIONES YOVI</h1>
        <p style={{ margin: '0 0 32px 0', fontSize: '15px', color: '#475569', fontWeight: '700' }}>SISTEMA DE GESTIÓN TALLER</p>

        {/* SELECTOR DE USUARIO PRO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {(['Luis', 'Luisa', 'Admin'] as const).map((u) => (
            <motion.button
              key={u}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, boxShadow: activeShadow }}
              onClick={() => setUsuario(u)}
              style={{ 
                padding: '14px 5px', 
                border: '3px solid #000', 
                borderRadius: '16px', 
                backgroundColor: usuario === u ? '#000' : '#fff', 
                color: usuario === u ? '#fff' : '#000', 
                fontWeight: '900', 
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: usuario === u ? 'none' : '4px 4px 0px #000',
                transition: 'background-color 0.2s'
              }}
            >
              {u.toUpperCase()}
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', textTransform: 'uppercase' }}>
              <Lock size={14} /> Contraseña de Acceso
            </label>
            <input 
              type="password" 
              placeholder="••••" 
              style={{
                width: '100%', 
                padding: '16px', 
                borderRadius: '16px', 
                border: '3px solid #000', 
                backgroundColor: '#fff', 
                color: '#000', 
                fontWeight: '800', 
                fontSize: '18px', 
                boxSizing: 'border-box',
                outline: 'none',
                boxShadow: 'inset 4px 4px 0px #f1f5f9'
              }} 
              value={clave} 
              onChange={(e) => setClave(e.target.value)} 
              required 
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0 }}
                style={{ color: '#ef4444', fontSize: '14px', fontWeight: '900', margin: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button 
            type="submit" 
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              width: '100%', 
              padding: '20px', 
              backgroundColor: '#4ade80', 
              color: '#000', 
              border: '4px solid #000', 
              borderRadius: '20px', 
              fontWeight: '950', 
              fontSize: '18px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px',
              boxShadow: isSubmitting ? 'none' : '6px 6px 0px #000'
            }}
          >
            {isSubmitting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Scissors size={24} />
              </motion.div>
            ) : (
              <>
                <ShieldCheck size={24} /> 
                ENTRAR AL TALLER
              </>
            )}
          </motion.button>
        </form>

        <p style={{ marginTop: '30px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>
          Creaciones Yovi v2.0 • San Joaquín
        </p>
      </motion.div>
    </main>
  )
}