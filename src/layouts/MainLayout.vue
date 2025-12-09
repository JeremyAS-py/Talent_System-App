<template>
  <q-layout view="hHh lpR fFf" class="bg-page">
    <!-- DRAWER LATERAL -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      :width="260"
      class="main-drawer bg-primary text-white"
    >
      <div class="drawer-content">
        <!-- Logo / espacio superior -->
        <div class="drawer-header q-px-lg q-pt-md q-pb-lg">
          <div class="drawer-title">
            <span class="drawer-app-name">Sistema de Gestión</span>
          </div>
        </div>

        <!-- OPCIONES PRINCIPALES -->
        <q-list padding class="drawer-list">
          <!-- INICIO (lleva a Vista General) -->
          <q-item clickable v-ripple class="drawer-item" @click="goHome">
            <q-item-section avatar>
              <img :src="inicioIcon" alt="Inicio" class="drawer-icon" />
            </q-item-section>
            <q-item-section>Inicio</q-item-section>
          </q-item>

          <!-- CARGA MASIVA -->
          <q-item clickable v-ripple class="drawer-item" @click="goCargaMasiva">
            <q-item-section avatar>
              <img :src="cargaIcon" alt="Carga masiva" class="drawer-icon" />
            </q-item-section>
            <q-item-section>Carga Masiva</q-item-section>
          </q-item>

          <!-- EXPORTAR -->
          <q-item clickable v-ripple class="drawer-item" @click="goExportar">
            <q-item-section avatar>
              <q-icon name="download" size="22px" class="drawer-icon-icon" />
            </q-item-section>
            <q-item-section>Exportar</q-item-section>
          </q-item>

          <!-- AUDITORÍA -->
          <q-item clickable v-ripple class="drawer-item" @click="goAuditoria">
            <q-item-section avatar>
              <q-icon name="fact_check" size="22px" class="drawer-icon-icon" />
            </q-item-section>
            <q-item-section>Auditoría</q-item-section>
          </q-item>
        </q-list>

        <!-- CERRAR SESIÓN ABAJO -->
        <div class="drawer-footer q-px-lg q-pb-lg q-pt-md">
          <q-item clickable v-ripple class="drawer-item drawer-item-logout" @click="logout">
            <q-item-section avatar>
              <img :src="cerrarIcon" alt="Cerrar sesión" class="drawer-icon" />
            </q-item-section>
            <q-item-section>Cerrar Sesión</q-item-section>
          </q-item>
        </div>
      </div>
    </q-drawer>

    <!-- HEADER PRINCIPAL (se oculta en /app/colaboradores/registrar) -->
    <q-header v-if="showLayout" elevated class="bg-primary text-white">
      <div class="header-content">
        <!-- IZQUIERDA: menú + título -->
        <div class="left-section">
          <q-btn flat dense round icon="menu" class="menu-btn" size="md" @click="toggleDrawer" />

          <div class="title-section">
            <div class="title-app">Sistema de Gestión de Talento Interno</div>
            <div class="subtitle-app">Movilidad interna inteligente basada en skills</div>
          </div>
        </div>

        <q-space />

        <!-- DERECHA: + menú y usuario -->
        <div class="right-section">
          <!-- BOTÓN + CON MENÚ (activador directo) -->
          <q-btn round color="white" text-color="primary" icon="add" size="md" class="add-btn">
            <q-menu anchor="bottom right" self="top right" class="custom-menu" :offset="[0, 8]">
              <q-list style="min-width: 220px">
                <q-item
                  clickable
                  v-ripple
                  v-close-popup
                  @click="navigate('/app/colaboradores/registrar')"
                  class="menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="person_add" color="primary" size="20px" />
                  </q-item-section>
                  <q-item-section>Registrar colaborador</q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-ripple
                  v-close-popup
                  @click="navigate('/app/crear-vacante')"
                  class="menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="work" color="primary" size="20px" />
                  </q-item-section>
                  <q-item-section>Crear vacante</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!-- USUARIO -->
          <div class="user-section">
            <q-avatar size="44px" color="white" text-color="primary" class="user-avatar">
              <q-icon name="person" size="24px" />
            </q-avatar>

            <div class="user-info">
              <div class="user-name ellipsis" :title="userName">
                {{ userName || 'Usuario' }}
              </div>
              <div class="user-role ellipsis" :title="userRole">
                {{ userRole || 'Rol' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABS -->
      <div class="tabs-container">
        <q-tabs
          v-model="tab"
          class="custom-tabs"
          align="left"
          active-color="primary"
          indicator-color="primary"
          dense
        >
          <q-tab
            name="vista"
            label="Vista General"
            class="custom-tab"
            @click="changeTab('vista')"
          />
          <q-tab
            name="mapping"
            label="Skill Mapping"
            class="custom-tab"
            @click="changeTab('mapping')"
          />
          <q-tab
            name="demanda"
            label="Demanda de Talento"
            class="custom-tab"
            @click="changeTab('demanda')"
          />
          <q-tab
            name="brechas"
            label="Brechas de Skill"
            class="custom-tab"
            @click="changeTab('brechas')"
          />
        </q-tabs>
      </div>
    </q-header>

    <!-- CONTENIDO -->
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>

    <!-- Carga Masiva modal (componente flotante) -->
    <CargaMasivaPage :modelValue="showCargaMasiva" @close="() => (showCargaMasiva = false)" />
  </q-layout>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import inicioIcon from 'assets/dashboard/home.png'
import cargaIcon from 'assets/dashboard/carga-de-archivos.png'
import cerrarIcon from 'assets/dashboard/cerrar-sesion.png'
import CargaMasivaPage from 'pages/CargaMasivaPage.vue'

const router = useRouter()
const route = useRoute()
const userName = ref('')
const userRole = ref('')

function loadUserFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const payloadBase64 = token.split('.')[1]
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)

    // Posibles keys según cómo generes el JWT en .NET
    const nameKeys = ['name', 'given_name', 'unique_name', 'email', 'sub']
    const roleKeys = [
      'role',
      'roles',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    ]

    // Nombre
    for (const k of nameKeys) {
      if (payload[k]) {
        userName.value = payload[k]
        break
      }
    }

    // Rol
    for (const k of roleKeys) {
      if (payload[k]) {
        userRole.value = Array.isArray(payload[k]) ? payload[k][0] : payload[k]
        break
      }
    }
  } catch (e) {
    console.error('Error decodificando token JWT', e)
  }
}

onMounted(() => {
  loadUserFromToken()
})
// Drawer lateral
const leftDrawerOpen = ref(false)
const showCargaMasiva = ref(false)
const toggleDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Mapa tab -> RUTA COMPLETA (incluye /app)
const tabRouteMap = {
  vista: '/app/vista-general',
  mapping: '/app/skill-mapping',
  demanda: '/app/demanda-talento',
  brechas: '/app/brechas-skill',
}

// Detecta qué tab va con la ruta actual
function getTabFromPath(path) {
  if (path.startsWith('/app/skill-mapping')) return 'mapping'
  if (path.startsWith('/app/demanda-talento')) return 'demanda'
  if (path.startsWith('/app/brechas-skill')) return 'brechas'
  // por defecto: Vista General
  return 'vista'
}

// Tab activa según ruta inicial
const tab = ref(getTabFromPath(route.path))

// Ocultar header (y tabs) en páginas de formulario pantalla completa
// ej: /app/colaboradores/registrar
const showLayout = computed(() => {
  return route.meta?.hideHeader !== true
})

// En producción esto vendría del login / store

// Navegar a una ruta
function navigate(path) {
  router.push(path)
}

// Acciones del drawer
function goHome() {
  navigate('/app/vista-general')
  leftDrawerOpen.value = false
}

function goCargaMasiva() {
  // abrir modal de carga masiva
  showCargaMasiva.value = true
  leftDrawerOpen.value = false
}

function goExportar() {
  // ajusta la ruta a la que tengas creada (ej: '/app/exportar')
  navigate('/app/exportar')
  leftDrawerOpen.value = false
}

function logout() {
  // ruta de login es '/', no '/login'
  navigate('/')
  leftDrawerOpen.value = false
}
function goAuditoria() {
  navigate('/app/auditoria')
  leftDrawerOpen.value = false
}

// Cuando haces click en una tab
function changeTab(tabName) {
  tab.value = tabName
  const path = tabRouteMap[tabName]
  if (path) router.push(path)
}

// Si navegas por otros lados, mantenemos el tab sincronizado
watch(
  () => route.path,
  (newPath) => {
    tab.value = getTabFromPath(newPath)
  },
)
</script>

<style lang="scss" scoped>
$primary-blue: #2469bc;
$bg-page: #f4f3f9;
$text-white: #ffffff;
$text-secondary: rgba(255, 255, 255, 0.9);
$border-color: #bdc7d9;
$hover-bg: rgba(36, 105, 188, 0.12);

.bg-primary {
  background: $primary-blue !important;
}

.bg-page {
  background: $bg-page;
}

/* ===== DRAWER LATERAL ===== */
.main-drawer {
  display: flex;
  flex-direction: column;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.drawer-title {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.drawer-list {
  flex: 1;
}

.drawer-item {
  border-radius: 0;
  padding: 12px 20px;
  font-family:
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 15px;
  color: $text-white;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
  }
}

.drawer-item-logout {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-top: 8px;
}

.drawer-icon {
  width: 22px;
  height: 22px;
}

.drawer-icon-icon {
  color: $text-white;
}

/* HEADER */
.header-content {
  display: flex;
  align-items: center;
  padding: 16px 32px;
  min-height: 72px;
}

/* IZQUIERDA */
.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  color: $text-white;

  &:hover {
    background: $hover-bg;
  }
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-app {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: $text-white;
  letter-spacing: -0.01em;
}

.subtitle-app {
  font-family:
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: $text-secondary;
  opacity: 0.85;
}

/* DERECHA */
.right-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-btn {
  background: $text-white !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);

  &:hover {
    background: rgba(255, 255, 255, 0.92) !important;
  }

  :deep(.q-icon) {
    color: $primary-blue;
  }
}

.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);

  :deep(.q-icon) {
    margin: 0;
    line-height: 1;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  text-align: left;
}

.user-name {
  font-family:
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
  color: $text-white;
}

.user-role {
  font-family:
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: $text-secondary;
  opacity: 0.8;
}

/* TABS */
.tabs-container {
  background: $bg-page;
  border-top: 1px solid $primary-blue;
  border-bottom: 1px solid $border-color;
  padding: 0 32px;
}

.custom-tabs {
  background: transparent;

  :deep(.q-tabs__content) {
    gap: 0;
  }

  :deep(.q-tab) {
    padding: 14px 20px;
    min-height: 48px;
    font-family:
      'Roboto',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    text-transform: none;
    letter-spacing: 0;
    transition: all 0.2s ease;
    border-radius: 0;

    &:hover {
      background: $hover-bg;
      color: $primary-blue;
    }

    &.q-tab--active {
      color: $primary-blue;
      font-weight: 600;
    }
  }

  :deep(.q-tabs__indicator) {
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: $primary-blue;
  }
}

/* CONTENEDOR DE PÁGINA */
.page-container {
  padding: 24px 32px;
}

/* MENÚ + */
.custom-menu {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-radius: 8px;

  :deep(.q-list) {
    padding: 8px;
  }
}

.menu-item {
  border-radius: 6px;
  padding: 10px 12px;
  font-family:
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 14px;

  &:hover {
    background: $hover-bg;
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }

  .tabs-container {
    padding: 0 16px;
  }

  .page-container {
    padding: 16px;
  }

  .title-app {
    font-size: 16px;
  }

  .subtitle-app {
    font-size: 12px;
  }

  .right-section {
    gap: 8px;
  }
  .ellipsis {
    max-width: 130px; /* ajusta según te guste */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}
</style>
