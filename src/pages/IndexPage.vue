<template>
  <q-page class="bg-page q-pa-lg">

    <!-- TÍTULO -->
    <div class="row items-center q-mb-md">
      <div>
        <h4 class="page-title q-my-none">Vista General</h4>
        <div class="page-subtitle">
          Resumen de movilidad interna, demanda de talento y brechas de skill
        </div>
      </div>
    </div>

    <!-- KPIs SUPERIORES -->
    <div class="row q-col-gutter-md q-mb-xl">

      <div
        v-for="card in kpiCards"
        :key="card.key"
        class="col-12 col-sm-6 col-md-3"
      >
        <q-card class="kpi-card shadow-1">
          <q-card-section class="row no-wrap items-center">
            <q-avatar rounded size="42px" class="kpi-icon" :color="card.iconBg">
              <q-icon :name="card.icon" size="24px" />
            </q-avatar>

            <div class="kpi-content">
              <div class="kpi-label">{{ card.label }}</div>
              <div class="kpi-value">
                {{ card.value }}
                <span v-if="card.suffix" class="kpi-suffix">
                  {{ card.suffix }}
                </span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-helper">{{ card.helper }}</span>
                <span
                  v-if="card.trend"
                  class="kpi-trend"
                  :class="card.trend.startsWith('-') ? 'negative' : 'positive'"
                >
                  {{ card.trend }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="row q-col-gutter-xl">

      <!-- SKILL MAPPING POR COLABORADOR -->
      <div class="col-12 col-lg-7">
        <q-card class="shadow-1 rounded-borders">

          <q-card-section class="row items-center justify-between q-pb-sm">
            <div>
              <div class="card-title">
                Skill Mapping por Colaborador
              </div>
              <div class="card-subtitle">
                Mapa de skills y movilidad por área / departamento
              </div>
            </div>

            <div class="controls row items-center q-gutter-sm">
              <q-select
                dense
                outlined
                v-model="selectedDept"
                :options="departmentOptions"
                option-label="label"
                emit-value
                map-options
                style="min-width: 210px"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-none q-pl-none q-pr-none">
            <q-table
              :rows="filteredEmployees"
              :columns="employeeColumns"
              row-key="id"
              flat
              dense
              hide-bottom
              separator="horizontal"
              class="mapping-table"
            >
              <template #body-cell-name="props">
                <q-td :props="props">
                  <div class="emp-name">{{ props.row.name }}</div>
                  <div class="emp-meta">
                    {{ props.row.role }} · {{ props.row.department }}
                  </div>
                </q-td>
              </template>

              <template #body-cell-skills="props">
                <q-td :props="props">
                  <div class="row items-center q-col-gutter-xs">
                    <q-chip
                      v-for="skill in props.row.keySkills"
                      :key="skill"
                      size="sm"
                      color="primary"
                      text-color="white"
                      class="q-mr-xs q-mb-xs"
                    >
                      {{ skill }}
                    </q-chip>
                  </div>
                </q-td>
              </template>

              <template #body-cell-mapped="props">
                <q-td :props="props">
                  <div class="row items-center no-wrap">
                    <div class="mapping-label">
                      {{ props.row.mappedPercent }}%
                    </div>
                    <q-linear-progress
                      :value="props.row.mappedPercent / 100"
                      rounded
                      size="6px"
                      color="primary"
                      class="mapping-bar"
                    />
                  </div>
                  <div class="mapping-sub">
                    {{ props.row.skillsMapped }} skills mapeados
                  </div>
                </q-td>
              </template>

              <template #body-cell-mobility="props">
                <q-td :props="props">
                  <q-chip
                    :color="props.row.mobility === 'Alta' ? 'positive' : 'warning'"
                    text-color="white"
                    size="sm"
                  >
                    Movilidad {{ props.row.mobility }}
                  </q-chip>
                </q-td>
              </template>

              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    label="Ver perfil"
                    icon="open_in_new"
                    class="text-no-wrap"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat color="primary" label="Ver más colaboradores" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- COLUMNA DERECHA: DEMANDA + GAPS -->
      <div class="col-12 col-lg-5">

        <!-- DEMANDA DE TALENTO -->
        <q-card class="shadow-1 rounded-borders q-mb-lg">
          <q-card-section class="row items-center justify-between q-pb-xs">
            <div>
              <div class="card-title">Demanda de talento</div>
              <div class="card-subtitle">
                Vacantes internas activas por área y urgencia
              </div>
            </div>
            <q-badge
              color="primary"
              transparent
              align="middle"
            >
              {{ openPositions.length }} vacantes
            </q-badge>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-gutter-md q-pt-md">
            <q-card
              v-for="vac in openPositions"
              :key="vac.id"
              flat
              bordered
              class="vacancy-card"
            >
              <q-card-section class="row items-start justify-between q-pb-sm">
                <div>
                  <div class="vacancy-role">
                    {{ vac.role }}
                  </div>
                  <div class="vacancy-meta">
                    {{ vac.area }} · {{ vac.department }}
                  </div>
                </div>

                <q-chip
                  dense
                  :color="getUrgencyColor(vac.urgency)"
                  text-color="white"
                  class="text-uppercase"
                >
                  {{ vac.urgency }}
                </q-chip>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row items-center q-mb-xs">
                  <span class="vacancy-label">Proyecto:</span>
                  <span class="vacancy-value">{{ vac.project }}</span>
                </div>
                <div class="row items-center q-mb-xs">
                  <span class="vacancy-label">Inicio:</span>
                  <span class="vacancy-value">{{ vac.startDate }}</span>
                </div>
                <div class="row items-center">
                  <span class="vacancy-label">Skills clave:</span>
                  <span class="vacancy-value">
                    {{ vac.keySkills.join(', ') }}
                  </span>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="q-pt-none q-pb-sm">
                <q-btn flat size="sm" color="primary" label="Ver detalle" />
              </q-card-actions>
            </q-card>
          </q-card-section>

          <q-card-actions align="center" class="q-pt-none q-pb-md">
            <q-btn flat color="primary" label="Ver todas las vacantes" />
          </q-card-actions>
        </q-card>

        <!-- SKILL GAPS CRÍTICOS -->
        <q-card class="shadow-1 rounded-borders">
          <q-card-section class="row items-center justify-between q-pb-xs">
            <div>
              <div class="card-title">Skill gaps críticos</div>
              <div class="card-subtitle">
                Skills donde la demanda supera la oferta interna
              </div>
            </div>
            <q-icon name="warning_amber" color="negative" />
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-md">
            <div
              v-for="gap in criticalGaps"
              :key="gap.skill"
              class="q-mb-md"
            >
              <div class="row items-center justify-between q-mb-xs">
                <div class="gap-skill">{{ gap.skill }}</div>
                <q-badge
                  outline
                  :color="gap.delta < 0 ? 'negative' : 'primary'"
                  class="gap-badge"
                >
                  {{ gap.delta < 0 ? gap.delta : '+' + gap.delta }}
                </q-badge>
              </div>

              <div class="row items-center">
                <span class="gap-label">Disponible:</span>
                <span class="gap-value">{{ gap.available }}</span>
                <q-space />
                <span class="gap-label">Requerido:</span>
                <span class="gap-value">{{ gap.required }}</span>
              </div>

              <q-linear-progress
                :value="gap.available / gap.required"
                size="6px"
                rounded
                color="negative"
                track-color="grey-3"
                class="q-mt-xs"
              />
            </div>
          </q-card-section>

          <q-card-actions align="center" class="q-pt-none q-pb-md">
            <q-btn flat color="primary" label="Ver brechas de skill" />
          </q-card-actions>
        </q-card>

      </div>
    </div>

  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'

/**
 * KPIs superiores – en producción vendrían de la base de datos
 * (conteo de colaboradores activos, vacantes, etc.)
 */
const kpiCards = [
  {
    key: 'collaborators',
    label: 'Colaboradores activos',
    value: 100,
    suffix: '',
    helper: 'Skills totales mapeados: 1,482',
    trend: '+12%',
    icon: 'group',
    iconBg: 'blue-1'
  },
  {
    key: 'vacancies',
    label: 'Vacantes cubiertas internamente',
    value: '10/30',
    helper: 'Último trimestre',
    trend: '+8%',
    icon: 'work',
    iconBg: 'blue-1'
  },
  {
    key: 'coverage',
    label: 'Cobertura de skills críticos',
    value: '80',
    suffix: '%',
    helper: 'Top 50 skills estratégicos',
    trend: '+5%',
    icon: 'trending_up',
    iconBg: 'blue-1'
  },
  {
    key: 'gaps',
    label: 'Skill gaps críticos',
    value: 12,
    helper: 'Requieren atención inmediata',
    trend: '-7%',
    icon: 'warning_amber',
    iconBg: 'red-1'
  }
]

/**
 * Data mock para empleados – puedes mapear esto 1:1 a tu esquema:
 * Colaborador, Departamento, Área, Rol, Skills, etc.
 */
const employees = [
  {
    id: 1,
    name: 'Juan Pérez',
    role: 'Backend Developer Sr',
    department: 'Tecnología',
    keySkills: ['Node.js', 'SQL', 'Microservicios'],
    mappedPercent: 95,
    skillsMapped: 18,
    mobility: 'Alta'
  },
  {
    id: 2,
    name: 'Luis Chang',
    role: 'Frontend Developer',
    department: 'Tecnología',
    keySkills: ['Frontend Vue', 'UX', 'Comunicación'],
    mappedPercent: 88,
    skillsMapped: 15,
    mobility: 'Media'
  },
  {
    id: 3,
    name: 'María Torres',
    role: 'Data Engineer',
    department: 'Tecnología',
    keySkills: ['SQL', 'AWS', 'Python'],
    mappedPercent: 92,
    skillsMapped: 17,
    mobility: 'Alta'
  },
  {
    id: 4,
    name: 'Ana Rojas',
    role: 'HR Business Partner',
    department: 'Recursos Humanos',
    keySkills: ['Comunicación', 'Trabajo en equipo'],
    mappedPercent: 80,
    skillsMapped: 12,
    mobility: 'Media'
  }
]

const employeeColumns = [
  { name: 'name', label: 'Colaborador', field: 'name', align: 'left' },
  { name: 'skills', label: 'Skills clave', field: 'keySkills', align: 'left' },
  { name: 'mapped', label: 'Cobertura de skills', field: 'mappedPercent', align: 'left' },
  { name: 'mobility', label: 'Movilidad', field: 'mobility', align: 'left' },
  { name: 'actions', label: '', field: 'id', align: 'right' }
]

// Filtro por departamento
const departmentOptions = [
  { label: 'Todos los departamentos', value: 'ALL' },
  { label: 'Tecnología', value: 'Tecnología' },
  { label: 'Recursos Humanos', value: 'Recursos Humanos' }
]
const selectedDept = ref('ALL')

const filteredEmployees = computed(() => {
  if (selectedDept.value === 'ALL') return employees
  return employees.filter(e => e.department === selectedDept.value)
})

/**
 * Vacantes abiertas – mapeado a tus tablas Vacante / Proyecto / Urgencia.
 */
const openPositions = [
  {
    id: 1,
    role: 'Senior Engineer Backend',
    area: 'Desarrollo Backend',
    department: 'Tecnología',
    urgency: 'ALTA',
    project: 'Proyecto DataHub',
    startDate: '01/04/2025',
    keySkills: ['Node.js', 'Microservicios', 'SQL']
  },
  {
    id: 2,
    role: 'Data Scientist',
    area: 'Data & Analytics',
    department: 'Tecnología',
    urgency: 'MEDIA',
    project: 'Proyecto CRM360',
    startDate: '15/04/2025',
    keySkills: ['Python', 'ML', 'SQL']
  }
]

/**
 * Skill gaps – esto se puede construir con un query
 * que compare demanda (Vacantes+Perfiles) vs oferta interna (Skills por colaborador).
 */
const criticalGaps = [
  { skill: 'Python', available: 4, required: 10, delta: -6 },
  { skill: 'Frontend Vue', available: 3, required: 8, delta: -5 },
  { skill: 'Microservicios', available: 2, required: 7, delta: -5 }
]

function getUrgencyColor (urg) {
  if (urg === 'ALTA') return 'negative'
  if (urg === 'MEDIA') return 'warning'
  return 'primary'
}
</script>

<style scoped lang="scss">
$primary-blue: #2469bc;
$bg-page: #f4f3f9;

.bg-page {
  background: $bg-page;
}

.page-title {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-weight: 700;
  font-size: 20px;
}

.page-subtitle {
  font-family: 'Roboto', -apple-system, 'Segoe UI', sans-serif;
  font-size: 13px;
  color: #6b7280;
}

/* KPIs */
.kpi-card {
  border-radius: 16px;
  padding: 12px 14px;
}

.kpi-icon {
  background: #e8f2ff;
  color: $primary-blue;
}

.kpi-content {
  margin-left: 12px;
  flex: 1;
}

.kpi-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}

.kpi-value {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: baseline;
}

.kpi-suffix {
  font-size: 14px;
  margin-left: 2px;
}

.kpi-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.kpi-helper {
  font-size: 11px;
  color: #9ca3af;
}

.kpi-trend {
  font-size: 11px;
  font-weight: 600;

  &.positive {
    color: #059669;
  }

  &.negative {
    color: #dc2626;
  }
}

/* Card genérica */
.card-title {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-weight: 600;
  font-size: 15px;
}

.card-subtitle {
  font-family: 'Roboto', -apple-system, 'Segoe UI', sans-serif;
  font-size: 12px;
  color: #6b7280;
}

/* Tabla de mapping */
.mapping-table {
  font-family: 'Roboto', -apple-system, 'Segoe UI', sans-serif;
}

.emp-name {
  font-weight: 500;
  font-size: 14px;
}

.emp-meta {
  font-size: 11px;
  color: #6b7280;
}

.mapping-label {
  font-size: 12px;
  font-weight: 600;
  color: #111827;
  margin-right: 8px;
}

.mapping-bar {
  flex: 1;
}

.mapping-sub {
  font-size: 11px;
  color: #9ca3af;
}

/* Vacantes */
.vacancy-card {
  border-radius: 12px;
}

.vacancy-role {
  font-weight: 600;
  font-size: 14px;
}

.vacancy-meta {
  font-size: 12px;
  color: #6b7280;
}

.vacancy-label {
  font-size: 12px;
  color: #6b7280;
  margin-right: 4px;
}

.vacancy-value {
  font-size: 12px;
}

/* Skill gaps */
.gap-skill {
  font-weight: 500;
  font-size: 13px;
}

.gap-badge {
  font-size: 11px;
}

.gap-label {
  font-size: 11px;
  color: #6b7280;
  margin-right: 4px;
}

.gap-value {
  font-size: 11px;
}

/* Responsivo */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
}
</style>
