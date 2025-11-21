<template>
  <q-layout view="hHh lpR fFf" class="bg-page">
    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <div class="header-content">
        <!-- IZQUIERDA: menú + título -->
        <div class="left-section">
          <q-btn
            flat
            dense
            round
            icon="menu"
            class="menu-btn"
            size="md"
          />

          <div class="title-section">
            <div class="title-app">Sistema de Gestión de Talento Interno</div>
            <div class="subtitle-app">
              Movilidad interna inteligente basada en skills
            </div>
          </div>
        </div>

        <q-space />

        <!-- DERECHA: + menú y usuario -->
        <div class="right-section">
          <!-- BOTÓN + CON MENÚ (activador directo) -->
          <q-btn
            round
            color="white"
            text-color="primary"
            icon="add"
            size="md"
            class="add-btn"
          >
            <q-menu
              anchor="bottom right"
              self="top right"
              class="custom-menu"
              :offset="[0, 8]"
            >
              <q-list style="min-width: 220px">
                <q-item
                  clickable
                  v-ripple
                  v-close-popup
                  @click="navigate('/colaboradores/registrar')"
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
                  @click="navigate('/crear-vacante')"
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
            <q-avatar
              size="44px"
              color="white"
              text-color="primary"
              class="user-avatar"
            >
              <q-icon name="person" size="24px" />
            </q-avatar>

            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-role">Administrador</div>
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
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const tab = ref('demanda') // tab activa por defecto

// En producción esto vendría del login / store
const user = {
  name: 'F. Rosales'
}

function navigate (path) {
  router.push(path)
}

function changeTab (tabName) {
  tab.value = tabName
  // aquí luego puedes hacer router.push según el tab si quieres
}
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
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: $text-white;
  letter-spacing: -0.01em;
}

.subtitle-app {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
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
  gap: 10px; /* menos espacio entre + y usuario */
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
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
  color: $text-white;
}

.user-role {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
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
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
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
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
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
}
</style>
