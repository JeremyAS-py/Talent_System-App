<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 900px; border-radius: 20px">
      <q-card-section class="q-pa-none">
        <!-- HEADER -->
        <div class="header">
          <div class="title-box">
            <h2 style="color: white; margin: 0; padding: 12px 20px; font-weight: bold">
              Carga Masiva
            </h2>
          </div>

          <button class="btn-exit" @click="close" style="margin: 8px">
            <img :src="CierreSesionIcon" alt="Salir" class="icon-exit" />
            <span style="color: white">Salir</span>
          </button>
        </div>

        <!-- SUBTÍTULO + UPLOAD -->
        <div style="padding: 0px 28px">
          <p class="subtitle">
            Seleccione un archivo Excel o CSV para cargar colaboradores en masa
          </p>

          <div
            class="upload-area"
            :class="{ dragging: isDragging }"
            tabindex="0"
            @click="openFile"
            @keydown.enter.prevent="openFile"
            @dragover.prevent
            @dragenter.prevent="onDragEnter"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".xlsx,.xls,.csv"
              class="hidden-file"
              @change="handleFile"
            />

            <template v-if="selectedFile">
              <div class="file-chip" @click.stop>
                <img src="/icons/xls.png" class="file-icon" />
                <a class="file-name" href="#" @click.prevent>{{ selectedFile.name }}</a>
                <button class="file-remove" @click.stop.prevent="clearFile">✕</button>
              </div>
            </template>

            <template v-else>
              <div :class="['upload-icon-wrapper', { dragging: isDragging }]">
                <img src="/icons/Cargar.png" class="upload-icon" />
              </div>

              <p class="upload-text">Selecciona o arrastra y suelta el archivo aquí</p>
            </template>
          </div>

          <!-- PREVIEW -->
          <div class="table-preview" v-if="previewColumns.length">
            <div class="preview-info">
              Previsualización (las primeras {{ previewRows.length }} filas)
            </div>

            <div class="preview-wrapper">
              <table>
                <thead>
                  <tr>
                    <th v-for="(col, idx) in previewColumns" :key="idx">
                      {{ col || 'Col ' + (idx + 1) }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(row, rIdx) in previewRows" :key="rIdx">
                    <td v-for="(col, cIdx) in previewColumns" :key="cIdx">
                      {{ row[cIdx] ?? '' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="table-preview" v-else>
            <div class="preview-empty">
              No hay archivo seleccionado. Selecciona un archivo Excel o CSV para previsualizar.
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- ACCIONES -->
      <q-card-actions align="center" class="q-pb-md">
        <q-btn flat label="Cancelar" @click="close" style="border-radius: 8px" />
        <q-btn
          label="Cargar"
          color="primary"
          @click="uploadValidationAndExecute"
          unelevated
          style="border-radius: 8px; padding: 6px 24px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- DIALOG ÉXITO -->
  <q-dialog v-model="showSuccessDialog" persistent>
    <q-card class="success-dialog">
      <q-card-section class="text-center">
        <q-icon name="check_circle" color="positive" size="80px" />
        <h5 class="q-mt-md">¡Éxito!</h5>
        <p style="white-space: pre-line">{{ successMessage }}</p>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          label="Aceptar"
          color="primary"
          unelevated
          @click="showSuccessDialog = false"
          style="border-radius: 8px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- DIALOG ADVERTENCIA -->
  <q-dialog v-model="showWarningDialog" persistent>
    <q-card class="warning-dialog">
      <q-card-section class="text-center">
        <q-icon name="warning" color="warning" size="80px" />
        <h5 class="q-mt-md">Atención</h5>
        <p style="white-space: pre-line">{{ warningMessage }}</p>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          label="Aceptar"
          color="warning"
          unelevated
          @click="showWarningDialog = false"
          style="border-radius: 8px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- CONFIRMACIÓN -->
  <q-dialog v-model="showConfirmationDialog" persistent>
    <q-card class="warning-dialog">
      <q-card-section class="text-center">
        <q-icon name="help_outline" color="info" size="80px" />
        <h5 class="q-mt-md">Confirmación de Carga</h5>
        <p>
          ¿Desea revisar y ajustar la lista de colaboradores nuevos antes de continuar con la carga
          masiva?
        </p>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn
          flat
          label="Continuar sin Revisar"
          @click="handleConfirmation(false)"
          style="border-radius: 8px"
        />

        <q-btn
          label="Sí, Revisar Archivo"
          color="primary"
          unelevated
          @click="handleConfirmation(true)"
          style="border-radius: 8px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- REVISIÓN -->
  <q-dialog v-model="showReviewDialog" persistent>
    <q-card class="review-dialog" style="min-width: 600px">
      <q-card-section class="text-center">
        <q-icon name="info" color="info" size="80px" />
        <h5 class="q-mt-md">Revisión de Archivo</h5>
        <p style="white-space: pre-line">{{ reviewMessage }}</p>

        <q-input
          v-model="searchQuery"
          dense
          debounce="300"
          placeholder="Buscar por DNI, Nombre o Apellido"
          clearable
          style="margin: 15px 0 10px 0"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <div
          v-if="filteredReviewTable.length"
          class="table-preview"
          style="max-height: 250px; overflow: auto; margin-top: 15px"
        >
          <div class="preview-info">Colaboradores a revisar / a cargar</div>

          <table class="q-table">
            <thead>
              <tr>
                <th style="width: 50px">Incluir</th>
                <th style="width: 100px">DNI</th>
                <th>Nombre Completo</th>
                <th style="width: 150px">Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="col in filteredReviewTable" :key="col.dni">
                <td>
                  <q-checkbox
                    v-model="col.isIncluded"
                    :disable="col.isExisting"
                    color="primary"
                    @update:model-value="updateReviewMessage"
                  />
                </td>

                <td>{{ col.dni }}</td>
                <td>{{ col.nombres }} {{ col.apellidos }}</td>

                <td
                  :class="{
                    'text-negative': col.isExisting,
                    'text-positive': col.isIncluded && !col.isExisting,
                    'text-grey': !col.isIncluded && !col.isExisting,
                  }"
                >
                  {{
                    col.isExisting
                      ? 'DNI Existente (Ignorado)'
                      : col.isIncluded
                        ? 'Listo para Carga'
                        : 'Excluido manualmente'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn
          :label="`Continuar Carga (${totalToProcessCount} Nuevo(s) Habilitado(s))`"
          :disable="totalToProcessCount === 0"
          color="primary"
          unelevated
          @click="
            executeUpload(
              reviewTable.filter((c) => c.isIncluded),
              false,
            )
          "
          style="border-radius: 8px"
        />

        <q-btn flat label="Cancelar Carga" @click="cancelReview" style="border-radius: 8px" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch, computed } from 'vue'
import { api } from 'src/boot/axios.js'
import CierreSesionIcon from '../assets/dashboard/cerrar-sesion.png'

// --- Emits & Props ---
const emit = defineEmits(['close'])
const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

// --- Estado del Modal ---
const isOpen = ref(props.modelValue)
const showSuccessDialog = ref(false)
const successMessage = ref('')
const showWarningDialog = ref(false)
const warningMessage = ref('')
const showConfirmationDialog = ref(false)

const showReviewDialog = ref(false)
const reviewMessage = ref('')
const reviewTable = ref([])
const searchQuery = ref('')
const areaDepartmentMap = ref({})

// --- Archivo ---
const fileInput = ref(null)
const selectedFile = ref(null)
const previewColumns = ref([])
const previewRows = ref([])
const allRows = ref([])
const PREVIEW_MAX_ROWS = 10
const isDragging = ref(false)

// --- Acciones Archivo ---
const openFile = () => {
  if (fileInput.value) fileInput.value.click()
}

function onDragEnter() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e) {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) {
    selectedFile.value = f
    processFile(f)
  }
}

const handleFile = (e) => {
  selectedFile.value = e.target.files[0]
  processFile(selectedFile.value)
}

function clearFile() {
  selectedFile.value = null
  previewColumns.value = []
  previewRows.value = []
  allRows.value = []
  if (fileInput.value) fileInput.value.value = ''
}

// --- Computadas ---
const filteredReviewTable = computed(() => {
  if (!searchQuery.value) return reviewTable.value
  const query = searchQuery.value.toLowerCase().trim()
  return reviewTable.value.filter(
    (col) =>
      String(col.dni).includes(query) ||
      (col.nombres && col.nombres.toLowerCase().includes(query)) ||
      (col.apellidos && col.apellidos.toLowerCase().includes(query)),
  )
})

const totalToProcessCount = computed(() => {
  return reviewTable.value.filter((c) => c.isIncluded && !c.isExisting).length
})

// --- Watchers ---
watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
    if (val) loadAreaDepartmentMap()
  },
)

watch(isOpen, (val) => {
  if (!val) emit('close')
})

// --- Utilidades ---
function normalize(val) {
  return String(val || '')
    .trim()
    .toLowerCase()
}

function mapRowToModel(row, headers, rowIdx) {
  const obj = { __rowIdx: rowIdx }
  const h = headers || []

  for (let i = 0; i < h.length; i++) {
    const key = normalize(h[i])
    const val = row[i]

    if (/dni|documento|numdoc/.test(key)) obj.dni = String(val ?? '').trim()
    else if (/nombre|nombres|first ?name/.test(key)) obj.nombres = String(val ?? '').trim()
    else if (/apellido|apellidos|last ?name/.test(key)) obj.apellidos = String(val ?? '').trim()
    else if (/email|correo/.test(key)) obj.email = String(val ?? '').trim()
    else if (/password|contrasena|clave/.test(key)) obj.password = String(val ?? '').trim()
    else if (/rol|roleid|rolid/.test(key)) obj.rolId = Number(val) || null
    else if (/area|areaid/.test(key)) obj.areaId = Number(val) || null
    else if (/departamento|departamentoid|dept|department/.test(key))
      obj.departamentoId = Number(val) || null
    else if (/disponible|disponibilidad|movilidad|disponiblemovilidad/.test(key)) {
      const v = normalize(val)
      obj.disponibleMovilidad = v === 'si' || v === 'true' || v === '1'
    } else if (/activo|active/.test(key)) {
      const v = normalize(val)
      obj.activo = v === 'si' || v === 'true' || v === '1'
    }
  }

  obj.password = obj.password ?? 'ChangeMe123!'
  obj.rolId = typeof obj.rolId === 'number' && !isNaN(obj.rolId) ? obj.rolId : null
  obj.areaId = typeof obj.areaId === 'number' && !isNaN(obj.areaId) ? obj.areaId : null
  obj.departamentoId =
    typeof obj.departamentoId === 'number' && !isNaN(obj.departamentoId) ? obj.departamentoId : null
  obj.disponibleMovilidad = !!obj.disponibleMovilidad
  obj.activo = typeof obj.activo === 'boolean' ? obj.activo : true

  return obj
}

// --- Procesamiento de Archivos ---
// Dentro de <script setup>

async function processFile(file) {
  previewColumns.value = []
  previewRows.value = []
  if (!file) return

  const name = file.name.toLowerCase()

  try {
    let aoa = [] // Array of Arrays (todas las filas)

    if (name.endsWith('.csv')) {
      // read text and parse csv simple
      const text = await file.text()
      const rows = text.split(/\r?\n/).filter((r) => r.trim() !== '')
      // Usa un separador más flexible para CSV
      aoa = rows.map((r) => r.split(/,|;|\t/))
    } else {
      // try reading with SheetJS for .xlsx/.xls
      let mod

      try {
        // @ts-ignore
        mod = await import('xlsx')
      } catch (err) {
        console.error('Error loading xlsx module', err)
        // ... (manejo de error de dependencia) ...
      }

      const XLSX = mod.default ?? mod
      const ab = await file.arrayBuffer()
      const workbook = XLSX.read(ab, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // get rows as arrays
      aoa = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false })
    }

    // === APLICAR FILTRO DE LIMPIEZA DESPUÉS DE LA CARGA ===
    if (aoa && aoa.length) {
      const headers = aoa[0] || []
      let dataRows = aoa.slice(1) || []

      // Nuevo filtro: Eliminar filas donde todos los valores son vacíos/nulos/undefined
      dataRows = dataRows.filter((row) => row.some((cell) => String(cell ?? '').trim() !== ''))

      previewColumns.value = headers
      allRows.value = dataRows
      previewRows.value = allRows.value.slice(0, PREVIEW_MAX_ROWS)
    }
  } catch (err) {
    console.error('Error parsing file', err)
    showWarningDialog.value = true
    warningMessage.value =
      'No se pudo procesar el archivo. Asegúrate que es un Excel (.xlsx/.xls) o CSV válido.'
  }
}

// --- Cargar mapa Área-Departamento ---
async function loadAreaDepartmentMap() {
  try {
    const response = await api.get('/api/Area/areas')
    const map = {}

    ;(response.data || []).forEach((area) => {
      map[area.areaId] = area.departamentoId
    })

    areaDepartmentMap.value = map
  } catch (error) {
    console.error('Error al cargar el mapa Área-Departamento:', error)
  }
}

// --- Lógica Principal ---
const uploadValidationAndExecute = async () => {
  if (!selectedFile.value || !allRows.value.length) {
    warningMessage.value = 'Seleccione un archivo válido.'
    showWarningDialog.value = true
    return
  }

  if (Object.keys(areaDepartmentMap.value).length === 0) {
    warningMessage.value = 'No se cargó mapa Área-Departamento.'
    showWarningDialog.value = true
    return
  }

  const rowsData = allRows.value.map((row, idx) =>
    mapRowToModel(row, previewColumns.value, idx + 2),
  )

  const missingDniRows = rowsData.filter((r) => !r.dni).map((r) => r.__rowIdx)
  if (missingDniRows.length) {
    showWarningDialog.value = true
    warningMessage.value = `Hay filas sin DNI: ${missingDniRows.join(', ')}`
    clearFile()
    return
  }

  const inconsistentRows = []
  rowsData.forEach((r) => {
    const areaId = r.areaId
    const deptId = r.departamentoId
    const expectedDeptId = areaDepartmentMap.value[areaId]

    if (
      typeof areaId === 'number' &&
      typeof deptId === 'number' &&
      expectedDeptId &&
      expectedDeptId !== deptId
    ) {
      inconsistentRows.push({
        row: r.__rowIdx,
        areaId,
        fileDeptId: deptId,
        expectedDeptId,
      })
    }
  })

  if (inconsistentRows.length) {
    showWarningDialog.value = true
    warningMessage.value =
      `Inconsistencia Área-Departamento:\n` +
      inconsistentRows
        .map(
          (i) =>
            `Fila ${i.row}: Área ${i.areaId} → Dep esperado ${i.expectedDeptId}, dado ${i.fileDeptId}`,
        )
        .join('\n')

    clearFile()
    return
  }

  try {
    // 1. Obtenemos todos los colaboradores actuales
    const resp = await api.get('/api/Colaborador')
    const existingCollaborators = resp.data || []

    // 2. Creamos Sets para búsqueda rápida de DNI y EMAIL (normalizados)
    const existingDnis = new Set(existingCollaborators.map((c) => String(c.dni).trim()))

    // Asumimos que el objeto de la API tiene una propiedad 'email' o 'correo'
    const existingEmails = new Set(
      existingCollaborators.map((c) =>
        String(c.email || c.correo || '')
          .trim()
          .toLowerCase(),
      ),
    )

    let countIgnored = 0

    // 3. Mapeamos y validamos ambas condiciones
    reviewTable.value = rowsData.map((col) => {
      const inputDni = String(col.dni).trim()
      const inputEmail = String(col.email || '')
        .trim()
        .toLowerCase()

      const isDniDup = existingDnis.has(inputDni)
      const isEmailDup = inputEmail && existingEmails.has(inputEmail) // Solo valida si el excel trae email

      // Si cualquiera de los dos existe, marcamos como existente
      const isExisting = isDniDup || isEmailDup

      if (isExisting) countIgnored++

      // Determinamos el mensaje de error para la UI
      let statusMsg = ''
      if (isDniDup && isEmailDup) statusMsg = 'DNI y Email Existentes'
      else if (isDniDup) statusMsg = 'DNI Existente'
      else if (isEmailDup) statusMsg = 'Email Existente'

      return {
        ...col,
        isExisting,
        isIncluded: !isExisting,
        statusMsg, // Guardamos el mensaje para mostrarlo en la tabla
      }
    })

    const totalNew = rowsData.length - countIgnored
    if (totalNew === 0) {
      warningMessage.value = `No hay nuevos colaboradores.\nIgnorados: ${countIgnored}`
      showWarningDialog.value = true
      clearFile()
      return
    }

    updateReviewMessage()
    showConfirmationDialog.value = true
  } catch (err) {
    console.error('API error', err)
    showWarningDialog.value = true
    warningMessage.value = 'Error comunicándose con la API.'
  }
}

// --- Confirmación ---
// --- Confirmación ---
const handleConfirmation = (wantsToReview) => {
  showConfirmationDialog.value = false

  // Verificamos si hay algún duplicado en la lista preparada
  const hasDuplicates = reviewTable.value.some((c) => c.isExisting)

  // Caso: Usuario quiere revisar explícitamente ("Sí, Revisar Archivo")
  if (wantsToReview) {
    showReviewDialog.value = true
    return
  }

  // Caso: Usuario presionó "Continuar sin Revisar"
  if (hasDuplicates) {
    // REQUERIMIENTO 3: Si hay DNIs repetidos (y nuevos mezclados),
    // aunque haya dicho "sin revisar", forzamos la vista de revisión
    // para que vea cuáles se ignorarán.

    // Opcional: Actualizar mensaje para dar contexto de por qué se abrió
    // reviewMessage.value = "Se detectaron duplicados. Por favor verifique la lista antes de cargar."

    showReviewDialog.value = true
  } else {
    // REQUERIMIENTO 1: No hay ningún repetido. Carga directa y exitosa.
    const rowsToCreate = reviewTable.value.filter((c) => c.isIncluded && !c.isExisting)
    executeUpload(rowsToCreate, true)
  }
}

function updateReviewMessage() {
  const totalNew = reviewTable.value.filter((c) => !c.isExisting).length
  const included = totalToProcessCount.value
  const ignored = reviewTable.value.filter((c) => c.isExisting).length

  let msg = ''

  if (included > 0) msg += `Se cargarán ${included} colaboradores nuevos.\n`
  if (totalNew > included) msg += `${totalNew - included} están excluidos.\n`
  if (ignored > 0) msg += `Ignorados existentes: ${ignored}`

  reviewMessage.value = msg + '\n\nSelecciona una acción.'
}

const cancelReview = () => {
  showReviewDialog.value = false
  clearFile()
}

// --- Subida ---
const executeUpload = async (rowsToCreate, isQuickLoad) => {
  showReviewDialog.value = false
  showConfirmationDialog.value = false

  let createdCount = 0
  const failed = []

  const totalIgnored = reviewTable.value.filter((c) => c.isExisting).length
  const totalExcluded = isQuickLoad
    ? 0
    : reviewTable.value.filter((c) => !c.isExisting && !c.isIncluded).length

  for (const r of rowsToCreate) {
    try {
      const { ...data } = r
      await api.post('/api/Colaborador', data)
      createdCount++
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        showWarningDialog.value = true
        warningMessage.value = 'No autorizado.'
        return
      }
      failed.push({
        dni: r.dni,
        error: err?.response?.data?.message || err?.message,
      })
    }
  }

  if (failed.length) {
    console.error('Errores:', failed)
    showWarningDialog.value = true
    warningMessage.value = `Carga parcial: ${createdCount} creados, ${failed.length} errores.`
  } else {
    successMessage.value =
      `Carga exitosa: ${createdCount} creados.\n` +
      `Ignorados: ${totalIgnored}\n` +
      `Excluidos: ${totalExcluded}`

    showSuccessDialog.value = true
    close()
  }

  clearFile()
}

// --- Cerrar Modal ---
function close() {
  isOpen.value = false
}
</script>

<style scoped>
/* NOTE: Dialog uses Quasar's dialog overlay; removed custom overlay/modal selectors */

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2469bc;
  color: white;
  padding: 8px 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.title-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-title {
  width: 28px;
  height: 28px;
}

.header h2 {
  font-size: 22px;
  margin: 0;
}

/* BOTÓN SALIR */
.btn-exit {
  display: flex;
  align-items: center;
  border: none;
  background: #0f4a92;
  padding: 6px 15px;
  border-radius: 10px;
  cursor: pointer;
  gap: 8px;
}

.icon-exit {
  width: 22px;
  height: 22px;
}

.btn-exit span {
  font-size: 18px;
  color: white;
}

/* SUBTÍTULO */
.subtitle {
  font-size: 17px;
  margin: 22px 0 18px;
  color: #333;
}

/* ZONA DE CARGA */
.upload-area {
  width: 100%;
  height: 220px;
  border: 3px dashed #bdc7d9;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafc;
}

.upload-area.dragging {
  border-color: #1f6feb;
  background: rgba(36, 105, 188, 0.06);
}

.hidden-file {
  display: none;
}

.upload-icon-wrapper {
  width: 120px;
  height: 120px;
  background: #f4f3f9;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-icon {
  width: 70px;
  height: 70px;
  opacity: 0.85;
}

.upload-text {
  margin-top: 15px;
  color: #60646d;
  font-size: 17px;
}

/* FILE CHIP */
.file-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  width: 360px;
}

.file-icon {
  width: 28px;
  height: 28px;
}

.file-name {
  color: #1f2937;
  text-decoration: none;
  font-size: 15px;
}

.file-remove {
  margin-left: auto;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
}

/* TABLA FAKE */
.table-preview {
  margin-top: 30px;
  border: 1px solid #d2d2d2;
  border-radius: 12px;
  padding: 15px;
  background: #f8f9fc;
}

.table-preview table {
  width: 100%;
  border-collapse: collapse;
}

.table-preview th {
  background: #e4e8f0;
  padding: 10px;
  font-size: 15px;
}

.table-preview td {
  padding: 10px;
  border-top: 1px solid #d6d6d6;
  font-size: 15px;
}

.preview-info {
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 6px;
}

.preview-empty {
  padding: 28px;
  color: #6b7280;
  text-align: center;
}

.preview-wrapper {
  max-height: 320px;
  overflow: auto;
}

/* Dialogs */
.success-dialog,
.warning-dialog,
.review-dialog {
  padding: 20px;
  border-radius: 15px;
  width: 500px; /* Un poco más ancho para la revisión */
}
</style>
