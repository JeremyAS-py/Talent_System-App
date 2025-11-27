<template>
  <q-page class="bg-page q-pa-lg page-auto">

    <!-- TITULO + DESCRIPCIÓN -->
    <div class="q-mb-xl">
      <div class="page-title">Vista General</div>
      <div class="page-subtitle">
        Resumen de movilidad interna, demanda de talento y brechas de skill.
      </div>
    </div>

    <!-- =================== CARDS SUPERIORES =================== -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div
        v-for="card in summaryCards"
        :key="card.id"
        class="col-12 col-sm-6 col-lg-3"
      >
        <q-card class="summary-card q-pa-lg">
          <div class="row items-start no-wrap">
            <div class="summary-icon">
              <img :src="card.icon" :alt="card.title" />
            </div>

            <div class="q-ml-md" style="flex: 1;">
              <div class="summary-label">{{ card.title }}</div>
              <div class="summary-value">{{ card.value }}</div>

              <!-- helper + trend -->
              <div class="summary-footer">
                <span class="summary-helper">
                  {{ card.helper }}
                </span>
                <span
                  class="summary-trend"
                  :class="card.trendPositive ? 'trend-positive' : 'trend-negative'"
                >
                  {{ card.trend }}
                </span>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- =================== BLOQUE CENTRAL =================== -->
    <div class="row q-col-gutter-md">

      <!-- Skill Mapping -->
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
                style="min-width: 200px;"
              >
                <template v-slot:prepend>
                  <q-icon name="folder" size="18px" />
                </template>
              </q-select>

              <!-- Botón Filtrar alineado con el select -->
              <q-btn
                outline
                color="grey-6"
                class="filter-btn"
                no-caps
              >
                <div class="row items-center no-wrap">
                  <img
                    :src="filtrarIcon"
                    alt="Filtrar"
                    class="btn-filter-icon"
                  />
                  <span class="filter-label">Filtrar</span>
                </div>
              </q-btn>
            </div>
          </div>

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

          <!-- Filas -->
          <div
            v-for="colab in colaboradoresFiltrados"
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

            <!-- Botón Ver Perfil -->
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
          <div class="row justify-center q-mt-lg">
            <q-btn
              unelevated
              color="primary"
              label="Ver Más"
              class="q-px-xl"
              style="text-transform: none; font-weight: 600;"
            />
          </div>

        </q-card>
      </div>

      <!-- Derecha: Demanda + Gaps -->
      <div class="col-12 col-lg-5 col-xl-4">
        <!-- Demanda -->
        <q-card class="panel-card compact-card q-mb-md">
          <q-card-section class="q-pb-md">
            <div class="row justify-between items-center">
              <div class="panel-title row items-center">
                <q-icon name="work_outline" class="q-mr-xs" size="20px" />
                Demanda de talento
              </div>
              <q-badge color="primary" outline>
                {{ demandas.length }} vacantes
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
                <strong>Skills clave:</strong> {{ vac.skills }}
              </div>

              <div class="row justify-between items-center q-mt-sm">
                <div class="candidatos-text">
                  {{ vac.candidatos }} candidatos
                </div>
                <q-btn flat dense color="primary" label="Ver detalle" />
              </div>
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

        <!-- Gaps -->
        <q-card class="panel-card compact-card">
          <q-card-section class="q-pb-md">
            <div class="panel-title row items-center">
              <q-icon name="warning_amber" class="q-mr-xs" size="20px" />
              Skill Gaps Críticos
            </div>
            <div class="panel-subtitle">
              Skills con mayor brecha entre oferta y demanda
            </div>
          </q-card-section>

          <q-separator class="q-mb-md" />

          <q-card-section>
            <div
              v-for="gap in skillGaps"
              :key="gap.id"
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
import { computed, ref } from 'vue'

// ICONOS
import personasIcon from 'assets/dashboard/personas.png'
import vacanteIcon from 'assets/dashboard/vacante.png'
import tendenciaIcon from 'assets/dashboard/tendencia.png'
import busquedaIcon from 'assets/dashboard/busqueda.png'
import filtrarIcon from 'assets/dashboard/filtrar.png'

/* ====== CARDS ====== */
const summaryCards = [
  {
    id: 'colaboradores',
    title: 'Colaboradores activos',
    value: '100',
    helper: 'Skills totales mapeados: 1,482',
    trend: '+12%',
    trendPositive: true,
    icon: personasIcon
  },
  {
    id: 'vacantes',
    title: 'Vacantes cubiertas internamente',
    value: '10/30',
    helper: 'Último trimestre',
    trend: '+8%',
    trendPositive: true,
    icon: vacanteIcon
  },
  {
    id: 'cobertura',
    title: 'Cobertura de skills críticos',
    value: '80%',
    helper: 'Top 50 skills estratégicos',
    trend: '+5%',
    trendPositive: true,
    icon: tendenciaIcon
  },
  {
    id: 'gaps',
    title: 'Skill gaps críticos',
    value: '12',
    helper: 'Requieren atención inmediata',
    trend: '-7%',
    trendPositive: false,
    icon: busquedaIcon
  }
]

/* ====== COLABORADORES ====== */
const colaboradores = ref([
  {
    id: 1,
    nombre: 'Juan Pérez',
    area: 'Marketing · IT',
    rol: 'PROJECT MANAGER',
    skills: ['Liderazgo', 'Agile', 'Comunicación'],
    cobertura: 95,
    totalSkills: 18,
    movilidad: true,
    departamento: 'Todos los departamentos'
  },
  {
    id: 2,
    nombre: 'Luis Chang',
    area: 'IT · Tecnología',
    rol: 'FULL STACK',
    skills: ['Node.js', 'UI Design', 'SQL'],
    cobertura: 88,
    totalSkills: 15,
    movilidad: true,
    departamento: 'Tecnología'
  },
  {
    id: 3,
    nombre: 'José Ballón',
    area: 'IT · Ciencia de Datos',
    rol: 'DATA SCIENTIST',
    skills: ['Python', 'SQL', 'Machine Learning'],
    cobertura: 92,
    totalSkills: 17,
    movilidad: true,
    departamento: 'Tecnología'
  },
  {
    id: 4,
    nombre: 'Ana Rojas',
    area: 'HR Business Partner',
    rol: 'HR BUSINESS PARTNER',
    skills: ['Comunicación', 'Trabajo en equipo'],
    cobertura: 80,
    totalSkills: 12,
    movilidad: false,
    departamento: 'Recursos Humanos'
  }
])

const departamentoOptions = [
  { label: 'Todos los departamentos', value: 'Todos los departamentos' },
  { label: 'Tecnología', value: 'Tecnología' },
  { label: 'Recursos Humanos', value: 'Recursos Humanos' }
]

const filtroDepartamento = ref('Todos los departamentos')

const colaboradoresFiltrados = computed(() => {
  if (filtroDepartamento.value === 'Todos los departamentos') {
    return colaboradores.value
  }
  return colaboradores.value.filter(
    c => c.departamento === filtroDepartamento.value
  )
})

/* ====== DEMANDA ====== */
const demandas = [
  {
    id: 1,
    puesto: 'Senior Engineer Backend',
    area: 'Desarrollo Backend · Tecnología',
    urgencia: 'ALTA',
    urgenciaColor: 'negative',
    proyecto: 'Proyecto DataHub',
    inicio: '01/04/2025',
    skills: 'Node.js, Microservicios, SQL',
    candidatos: 1
  },
  {
    id: 2,
    puesto: 'Data Scientist',
    area: 'Data & Analytics · Tecnología',
    urgencia: 'MEDIA',
    urgenciaColor: 'warning',
    proyecto: 'Proyecto Retail Analytics',
    inicio: '15/05/2025',
    skills: 'Python, ML, Cloud',
    candidatos: 2
  }
]

/* ====== GAPS ====== */
const skillGaps = [
  {
    id: 1,
    skill: 'Python',
    disponible: 45,
    requerido: 60,
    brecha: 15,
    porcentaje: 75
  },
  {
    id: 2,
    skill: 'R',
    disponible: 12,
    requerido: 25,
    brecha: 13,
    porcentaje: 48
  },
  {
    id: 3,
    skill: 'Machine Learning',
    disponible: 45,
    requerido: 60,
    brecha: 15,
    porcentaje: 75
  }
]
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
  height: 40px;               /* similar al alto del q-select dense */
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
  color: #374151;             /* gris oscuro, como el texto del select */
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
