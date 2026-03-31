import { supabase } from './supabase'

export const registrarLog = async (accion: string, detalles = '') => {
  try {
    if (typeof window === 'undefined') return
    const usuario = sessionStorage.getItem('user_name') || 'Desconocido'
    const accionFinal =
      usuario === 'Admin' && !accion.startsWith('Admin realizó una prueba:')
        ? `Admin realizó una prueba: ${accion}`
        : accion
    await supabase.from('auditoria').insert([
      {
        usuario,
        accion: accionFinal,
        detalles
      }
    ])
  } catch {
    // Log en segundo plano: no debe bloquear la UI
  }
}
