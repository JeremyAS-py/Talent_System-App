<template>
  <!-- Persistent narrow blue bar that stays visible full-height -->
  <div class="left-bar" v-show="!internalOpen" aria-hidden="true"></div>

  <!-- Sliding menu sits to the right of the blue bar -->
  <div class="sidebar" :class="{ open: internalOpen }">
    <nav class="menu">
      <button class="menu-item" @click="emitNavigate('vista')">
        <div class="icon" style="background-image: url('/icons/Inicio.png')"></div>
        <span class="label">Inicio</span>
      </button>

      <button class="menu-item" @click="emitNavigate('bulk-upload')">
        <div class="icon" style="background-image: url('/icons/CargaMasiva.png')"></div>
        <span class="label">Carga masiva</span>
      </button>

      <button class="menu-item" @click="emitNavigate('export')">
        <div class="icon" style="background-image: url('/icons/Descargar.png')"></div>
        <span class="label">Exportar</span>
      </button>

      <div class="spacer"></div>

      <button class="menu-item logout-item" @click="emitNavigate('logout')">
        <div class="icon" style="background-image: url('/icons/Salir.png')"></div>
        <span class="label">Cerrar sesión</span>
      </button>
    </nav>
  </div>

  <!-- Backdrop that covers the content area (click outside to close) -->
  <div v-if="internalOpen" class="backdrop" @click="closeOnOutside" aria-hidden="true"></div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  initialOpen: { type: Boolean, default: false },
  isOpen: { type: Boolean, required: false },
})

const emit = defineEmits(['navigate', 'toggle'])

const internalOpen = ref(props.initialOpen)

watch(
  () => props.isOpen,
  (val) => {
    if (typeof val === 'boolean') internalOpen.value = val
  },
)

function closeMenu() {
  internalOpen.value = false
  emit('toggle', false)
}

function emitNavigate(dest) {
  emit('navigate', dest)
  // close sidebar when navigating
  closeMenu()
}

function closeOnOutside() {
  closeMenu()
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  /* aligned to left edge when open */
  top: 64px;
  left: 0;
  width: 200px;
  height: calc(100vh - 64px);
  background-color: #2469bc;
  display: flex;
  flex-direction: column;
  padding-top: 12px; /* leave space so header content isn't fully covered */
  transition: transform 0.28s ease;
  z-index: 2300;
  border-top-right-radius: 8px;
}

.sidebar.open {
  transform: translateX(0);
}
.sidebar:not(.open) {
  /* move fully off-screen so only the left-bar remains visible */
  transform: translateX(-100%);
}

.backdrop {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: calc(100vh - 64px);
  background: rgba(0, 0, 0, 0);
  z-index: 2250;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 14px;
  height: calc(100% - 72px);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: white;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 12px 10px;
  width: 100%;
  text-align: left;
}

.icon {
  width: 34px;
  height: 34px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: brightness(0) invert(1);
}

.label {
  margin-left: 8px;
  color: #fff;
}

.spacer {
  flex: 1 1 auto;
}
.logout-item {
  margin-bottom: 18px;
}

.left-bar {
  border-top-right-radius: 8px;
}
</style>
