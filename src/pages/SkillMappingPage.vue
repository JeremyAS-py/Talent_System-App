<template>
  <q-layout view="lHh lpr lFf" container style="height: calc(100vh - 150px)">
    <!-- Filtro de Skills (Drawer Izquierdo) -->
    <q-drawer v-model="skillFilterDrawerOpen" side="left" bordered show-if-above :width="300">
      <SkillMappingFilter v-model="selectedSkills" class="full-height" />
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-lg">
        <!-- TITULO + DESCRIPCIÓN -->
        <div class="q-mb-xl">
          <div class="page-title">Skill Mapping</div>
          <div class="page-subtitle">
            Visualiza y gestiona las habilidades de los colaboradores.
          </div>
        </div>

        <!-- FILTROS SUPERIORES (Colaborador) -->
        <q-card class="q-mb-lg filter-bar-card">
          <q-card-section>
            <div class="row q-col-gutter-md items-center">
              <!-- Botón para toggle drawer en mobile -->
              <div class="col-auto lt-lg">
                <q-btn
                  flat
                  round
                  icon="filter_alt"
                  @click="skillFilterDrawerOpen = !skillFilterDrawerOpen"
                  aria-label="Abrir filtros de skill"
                />
              </div>

              <!-- Buscador -->
              <div class="col-12 col-sm-4 col-md">
                <label class="filter-label">Buscar Colaborador</label>
                <q-input
                  outlined
                  dense
                  v-model="searchTerm"
                  placeholder="Nombre o Puesto"
                  debounce="300"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <!-- Filtro Departamento -->
              <div class="col-12 col-sm-3 col-md">
                <label class="filter-label">Departamentos</label>
                <q-select
                  outlined
                  dense
                  v-model="filtroDepartamento"
                  :options="departamentoOptions"
                  emit-value
                  map-options
                />
              </div>

              <!-- Filtro Roles -->
              <div class="col-12 col-sm-3 col-md">
                <label class="filter-label">Roles</label>
                <q-select
                  outlined
                  dense
                  v-model="filtroRol"
                  :options="rolOptions"
                  emit-value
                  map-options
                />
              </div>

              <!-- Botón Limpiar -->
              <div class="col-12 col-sm-2 col-md-auto text-right">
                <q-btn
                  flat
                  color="primary"
                  label="Limpiar Filtros"
                  @click="clearFilters"
                  class="q-px-sm"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="filter-card q-mt-md" flat
          >1
          <q-card-section v-if="selectedCollaborators.length > 0">
            <div class="panel-subtitle text-weight-medium q-mb-sm">Colaboradores Seleccionados</div>
            <div class="q-gutter-sm flex-row">
              <q-chip
                v-for="collaborator in selectedCollaborators"
                :key="collaborator"
                removable
                @remove="toggleCollaborator(collaborator)"
                color="primary"
                text-color="white"
                icon="check"
              >
                {{ collaborator }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>

        <!-- Lista de Colaboradores -->
        <SkillMappingList :colaboradores="colaboradoresFiltrados" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import SkillMappingFilter from 'src/components/skillmapping/SkillMappingFilter.vue'
import SkillMappingList from 'src/components/skillmapping/SkillMappingList.vue'

// --- STATE ---
const skillFilterDrawerOpen = ref(true)
const searchTerm = ref('')
const filtroDepartamento = ref('Todos')
const filtroRol = ref('Todos')
const selectedSkills = ref([])

// --- OPTIONS for filters ---
const departamentoOptions = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Tecnología', value: 'Tecnología' },
  { label: 'Recursos Humanos', value: 'Recursos Humanos' },
  { label: 'Marketing', value: 'Marketing' },
]

const rolOptions = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Project Manager', value: 'Project Manager' },
  { label: 'Full Stack Developer', value: 'Full Stack Developer' },
  { label: 'Data Scientist', value: 'Data Scientist' },
  { label: 'HR Business Partner', value: 'HR Business Partner' },
]

// --- MOCK DATA ---
const colaboradores = ref([
  {
    id: 1,
    nombre: 'Juan Pérez',
    departamento: 'Tecnología',
    rol: 'Project Manager',
    technicalSkills: ['Agile', 'Jira'],
    softSkills: ['Liderazgo', 'Comunicación'],
    lastUpdate: '15/10/2025',
  },
  {
    id: 2,
    nombre: 'Luis Chang',
    departamento: 'Tecnología',
    rol: 'Full Stack Developer',
    technicalSkills: ['Vue.js', 'Node.js', 'SQL'],
    softSkills: ['Trabajo en equipo'],
    lastUpdate: '22/11/2025',
  },
  {
    id: 3,
    nombre: 'José Ballón',
    departamento: 'Tecnología',
    rol: 'Data Scientist',
    technicalSkills: ['Python', 'SQL', 'Machine Learning', 'React'],
    softSkills: ['Resolución de problemas'],
    lastUpdate: '03/09/2025',
  },
  {
    id: 4,
    nombre: 'Ana Rojas',
    departamento: 'Recursos Humanos',
    rol: 'HR Business Partner',
    technicalSkills: [],
    softSkills: ['Comunicación', 'Empatía', 'Negociación'],
    lastUpdate: '30/10/2025',
  },
  {
    id: 5,
    nombre: 'Carla Vidal',
    departamento: 'Marketing',
    rol: 'Digital Marketer',
    technicalSkills: ['SEO', 'Google Analytics'],
    softSkills: ['Creatividad', 'Comunicación'],
    lastUpdate: '18/11/2025',
  },
])

// --- LOGIC ---

const colaboradoresFiltrados = computed(() => {
  return colaboradores.value.filter((c) => {
    // Search Term Filter
    const searchTermLower = searchTerm.value.toLowerCase()
    const nameMatch = c.nombre.toLowerCase().includes(searchTermLower)
    const rolMatchSearch = c.rol.toLowerCase().includes(searchTermLower)
    const searchMatch = nameMatch || rolMatchSearch

    // Department Filter
    const depMatch =
      filtroDepartamento.value === 'Todos' || c.departamento === filtroDepartamento.value

    // Role Filter
    const rolMatch = filtroRol.value === 'Todos' || c.rol === filtroRol.value

    // Skills Filter
    const skillsMatch =
      selectedSkills.value.length === 0 ||
      selectedSkills.value.every((skill) => [...c.technicalSkills, ...c.softSkills].includes(skill))

    return searchMatch && depMatch && rolMatch && skillsMatch
  })
})
const selectedCollaborators = ref([]) // Managing internally for now

function clearFilters() {
  searchTerm.value = ''
  filtroDepartamento.value = 'Todos'
  filtroRol.value = 'Todos'
  selectedSkills.value = []
}
function toggleCollaborator(collaboratorName) {
  const newSelection = [...selectedCollaborators.value]
  const index = newSelection.indexOf(collaboratorName)

  if (index === -1) {
    newSelection.push(collaboratorName)
  } else {
    newSelection.splice(index, 1)
  }
  selectedCollaborators.value = newSelection
}
</script>

<style scoped>
.filter-bar-card {
  border-radius: 12px;
}

.filter-label {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}
</style>
