<template>
  <q-card class="filter-card" flat>
    <q-card-section>
      <div class="panel-title text-h6">Filtro por Skills</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-select
        outlined
        v-model="selectedSkillType"
        :options="skillTypes"
        label="Tipo de Skill"
        dense
        class="q-mb-md"
      />

      <q-input outlined v-model="searchTerm" label="Buscar Skill" dense clearable class="q-mb-md">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-scroll-area style="height: 250px; border: 1px solid #e0e0e0; border-radius: 8px">
        <q-list dense padding>
          <q-item
            v-for="skill in filteredSkills"
            :key="skill.id"
            clickable
            v-ripple
            class="skill-item-selectable"
            :class="{ selected: selectedSkills.includes(skill.name) }"
            @click="toggleSkill(skill.name)"
          >
            <q-item-section>
              <q-item-label>{{ skill.name }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="selectedSkills.includes(skill.name)">
              <q-icon name="check" color="primary" />
            </q-item-section>
          </q-item>
          <q-item v-if="filteredSkills.length === 0" class="text-center">
            <q-item-section>
              <q-item-label caption>No hay skills para mostrar.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card-section>

    <q-separator />

    <q-card-section v-if="selectedSkills.length > 0">
      <div class="panel-subtitle text-weight-medium q-mb-sm">Skills Seleccionados</div>
      <div class="q-gutter-sm">
        <q-chip
          v-for="skill in selectedSkills"
          :key="skill"
          removable
          @remove="toggleSkill(skill)"
          color="primary"
          text-color="white"
          icon="check"
        >
          {{ skill }}
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

// --- State for Filters ---
const selectedSkillType = ref('Todos')
const searchTerm = ref('')

// --- Mock Data ---
const skillTypes = ['Todos', 'Técnicos', 'Blandos']
const allSkills = ref([
  { id: 's1', name: 'Vue.js', type: 'Técnicos' },
  { id: 's2', name: 'React', type: 'Técnicos' },
  { id: 's3', name: 'Angular', type: 'Técnicos' },
  { id: 's4', name: 'Node.js', type: 'Técnicos' },
  { id: 's5', name: 'Python', type: 'Técnicos' },
  { id: 's6', name: 'SQL', type: 'Técnicos' },
  { id: 's7', name: 'Liderazgo', type: 'Blandos' },
  { id: 's8', name: 'Comunicación', type: 'Blandos' },
  { id: 's9', name: 'Trabajo en equipo', type: 'Blandos' },
  { id: 's10', name: 'Resolución de problemas', type: 'Blandos' },
  { id: 's11', name: 'Diseño UX', type: 'Técnicos' },
  { id: 's12', name: 'Scrum', type: 'Blandos' },
])

// --- Computed Properties ---
const selectedSkills = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  },
})

const filteredSkills = computed(() => {
  return allSkills.value.filter((skill) => {
    const typeMatch = selectedSkillType.value === 'Todos' || skill.type === selectedSkillType.value
    const searchTermMatch =
      !searchTerm.value || skill.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    return typeMatch && searchTermMatch
  })
})

// --- Methods ---
function toggleSkill(skillName) {
  const newSelection = [...selectedSkills.value]
  const index = newSelection.indexOf(skillName)

  if (index === -1) {
    newSelection.push(skillName)
  } else {
    newSelection.splice(index, 1)
  }
  emit('update:modelValue', newSelection)
}
</script>

<style scoped>
.filter-card {
  border: none;
  box-shadow: none;
}

.panel-title {
  color: #111827;
}

.panel-subtitle {
  font-size: 1rem;
  color: #374151;
}

.skill-item-selectable {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  border-left: 3px solid transparent;
}

.skill-item-selectable.selected {
  background-color: #eef2ff;
  border-left: 3px solid #4f46e5;
  color: #4f46e5;
  font-weight: 600;
}
</style>
