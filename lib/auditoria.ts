import { supabase } from './supabase'

export const registrarLog = async (accion: string, detalles = '') => {
  try {
    if (typeof window === 'undefined') return
    const usuario = sessionStorage.getItem('user_name') || 'Sistema/Anónimo'
    const accionFinal =
      usuario === 'Admin' && !accion.startsWith('Admin realizó una prueba:')
        ? `Admin realizó una prueba: ${accion}`
        : accion
    console.log('[auditoria] intentando registrar', { usuario, accion: accionFinal, detalles })
    const { error } = await supabase.from('auditoria').insert([
      {
        usuario,
        accion: accionFinal,
        detalles
      }
    ])
    if (error) {
      console.error('[auditoria] error al insertar log', error)
    }
  } catch {
    console.error('[auditoria] excepción inesperada al registrar log')
  }
}
