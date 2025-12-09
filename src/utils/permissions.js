// src/utils/permissions.js

// OJO: estos nombres deben ser EXACTAMENTE los mismos que vienen de la BD/JWT
export const ROLE_ADMIN = 'Admin'
export const ROLE_RRHH = 'RRHH'
export const ROLE_BM = 'Business Manager'

export const ACTIONS = {
  CREAR_COLAB: 'CREAR_COLAB',
  CREAR_VACANTE: 'CREAR_VACANTE',
  CARGA_MASIVA: 'CARGA_MASIVA',
  EDITAR_COLAB: 'EDITAR_COLAB',
  PLAN_CAPACITACION: 'PLAN_CAPACITACION',
  MATCHING: 'MATCHING',
  VER_BRECHAS: 'VER_BRECHAS',
  EXPORTAR_REPORTES: 'EXPORTAR_REPORTES',
  AUDITORIA: 'AUDITORIA',
}

// Matriz de permisos (tu lista pero pasada a código)
const PERMISSIONS = {
  [ACTIONS.CREAR_COLAB]: [ROLE_ADMIN, ROLE_RRHH],
  [ACTIONS.CREAR_VACANTE]: [ROLE_ADMIN, ROLE_RRHH],
  [ACTIONS.CARGA_MASIVA]: [ROLE_ADMIN],
  [ACTIONS.EDITAR_COLAB]: [ROLE_ADMIN, ROLE_RRHH],
  [ACTIONS.PLAN_CAPACITACION]: [ROLE_ADMIN, ROLE_RRHH],
  [ACTIONS.MATCHING]: [ROLE_ADMIN, ROLE_RRHH, ROLE_BM],
  [ACTIONS.VER_BRECHAS]: [ROLE_ADMIN, ROLE_RRHH, ROLE_BM],
  [ACTIONS.EXPORTAR_REPORTES]: [ROLE_ADMIN, ROLE_RRHH],
  [ACTIONS.AUDITORIA]: [ROLE_ADMIN],
}

// ¿Este rol puede hacer esta acción?
export function can(role, action) {
  if (!role) return false
  const allowedRoles = PERMISSIONS[action] || []
  return allowedRoles.includes(role)
}

// ¿Este rol puede hacer al menos una de estas acciones?
export function canAny(role, actions) {
  return actions.some((a) => can(role, a))
}
