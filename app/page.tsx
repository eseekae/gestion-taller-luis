'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingBag, ClipboardList, Package, BarChart3, Scissors, LogOut, History, Box } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const session = sessionStorage.getItem('user_role')
    const userName = sessionStorage.getItem('user_name')
    if (!session) {
      router.push('/login') 
    } else {
      setUser({ role: session, nombre: userName || 'Usuario' })
    }
  }, [router])

  const logout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  }

  if (!user) return null

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ maxWidth: '450px', width: '100%' }}
      >
        
        {/* CABECERA CORPORATIVA NEUBRUTALIST */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            variants={{ hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', backgroundColor: '#000', color: '#fff', borderRadius: '20px', marginBottom: '20px', border: '3px solid #000', boxShadow: '6px 6px 0px #3b82f6' }}
          >
            <Scissors size={35} />
          </motion.div>
          <motion.h1 
            variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '900', color: '#000', letterSpacing: '-1px' }}
          >
            Gestión Don Luis
          </motion.h1>
          
          <motion.div 
            variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '14px', fontWeight: '900', color: '#000', textTransform: 'uppercase' }}>
              Sesión Activa: {user.nombre}
            </span>
          </motion.div>
        </div>

        {/* BOTONERA PRINCIPAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <MenuButton 
            icon={<ShoppingBag size={24} />} 
            title="Nueva Venta" 
            subtitle="Registrar pedido de cliente"
            color="#4ade80" 
            onClick={() => router.push('/nuevo-pedido')} 
          />
          
          <MenuButton 
            icon={<ClipboardList size={24} />} 
            title="Ver Pedidos" 
            subtitle="Entregas, abonos y deudas"
            color="#fbbf24" 
            onClick={() => router.push('/pedidos')} 
          />

          {/* NUEVO BOTÓN DE PRODUCCIÓN */}
          <MenuButton 
            icon={<Scissors size={24} />} 
            title="Prendas Pendientes" 
            subtitle="Lo que falta fabricar por colegio"
            color="#f472b6" 
            onClick={() => router.push('/pendientes')} 
          />
          
          <MenuButton 
            icon={<Package size={24} />} 
            title="Inventario" 
            subtitle="Stock de productos e insumos"
            color="#60a5fa" 
            onClick={() => router.push('/inventario')} 
          />

          {/* BOTÓN SALIR */}
          <motion.button 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            whileHover={{ scale: 1.02, backgroundColor: '#ef4444', color: '#fff' }}
            whileTap={{ scale: 0.98 }}
            onClick={logout} 
            style={{ 
              marginTop: '20px', 
              backgroundColor: '#fff', 
              border: '3px solid #000', 
              color: '#000', 
              fontWeight: '900', 
              padding: '16px', 
              borderRadius: '16px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              fontSize: '15px',
              width: '100%',
              boxShadow: '4px 4px 0px #000'
            }}
          >
            <LogOut size={20} /> Cerrar Sesión
          </motion.button>

        </div>
      </motion.div>
    </main>
  )
}

function MenuButton({ icon, title, subtitle, color, onClick }: any) {
  return (
    <motion.button 
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 1.03, boxShadow: '8px 8px 0px #000' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ 
        width: '100%', 
        padding: '22px', 
        backgroundColor: '#fff', 
        border: '3px solid #000', 
        borderRadius: '20px', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        boxShadow: '4px 4px 0px #000',
        textAlign: 'left'
      }}
    >
      <div style={{ backgroundColor: color, color: '#000', padding: '14px', borderRadius: '14px', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 2px 0', fontSize: '18px', fontWeight: '900', color: '#000' }}>{title}</p>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#475569' }}>{subtitle}</p>
      </div>
    </motion.button>
  )
}