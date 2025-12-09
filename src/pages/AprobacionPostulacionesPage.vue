<template>
  <div class="aprobacion-page">
    <!-- Encabezado -->
    <section class="page-header card">
      <div class="row items-center justify-between">
        <div>
          <div class="title">Aprobación de Postulaciones</div>
          <div class="subtitle">
            Gestión de candidatos enviados a revisión por Admin / RRHH
          </div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-select
            dense
            outlined
            v-model="estadoSeleccionado"
            :options="estadoOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Estado"
            style="min-width: 180px"
            @update:model-value="cargarPostulaciones"
          />

          <q-btn
            color="primary"
            unelevated
            icon="refresh"
            label="ACTUALIZAR"
            @click="cargarPostulaciones"
          />
        </div>
      </div>
    </section>

    <!-- Tabla -->
    <section class="card">
      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="postulacionId"
        :loading="loading"
        :filter="filter"
        separator="horizontal"
        class="custom-table"
        no-data-label="No hay postulaciones para este estado"
        rows-per-page-label="Registros por página"
      >
        <!-- TOP -->
        <template #top>
          <div class="row items-center justify-between full-width">
            <div class="table-title">Postulaciones</div>

            <q-input
              dense
              outlined
              debounce="200"
              v-model="filter"
              placeholder="Buscar colaborador o vacante..."
              style="width: 280px"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <!-- Estado como chip -->
        <template #body-cell-estado="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="estadoColor(props.row.estado)"
              text-color="white"
              class="text-weight-medium"
            >
              {{ props.row.estado }}
            </q-chip>
          </q-td>
        </template>

        <!-- MatchScore -->
        <template #body-cell-matchScore="props">
          <q-td :props="props">
            <span v-if="props.row.matchScore != null">
              {{ Number(props.row.matchScore).toFixed(2) }}%
            </span>
            <span v-else>-</span>
          </q-td>
        </template>

        <!-- Acciones -->
        <template #body-cell-acciones="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">

              <q-btn
                dense
                flat
                icon="call"
                label="ENTREVISTA"
                color="primary"
                @click="cambiarEstado(props.row, 'Entrevista')"
                v-if="esEnRevision(props.row.estado)"
              />

              <q-btn
                dense
                flat
                icon="check_circle"
                label="SELECCIONAR"
                color="positive"
                @click="cambiarEstado(props.row, 'Seleccionado')"
                v-if="props.row.estado !== 'Seleccionado' && props.row.estado !== 'Rechazado'"
              />

              <q-btn
                dense
                flat
                icon="cancel"
                label="RECHAZAR"
                color="negative"
                @click="rechazar(props.row)"
                v-if="props.row.estado !== 'Rechazado'"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

const loading = ref(false)
const filter = ref('')

/**
 * OJO IMPORTANTE:
 * - label = lo que ve el usuario
 * - value = lo que se manda al backend
 * Así evitas problemas con tildes/espacios.
 */
const estadoOptions = [
  { label: 'En Revisión', value: 'En Revision' },
  { label: 'Entrevista', value: 'Entrevista' },
  { label: 'Seleccionado', value: 'Seleccionado' },
  { label: 'Rechazado', value: 'Rechazado' }
]

const estadoSeleccionado = ref('En Revision')

const columns = [
  {
    name: 'colaborador',
    label: 'Colaborador',
    field: 'nombreColaborador',
    align: 'left',
    sortable: true
  },
  {
    name: 'vacante',
    label: 'Vacante',
    field: 'vacanteTitulo',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fechaPostulacion',
    align: 'left',
    sortable: true,
    format: (val) => {
      try {
        return new Date(val).toLocaleDateString()
      } catch {
        return val
      }
    }
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'left',
    sortable: true
  },
  {
    name: 'matchScore',
    label: 'Match',
    field: 'matchScore',
    align: 'left',
    sortable: true
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'acciones',
    align: 'left'
  }
]

const rows = ref([])

function estadoColor(estado) {
  const e = (estado || '').toLowerCase()
  if (e.includes('revision')) return 'orange'
  if (e.includes('entrevista')) return 'blue'
  if (e.includes('seleccion')) return 'green'
  if (e.includes('rechaz')) return 'red'
  return 'grey'
}

function esEnRevision(estado) {
  return (estado || '').toLowerCase().includes('revision')
}

async function cargarPostulaciones() {
  loading.value = true
  try {
    const estado = estadoSeleccionado.value
    const { data } = await api.get(`/api/Postulacion/estado/${encodeURIComponent(estado)}`)
    rows.value = data ?? []
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar las postulaciones.' })
  } finally {
    loading.value = false
  }
}

async function cambiarEstado(row, nuevoEstado) {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Cambiar estado a "${nuevoEstado}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.put(`/api/Postulacion/${row.postulacionId}/estado`, {
        nuevoEstado,
        comentarios:
          nuevoEstado === 'Seleccionado'
            ? 'Aprobado por RRHH'
            : 'Aprobado para continuar proceso'
      })

      $q.notify({ type: 'positive', message: 'Estado actualizado.' })
      await cargarPostulaciones()
    } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Error actualizando estado.' })
    }
  })
}

async function rechazar(row) {
  $q.dialog({
    title: 'Rechazar candidato',
    message: 'Escribe un motivo de rechazo:',
    prompt: {
      model: '',
      type: 'text'
    },
    cancel: true,
    persistent: true
  }).onOk(async (motivo) => {
    try {
      await api.put(`/api/Postulacion/${row.postulacionId}/rechazar`, {
        motivoRechazo: motivo || 'No especificado'
      })

      $q.notify({ type: 'positive', message: 'Candidato rechazado.' })
      await cargarPostulaciones()
    } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Error rechazando candidato.' })
    }
  })
}

onMounted(cargarPostulaciones)
</script>

<style scoped>
.aprobacion-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Card estilo dashboard */
.card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e3e7f4;
  padding: 22px 28px 24px;
  box-shadow: 0 8px 20px rgba(21, 44, 101, 0.06);
}

.page-header .title {
  font-size: 18px;
  font-weight: 700;
  color: #1b1c1d;
}

.page-header .subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: #1b1c1d;
}
</style>
