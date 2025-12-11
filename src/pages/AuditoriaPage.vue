<template>
  <q-page class="panel-registro-acciones">
    <!-- CONTENIDO -->
    <div class="pra-content">
      <!-- HEADER LOCAL -->
      <div class="row items-center q-mb-md pra-local-header">
        <q-btn
          flat
          round
          icon="arrow_back"
          color="primary"
          class="q-mr-sm"
          @click="$router.back()"
        />
        <div>
          <h4 class="title text-primary q-my-none">Registro de Auditoría</h4>
          <div class="subtitle text-grey-7">
            Consulta las acciones realizadas por los usuarios en el sistema
          </div>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="pra-filters">
        <!-- Usuario -->
        <q-select
          v-model="filtros.usuario"
          :options="usuariosOptions"
          label="Usuario"
          emit-value
          map-options
          dense
          outlined
          class="pra-filter-item"
        />

        <!-- Rango de fechas -->
        <q-input
          readonly
          label="Rango de fechas"
          dense
          outlined
          class="pra-filter-item"
          :model-value="rangoFechasLabel"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="filtros.rangoFechas" range locale="es" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- Acción -->
        <q-select
          v-model="filtros.tipoAccion"
          :options="tipoAccionOptions"
          label="Tipo de acción"
          dense
          outlined
          class="pra-filter-item"
        />

        <q-btn class="pra-filter-btn" color="primary" unelevated @click="aplicarFiltros">
          <q-icon name="filter_list" class="q-mr-xs" />
          Filtrar
        </q-btn>
      </div>

      <!-- CARD CON TABLA -->
      <q-card class="pra-card">
        <div class="pra-table-wrapper">
          <q-table
            :rows="accionesFiltradas"
            :columns="columns"
            row-key="id"
            flat
            class="pra-table"
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <!-- Usuario con avatar -->
            <template #body-cell-usuario="props">
              <q-td :props="props">
                <div class="pra-cell-usuario">
                  <q-avatar size="38px" class="pra-avatar-mini">
                    <q-icon name="person" />
                  </q-avatar>
                  <span>{{ props.row.usuario }}</span>
                </div>
              </q-td>
            </template>

            <!-- Resultado con pill verde -->
            <template #body-cell-resultado="props">
              <q-td :props="props">
                <q-chip
                  dense
                  class="pra-resultado-chip"
                  color="positive"
                  text-color="positive"
                  outline
                >
                  {{ props.row.resultado }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'

export default {
  name: 'PanelRegistroAcciones',

  data() {
    return {
      cargando: false,

      filtros: {
        usuario: null,
        rangoFechas: null,
        tipoAccion: null,
      },

      usuariosOptions: [],
      tipoAccionOptions: [],
      acciones: [],

      columns: [
        { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' },
        { name: 'accion', label: 'Acción', field: 'accion', align: 'left' },
        { name: 'entidad', label: 'Entidad', field: 'entidad', align: 'left' },
        { name: 'idAfectado', label: 'Id Afectado', field: 'idAfectado', align: 'left' },
        { name: 'fechaHora', label: 'Fecha/Hora', field: 'fechaHora', align: 'left' },
        { name: 'resultado', label: 'Resultado', field: 'resultado', align: 'left' },
      ],
    }
  },

  computed: {
    rangoFechasLabel() {
      const r = this.filtros.rangoFechas
      if (!r || !r.from || !r.to) return ''
      return `${this.formatearFechaCorta(r.from)} - ${this.formatearFechaCorta(r.to)}`
    },

    accionesFiltradas() {
      return this.acciones.filter((a) => {
        const coincideUsuario = !this.filtros.usuario || a.usuario === this.filtros.usuario
        const coincideTipoAccion = !this.filtros.tipoAccion || a.accion === this.filtros.tipoAccion
        return coincideUsuario && coincideTipoAccion
      })
    },
  },

  created() {
    this.cargarAuditoria()
  },

  methods: {
    async cargarAuditoria() {
      this.cargando = true
      try {
        const token = localStorage.getItem('token')
        const params = {}

        if (this.filtros.usuario !== null) params.usuarioId = this.filtros.usuario

        const r = this.filtros.rangoFechas
        if (r?.from && r?.to) {
          params.desde = this.toIsoDate(r.from)
          params.hasta = this.toIsoDate(r.to)
        }

        const { data } = await api.get('/api/auditoria', {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        this.acciones = data.map((item) => ({
          id: item.auditoriaId,
          usuario: item.usuarioEmail || '—',
          accion: item.accion,
          entidad: item.entidad || '—',
          idAfectado: item.entidadId ?? '—',
          fechaHora: this.formatearFecha(item.fecha),
          resultado: item.exitoso === false ? 'Error' : 'Éxito',
        }))

        this.usuariosOptions = [
          { label: 'Todos', value: null },
          ...[...new Set(this.acciones.map((a) => a.usuario))].map((u) => ({
            label: u,
            value: u,
          })),
        ]

        this.tipoAccionOptions = [...new Set(this.acciones.map((a) => a.accion))]
      } catch (err) {
        console.error('Error cargando auditoría', err)
        this.$q.notify({ type: 'negative', message: 'No se pudo cargar la auditoría' })
      } finally {
        this.cargando = false
      }
    },

    async aplicarFiltros() {
      await this.cargarAuditoria()
    },

    formatearFecha(fechaIso) {
      if (!fechaIso) return '—'
      const d = new Date(fechaIso)
      return d.toLocaleString('es-PE', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    formatearFechaCorta(str) {
      const [y, m, d] = str.split(/[/-]/).map(Number)
      return new Date(y, m - 1, d).toLocaleDateString('es-PE')
    },

    toIsoDate(str) {
      const [y, m, d] = str.split(/[/-]/).map(Number)
      return new Date(y, m - 1, d).toISOString()
    },
  },
}
</script>

<style scoped>
.panel-registro-acciones {
  background: #f4f3f9;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* HEADER AZUL */
.pra-header {
  background: #2469bc;
  color: white;
  padding: 24px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -24px -32px 24px;
}

.pra-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pra-title {
  font-size: 30px;
  font-weight: 700;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.pra-subtitle {
  font-size: 20px;
  font-family:
    Roboto,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  opacity: 0.9;
}

.pra-back-btn {
  background: rgba(255, 255, 255, 0.15);
}

.pra-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pra-user-info {
  text-align: right;
}

.pra-user-name {
  font-size: 22px;
  font-weight: 600;
}

.pra-user-role {
  font-size: 16px;
}

.pra-user-divider {
  margin-top: 4px;
  height: 1px;
  width: 120px;
  background: white;
  opacity: 0.7;
  margin-left: auto;
}

.pra-avatar-user {
  background: white;
  color: #2469bc;
}

/* CONTENIDO */
.pra-content {
  padding: 0 16px 40px;
}

/* FILTROS */
.pra-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.pra-filter-item {
  min-width: 220px;
}

.pra-filter-btn {
  min-width: 120px;
}

/* CARD / TABLA */
.pra-card {
  border-radius: 25px;
  border: 1px solid #bdc7d9;
  background: #f4f3f9;
  padding: 16px 24px 8px;
}

/* SCROLL SOLO EN EL CUERPO DE LA TABLA */
.pra-table :deep(.q-table__middle) {
  max-height: 420px; /* ajusta a tu gusto */
  overflow-y: auto;
}

.pra-table :deep(tbody tr:nth-child(odd)) {
  background: #ffffff;
}

.pra-table :deep(tbody tr:nth-child(even)) {
  background: #f9fafb;
}

.pra-table :deep(.q-table__top),
.pra-table :deep(.q-table__bottom) {
  padding-left: 0;
  padding-right: 0;
}

.pra-cell-usuario {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pra-avatar-mini {
  border: 1px solid #bdc7d9;
  background: white;
}

.pra-resultado-chip {
  background: #d4edda;
  border-radius: 12px;
  border-color: #53885f;
}
.panel-registro-acciones {
  padding-top: 48px; /* nivel perfecto según tu UI */
}

.pra-table-wrapper {
  max-height: 420px;
  overflow-y: auto;
}
.pra-local-header {
  margin-bottom: 20px;
}

.title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

.subtitle {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
}
</style>
