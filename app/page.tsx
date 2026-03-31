'use client'
import { useEffect, useState } from 'react' // Añadimos hooks para la sesión
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingBag, ClipboardList, Package, BarChart3, Scissors, LogOut, History } from 'lucide-react' // Añadimos LogOut

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null) // Estado para el usuario

  // 1. Verificación de Seguridad: Obliga a loguearse cada vez que se abre la página
  useEffect(() => {
    const session = sessionStorage.getItem('user_role')
    const userName = sessionStorage.getItem('user_name')
    if (!session) {
      router.push('/login') 
    } else {
      const parsed = JSON.parse(session)
      setUser({ ...parsed, nombre: userName || parsed.nombre })
    }
  }, [router])

  // 2. Función para Salir: Limpia la memoria y vuelve al login
  const logout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  // Animaciones para que los elementos aparezcan en cascada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  }

  // Si no hay usuario, no renderizamos nada para evitar parpadeos
  if (!user) return null

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', borderTop: user?.nombre === 'Admin' ? '8px solid #3b82f6' : '8px solid transparent' }}>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ maxWidth: '450px', width: '100%' }}
      >
        
        {/* CABECERA CORPORATIVA */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            variants={{ hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '18px', marginBottom: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <Scissors size={32} />
          </motion.div>
          <motion.h1 
            variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}
          >
            Sistema de Gestión
          </motion.h1>
          
          {/* Mostramos el perfil activo */}
          <motion.div 
            variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Sesión:</span>
            <span style={{ backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>
              {user.nombre}
            </span>
          </motion.div>
        </div>

        {/* BOTONERA PRINCIPAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <MenuButton 
            icon={<ShoppingBag size={24} />} 
            title="Nueva Venta" 
            subtitle="Registrar un pedido en el sistema"
            color="#10b981" 
            onClick={() => router.push('/nuevo-pedido')} 
          />
          
          <MenuButton 
            icon={<ClipboardList size={24} />} 
            title="Ver Pedidos" 
            subtitle="Control de entregas y abonos"
            color="#f59e0b" 
            onClick={() => router.push('/pedidos')} 
          />
          
          <MenuButton 
            icon={<Package size={24} />} 
            title="Inventario" 
            subtitle="Gestión de stock físico e insumos"
            color="#3b82f6" 
            onClick={() => router.push('/inventario')} 
          />

          <MenuButton
            icon={<History size={24} />}
            title="Historial de Movimientos"
            subtitle="Auditoría de acciones del sistema"
            color="#0f172a"
            onClick={() => router.push('/logs')}
          />

          {/* Solo el Jefe ve Estadísticas */}
          {user.permiso_ver_lucas && (
            <MenuButton 
              icon={<BarChart3 size={24} />} 
              title="Estadísticas" 
              subtitle="Reportes financieros y rendimiento"
              color="#8b5cf6" 
              onClick={() => router.push('/estadisticas')} 
            />
          )}

          {/* BOTÓN CERRAR SESIÓN ROJO */}
          <motion.button 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout} 
            style={{ 
              marginTop: '30px', 
              backgroundColor: '#fee2e2', 
              border: '1px solid #fecaca', 
              color: '#ef4444', 
              fontWeight: '800', 
              padding: '16px', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              fontSize: '15px',
              width: '100%'
            }}
          >
            <LogOut size={20} /> Salir y Cambiar Perfil
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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 1.02, translateY: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ 
        width: '100%', 
        padding: '20px', 
        backgroundColor: '#fff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '20px', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        textAlign: 'left'
      }}
    >
      <div style={{ backgroundColor: color, color: '#000000', padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{title}</p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#64748b' }}>{subtitle}</p>
      </div>
    </motion.button>
  )
}
//Probando rama develop