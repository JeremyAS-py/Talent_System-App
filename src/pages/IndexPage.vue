<template>
  <q-page class="bg-page q-pa-lg page-auto">
    <!-- TÍTULO -->
    <div class="q-mb-xl">
      <div class="page-title">Vista General</div>
      <div class="page-subtitle">
        Resumen de movilidad interna, demanda de talento y brechas de skill.
      </div>
    </div>

    <!-- =================== CARDS SUPERIORES =================== -->
    <div class="row q-col-gutter-md q-mb-xl">
      <!-- Colaboradores activos -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="summary-card q-pa-lg">
          <div class="row items-start no-wrap">
            <div class="summary-icon">
              <img :src="personasIcon" alt="Colaboradores activos" />
            </div>

            <div class="q-ml-md" style="flex: 1;">
              <div class="summary-label">Colaboradores activos</div>
              <div class="summary-value">
                {{ summary.colaboradoresActivos }}
              </div>

              <div class="summary-footer">
                <span class="summary-helper">
                  Skills totales mapeados: {{ summary.skillsMapeados }}
                </span>
                <span class="summary-trend trend-positive">
                  +12%
                </span>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Vacantes cubiertas internamente -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="summary-card q-pa-lg">
          <div class="row items-start no-wrap">
            <div class="summary-icon">
              <img :src="vacanteIcon" alt="Vacantes cubiertas" />
            </div>

            <div class="q-ml-md" style="flex: 1;">
              <div class="summary-label">Vacantes cubiertas internamente</div>
              <div class="summary-value">
                {{ summary.vacantesCubiertasInternamente }}/{{ summary.vacantesTotales }}
              </div>

              <div class="summary-footer">
                <span class="summary-helper">
                  Último trimestre
                </span>
                <span class="summary-trend trend-positive">
                  +8%
                </span>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Cobertura skills críticos -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="summary-card q-pa-lg">
          <div class="row items-start no-wrap">
            <div class="summary-icon">
              <img :src="tendenciaIcon" alt="Cobertura skills críticos" />
            </div>

            <div class="q-ml-md" style="flex: 1;">
              <div class="summary-label">Cobertura de skills críticos</div>
              <div class="summary-value">
                {{ summary.coberturaSkillsCriticos }}%
              </div>

              <div class="summary-footer">
                <span class="summary-helper">
                  Top skills estratégicos
                </span>
                <span class="summary-trend trend-positive">
                  +5%
                </span>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Skill gaps críticos -->
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="summary-card q-pa-lg">
          <div class="row items-start no-wrap">
            <div class="summary-icon">
              <img :src="busquedaIcon" alt="Skill gaps críticos" />
            </div>

            <div class="q-ml-md" style="flex: 1;">
              <div class="summary-label">Skill gaps críticos</div>
              <div class="summary-value">
                {{ summary.skillGapsCriticos }}
              </div>

              <div class="summary-footer">
                <span class="summary-helper">
                  Requieren atención inmediata
                </span>
                <span class="summary-trend trend-negative">
                  -7%
                </span>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- =================== BLOQUE CENTRAL =================== -->
    <div class="row q-col-gutter-md">

      <!-- Skill Mapping por colaborador (resumen) -->
      <div class="col-12 col-lg-7 col-xl-8">
        <q-card class="panel-card q-pa-lg">

          <!-- Header tabla -->
          <div class="row justify-between items-start q-mb-lg">
            <div>
              <div class="panel-title">Skill Mapping por Colaborador</div>
              <div class="panel-subtitle">
                Mapa de skills y movilidad por área / departamento
              </div>
            </div>

            <div class="row items-center q-gutter-sm">
              <q-select
                dense
                outlined
                v-model="filtroDepartamento"
                :options="departamentoOptions"
                emit-value
                map-options
                style="min-width: 220px;"
              >
                <template #prepend>
                  <q-icon name="folder" size="18px" />
                </template>
              </q-select>

              <q-btn
                outline
                color="grey-6"
                class="filter-btn"
                no-caps
              >
                <div class="row items-center no-wrap">
                  <img :src="filtrarIcon" alt="Filtrar" class="btn-filter-icon" />
                  <span class="filter-label">Filtrar</span>
                </div>
              </q-btn>
            </div>
          </div>

          <!-- Estados de carga -->
          <div v-if="loading" class="text-center q-pa-xl">
            <q-spinner-dots color="primary" size="40px" />
            <p class="q-mt-md">Cargando colaboradores...</p>
          </div>
          <div v-else-if="error" class="text-center text-negative q-pa-xl">
            <q-icon name="error_outline" size="40px" />
            <p class="q-mt-md">{{ error }}</p>
          </div>

          <!-- Tabla -->
          <template v-else>
            <!-- Encabezados -->
            <div class="row table-header q-py-md q-px-sm">
              <div class="col-3">Colaborador</div>
              <div class="col-2">Rol</div>
              <div class="col-3">Skills clave</div>
              <div class="col-2">Cobertura</div>
              <div class="col-1 text-center">Movilidad</div>
              <div class="col-1 text-center">Acciones</div>
            </div>
            <q-separator />

            <!-- Filas (máximo 4 mejores) -->
            <div
              v-for="colab in colaboradoresTop"
              :key="colab.id"
              class="row table-row items-center q-py-md q-px-sm"
            >
              <!-- Nombre + Área -->
              <div class="col-3">
                <div class="text-body2 text-weight-bold name-text">
                  {{ colab.nombre }}
                </div>
                <div class="text-caption area-text">
                  {{ colab.area }}
                </div>
              </div>

              <!-- Rol -->
              <div class="col-2 rol-text">
                {{ colab.rol }}
              </div>

              <!-- Skills clave -->
              <div class="col-3 skills-cell">
                <q-chip
                  v-for="skill in colab.skills"
                  :key="skill"
                  dense
                  color="primary"
                  text-color="white"
                  class="skill-chip"
                >
                  {{ skill }}
                </q-chip>
              </div>

              <!-- Cobertura + barra -->
              <div class="col-2">
                <div class="cobertura-text">{{ colab.cobertura }}%</div>
                <q-linear-progress
                  :value="colab.cobertura / 100"
                  color="primary"
                  track-color="grey-3"
                  size="7px"
                  rounded
                />
                <div class="text-caption skills-count">
                  {{ colab.totalSkills }} skills
                </div>
              </div>

              <!-- Movilidad -->
              <div class="col-1 flex flex-center">
                <q-chip
                  dense
                  square
                  :color="colab.movilidad ? 'positive' : 'grey-4'"
                  :text-color="colab.movilidad ? 'white' : 'grey-8'"
                  class="movilidad-chip"
                >
                  {{ colab.movilidad ? 'SI' : 'NO' }}
                </q-chip>
              </div>

              <!-- Botón Ver Perfil (placeholder) -->
              <div class="col-1 flex flex-center">
                <q-btn
                  flat
                  color="primary"
                  dense
                  style="font-size: 12px;"
                  label="Ver perfil"
                />
              </div>
            </div>

            <!-- Botón Ver más -->
            <div class="row justify-center q-mt-lg" v-if="colaboradoresTop.length">
              <q-btn
                unelevated
                color="primary"
                label="Ver Más"
                class="q-px-xl"
                style="text-transform: none; font-weight: 600;"
              />
            </div>
          </template>
        </q-card>
      </div>

      <!-- Derecha: Demanda + Skill Gaps -->
      <div class="col-12 col-lg-5 col-xl-4">

        <!-- Demanda de talento (top 2 vacantes abiertas) -->
        <q-card class="panel-card compact-card q-mb-md">
          <q-card-section class="q-pb-md">
            <div class="row justify-between items-center">
              <div class="panel-title row items-center">
                <q-icon name="work_outline" class="q-mr-xs" size="20px" />
                Demanda de talento
              </div>
              <q-badge color="primary" outline>
                {{ vacantesAbiertas }} vacantes
              </q-badge>
            </div>
            <div class="panel-subtitle">
              Vacantes internas activas por área y urgencia
            </div>
          </q-card-section>

          <q-separator class="q-mb-md" />

          <q-card-section>
            <div
              v-for="vac in demandas"
              :key="vac.id"
              class="vacancy-item q-pa-md q-mb-md"
            >
              <div class="row justify-between items-center q-mb-sm">
                <div class="vac-puesto">{{ vac.puesto }}</div>
                <q-badge :color="vac.urgenciaColor" outline>
                  {{ vac.urgencia }}
                </q-badge>
              </div>

              <div class="vac-area">{{ vac.area }}</div>
              <div class="vac-desc">
                <strong>Proyecto:</strong> {{ vac.proyecto }}
              </div>
              <div class="vac-desc">
                <strong>Inicio:</strong> {{ vac.inicio }}
              </div>
              <div class="vac-desc">
                <strong>Skills clave:</strong> {{ vac.skillsResumen }}
              </div>

              <div class="row justify-between items-center q-mt-sm">
                <div class="candidatos-text">
                  {{ vac.candidatos }} candidatos
                </div>
                <q-btn flat dense color="primary" label="Ver detalle" />
              </div>
            </div>

            <div v-if="!demandas.length" class="text-center text-grey-7">
              No hay vacantes abiertas.
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              unelevated
              color="primary"
              label="Ver Más"
              class="btn-primary-link"
            />
          </q-card-actions>
        </q-card>

        <!-- Skill Gaps (usando /api/exportacion/brechas de la vacante más urgente) -->
        <q-card class="panel-card compact-card">
          <q-card-section class="q-pb-md">
            <div class="panel-title row items-center">
              <q-icon name="warning_amber" class="q-mr-xs" size="20px" />
              Skill Gaps Críticos
            </div>
            <div class="panel-subtitle">
              Skills con mayor brecha entre oferta y demanda
              <span v-if="vacanteBrechasTitulo">
                · {{ vacanteBrechasTitulo }}
              </span>
            </div>
          </q-card-section>

          <q-separator class="q-mb-md" />

          <q-card-section>
            <div v-if="loadingBrechas" class="text-center q-py-md">
              <q-spinner-dots color="primary" size="30px" />
              <div class="q-mt-sm text-grey-7">Calculando brechas...</div>
            </div>

            <template v-else>
              <div
                v-for="gap in skillGaps"
                :key="gap.skill"
                class="q-mb-md"
              >
                <div class="row justify-between items-center q-mb-sm">
                  <div class="gap-skill">{{ gap.skill }}</div>
                  <span class="gap-num">-{{ gap.brecha }}</span>
                </div>

                <q-linear-progress
                  :value="gap.porcentaje / 100"
                  color="negative"
                  track-color="grey-3"
                  size="8px"
                  rounded
                />

                <div class="gap-detalle">
                  Disponible: {{ gap.disponible }} · Requerido: {{ gap.requerido }}
                </div>
              </div>

              <div v-if="!skillGaps.length" class="text-center text-grey-7">
                No se encontró información de brechas para la vacante seleccionada.
              </div>
            </template>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              unelevated
              color="primary"
              label="Ver Brechas de Skills"
              class="btn-primary-link"
            />
          </q-card-actions>
        </q-card>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import * as XLSX from 'xlsx'

// ICONOS KPI
import personasIcon from 'assets/dashboard/personas.png'
import vacanteIcon from 'assets/dashboard/vacante.png'
import tendenciaIcon from 'assets/dashboard/tendencia.png'
import busquedaIcon from 'assets/dashboard/busqueda.png'
// Icono botón filtrar (bloque izquierdo)
import filtrarIcon from 'assets/dashboard/filtrar.png'

/* ====== ESTADO GENERAL ====== */
const loading = ref(true)
const error = ref(null)

const colaboradores = ref([])
const vacantes = ref([])

const departamentos = ref([])
const departamentoOptions = ref([
  { label: 'Todos los departamentos', value: null }
])
const filtroDepartamento = ref(null)

/* ====== RESUMEN KPIs ====== */
const summary = ref({
  colaboradoresActivos: 0,
  skillsMapeados: 0,
  vacantesTotales: 0,
  vacantesCubiertasInternamente: 0,
  coberturaSkillsCriticos: 0,
  skillGapsCriticos: 0
})

/* ====== DEMANDA (panel derecho) ====== */
const demandas = ref([])
const vacantesAbiertas = computed(
  () => vacantes.value.filter(v => !v.estado || v.estado.toLowerCase() === 'abierta').length
)

/* ====== SKILL GAPS (panel derecho) ====== */
const skillGaps = ref([])
const loadingBrechas = ref(false)
const vacanteBrechasTitulo = ref('')

/* ==== helpers ==== */
function mapUrgencia (nombre) {
  const n = (nombre || '').toLowerCase()
  if (n === 'alta') return { label: 'ALTA', color: 'negative' }
  if (n === 'media') return { label: 'MEDIA', color: 'warning' }
  if (n === 'baja') return { label: 'BAJA', color: 'info' }
  return { label: nombre || 'SIN PRIORIDAD', color: 'grey-5' }
}

/* ====== CARGA PRINCIPAL DASHBOARD ====== */
async function cargarDashboard () {
  try {
    loading.value = true
    error.value = null

    const [colabRes, vacRes, depRes, areaRes] = await Promise.all([
      api.get('/api/Colaborador'),
      api.get('/api/vacante'),
      api.get('/api/Departamento'),
      api.get('/api/Area/areas')
    ])

    const colabData = colabRes.data || []
    const vacData = vacRes.data || []
    const depData = depRes.data || []
    const areaData = areaRes.data || []

    departamentos.value = depData

    // Lookups para armar texto de área
    const depLookup = new Map(
      depData.map(d => [Number(d.departamentoId), d])
    )
    const areaLookup = new Map(
      areaData.map(a => [Number(a.areaId), a])
    )

    /* ---- Colaboradores ---- */
    colaboradores.value = colabData.map(c => {
      const dep = depLookup.get(Number(c.departamentoId))
      const area = areaLookup.get(Number(c.areaId))

      const fullName = `${c.nombres || ''} ${c.apellidos || ''}`.trim()
      const areaText = [
        dep?.nombre,
        area?.nombre
      ].filter(Boolean).join(' · ')

      const skillsArr = Array.isArray(c.skills) ? c.skills : []

      const cobertura =
        c.coberturaGlobal ??
        c.cobertura ??
        c.porcentajeCobertura ??
        Math.min(100, (skillsArr.length || 0) * 5)

      return {
        id: c.colaboradorId || c.id,
        nombre: fullName || c.nombre || '—',
        area: areaText || '—',
        rol: c.rolNombre || c.rol || '—',
        skills: skillsArr.slice(0, 3),
        totalSkills: skillsArr.length,
        cobertura: Math.round(cobertura),
        movilidad: c.disponibleMovilidad ?? false,
        departamentoId: c.departamentoId ? Number(c.departamentoId) : null
      }
    })

    // Opciones de departamento para el filtro
    departamentoOptions.value = [
      { label: 'Todos los departamentos', value: null },
      ...depData.map(d => ({
        label: d.nombre,
        value: Number(d.departamentoId)
      }))
    ]

    // Métricas colaboradores
    summary.value.colaboradoresActivos = colaboradores.value.length
    summary.value.skillsMapeados = colaboradores.value.reduce(
      (acc, c) => acc + (c.totalSkills || 0),
      0
    )

    /* ---- Vacantes ---- */
    const mapeadas = vacData.map(v => {
      const urg = mapUrgencia(v.urgenciaNombre)
      return {
        id: v.vacanteId,
        puesto: v.titulo,
        area: v.perfilNombre,
        urgencia: urg.label,
        urgenciaColor: urg.color,
        estado: v.estado,
        proyecto: v.proyectoNombre || 'Proyecto no especificado',
        inicio: v.fechaInicio
          ? new Date(v.fechaInicio).toLocaleDateString()
          : 'Sin fecha',
        skillsRequeridos: []
      }
    })

    vacantes.value = mapeadas

    summary.value.vacantesTotales = mapeadas.length
    // Aproximación: consideramos "cubiertas" las que NO están abiertas
    summary.value.vacantesCubiertasInternamente = mapeadas.filter(
      v => v.estado && v.estado.toLowerCase() !== 'abierta'
    ).length

    // Orden de urgencia para escoger top vacantes abiertas
    const ordenUrgencia = { ALTA: 1, MEDIA: 2, BAJA: 3 }

    const abiertasOrdenadas = mapeadas
      .filter(v => !v.estado || v.estado.toLowerCase() === 'abierta')
      .sort((a, b) => {
        const aRank = ordenUrgencia[a.urgencia] ?? 99
        const bRank = ordenUrgencia[b.urgencia] ?? 99
        return aRank - bRank
      })

    // Tomamos máximo 2 vacantes para el panel derecho
    demandas.value = abiertasOrdenadas.slice(0, 2).map(v => ({
      ...v,
      skillsResumen: 'Cargando...',
      candidatos: 0
    }))

    // Cargamos skills requeridos solo de estas vacantes
    await Promise.all(
      demandas.value.map(async vac => {
        try {
          const resSkillsReq = await api.get(`/api/vacante/${vac.id}/skills`)
          const reqs = resSkillsReq.data || []
          const skillsNombres = reqs
            .map(r => r.skillNombre || r.skillName)
            .filter(Boolean)
          vac.skillsResumen = skillsNombres.join(', ')
        } catch (err) {
          console.error('Error cargando skills de vacante', vac.id, err)
          vac.skillsResumen = '—'
        }
      })
    )

    // Escogemos la vacante más urgente para calcular skill gaps
    if (demandas.value.length) {
      const vac = demandas.value[0]
      vacanteBrechasTitulo.value = vac.puesto
      await cargarSkillGapsDesdeExcel(vac.id)
    } else {
      skillGaps.value = []
      summary.value.coberturaSkillsCriticos = 0
      summary.value.skillGapsCriticos = 0
    }
  } catch (err) {
    console.error('Error cargando dashboard:', err)
    error.value =
      err.message ||
      'No se pudo cargar la información. Verifique la conexión con la API.'
  } finally {
    loading.value = false
  }
}

/* ====== SKILL GAPS usando /api/exportacion/brechas ====== */
async function cargarSkillGapsDesdeExcel (vacanteId) {
  loadingBrechas.value = true
  skillGaps.value = []
  try {
    const params = {
      vacanteId,
      areaId: null
    }

    const response = await api.get('/api/exportacion/brechas', {
      params,
      responseType: 'arraybuffer'
    })

    const data = new Uint8Array(response.data)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const json = XLSX.utils.sheet_to_json(worksheet, {
      header: ['candidato', 'skill', 'disponible', 'requerido', 'brecha'],
      range: 4
    })

    // Agregamos por skill
    const map = new Map()
    json.forEach(row => {
      const skill = row.skill
      if (!skill) return
      const disponible = Number(row.disponible) || 0
      const requerido = Number(row.requerido) || 0
      const brechaRow =
        row.brecha != null && row.brecha !== ''
          ? Number(row.brecha) || 0
          : requerido - disponible

      if (!map.has(skill)) {
        map.set(skill, {
          skill,
          disponible: 0,
          requerido: 0,
          brecha: 0
        })
      }
      const agg = map.get(skill)
      agg.disponible += disponible
      agg.requerido += requerido
      agg.brecha += brechaRow
    })

    const agregados = Array.from(map.values())
      .filter(g => g.requerido > 0)
      .sort((a, b) => Math.abs(b.brecha) - Math.abs(a.brecha))

    const top3 = agregados.slice(0, 3).map(g => {
      const porcentaje =
        g.requerido > 0
          ? Math.max(0, Math.min(100, (g.disponible / g.requerido) * 100))
          : 0
      return {
        ...g,
        porcentaje: Math.round(porcentaje)
      }
    })

    skillGaps.value = top3
    summary.value.skillGapsCriticos = top3.length

    if (top3.length) {
      const promedioCobertura =
        top3.reduce((acc, g) => acc + g.porcentaje, 0) / top3.length
      summary.value.coberturaSkillsCriticos = Math.round(promedioCobertura)
    } else {
      summary.value.coberturaSkillsCriticos = 0
    }
  } catch (err) {
    console.error('Error cargando brechas desde Excel:', err)
    skillGaps.value = []
    summary.value.coberturaSkillsCriticos = 0
    summary.value.skillGapsCriticos = 0
  } finally {
    loadingBrechas.value = false
  }
}

/* ====== COLABORADORES FILTRADOS (TOP 4) ====== */
const colaboradoresFiltrados = computed(() => {
  let lista = colaboradores.value
  if (filtroDepartamento.value) {
    lista = lista.filter(
      c => c.departamentoId === filtroDepartamento.value
    )
  }
  // Ordenar por cobertura descendente
  lista = [...lista].sort((a, b) => (b.cobertura || 0) - (a.cobertura || 0))
  return lista
})

// En la tabla mostramos solo los 4 mejores
const colaboradoresTop = computed(() =>
  colaboradoresFiltrados.value.slice(0, 4)
)

/* ====== INIT ====== */
onMounted(cargarDashboard)
</script>

<style scoped>
/* Fondo auto + padding inferior */
.page-auto {
  min-height: auto !important;
  padding-bottom: 40px;
}

/* TIPOGRAFÍA GENERAL */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

/* CARDS SUPERIORES */
.summary-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.summary-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-icon img {
  width: 24px;
  height: 24px;
}

.summary-label {
  font-size: 13px;
  color: #6b7280;
}

.summary-value {
  font-size: 32px;
  font-weight: 700;
}

/* Línea helper + trend */
.summary-footer {
  margin-top: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.summary-helper {
  color: #6b7280;
  margin-right: 6px;
}

/* Badge del trend (+12%, -7%) */
.summary-trend {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
}

.trend-positive {
  background-color: #ecfdf3;
  color: #16a34a;
}

.trend-negative {
  background-color: #fef2f2;
  color: #dc2626;
}

/* PANEL */
.panel-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
}

.compact-card {
  padding: 16px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.panel-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

/* TABLA */
.table-header {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s ease;
}

.table-row:hover {
  background: #eef2ff;
}

.name-text {
  color: #111827;
}

.area-text {
  color: #6b7280;
}

.rol-text {
  color: #374151;
  font-weight: 500;
}

/* Skills: más compactos y ordenados */
.skills-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-chip {
  font-size: 11px;
  height: 22px;
  border-radius: 999px;
  padding: 0 10px;
}

.cobertura-text {
  font-weight: 700;
  color: #111827;
}

.skills-count {
  color: #6b7280;
  font-size: 11px;
}

.movilidad-chip {
  font-size: 11px;
  font-weight: 600;
}

/* Botón de Filtrar alineado con el q-select */
.filter-btn {
  height: 40px;
  border-radius: 8px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
}

/* Icono del botón Filtrar */
.btn-filter-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

/* Texto del botón Filtrar */
.filter-label {
  font-size: 14px;
  color: #374151;
}

/* VACANTES */
.vacancy-item {
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  transition: background 0.15s ease;
}

.vacancy-item:hover {
  background: #f9fafb;
}

.vac-puesto {
  font-weight: 700;
  color: #111827;
}

.vac-area {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
}

.vac-desc {
  font-size: 12px;
  color: #374151;
}

.candidatos-text {
  font-size: 12px;
  color: #2563eb;
}

/* GAPS */
.gap-skill {
  font-weight: 700;
  color: #111827;
}

.gap-num {
  font-weight: 700;
  color: #ef4444;
}

.gap-detalle {
  font-size: 11px;
  color: #6b7280;
}

/* Botones inferiores sólidos */
.btn-primary-link {
  text-transform: none;
  font-weight: 600;
}
</style>
