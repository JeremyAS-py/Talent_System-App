<template>
  <q-layout view="lHh lpr lFf" container style="height: calc(100vh - 150px)">
    <q-drawer v-model="skillFilterDrawerOpen" side="left" bordered show-if-above :width="300">
      <SkillMappingFilter v-model="selectedSkills" :skills="allSkills" class="full-height" />
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-lg">
        <div class="q-mb-xl">
          <div class="page-title">Skill Mapping</div>
          <div class="page-subtitle">
            Visualiza y gestiona las habilidades de los colaboradores.
          </div>
        </div>

        <q-card class="q-mb-lg filter-bar-card">
          <q-card-section>
            <div class="row q-col-gutter-md items-center">
              <div class="col-auto lt-lg">
                <q-btn
                  flat
                  round
                  icon="filter_alt"
                  @click="skillFilterDrawerOpen = !skillFilterDrawerOpen"
                  aria-label="Abrir filtros de skill"
                />
              </div>

              <div class="col-12 col-md-4">
                <label class="filter-label">Buscar Colaborador</label>
                <q-input
                  outlined
                  dense
                  v-model="searchTerm"
                  placeholder="Nombre o Puesto"
                  debounce="300"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

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

        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="40px" />
          <p class="q-mt-md">Cargando colaboradores...</p>
        </div>
        <div v-else-if="error" class="text-center text-negative q-pa-xl">
          <q-icon name="error_outline" size="40px" />
          <p class="q-mt-md">{{ error }}</p>
        </div>
        <SkillMappingList
          v-else
          :colaboradores="paginatedColaboradores"
          :search-term="searchTerm"
        />

        <div v-if="pageCount > 1" class="flex flex-center q-mt-lg">
          <q-pagination
            v-model="currentPage"
            :max="pageCount"
            direction-links
            flat
            color="grey"
            active-color="primary"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import SkillMappingFilter from 'src/components/skillmapping/SkillMappingFilter.vue'
import SkillMappingList from 'src/components/skillmapping/SkillMappingList.vue'

// --- DYNAMIC DATA for filters ---
const departamentos = ref([])
const areas = ref([])

// --- STATE ---
const skillFilterDrawerOpen = ref(true)
const searchTerm = ref('')
const selectedSkills = ref([])
const loading = ref(true)
const error = ref(null)
const selectedDepartamento = ref(null)
const selectedArea = ref(null)

// --- PAGINATION STATE ---
const currentPage = ref(1)
const itemsPerPage = ref(8) // 8 items per page

// --- API DATA ---
const allSkills = ref([])
const collaboratorsWithSkills = ref([])

// --- FETCH DATA ---
onMounted(async () => {
  try {
    loading.value = true
    error.value = null

    const results = await Promise.allSettled([
      api.get('/api/Skill'),
      api.get('/api/Colaborador'),
      api.get('/api/Departamento'),
      api.get('/api/Area/areas'),
    ])

    const [skillsRes, collaboratorsRes, departamentosRes, areasRes] = results
    const errors = []

    if (skillsRes.status === 'rejected') errors.push('skills')
    if (collaboratorsRes.status === 'rejected') errors.push('colaboradores')
    if (departamentosRes.status === 'rejected') errors.push('departamentos')
    if (areasRes.status === 'rejected') errors.push('áreas')

    if (errors.length > 0) {
      throw new Error(`Error al cargar datos de: ${errors.join(', ')}`)
    }

    // 1. Process Departments and Areas
    departamentos.value = departamentosRes.value.data || []
    areas.value = areasRes.value.data || []

    // 2. Process allSkills
    const skillTypeMap = { 1: 'Hard Skill', 2: 'Soft Skill', 3: 'Idioma' }
    allSkills.value = (skillsRes.value.data || []).map((skill) => ({
      ...skill,
      type: skillTypeMap[skill.tipoSkillId] || 'Desconocido',
    }))

    // Create a map for quick lookup by skill name to get its ID/Type
    const skillLookup = allSkills.value.reduce((acc, skill) => {
      acc[skill.nombre.toLowerCase()] = {
        id: skill.skillId,
        type: skill.type,
        nombre: skill.nombre,
      }
      return acc
    }, {})

    // 3. Process collaborators
    collaboratorsWithSkills.value = (collaboratorsRes.value.data || []).map((c) => {
      const technicalSkills = []
      const softSkills = []
      const languageSkills = []
      ;(c.skills || []).forEach((skillName) => {
        const skillNameLower = skillName.toLowerCase()
        const detail = skillLookup[skillNameLower]
        if (detail) {
          const skillObject = { id: detail.id, nombre: detail.nombre }
          if (detail.type === 'Hard Skill') {
            technicalSkills.push(skillObject)
          } else if (detail.type === 'Soft Skill') {
            softSkills.push(skillObject)
          } else if (detail.type === 'Idioma') {
            languageSkills.push(skillObject)
          }
        }
      })

      // **CORRECCIÓN DE TIPADO APLICADA AQUÍ**
      return {
        ...c,
        departamentoId: c.departamentoId ? Number(c.departamentoId) : null,
        areaId: c.areaId ? Number(c.areaId) : null,
        technicalSkills: technicalSkills,
        softSkills: softSkills,
        languageSkills: languageSkills,
      }
    })
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value =
      err.message || 'No se pudo cargar la información. Por favor, revise la conexión con la API.'
  } finally {
    loading.value = false
  }
})

// --- OPTIONS for filters ---
const departamentoOptions = computed(() =>
  // **CORRECCIÓN DE TIPADO APLICADA AQUÍ**
  (departamentos.value || []).map((d) => ({
    label: d.nombre,
    value: Number(d.departamentoId),
  })),
)

const areaOptions = computed(() => {
  if (!selectedDepartamento.value) return []
  return (
    (areas.value || [])
      .filter((area) => Number(area.departamentoId) === selectedDepartamento.value)
      // **CORRECCIÓN DE TIPADO APLICADA AQUÍ**
      .map((area) => ({
        label: area.nombre,
        value: Number(area.areaId),
      }))
  )
})

// --- LOGIC ---
watch(selectedDepartamento, () => {
  // Reset selected area when department changes
  selectedArea.value = null
})

const colaboradoresFiltrados = computed(() => {
  if (loading.value) return []

  return (collaboratorsWithSkills.value || []).filter((c) => {
    if (!c) return false

    // 1. Filter by Department (Compara ID numérico con ID numérico)
    const depMatch = !selectedDepartamento.value || c.departamentoId === selectedDepartamento.value

    // 2. Filter by Area (Compara ID numérico con ID numérico)
    const areaMatch = !selectedArea.value || c.areaId === selectedArea.value

    // 3. Search Term Filter
    const searchTermLower = searchTerm.value.toLowerCase()
    const fullName = `${c.nombres || ''} ${c.apellidos || ''}`.toLowerCase()
    const nameMatch = fullName.includes(searchTermLower)
    const rolMatchSearch = c.rolNombre ? c.rolNombre.toLowerCase().includes(searchTermLower) : false
    const searchMatch = !searchTerm.value || nameMatch || rolMatchSearch

    // 4. Skills Filter
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

// --- PAGINATION LOGIC ---
const pageCount = computed(() => {
  return Math.ceil(colaboradoresFiltrados.value.length / itemsPerPage.value)
})

const paginatedColaboradores = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return colaboradoresFiltrados.value.slice(startIndex, endIndex)
})

// Reset to page 1 when filters change
watch(colaboradoresFiltrados, () => {
  currentPage.value = 1
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
