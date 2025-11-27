<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 900px; border-radius: 20px">
      <q-card-section class="q-pa-none">
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
                    <td v-for="(col, cIdx) in previewColumns" :key="cIdx">{{ row[cIdx] ?? '' }}</td>
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

      <q-card-actions align="center" class="q-pb-md">
        <q-btn flat label="Cancelar" @click="close" style="border-radius: 8px" />
        <q-btn
          label="Cargar"
          color="primary"
          @click="upload"
          unelevated
          style="border-radius: 8px; padding: 6px 24px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Success Dialog -->
  <q-dialog v-model="showSuccessDialog" persistent>
    <q-card class="success-dialog">
      <q-card-section class="text-center">
        <q-icon name="check_circle" color="positive" size="80px" />
        <h5 class="q-mt-md">¡Éxito!</h5>
        <p>{{ successMessage }}</p>
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
  <!-- Warning Dialog -->
  <q-dialog v-model="showWarningDialog" persistent>
    <q-card class="warning-dialog">
      <q-card-section class="text-center">
        <q-icon name="warning" color="warning" size="80px" />
        <h5 class="q-mt-md">Atención</h5>
        <p>{{ warningMessage }}</p>
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
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'
import { api } from 'src/boot/axios.js'
import CierreSesionIcon from '../assets/dashboard/cerrar-sesion.png'
// use dynamic import for xlsx to avoid build-time resolution errors when dependency not installed

const emit = defineEmits(['close'])
const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

// Estado interno del modal
const isOpen = ref(props.modelValue)
const showSuccessDialog = ref(false)
const successMessage = ref('')
const showWarningDialog = ref(false)
const warningMessage = ref('')

// Sincroniza apertura/cierre con MainLayout
watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
  },
)

watch(isOpen, (val) => {
  if (!val) emit('close')
})

// === Lógica subida de archivo ===
const fileInput = ref(null)
const selectedFile = ref(null)
const previewColumns = ref([])
const previewRows = ref([])
const allRows = ref([]) // full parsed rows (arrays), used for upload

// limit preview rows
const PREVIEW_MAX_ROWS = 10

// keep openFile available if later needed; reference to avoid linter unused var
const openFile = () => {
  if (fileInput.value) fileInput.value.click()
}
void openFile

const isDragging = ref(false)

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

async function processFile(file) {
  previewColumns.value = []
  previewRows.value = []
  if (!file) return

  const name = file.name.toLowerCase()
  try {
    if (name.endsWith('.csv')) {
      // read text and parse csv simple
      const text = await file.text()
      const rows = text.split(/\r?\n/).filter((r) => r.trim() !== '')
      const parsed = rows.map((r) => r.split(/,|;\t?|\t/))
      previewColumns.value = parsed[0] || []
      allRows.value = parsed.slice(1) || []
      previewRows.value = allRows.value.slice(0, PREVIEW_MAX_ROWS)
    } else {
      // try reading with SheetJS for .xlsx/.xls
      let mod
      try {
        mod = await import('xlsx')
      } catch (err) {
        console.warn('xlsx import failed', err)
        alert('Para procesar archivos Excel (.xlsx/.xls) instala la dependencia: npm install xlsx')
        return
      }
      const XLSX = mod.default ?? mod
      const ab = await file.arrayBuffer()
      const workbook = XLSX.read(ab, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      // get rows as arrays
      const aoa = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false })
      if (aoa && aoa.length) {
        previewColumns.value = aoa[0] || []
        allRows.value = aoa.slice(1) || []
        previewRows.value = allRows.value.slice(0, PREVIEW_MAX_ROWS)
      }
    }
  } catch (err) {
    console.error('Error parsing file', err)
    alert('No se pudo procesar el archivo. Asegúrate que es un Excel (.xlsx/.xls) o CSV válido.')
  }
}

const clearFile = () => {
  selectedFile.value = null
  previewColumns.value = []
  previewRows.value = []
  allRows.value = []
  if (fileInput.value) fileInput.value.value = ''
}
// reference to satisfy linters that don't analyze template usage
void clearFile

const upload = () => {
  if (!selectedFile.value) {
    alert('Seleccione un archivo primero.')
    return
  }

  if (!allRows.value || !allRows.value.length) {
    alert('No se han detectado filas para procesar en el archivo.')
    return
  }

  ;(async () => {
    try {
      // ensure auth token is attached if present
      try {
        // LoginForm stores the token under 'token'; some code used 'authToken'.
        const t = localStorage.getItem('token') || localStorage.getItem('authToken')
        if (t) api.defaults.headers.common['Authorization'] = 'Bearer ' + t
      } catch (e) {
        console.warn('Unable to read token from localStorage', e)
      }

      // 1. obtener colaboradores existentes
      const resp = await api.get('/api/Colaborador')
      const existing = resp.data || []
      const existingDnis = new Set((existing || []).map((c) => String(c.dni).trim()))

      // 2. mapear filas a objetos usando headers
      const rowsData = allRows.value.map((row) => mapRowToModel(row, previewColumns.value))

      // 3. validar presencia de dni y buscar duplicados
      const fileDniCounts = {}
      const missingDniRows = []
      rowsData.forEach((r, idx) => {
        const dni = String(r.dni ?? '').trim()
        if (!dni) missingDniRows.push(idx + 1)
        fileDniCounts[dni] = (fileDniCounts[dni] || 0) + 1
      })

      const duplicatesInFile = Object.entries(fileDniCounts).filter(([dni, cnt]) => dni && cnt > 1)
      const duplicatesExisting = Object.keys(fileDniCounts).filter(
        (dni) => dni && existingDnis.has(dni),
      )

      if (missingDniRows.length) {
        warningMessage.value = `Hay filas sin DNI en las posiciones: ${missingDniRows.join(
          ', ',
        )}. Corrige el archivo y vuelve a intentar.`
        showWarningDialog.value = true
        clearFile()
        return
      }

      if (duplicatesInFile.length || duplicatesExisting.length) {
        const msgs = []
        if (duplicatesInFile.length) msgs.push(`Duplicados en archivo: ${duplicatesInFile.length}`)
        if (duplicatesExisting.length)
          msgs.push(`Ya existen en sistema (por DNI): ${duplicatesExisting.length}`)

        warningMessage.value = `No se realizará la carga.\n${msgs.join(' - ')}`
        showWarningDialog.value = true
        clearFile()
        return
      }

      // 4. enviar POST por cada fila
      const created = []
      const failed = []
      for (const r of rowsData) {
        try {
          await api.post('/api/Colaborador', r)
          created.push(r.dni)
        } catch (err) {
          // if auth error, bail out with clear message
          const status = err?.response?.status
          if (status === 401 || status === 403) {
            alert('No autorizado. Por favor inicia sesión con un usuario con el rol adecuado.')
            return
          }
          failed.push({ dni: r.dni, error: err?.message ?? String(err) })
        }
      }

      if (failed.length) {
        alert(
          `Carga parcial: creados ${created.length}, errores ${failed.length}. Revisa la consola.`,
        )
        console.error('Failed rows:', failed)
      } else {
        successMessage.value = `Carga exitosa. Colaboradores creados: ${created.length}`
        showSuccessDialog.value = true
        close() // Cierra el modal de carga masiva
        clearFile()
      }
    } catch (err) {
      console.error(err)
      alert('Error al comunicarse con la API. Revisa la consola para más detalles.')
    }
  })()
}

function mapRowToModel(row, headers) {
  const obj = {}
  const h = headers || []
  // normalize header names to lower-case for matching
  const normalize = (s) =>
    String(s || '')
      .trim()
      .toLowerCase()
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
      const v = String(val ?? '')
        .trim()
        .toLowerCase()
      obj.disponibleMovilidad = v === 'si' || v === 'true' || v === '1'
    } else if (/activo|active/.test(key)) {
      const v = String(val ?? '')
        .trim()
        .toLowerCase()
      obj.activo = v === 'si' || v === 'true' || v === '1'
    }
  }
  // ensure defaults for missing but required fields
  obj.password = obj.password ?? 'ChangeMe123!'
  obj.rolId = typeof obj.rolId === 'number' ? obj.rolId : null
  obj.areaId = typeof obj.areaId === 'number' ? obj.areaId : null
  obj.departamentoId = typeof obj.departamentoId === 'number' ? obj.departamentoId : null
  obj.disponibleMovilidad = !!obj.disponibleMovilidad
  obj.activo = typeof obj.activo === 'boolean' ? obj.activo : true
  return obj
}

// Cerrar modal
function close() {
  isOpen.value = false
}
</script>

<style scoped>
/* NOTE: dialog uses Quasar's dialog overlay; removed custom overlay/modal selectors */

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
.warning-dialog {
  padding: 20px;
  border-radius: 15px;
  width: 400px;
}
</style>
