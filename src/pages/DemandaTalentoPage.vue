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
        <q-btn outline color="grey-6" class="filter-btn" no-caps>
          <div class="row items-center no-wrap">
            <img :src="filtrarIcon" alt="Filtrar" class="btn-filter-icon" />
            <span class="filter-label">Filtrar</span>
          </div>
        </q-btn>

        <q-btn
          unelevated
          color="primary"
          no-caps
          class="export-btn"
          @click="exportarVacantes"
        >
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
                  <q-btn
                    outline
                    color="primary"
                    no-caps
                    dense
                    class="btn-export-outline"
                    @click="exportarVacante(vac.id)"
                  >
                    <div class="row items-center no-wrap">
                      <img
                        :src="descargarWhiteIcon"
                        alt="Exportar"
                        class="btn-export-outline-icon"
                      />
                      <span>Exportar</span>
                    </div>
                  </q-btn>

                  <q-btn
                    unelevated
                    color="primary"
                    no-caps
                    dense
                    class="btn-reclutamiento"
                  >
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
          <div
            class="candidatos-footer row items-center justify-between"
            @click="openCandidatos(vac)"
          >
            <div class="candidatos-text">Candidatos Sugeridos</div>
            <q-icon name="chevron_right" size="20px" />
          </div>
        </q-card>
      </div>
    </div>

    <!-- =================== DIALOG CANDIDATOS =================== -->
    <q-dialog v-model="dialogCandidatosOpen">
      <q-card class="match-dialog-card">
        <!-- HEADER -->
        <q-card-section class="row items-center justify-between q-pb-sm">
          <div>
            <div class="match-dialog-title">Candidatos internos sugeridos</div>
            <div class="match-dialog-subtitle">
              {{ vacanteSeleccionada?.puesto }} · {{ vacanteSeleccionada?.area }}
            </div>
          </div>
          <q-btn flat round icon="close" @click="dialogCandidatosOpen = false" />
        </q-card-section>

        <q-separator />

        <!-- BODY -->
        <q-card-section class="q-pt-none">
          <div v-if="loadingCandidatos" class="text-center q-py-xl">
            <q-spinner size="40px" color="primary" />
            <div class="q-mt-sm text-grey-7">Calculando matching...</div>
          </div>

          <div v-else>
            <div v-if="!candidatos.length" class="text-center q-py-xl text-grey-7">
              No se encontraron candidatos internos para esta vacante.
            </div>

            <div v-else class="match-table">
              <!-- Header tipo tabla -->
              <div class="match-header row items-center q-px-lg q-py-sm">
                <div class="col-4">Colaborador</div>
                <div class="col-2 text-center">Match</div>
                <div class="col-2 text-center">Skill</div>
                <div class="col-2 text-center">Readiness</div>
                <div class="col-2 text-right">Acciones</div>
              </div>
              <q-separator />

              <!-- Filas -->
              <div
                v-for="cand in candidatos"
                :key="cand.id"
                class="match-row row items-center q-px-lg q-py-sm"
              >
                <!-- Colaborador -->
                <div class="col-4">
                  <div class="cand-name">{{ cand.nombre }}</div>
                  <div class="cand-role">
                    {{ cand.resumenPuesto }}
                  </div>
                </div>

                <!-- Match -->
                <div class="col-2 text-center">
                  <span :class="['metric', metricColorClass(cand.match)]">
                    {{ formatPercent(cand.match) }}
                  </span>
                </div>

                <!-- Skill -->
                <div class="col-2 text-center">
                  <span :class="['metric', metricColorClass(cand.skillScore)]">
                    {{ formatPercent(cand.skillScore) }}
                  </span>
                </div>

                <!-- Readiness -->
                <div class="col-2 text-center">
                  <span :class="['metric', metricColorClass(cand.readinessScore)]">
                    {{ formatPercent(cand.readinessScore) }}
                  </span>
                </div>

                <!-- Acciones -->
                <div class="col-2">
                  <div class="actions-cell">
                    <q-btn
                      dense
                      no-caps
                      class="btn-capacitacion"
                    >
                      <img :src="birreteIcon" class="btn-icon" alt="Capacitación" />
                      <span class="btn-label">Ver</span>
                    </q-btn>

                    <q-btn
                      dense
                      no-caps
                      class="btn-asignar"
                    >
                      <img :src="agregarIcon" class="btn-icon" alt="Asignar" />
                      <span class="btn-label">Asignar</span>
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'

// ICONOS
import filtrarIcon from 'assets/dashboard/filtrar.png'
import personasIcon from 'assets/dashboard/personas.png'
import chequeIcon from 'assets/dashboard/cheque.png'
import tendenciaIcon from 'assets/dashboard/tendencia.png'
import busquedaIcon from 'assets/dashboard/busqueda.png'
import descargasIcon from 'assets/dashboard/descargas.png'
import descargarWhiteIcon from 'assets/dashboard/descargar (1).png'
import birreteIcon from 'assets/dashboard/birrete.png'
import agregarIcon from 'assets/dashboard/agregar_.png'

// ======== STATE PRINCIPAL ========
const vacantes = ref([])

// filtros
const filtroTexto = ref('')
const filtroDepartamento = ref(null)
const filtroRol = ref(null)
const filtroSkill = ref(null)

// opciones de selects
const departamentoOptions = ref([
  { label: 'Todos los Departamentos', value: null }
])
const rolOptions = ref([
  { label: 'Todos los Roles', value: null }
])
const skillOptions = ref([
  { label: 'Todas las Skills', value: null }
])

const cargando = ref(false)

// ======== DIALOG CANDIDATOS ========
const dialogCandidatosOpen = ref(false)
const vacanteSeleccionada = ref(null)
const candidatos = ref([])
const loadingCandidatos = ref(false)

// ==== MAPEO URGENCIA ====
function mapUrgencia (nombre) {
  const n = (nombre || '').toLowerCase()
  if (n === 'alta') return { label: 'URGENTE', color: 'negative' }
  if (n === 'media') return { label: 'MEDIA', color: 'warning' }
  if (n === 'baja') return { label: 'BAJA', color: 'info' }
  return { label: nombre || 'SIN PRIORIDAD', color: 'grey-5' }
}

// ======== CARGA DE DATA DESDE BACKEND ========
async function cargarData () {
  try {
    cargando.value = true

    // 1) Vacantes
    const resVac = await api.get('/api/vacante')
    const lista = resVac.data || []

    // 2) Skills para el combo de filtro
    try {
      const resSkills = await api.get('/api/skill')
      const skills = resSkills.data || []
      skillOptions.value = [
        { label: 'Todas las Skills', value: null },
        ...skills.map(s => ({
          label: s.nombre,
          value: s.nombre
        }))
      ]
    } catch (err) {
      console.error('Error cargando skills para filtro', err)
    }

    // 3) Departamentos para el combo (si tu backend los tiene)
    try {
      const resDep = await api.get('/api/departamento')
      const deps = resDep.data || []
      departamentoOptions.value = [
        { label: 'Todos los Departamentos', value: null },
        ...deps.map(d => ({
          label: d.nombre,
          value: d.nombre
        }))
      ]
    } catch (err) {
      console.warn('No se pudieron cargar departamentos (opcional)', err)
    }

    // 4) Mapear vacantes a estructura del frontend
    const mapeadas = lista.map(v => {
      const urg = mapUrgencia(v.urgenciaNombre)
      return {
        id: v.vacanteId,
        puesto: v.titulo,
        area: v.perfilNombre,
        urgencia: urg.label,
        urgenciaColor: urg.color,
        coberturaInterna: 0,
        requeridos: 1,
        departamento: null, // pendiente hasta que backend lo provea
        rol: v.perfilNombre,
        skillsRequeridos: []
      }
    })

    // 5) Para cada vacante, traer sus skills requeridos
    await Promise.all(
      mapeadas.map(async vac => {
        try {
          const resSkillsReq = await api.get(`/api/vacante/${vac.id}/skills`)
          const reqs = resSkillsReq.data || []
          vac.skillsRequeridos = reqs.map(r => {
            const nombre = r.skillNombre || r.skillName
            const nivel = r.nivelNombre || null
            return nivel ? `${nombre} · ${nivel}` : nombre
          })
        } catch (err) {
          console.error('Error cargando skills de vacante', vac.id, err)
          vac.skillsRequeridos = []
        }
      })
    )

    vacantes.value = mapeadas
  } catch (error) {
    console.error('Error cargando vacantes', error)
  } finally {
    cargando.value = false
  }
}

onMounted(cargarData)

// ======== FILTRADO ========
const vacantesFiltradas = computed(() => {
  return vacantes.value.filter(v => {
    const texto = (filtroTexto.value || '').toLowerCase()

    const matchTexto =
      !texto ||
      v.puesto.toLowerCase().includes(texto) ||
      (v.area && v.area.toLowerCase().includes(texto))

    const matchDepto =
      !filtroDepartamento.value || v.departamento === filtroDepartamento.value

    const matchRol = !filtroRol.value || v.rol === filtroRol.value

    const matchSkill =
      !filtroSkill.value ||
      (v.skillsRequeridos || []).some(skill =>
        skill.toLowerCase().includes(filtroSkill.value.toLowerCase())
      )

    return matchTexto && matchDepto && matchRol && matchSkill
  })
})

// ======== MÉTRICAS RESUMEN ========
const totalVacantes = computed(() => vacantesFiltradas.value.length)

const vacantesUrgentes = computed(
  () => vacantesFiltradas.value.filter(v => v.urgencia === 'URGENTE').length
)

const coberturaInternaPromedio = computed(() => {
  if (!vacantesFiltradas.value.length) return 0
  const suma = vacantesFiltradas.value.reduce(
    (acc, v) => acc + (v.coberturaInterna || 0),
    0
  )
  return Math.round(suma / vacantesFiltradas.value.length)
})

// de momento 0; cuando tengas KPI real lo conectas
const skillsCriticosCubiertos = computed(() => 0)

// ======== ACCIONES EXPORTAR ========
function exportarVacantes () {
  console.log('Exportar vacantes (pendiente de definir endpoint)')
}

function exportarVacante (vacId) {
  const base = api.defaults.baseURL || 'http://localhost:5066'
  window.open(`${base}/api/exportacion/ranking/${vacId}`, '_blank')
}

// ======== HELPERS PORCENTAJES ========
function formatPercent (val) {
  if (val === null || val === undefined || isNaN(val)) return '--'
  return `${Math.round(val)}%`
}

function metricColorClass (val) {
  if (val === null || val === undefined || isNaN(val)) return 'metric-low'
  if (val >= 60) return 'metric-high'
  if (val >= 40) return 'metric-mid'
  return 'metric-low'
}

// ======== CÁLCULO Skill% y Readiness% EN FRONT ========
function computeSkillAndReadiness (candidate, reqs) {
  const skills = candidate.skills || []
  if (!reqs.length || !skills.length) {
    return { skillPercent: 0, readinessPercent: 0 }
  }

  let coverageSum = 0
  let expYearsSum = 0
  let expCount = 0

  reqs.forEach(req => {
    const cs = skills.find(s => s.skillId === req.skillId)
    if (!cs) return

    const nivelC = cs.nivelId || 0
    const nivelR = req.nivelDeseado || 1

    // Cobertura de skill
    let coverage = 0
    if (nivelC >= nivelR) {
      coverage = 1           // cumple o supera
    } else if (nivelC === nivelR - 1) {
      coverage = 0.5         // está a un nivel por debajo
    } else {
      coverage = 0           // muy lejos o no tiene la skill
    }
    coverageSum += coverage

    // Experiencia
    if (cs.aniosExp != null) {
      expYearsSum += cs.aniosExp
      expCount++
    }
  })

  // Skill% = cobertura promedio de skills requeridas
  const rawSkill = (coverageSum / reqs.length) * 100

  // Exp% = promedio de años / 5 (tope), en porcentaje
  let expPercent = 0
  if (expCount > 0) {
    const avgYears = expYearsSum / expCount
    const maxYears = 5
    expPercent = Math.min(1, avgYears / maxYears) * 100
  }

  // Readiness = 70% skill + 30% experiencia
  const readiness = 0.7 * rawSkill + 0.3 * expPercent

  return {
    skillPercent: Math.round(rawSkill),
    readinessPercent: Math.round(readiness)
  }
}

// ======== CANDIDATOS (DIALOG) ========
async function openCandidatos (vac) {
  vacanteSeleccionada.value = vac
  dialogCandidatosOpen.value = true
  loadingCandidatos.value = true
  candidatos.value = []

  try {
    // ranking + requisitos de skill en paralelo
    const [resRanking, resReqs] = await Promise.all([
      api.get(`/api/vacante/${vac.id}/ranking`),
      api.get(`/api/vacante/${vac.id}/skills`)
    ])

    const ranking = resRanking.data || []
    const reqs = (resReqs.data || []).map(r => ({
      skillId: r.skillId,
      nivelDeseado: r.nivelDeseado ?? r.nivelRequerido ?? 1,
      peso: r.peso ?? 1,
      critico: !!r.critico
    }))

    candidatos.value = ranking.map(c => {
      const { skillPercent, readinessPercent } =
        computeSkillAndReadiness(c, reqs)

      const skillsNames = (c.skills || [])
        .map(s => s.skillNombre || s.skillName)
        .filter(Boolean)

      const match = Number(c.matchScore ?? 0)

      return {
        id: c.colaboradorId,
        nombre: c.nombre,
        resumenPuesto: skillsNames.length ? skillsNames.join(' · ') : '—',
        match,
        skillScore: skillPercent,
        readinessScore: readinessPercent
      }
    })
  } catch (err) {
    console.error('Error cargando ranking de candidatos', err)
  } finally {
    loadingCandidatos.value = false
  }
}
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
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.page-subtitle {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
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

/* ========== DIALOG MATCHING ========== */
.match-dialog-card {
  width: 96vw;
  max-width: 1200px;
  max-height: 90vh;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.25);
}

.match-dialog-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.match-dialog-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.match-table {
  max-height: 64vh;
  overflow-y: auto;
}

.match-header {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.match-row:nth-child(odd) {
  background: #f9fafb;
}

.match-row:nth-child(even) {
  background: #ffffff;
}

.cand-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.cand-role {
  font-size: 12px;
  color: #6b7280;
}

/* Métricas */
.metric {
  font-size: 16px;
  font-weight: 700;
}

.metric-high {
  color: #16a34a; /* verde */
}

.metric-mid {
  color: #f59e0b; /* amarillo */
}

.metric-low {
  color: #ef4444; /* rojo */
}

/* Botones del dialog */
.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-capacitacion {
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  background: #2563eb;
  color: #ffffff;
}

.btn-asignar {
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  background: #22c55e;
  color: #ffffff;
}

.btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.btn-label {
  white-space: nowrap;
}
</style>
