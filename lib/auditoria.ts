import { supabase } from './supabase'

export const registrarLog = async (accion: string, detalles = '') => {
  try {
    if (typeof window === 'undefined') return
    const usuario = sessionStorage.getItem('user_name') || 'Desconocido'
    await supabase.from('auditoria').insert([
      {
        usuario,
        accion,
        detalles
      }
    ])
  } catch {
    // Log en segundo plano: no debe bloquear la UI
  }
}
