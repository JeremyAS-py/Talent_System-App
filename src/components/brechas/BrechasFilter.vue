<template>
  <div>
    <q-card flat bordered class="q-mb-lg" style="border-radius: 10px">
      <q-card-section class="q-py-md">
        <div class="row q-gutter-md items-center">
          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroVacante"
              :options="vacantes"
              option-value="vacanteId"
              option-label="titulo"
              label="Vacante"
              emit-value
              map-options
              style="width: 250px"
              @update:model-value="emitFilters"
              :loading="cargandoVacantes"
              :disable="cargandoVacantes"
            />
          </div>

          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroDepartamento"
              :options="departamentos"
              option-value="departamentoId"
              option-label="nombre"
              label="Departamento"
              emit-value
              map-options
              style="width: 250px"
              @update:model-value="onDepartamentoChange"
            />
          </div>

          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroArea"
              :options="areasFiltradas"
              option-value="areaId"
              option-label="nombre"
              label="Área"
              emit-value
              map-options
              style="width: 180px"
              @update:model-value="onAreaChange"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'

const emit = defineEmits(['update:filters'])

/* ---------------------------------------------
   DATA PARA FILTROS (solo los necesarios)
--------------------------------------------- */
const filtroVacante = ref(null)
const filtroDepartamento = ref(null)
const filtroArea = ref(null)

const vacantes = ref([])
const departamentos = ref([])
const areas = ref([])

/* ---------------------------------------------
   ESTADOS DE CARGA
--------------------------------------------- */
const cargandoVacantes = ref(false)

/* ---------------------------------------------
   CARGAR VACANTES FILTRADAS  (GET /api/Vacante)
--------------------------------------------- */
const fetchFilteredVacantes = async () => {
  filtroVacante.value = null
  vacantes.value = []

  const departamentoId = filtroDepartamento.value
  const areaId = filtroArea.value

  if (!departamentoId && !areaId) {
    cargandoVacantes.value = false
    return
  }

  cargandoVacantes.value = true

  try {
    const params = {}

    if (departamentoId) params.departamentoId = departamentoId
    if (areaId) params.areaId = areaId

    const response = await api.get('/api/Vacante', { params })

    if (
      Array.isArray(response.data) &&
      response.data.every((item) => 'vacanteId' in item && 'titulo' in item)
    ) {
      vacantes.value = response.data
    } else {
      console.error('La estructura de datos de las vacantes no es la esperada.')
      vacantes.value = []
    }
  } catch (err) {
    console.error('Error al cargar vacantes:', err)
    vacantes.value = []
  } finally {
    cargandoVacantes.value = false
  }
}

/* ---------------------------------------------
   CARGAR DATOS MAESTROS
--------------------------------------------- */
const fetchDepartamentos = async () => {
  try {
    const response = await api.get('/api/Departamento')
    departamentos.value = [{ departamentoId: null, nombre: 'Departamento' }, ...response.data]
    if (!filtroDepartamento.value) filtroDepartamento.value = null
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

const fetchAreas = async () => {
  try {
    const response = await api.get('/api/Area/areas')
    areas.value = [{ areaId: null, nombre: 'Área', departamentoId: null }, ...response.data]
    if (!filtroArea.value) filtroArea.value = null
  } catch (error) {
    console.error('Error fetching areas:', error)
  }
}

/* ---------------------------------------------
   COMPUTED: ÁREAS SEGÚN DEPARTAMENTO
--------------------------------------------- */
const areasFiltradas = computed(() => {
  if (!filtroDepartamento.value) {
    return areas.value.filter((a) => a.areaId === null)
  }

  const placeholder = areas.value.find((a) => a.areaId === null)
  const filtered = areas.value.filter((area) => area.departamentoId === filtroDepartamento.value)

  return [placeholder, ...filtered]
})

/* ---------------------------------------------
   EVENTOS DE CAMBIO
--------------------------------------------- */
const onDepartamentoChange = () => {
  filtroArea.value = null
  fetchFilteredVacantes()
  emitFilters()
}

const onAreaChange = () => {
  fetchFilteredVacantes()
  emitFilters()
}

const emitFilters = () => {
  const selectedVacante = vacantes.value.find((v) => v.vacanteId === filtroVacante.value)

  emit('update:filters', {
    vacanteId: filtroVacante.value,
    vacanteTitle: selectedVacante ? selectedVacante.titulo : '',
    departamentoId: filtroDepartamento.value,
    areaId: filtroArea.value,
  })
}

/* ---------------------------------------------
   MOUNTED
--------------------------------------------- */
onMounted(async () => {
  await fetchDepartamentos()
  await fetchAreas()
  // Vacantes NO se cargan al inicio
})
</script>
