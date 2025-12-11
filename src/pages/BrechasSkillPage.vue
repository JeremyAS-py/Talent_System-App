<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-xl">
      <div class="text-h4 text-weight-bolder text-primary">Brechas de Skill</div>
      <div class="text-subtitle1 text-grey-7">
        Seleccione una vacante para analizar la demanda de skills vs. la disponibilidad actual.
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Columna Izquierda: Lista de Vacantes -->
      <div class="col-12 col-md-3">
        <q-card flat bordered style="border-radius: 10px">
          <q-card-section>
            <div class="text-h6">Vacantes Disponibles</div>
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-inner-loading :showing="cargandoVacantes">
              <q-spinner-dots size="50px" color="primary" />
            </q-inner-loading>
            <q-item
              v-for="vacante in allVacantes"
              :key="vacante.vacanteId"
              clickable
              v-ripple
              :active="selectedVacancyId === vacante.vacanteId"
              @click="onVacancySelect(vacante)"
              active-class="bg-teal-1 text-grey-8"
            >
              <q-item-section>
                <q-item-label lines="1">{{ vacante.titulo }}</q-item-label>
                <q-item-label caption>ID: {{ vacante.vacanteId }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!cargandoVacantes && allVacantes.length === 0">
              <q-item-section class="text-center text-grey">
                No se encontraron vacantes.
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Columna Derecha: Gráficos y Tabla -->
      <div class="col-12 col-md-9">
        <div v-if="!selectedVacancyId" class="text-center text-grey-7 q-pa-xl">
          <q-icon name="arrow_back" size="4rem" class="q-mb-md" />
          <div class="text-h6">Por favor, seleccione una vacante de la lista.</div>
        </div>

        <div v-else>
          <!-- Componente de Gráfica -->
          <brechas-chart :rows="tableRows" />

          <q-banner
            v-if="tableError"
            inline-actions
            class="text-white bg-red q-mb-md q-mt-lg"
            style="border-radius: 10px"
          >
            <strong>Error al cargar los datos de la tabla:</strong>
            <p>{{ tableError }}</p>
          </q-banner>

          <!-- Componente de Tabla -->
          <div class="q-mt-xl">
            <brechas-table
              :rows="tableRows"
              :is-loading="isTableLoading"
              :vacancy-title="vacancyTitle"
            />
          </div>

          <!-- Botones de Exportación -->
          <div class="row justify-end q-mt-lg q-gutter-sm">
            <q-btn
              @click="descargarExcelCargado"
              color="blue-8"
              icon="visibility"
              label="Visualizar Excel Cargado"
              rounded
              :disable="!excelDataBlob"
            />
            <q-btn
              @click="exportarPdf"
              color="red-8"
              icon="picture_as_pdf"
              label="Exportar Book PDF"
              rounded
              :disable="!selectedVacancyId || !pdfDataBlob"
            />

          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import * as XLSX from 'xlsx'
import BrechasChart from 'src/components/brechas/BrechasChart.vue'
import BrechasTable from 'src/components/brechas/BrechasTable.vue'

const $q = useQuasar()

// --- Estado General ---
const allVacantes = ref([])
const cargandoVacantes = ref(false)
const selectedVacancyId = ref(null)
const vacancyTitle = ref('')
const excelDataBlob = ref(null)
const pdfDataBlob = ref(null)

const tableRows = ref([])
const tableError = ref(null)
const isTableLoading = ref(false)

// --- Cargar Lista de Vacantes (al inicio) ---
const fetchVacantes = async () => {
  cargandoVacantes.value = true
  try {
    const response = await api.get('/api/Vacante')
    allVacantes.value = response.data
  } catch (error) {
    console.error('Error fetching vacancies:', error)
    $q.notify({ color: 'negative', message: 'No se pudieron cargar las vacantes.' })
  } finally {
    cargandoVacantes.value = false
  }
}

onMounted(fetchVacantes)

// --- Selección de Vacante ---
const onVacancySelect = (vacante) => {
  selectedVacancyId.value = vacante.vacanteId
  vacancyTitle.value = vacante.titulo
  excelDataBlob.value = null
  pdfDataBlob.value = null
  fetchBrechasData()
  fetchPdfReport()
}

// --- Obtener Datos para la Tabla (Parseando Excel) ---
const fetchBrechasData = async () => {
  if (!selectedVacancyId.value) {
    tableRows.value = []
    return
  }

  isTableLoading.value = true
  tableError.value = null

  try {
    const response = await api.get(`/api/exportacion/${selectedVacancyId.value}/brechas`, {
      responseType: 'arraybuffer',
    })

    excelDataBlob.value = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const data = new Uint8Array(response.data)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 4 })

    const formattedRows = sheetData
      .map((row) => {
        const matchPercentage = parseFloat(row[5])
        if (isNaN(matchPercentage)) return null
        return {
          candidato: row[1],
          area: row[2],
          departamento: row[3],
          rolActual: row[4],
          matchPercentage: matchPercentage,
          brecha: (1 - matchPercentage) * 100,
          estado: row[6],
          skillsFaltantes: row[7],
        }
      })
      .filter((row) => row !== null)

    tableRows.value = formattedRows
  } catch (error) {
    console.error('Error fetching or parsing brechas data:', error)
    tableError.value =
      'No se pudieron cargar o procesar los datos del reporte. ' + (error.message || '')
    tableRows.value = []
  } finally {
    isTableLoading.value = false
  }
}

// --- Cargar PDF (al seleccionar vacante) ---
const fetchPdfReport = async () => {
  if (!selectedVacancyId.value) return
  try {
    const response = await api.get(`/api/exportacion/${selectedVacancyId.value}/pdf`, {
      responseType: 'blob',
    })
    pdfDataBlob.value = response.data
  } catch (error) {
    console.error('Error fetching PDF report:', error)
    pdfDataBlob.value = null
    $q.notify({ color: 'negative', message: 'No se pudo cargar el reporte PDF.' })
  }
}

// --- Descargar el Excel que se usó para la tabla ---
const descargarExcelCargado = () => {
  if (!excelDataBlob.value) {
    $q.notify({ color: 'negative', message: 'No hay datos de Excel para descargar.' })
    return
  }
  try {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(excelDataBlob.value)
    link.download = `DatosCargados_${vacancyTitle.value.replace(/\s/g, '_')}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Error downloading loaded excel:', error)
    $q.notify({ color: 'negative', message: 'Error al intentar descargar el archivo.' })
  }
}


const exportarPdf = () => {
  if (!pdfDataBlob.value) {
    $q.notify({
      color: 'warning',
      message: 'El reporte PDF aún no está listo o no se pudo cargar.',
      icon: 'warning',
    })
    return
  }
  try {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(pdfDataBlob.value)
    link.download = `Book_Candidatos_${vacancyTitle.value.replace(/\s/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Error downloading PDF book:', error)
    $q.notify({ color: 'negative', message: 'Error al intentar descargar el PDF.' })
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
