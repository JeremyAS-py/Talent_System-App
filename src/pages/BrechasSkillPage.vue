<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-xl">
      <div class="text-h4 text-weight-bolder text-primary">Brechas de Skill</div>
      <div class="text-subtitle1 text-grey-7">
        Análisis de la demanda de skills vs. la disponibilidad actual de la plantilla.
      </div>
    </div>

    <!-- Componente de Filtros -->
    <brechas-filter @update:filters="handleFiltersUpdate" />

    <div class="row q-col-gutter-lg">
      <div class="col-9">
        <!-- Componente de Gráfica -->
        <brechas-chart />
      </div>

      <div class="col-3 column q-gutter-md justify-center">
        <q-btn
          color="primary"
          icon="visibility"
          label="Ver más"
          size="lg"
          rounded
          class="full-width"
          padding="md"
        />
        <q-btn
          @click="exportarBrechas"
          color="primary"
          icon="file_download"
          label="Exportar"
          size="lg"
          rounded
          class="full-width"
          padding="md"
          :disable="!activeFilters.vacanteId"
        />
      </div>
    </div>

    <div class="q-mt-xl"></div>

    <q-banner
      v-if="tableError"
      inline-actions
      class="text-white bg-red q-mb-md"
      style="border-radius: 10px"
    >
      <strong>Error al cargar los datos de la tabla:</strong>
      <p>{{ tableError }}</p>
    </q-banner>

    <div class="row q-col-gutter-lg">
      <div class="col-9">
        <!-- Componente de Tabla -->
        <brechas-table
          :rows="tableRows"
          :is-loading="isTableLoading"
          :vacancy-title="vacancyTitle"
        />
      </div>

      <div class="col-3 column q-gutter-md justify-start">
        <q-btn
          color="primary"
          icon="visibility"
          label="Ver más"
          size="lg"
          rounded
          class="full-width"
          padding="md"
        />
        <q-btn
          color="primary"
          icon="school"
          label="Ver Capacitación"
          size="lg"
          rounded
          class="full-width"
          padding="md"
        />
        <q-btn
          color="negative"
          icon="group_add"
          label="Ver Reclutamiento"
          size="lg"
          rounded
          class="full-width"
          padding="md"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import * as XLSX from 'xlsx'
import BrechasFilter from 'src/components/brechas/BrechasFilter.vue'
import BrechasChart from 'src/components/brechas/BrechasChart.vue'
import BrechasTable from 'src/components/brechas/BrechasTable.vue'

// ... dentro de setup() de BrechasSkillsPage.vue
// --- Estado de los Filtros ---
const activeFilters = ref({})
const tableRows = ref([])
const tableError = ref(null)
const isTableLoading = ref(false)
const vacancyTitle = ref('') // <-- NUEVO: Para guardar el título
// ...

// --- Código CORREGIDO para BrechasSkillsPage.vue (fetchBrechasData) ---
const fetchBrechasData = async () => {
  if (!activeFilters.value.vacanteId) {
    tableRows.value = []
    return
  }

  isTableLoading.value = true
  tableError.value = null

  try {
    const params = {
      vacanteId: activeFilters.value.vacanteId,
      areaId: activeFilters.value.areaId || null,
    }

    const response = await api.get('/api/exportacion/brechas', {
      params,
      responseType: 'arraybuffer',
    })

    const data = new Uint8Array(response.data)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(worksheet, {
      header: ['skill', 'disponible', 'requerido', 'brecha'],
      range: 1, // Skip the header row in the Excel file
    })

    tableRows.value = json
  } catch (error) {
    console.error('Error fetching or parsing brechas data:', error)
    tableError.value = error.message || 'Ocurrió un error desconocido.'
    if (error.response) {
      tableError.value += ` (Status: ${error.response.status})`
    }
    tableRows.value = []
  } finally {
    isTableLoading.value = false
  }
}
// ------------------------------------------------------------------------

const handleFiltersUpdate = (filters) => {
  activeFilters.value = filters
  vacancyTitle.value = filters.vacanteTitle // <-- NUEVO
  fetchBrechasData()
}

const exportarBrechas = async () => {
  if (!activeFilters.value.vacanteId) {
    console.warn('Debe seleccionar una vacante para exportar.')
    return
  }
  try {
    const params = {
      vacanteId: activeFilters.value.vacanteId,
      areaId: activeFilters.value.areaId || null,
    }
    const response = await api.get('/api/exportacion/brechas', {
      params,
      responseType: 'blob',
    })

    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `Brechas_Vacante_${params.vacanteId}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Error exporting brechas:', error)
  }
}
</script>

<style scoped>
.text-h4 {
  font-weight: 700;
  color: #111827;
}

.text-subtitle1 {
  color: #6b7280;
}
</style>
