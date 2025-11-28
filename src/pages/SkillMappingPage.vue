<template>
  <q-layout view="lHh lpr lFf" container style="height: calc(100vh - 150px)">
    <!-- Filtro de Skills (Drawer Izquierdo) -->
    <q-drawer v-model="skillFilterDrawerOpen" side="left" bordered show-if-above :width="300">
      <SkillMappingFilter v-model="selectedSkills" :skills="allSkills" class="full-height" />
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

        <!-- FILTROS SUPERIORES -->
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
              <div class="col-12 col-md-4">
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
              <div class="col-12 col-sm-6 col-md-3">
                <label class="filter-label">Departamento</label>
                <q-select
                  outlined
                  dense
                  v-model="selectedDepartamento"
                  :options="departamentoOptions"
                  emit-value
                  map-options
                  clearable
                />
              </div>

              <!-- Filtro Area -->
              <div class="col-12 col-sm-6 col-md-3">
                <label class="filter-label">Área</label>
                <q-select
                  outlined
                  dense
                  v-model="selectedArea"
                  :options="areaOptions"
                  emit-value
                  map-options
                  clearable
                  :disable="!selectedDepartamento"
                />
              </div>

              <!-- Botón Limpiar -->
              <div class="col-12 col-md-2 text-right">
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

        <!-- Lista de Colaboradores -->
        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="40px" />
          <p class="q-mt-md">Cargando colaboradores...</p>
        </div>
        <div v-else-if="error" class="text-center text-negative q-pa-xl">
          <q-icon name="error_outline" size="40px" />
          <p class="q-mt-md">Error al cargar los datos. Inténtalo de nuevo más tarde.</p>
        </div>
        <SkillMappingList v-else :colaboradores="colaboradoresFiltrados" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import SkillMappingFilter from 'src/components/skillmapping/SkillMappingFilter.vue'
import SkillMappingList from 'src/components/skillmapping/SkillMappingList.vue'

// --- STATIC DATA for filters ---
const departamentos = ref([
  { id: 9, nombre: 'ADMINISTRACION' },
  { id: 8, nombre: 'COMPRAS' },
  { id: 4, nombre: 'FINANZAS' },
  { id: 7, nombre: 'INVESTIGACIÓN' },
  { id: 5, nombre: 'LOGISTICA' },
  { id: 2, nombre: 'MARKETING' },
  { id: 6, nombre: 'OPERACIONES' },
  { id: 3, nombre: 'RRHH' },
  { id: 1, nombre: 'TI' },
])

const areas = ref([
  { id: 1, nombre: 'TI', departamentoId: 1 },
  { id: 2, nombre: 'Desarrollo de Software', departamentoId: 1 },
  { id: 3, nombre: 'Soporte Técnico', departamentoId: 1 },
  { id: 4, nombre: 'Infraestructura y Redes', departamentoId: 1 },
  { id: 5, nombre: 'Selección y Contratación', departamentoId: 3 },
  { id: 6, nombre: 'Nóminas y Compensación', departamentoId: 3 },
  { id: 7, nombre: 'Capacitación y Desarrollo', departamentoId: 3 },
  { id: 8, nombre: 'Marketing Digital', departamentoId: 2 },
  { id: 9, nombre: 'Redes Sociales', departamentoId: 2 },
])

// --- STATE ---
const skillFilterDrawerOpen = ref(true)
const searchTerm = ref('')
const selectedSkills = ref([])
const loading = ref(true)
const error = ref(null)
const selectedDepartamento = ref(null)
const selectedArea = ref(null)

// --- API DATA ---
const allSkills = ref([])
const collaboratorsWithSkills = ref([])

// --- FETCH DATA ---
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    // Fetch all data in parallel
    const [skillsRes, collaboratorsRes] = await Promise.all([
      api.get('/api/Skill'),
      api.get('/api/Colaborador') // Assuming this returns collaborators with skills
    ]);

    // Process skills for the filter
    const skillTypeMap = { 1: 'Hard Skill', 2: 'Soft Skill', 3: 'Idioma' };
    allSkills.value = (skillsRes.data || []).map(skill => ({
      ...skill,
      type: skillTypeMap[skill.tipo] || 'Desconocido',
    }));

    // Process collaborators, mapping API properties to component properties
    collaboratorsWithSkills.value = (collaboratorsRes.data || []).map(c => ({
      ...c,
      technicalSkills: c.habilidadesTecnicas || c.technicalSkills || [],
      softSkills: c.habilidadesBlandas || c.softSkills || [],
      languageSkills: c.idiomas || c.languageSkills || [],
    }));

  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = 'No se pudo cargar la información. Por favor, revise la conexión con la API.';
  } finally {
    loading.value = false;
  }
})

// --- OPTIONS for filters ---
const departamentoOptions = computed(() =>
  departamentos.value.map((d) => ({ label: d.nombre, value: d.id })),
)

const areaOptions = computed(() => {
  if (!selectedDepartamento.value) return []
  return areas.value
    .filter((area) => area.departamentoId === selectedDepartamento.value)
    .map((area) => ({ label: area.nombre, value: area.id }))
})

// --- LOGIC ---
watch(selectedDepartamento, () => {
  selectedArea.value = null
})

const colaboradoresFiltrados = computed(() => {
  if (loading.value) return []

  return (collaboratorsWithSkills.value || []).filter((c) => {
    if (!c) return false

    // Filter by Department
    const depMatch = !selectedDepartamento.value || c.departamentoId === selectedDepartamento.value

    // Filter by Area
    const areaMatch = !selectedArea.value || c.areaId === selectedArea.value

    // Search Term Filter
    const searchTermLower = searchTerm.value.toLowerCase()
    const fullName = `${c.nombres || ''} ${c.apellidos || ''}`.toLowerCase()
    const nameMatch = fullName.includes(searchTermLower)
    const rolMatchSearch = c.rolNombre ? c.rolNombre.toLowerCase().includes(searchTermLower) : false
    const searchMatch = !searchTerm.value || nameMatch || rolMatchSearch

    // Skills Filter
    const skillsToMatch = [
      ...(c.technicalSkills || []),
      ...(c.softSkills || []),
      ...(c.languageSkills || []),
    ]
    const skillsMatch =
      selectedSkills.value.length === 0 ||
      selectedSkills.value.every((skillName) =>
        skillsToMatch.some((s) => s && s.nombre === skillName),
      )

    return depMatch && areaMatch && searchMatch && skillsMatch
  })
})

function clearFilters() {
  searchTerm.value = ''
  selectedSkills.value = []
  selectedDepartamento.value = null
  selectedArea.value = null
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
