<template>
  <q-layout view="hHh lpR fFf" class="bg-page">

    <!-- TOP BAR -->
    <q-header elevated class="bg-primary text-white header-shadow">
      <div class="row items-center justify-between q-px-lg q-py-md">

        <!-- Left: Title + subtitle -->
        <div class="row items-center">
          <q-btn flat dense round icon="menu" class="q-mr-md text-white" />

          <div>
            <div class="title-app">Sistema de Gestión de Talento Interno</div>
            <div class="subtitle-app">Movilidad interna inteligente basada en skills</div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="row items-center q-gutter-sm">

          <!-- PLUS BUTTON (MENU) -->
          <q-btn
            round
            color="white"
            text-color="primary"
            icon="add"
            size="18px"
            @click="menu = !menu"
          />

          <q-menu v-model="menu" anchor="bottom right" self="top right">
            <q-list style="min-width:180px">
              <q-item clickable v-ripple @click="navigate('/colaboradores/registrar')">
                <q-item-section avatar><q-icon name="person_add" /></q-item-section>
                <q-item-section>Registrar colaborador</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="navigate('/vacantes/crear')">
                <q-item-section avatar><q-icon name="work" /></q-item-section>
                <q-item-section>Crear vacante</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

          <!-- USER INFO -->
          <div class="row items-center q-ml-md">
            <q-avatar size="38px" color="white" text-color="primary" class="avatar-shadow">
              <q-icon name="person" size="28px" />
            </q-avatar>
            <div class="q-ml-sm text-right">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-role">Administrador</div>
            </div>
          </div>

        </div>
      </div>

      <!-- NAV TABS -->
      <div class="tabs-container">
        <q-tabs
          v-model="tab"
          class="text-primary tabs-style"
          align="left"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="vista" label="Vista General" />
          <q-tab name="mapping" label="Skill Mapping" />
          <q-tab name="demanda" label="Demanda de Talento" />
          <q-tab name="brechas" label="Brechas de Skill" />
        </q-tabs>
      </div>

    </q-header>

    <!-- PAGE CONTENT -->
    <q-page-container class="q-pa-lg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const menu = ref(false);
const router = useRouter();
const tab = ref("vista");

// usuario temporal – en producción viene del login
const user = {
  name: "F. Rosales"
};

function navigate(path) {
  menu.value = false;
  router.push(path);
}
</script>

<style lang="scss">
.bg-primary {
  background: #2469bc !important;
}

.bg-page {
  background: #f4f3f9;
}

.header-shadow {
  box-shadow: 0 3px 6px rgba(0,0,0,0.08);
}

.title-app {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.subtitle-app {
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  opacity: 0.9;
}

.user-name {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  opacity: 0.8;
}

.tabs-container {
  background: #f4f3f9;
  border-top: 1px solid #2469bc;
  border-bottom: 1px solid #bdc7d9;
}

.tabs-style .q-tab {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  transition: 0.2s ease;
}

.tabs-style .q-tab:hover {
  background: rgba(36,105,188,0.12);
  color: #2469bc;
}

.avatar-shadow {
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
</style>
