<template>
  <q-page class="bg-page q-pa-lg demanda-page">
    <!-- TÍTULO -->
    <div class="header-block q-mb-lg">
      <div class="page-title">Demanda de Talento</div>
      <div class="page-subtitle">
        Visión de vacantes internas, cobertura y skills requeridos por rol.
      </div>
    </div>

    <!-- =================== BARRA DE FILTROS =================== -->
    <div class="row items-center q-mb-lg filters-row">
      <!-- BLOQUE IZQUIERDO: 4 CONTROLES ALINEADOS -->
      <div class="col-grow">
        <div class="row items-center q-gutter-sm filters-main">
          <!-- Buscar -->
          <div class="filter-item">
            <q-input
              dense
              outlined
              v-model="filtroTexto"
              placeholder="Buscar vacante..."
              class="filter-control"
            >
              <template v-slot:prepend>
                <q-icon name="search" size="18px" />
              </template>
            </q-input>
          </div>

          <!-- Departamentos -->
          <div class="filter-item">
            <q-select
              dense
              outlined
              v-model="filtroDepartamento"
              :options="departamentoOptions"
              emit-value
              map-options
              class="filter-control"
              popup-content-class="filter-menu"
            />
          </div>

          <!-- Roles -->
          <div class="filter-item">
            <q-select
              dense
              outlined
              v-model="filtroRol"
              :options="rolOptions"
              emit-value
              map-options
              class="filter-control"
              popup-content-class="filter-menu"
            />
          </div>

          <!-- Skills -->
          <div class="filter-item">
            <q-select
              dense
              outlined
              v-model="filtroSkill"
              :options="skillOptions"
              emit-value
              map-options
              class="filter-control"
              popup-content-class="filter-menu"
            />
          </div>
        </div>
      </div>

      <!-- BLOQUE DERECHO: FILTRAR + EXPORTAR -->
      <div class="filters-actions row items-center q-gutter-sm">
        <!-- Botón Filtrar -->
        <q-btn outline color="grey-6" class="filter-btn" no-caps>
          <div class="row items-center no-wrap">
            <img :src="filtrarIcon" alt="Filtrar" class="btn-filter-icon" />
            <span class="filter-label">Filtrar</span>
          </div>
        </q-btn>

        <!-- Botón Exportar (solo “Exportar”) -->
        <q-btn unelevated color="primary" no-caps class="export-btn">
          <div class="row items-center no-wrap">
            <img :src="descargasIcon" alt="Exportar" class="btn-export-icon" />
            <span class="export-label">Exportar</span>
          </div>
        </q-btn>
      </div>
    </div>

    <!-- =================== CARDS RESUMEN =================== -->
    <div class="row q-col-gutter-md q-mb-xl">
      <!-- Vacantes -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="kpi-card q-pa-md">
          <div class="row items-center q-mb-sm">
            <div class="kpi-icon-wrapper">
              <img :src="personasIcon" alt="Vacantes" class="kpi-icon-img" />
            </div>
          </div>
          <div class="kpi-value">{{ totalVacantes }}</div>
          <div class="kpi-label">Vacantes</div>
        </q-card>
      </div>

      <!-- % Cubiertas internamente -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="kpi-card q-pa-md">
          <div class="row items-center q-mb-sm">
            <div class="kpi-icon-wrapper">
              <img :src="chequeIcon" alt="% Cubiertas" class="kpi-icon-img" />
            </div>
          </div>
          <div class="kpi-value">{{ coberturaInternaPromedio }}%</div>
          <div class="kpi-label">% Cubiertas internamente</div>
        </q-card>
      </div>

      <!-- % Skills críticos -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="kpi-card q-pa-md">
          <div class="row items-center q-mb-sm">
            <div class="kpi-icon-wrapper">
              <img :src="tendenciaIcon" alt="Skills críticos" class="kpi-icon-img" />
            </div>
          </div>
          <div class="kpi-value">{{ skillsCriticosCubiertos }}%</div>
          <div class="kpi-label">% Skills críticos cubiertos</div>
        </q-card>
      </div>

      <!-- Vacantes urgentes -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="kpi-card q-pa-md">
          <div class="row items-center q-mb-sm">
            <div class="kpi-icon-wrapper">
              <img :src="busquedaIcon" alt="Vacantes urgentes" class="kpi-icon-img" />
            </div>
          </div>
          <div class="kpi-value">{{ vacantesUrgentes }}</div>
          <div class="kpi-label">Vacantes urgentes</div>
        </q-card>
      </div>
    </div>

    <!-- =================== CARDS DE VACANTES =================== -->
    <div class="row q-col-gutter-lg">
      <div v-for="vac in vacantesFiltradas" :key="vac.id" class="col-12 col-lg-6">
        <q-card class="vacancy-card">
          <!-- HEADER -->
          <q-card-section class="q-pb-sm">
            <div class="row justify-between items-center q-mb-sm">
              <div class="row items-center no-wrap">
                <div class="vac-icon-wrapper q-mr-sm">
                  <q-icon name="work_outline" size="22px" class="vac-icon" />
                </div>
                <div>
                  <div class="vac-title">{{ vac.puesto }}</div>
                  <div class="vac-area">{{ vac.area }}</div>
                </div>
              </div>

              <q-badge :color="vac.urgenciaColor" text-color="white" class="urgency-badge">
                {{ vac.urgencia }}
              </q-badge>
            </div>
          </q-card-section>

          <q-separator />

          <!-- KPIs de la vacante -->
          <q-card-section class="q-py-md">
            <div class="row q-col-gutter-md">
              <div class="col-6 col-sm-4">
                <div class="vac-kpi-card">
                  <div class="vac-kpi-value">{{ vac.coberturaInterna }}%</div>
                  <div class="vac-kpi-label">Cobertura interna</div>
                </div>
              </div>

              <div class="col-6 col-sm-4">
                <div class="vac-kpi-card">
                  <div class="vac-kpi-value">
                    {{ vac.requeridos }}
                  </div>
                  <div class="vac-kpi-label">Requeridos</div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="col-12 col-sm-4">
                <div class="action-buttons column items-end q-gutter-xs">
                  <q-btn outline color="primary" no-caps dense class="btn-export-outline">
                    <div class="row items-center no-wrap">
                      <img
                        :src="descargarWhiteIcon"
                        alt="Exportar"
                        class="btn-export-outline-icon"
                      />
                      <span>Exportar</span>
                    </div>
                  </q-btn>

                  <q-btn unelevated color="primary" no-caps dense class="btn-reclutamiento">
                    Reclutamiento externo
                  </q-btn>
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- Skills requeridos -->
          <q-card-section class="q-pt-none q-pb-md">
            <div class="vac-section-title q-mb-xs">Skills requeridos</div>
            <div class="skills-row">
              <q-chip
                v-for="skill in vac.skillsRequeridos"
                :key="skill"
                dense
                color="primary"
                text-color="white"
                class="skill-chip"
              >
                {{ skill }}
              </q-chip>
            </div>
          </q-card-section>

          <!-- FOOTER: Candidatos sugeridos -->
          <div class="candidatos-footer row items-center justify-between">
            <div class="candidatos-text">Candidatos Sugeridos</div>
            <q-icon name="chevron_right" size="20px" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'

// ICONOS (ajusta las rutas según tus archivos reales)
import filtrarIcon from 'assets/dashboard/filtrar.png'
import personasIcon from 'assets/dashboard/personas.png'
import chequeIcon from 'assets/dashboard/cheque.png'
import tendenciaIcon from 'assets/dashboard/tendencia.png'
import busquedaIcon from 'assets/dashboard/busqueda.png'
import descargasIcon from 'assets/dashboard/descargas.png'
import descargarWhiteIcon from 'assets/dashboard/descargar (1).png' // o 'descargar (1).png'

/* ========= DATA DE VACANTES (mock) ========= */
const vacantes = ref([
  {
    id: 1,
    puesto: 'Senior Engineer Backend',
    area: 'Desarrollo Backend · Tecnología',
    urgencia: 'URGENTE',
    urgenciaColor: 'negative',
    coberturaInterna: 50,
    requeridos: 2,
    departamento: 'Tecnología',
    rol: 'Senior Engineer',
    skillsRequeridos: ['Python · Avanzado', 'Machine Learning · Avanzado', 'SQL · Intermedio'],
  },
  {
    id: 2,
    puesto: 'DevOps Engineer',
    area: 'DevOps · Tecnología',
    urgencia: 'MEDIA',
    urgenciaColor: 'warning',
    coberturaInterna: 80,
    requeridos: 1,
    departamento: 'Tecnología',
    rol: 'DevOps Engineer',
    skillsRequeridos: ['Azure · Avanzado', 'Docker · Avanzado', 'CI/CD · Intermedio'],
  },
])

/* ========= FILTROS ========= */
const filtroTexto = ref('')
const filtroDepartamento = ref(null)
const filtroRol = ref(null)
const filtroSkill = ref(null)

const departamentoOptions = [
  { label: 'Todos los Departamentos', value: null },
  { label: 'Tecnología', value: 'Tecnología' },
  { label: 'Recursos Humanos', value: 'Recursos Humanos' },
]

const rolOptions = [
  { label: 'Todos los Roles', value: null },
  { label: 'Senior Engineer', value: 'Senior Engineer' },
  { label: 'DevOps Engineer', value: 'DevOps Engineer' },
]

const skillOptions = [
  { label: 'Todas las Skills', value: null },
  { label: 'Python', value: 'Python' },
  { label: 'Machine Learning', value: 'Machine Learning' },
  { label: 'SQL', value: 'SQL' },
  { label: 'Azure', value: 'Azure' },
  { label: 'Docker', value: 'Docker' },
  { label: 'CI/CD', value: 'CI/CD' },
]

/* ========= VACANTES FILTRADAS ========= */
const vacantesFiltradas = computed(() => {
  return vacantes.value.filter((v) => {
    const matchTexto =
      !filtroTexto.value || v.puesto.toLowerCase().includes(filtroTexto.value.toLowerCase())

    const matchDepto = !filtroDepartamento.value || v.departamento === filtroDepartamento.value

    const matchRol = !filtroRol.value || v.rol === filtroRol.value

    const matchSkill =
      !filtroSkill.value ||
      v.skillsRequeridos.some((skill) =>
        skill.toLowerCase().includes(filtroSkill.value.toLowerCase()),
      )

    return matchTexto && matchDepto && matchRol && matchSkill
  })
})

/* ========= MÉTRICAS RESUMEN ========= */
const totalVacantes = computed(() => vacantesFiltradas.value.length)

const vacantesUrgentes = computed(
  () => vacantesFiltradas.value.filter((v) => v.urgencia === 'URGENTE').length,
)

const coberturaInternaPromedio = computed(() => {
  if (!vacantesFiltradas.value.length) return 0
  const suma = vacantesFiltradas.value.reduce((acc, v) => acc + v.coberturaInterna, 0)
  return Math.round(suma / vacantesFiltradas.value.length)
})

// por ahora 0; luego lo puedes calcular de verdad
const skillsCriticosCubiertos = computed(() => 0)
</script>

<style scoped>
.demanda-page {
  min-height: auto;
}

/* Bloque título */
.header-block {
  margin-bottom: 20px;
}

.page-title {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.page-subtitle {
  font-family:
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 14px;
  color: #6b7280;
}

/* ===== BARRA DE FILTROS ===== */
.filters-row {
  margin-bottom: 26px;
  flex-wrap: wrap;
}

.filters-main {
  flex-wrap: wrap;
}

/* Cada control tiene mismo ancho para que se vea alineado al Figma */
.filter-item {
  width: 260px;
}

.filter-control {
  width: 100%;
}

.filter-menu {
  font-size: 14px;
}

.filters-actions {
  flex-shrink: 0;
  margin-top: 12px;
}

@media (min-width: 1200px) {
  .filters-row {
    flex-wrap: nowrap;
  }
  .filters-main {
    flex-wrap: nowrap;
  }
  .filters-actions {
    margin-top: 0;
    margin-left: 16px;
  }
}

.filter-btn {
  height: 40px;
  border-radius: 8px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
}

.btn-filter-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

.filter-label {
  font-size: 14px;
  color: #374151;
}

/* Botón exportar top */
.export-btn {
  height: 40px;
  border-radius: 10px;
  padding: 0 26px;
  min-width: 170px;
  display: inline-flex;
  align-items: center;
}

.btn-export-icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
}

.export-label {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

/* KPI cards */
.kpi-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.kpi-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon-img {
  width: 22px;
  height: 22px;
}

.kpi-value {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: 13px;
  color: #6b7280;
}

/* Vacancy cards */
.vacancy-card {
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.vac-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #e0ecff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vac-icon {
  color: #2563eb;
}

.vac-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.vac-area {
  font-size: 12px;
  color: #6b7280;
}

.urgency-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
}

/* KPIs de vacante */
.vac-kpi-card {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 10px 12px;
}

.vac-kpi-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.vac-kpi-label {
  font-size: 12px;
  color: #6b7280;
}

/* Botones dentro de cada tarjeta */
.action-buttons {
  min-width: 170px;
}

.btn-export-outline {
  border-radius: 20px;
  font-size: 12px;
  padding: 4px 10px;
}

.btn-export-outline-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.btn-reclutamiento {
  border-radius: 20px;
  font-size: 12px;
  padding: 6px 14px;
}

/* Skills */
.vac-section-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.skill-chip {
  font-size: 11px;
  height: 22px;
  border-radius: 999px;
  padding: 0 10px;
}

/* Footer candidatos sugeridos */
.candidatos-footer {
  padding: 10px 16px;
  background: #2563eb;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.candidatos-text {
  text-transform: none;
}

/* Responsivo botones internos */
@media (max-width: 1024px) {
  .action-buttons {
    width: 100%;
  }

  .btn-export-outline,
  .btn-reclutamiento {
    width: 100%;
    justify-content: center;
    text-align: center;
  }
}
</style>
