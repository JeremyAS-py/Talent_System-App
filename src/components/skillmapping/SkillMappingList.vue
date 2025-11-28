<template>
  <div>
    <SkillMappingItem
      v-for="colaborador in colaboradores"
      :key="colaborador.id"
      :colaborador="colaborador"
      :search-term="searchTerm"
    />
    <div v-if="!colaboradores.length" class="text-center text-grey-6 q-mt-xl">
      <q-icon name="person_search" size="4em" />
      <p class="q-mt-md text-body1">No se encontraron colaboradores.</p>
      <p>Intenta ajustar los filtros de búsqueda.</p>
    </div>
  </div>
</template>

<script setup>
import SkillMappingItem from './SkillMappingItem.vue'

defineProps({
  colaboradores: {
    type: Array,
    required: true,
  },
  searchTerm: {
    type: String,
    default: '',
  },
})
</script>
