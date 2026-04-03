'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ClipboardList, Package, Scissors, LogOut, Calendar, LayoutDashboard, UserCircle } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // FIX: Cambiamos sessionStorage por localStorage para romper el círculo vicioso
    const session = localStorage.getItem('user_role')
    const userName = localStorage.getItem('user_name')
    
    if (!session) {
      router.push('/login') 
    } else {
      setUser({ role: session, nombre: userName || 'Usuario' })
    }
  }, [router])

  const logout = () => {
    // FIX: Limpiamos localStorage para cerrar la sesión de verdad
    localStorage.clear()
    router.push('/login')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08, delayChildren: 0.2 } 
    }
  }

  if (!user) return null

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
      backgroundSize: '32px 32px',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '40px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ maxWidth: '480px', width: '100%' }}
      >
        
        {/* CABECERA PRO */}
        <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
          <motion.div 
            variants={{ hidden: { scale: 0, rotate: -180 }, visible: { scale: 1, rotate: 0 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '85px', 
              height: '85px', 
              backgroundColor: '#000', 
              color: '#fff', 
              borderRadius: '28px', 
              marginBottom: '24px', 
              border: '4px solid #000', 
              boxShadow: '8px 8px 0px #3b82f6' 
            }}
          >
            <Scissors size={42} />
          </motion.div>

          <motion.h1 
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            style={{ margin: '0 0 12px 0', fontSize: '38px', fontWeight: '950', color: '#000', letterSpacing: '-1.5px', textTransform: 'uppercase' }}
          >
            PANEL DE CONTROL
          </motion.h1>
          
          <motion.div 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: '#000', 
              padding: '6px 16px', 
              borderRadius: '12px',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px #4ade80'
            }}
          >
            <UserCircle size={16} color="#fff" />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              OPERADOR: {user.nombre}
            </span>
          </motion.div>
        </div>

        {/* GRILLA DE ACCIONES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <MenuButton 
            icon={<ShoppingBag size={26} />} 
            title="NUEVA VENTA" 
            subtitle="Registrar pedido o entrega inmediata"
            color="#4ade80" 
            onClick={() => router.push('/nuevo-pedido')} 
          />
          
          <MenuButton 
            icon={<ClipboardList size={26} />} 
            title="GESTIÓN PEDIDOS" 
            subtitle="Seguimiento de deudas y avisos"
            color="#fbbf24" 
            onClick={() => router.push('/pedidos')} 
          />

          <MenuButton 
            icon={<Calendar size={26} />} 
            title="AGENDA ENTREGAS" 
            subtitle="Calendario de producción mensual"
            color="#3b82f6" 
            onClick={() => router.push('/calendario')} 
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <MenuButton 
              icon={<Scissors size={24} />} 
              title="TALLER" 
              subtitle="Pendientes"
              color="#f472b6" 
              onClick={() => router.push('/pendientes')} 
              compact
            />
            <MenuButton 
              icon={<Package size={24} />} 
              title="STOCK" 
              subtitle="Inventario"
              color="#a78bfa" 
              onClick={() => router.push('/inventario')} 
              compact
            />
          </div>

          {/* BOTÓN SALIR */}
          <motion.button 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            whileHover={{ y: -4, backgroundColor: '#000', color: '#fff', boxShadow: '0px 8px 0px #ef4444' }}
            whileTap={{ y: 2, boxShadow: 'none' }}
            onClick={logout} 
            style={{ 
              marginTop: '24px', 
              backgroundColor: '#fff', 
              border: '4px solid #000', 
              color: '#000', 
              fontWeight: '900', 
              padding: '18px', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px',
              fontSize: '16px',
              width: '100%',
              boxShadow: '6px 6px 0px #000',
              transition: 'all 0.1s ease'
            }}
          >
            <LogOut size={22} /> CERRAR SESIÓN DEL TALLER
          </motion.button>

        </div>

        <p style={{ marginTop: '40px', textAlign: 'center', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px' }}>
          CREACIONES YOVI • EST. 1998 • V2.0
        </p>
      </motion.div>
    </main>
  )
}

function MenuButton({ icon, title, subtitle, color, onClick, compact }: any) {
  return (
    <motion.button 
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ y: -6, boxShadow: `10px 10px 0px #000` }}
      whileTap={{ y: 2, boxShadow: '2px 2px 0px #000' }}
      onClick={onClick}
      style={{ 
        width: '100%', 
        padding: compact ? '20px' : '24px', 
        backgroundColor: '#fff', 
        border: '4px solid #000', 
        borderRadius: '24px', 
        cursor: 'pointer', 
        display: 'flex', 
        flexDirection: compact ? 'column' : 'row',
        alignItems: compact ? 'flex-start' : 'center', 
        gap: compact ? '12px' : '24px', 
        boxShadow: '6px 6px 0px #000',
        textAlign: 'left',
        position: 'relative',
        transition: 'all 0.1s ease'
      }}
    >
      <div style={{ 
        backgroundColor: color, 
        color: '#000', 
        padding: '14px', 
        borderRadius: '18px', 
        border: '3px solid #000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '3px 3px 0px #000'
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 2px 0', fontSize: compact ? '16px' : '20px', fontWeight: '950', color: '#000', lineHeight: '1' }}>{title}</p>
        {!compact && <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#475569' }}>{subtitle}</p>}
        {compact && <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>{subtitle}</p>}
      </div>
    </motion.button>
  )
}