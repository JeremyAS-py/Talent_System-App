<template>
  <q-page class="bg-page q-pa-lg">

    <!-- HEADER LOCAL -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="primary" class="q-mr-sm" />
      <div>
        <h4 class="title text-primary q-my-none">Nueva Vacante</h4>
        <div class="subtitle text-grey-7">
          Define los requisitos para la búsqueda de talento interno
        </div>
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="row q-col-gutter-xl">
      
      <!-- FORMULARIO PRINCIPAL -->
      <div class="col-12 col-md-8">
        <q-card class="q-pa-lg shadow-1 rounded-borders main-card">
          
          <!-- ASIGNACIÓN DE CLIENTE -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12">
              <div class="section-header">
                <q-icon name="business" class="q-mr-sm" color="primary" />
                <div>
                  <div class="section-title">Asignación de Cliente</div>
                  <div class="section-subtitle">
                    Selecciona la cuenta y proyecto donde se ubicará la vacante
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="form.cuenta"
                :options="cuentas"
                option-label="nombre"
                label="Cuenta / Cliente *"
                @update:model-value="resetProyecto"
                behavior="menu"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="form.proyecto"
                :options="filteredProyectos"
                option-label="nombre"
                label="Proyecto Asignado *"
                :disable="!form.cuenta"
                hint="Seleccione primero una cuenta"
              />
            </div>
          </div>

          <q-separator spaced inset />

          <!-- DETALLES DE LA POSICIÓN -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12">
              <div class="section-header">
                <q-icon name="badge" class="q-mr-sm" color="primary" />
                <div>
                  <div class="section-title">Detalles de la Posición</div>
                  <div class="section-subtitle">
                    Define la posición, área, rol estándar y nivel de urgencia
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12">
              <q-input
                filled
                v-model="form.titulo"
                label="Título de la Vacante (Ej. Senior Backend Dev) *"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="form.departamento"
                :options="departamentos"
                option-label="nombre"
                label="Departamento *"
                @update:model-value="resetArea"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="form.area"
                :options="filteredAreas"
                option-label="nombre"
                label="Área Funcional *"
                :disable="!form.departamento"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="form.rol"
                :options="roles"
                option-label="nombre"
                label="Rol Estándar *"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="form.urgencia"
                :options="urgencias"
                option-label="nombre"
                label="Nivel de Urgencia *"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon
                        name="flag"
                        :color="getUrgencyColor(scope.opt.nombre)"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="form.fechaInicio"
                type="date"
                label="Fecha de Inicio *"
                stack-label
              />
            </div>
          </div>

          <q-separator spaced inset />

          <!-- STACK TECNOLÓGICO Y HABILIDADES -->
          <div>
            <div class="row justify-between items-center q-mb-md">
              <div class="section-header">
                <q-avatar
                  icon="school"
                  size="32px"
                  color="blue-1"
                  text-color="primary"
                  class="q-mr-sm"
                />
                <div>
                  <div class="section-title">
                    Stack Tecnológico y Habilidades
                  </div>
                  <div class="section-subtitle">
                    Agrega skills técnicos y habilidades blandas clave para el matching
                  </div>
                </div>
              </div>

              <q-btn
                unelevated
                round
                color="primary"
                icon="add"
                size="sm"
                @click="openSkillModal"
              >
                <q-tooltip>Agregar Skill</q-tooltip>
              </q-btn>
            </div>

            <!-- Estado vacío -->
            <div
              v-if="form.skills.length === 0"
              class="text-center q-pa-md text-grey-6 bg-grey-2 rounded-borders dashed-border"
            >
              No se han asignado skills. Agregue skills técnicos (Primarios/Secundarios)
              y blandos para el matching.
            </div>

            <!-- Chips de skills -->
            <div v-else class="row q-col-gutter-sm q-mt-xs">
              <div
                v-for="(skill, index) in form.skills"
                :key="index"
                class="q-mb-xs q-mr-xs"
              >
                <q-chip
                  removable
                  @remove="removeSkill(index)"
                  :color="getSkillColor(skill.tipoImportancia)"
                  text-color="white"
                  :icon="skill.esTecnico ? 'code' : 'psychology'"
                  class="skill-chip"
                >
                  <div class="skill-chip__content">
                    <div class="skill-chip__name">
                      {{ skill.nombre }}
                    </div>
                    <div class="skill-chip__meta">
                      {{ skill.nivel }} • {{ skill.tipoImportancia }}
                    </div>
                  </div>
                </q-chip>
              </div>
            </div>
          </div>

          <!-- BOTONES -->
          <div class="row justify-end q-gutter-md q-mt-xl">
            <q-btn flat color="grey-8" label="Cancelar" to="/" />
            <q-btn
              unelevated
              color="primary"
              label="Publicar Vacante"
              icon="send"
              @click="saveVacancy"
              size="md"
              padding="10px 24px"
            />
          </div>

        </q-card>
      </div>

      <!-- PANEL DE VISTA PREVIA -->
      <div class="col-12 col-md-4">
        <q-card class="bg-white shadow-1 sticky-top preview-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Vista Previa</div>
            <div class="text-caption">
              Así verán la vacante los candidatos
            </div>
          </q-card-section>

          <q-card-section class="q-pt-lg">
            <div class="row items-center q-mb-md">
              <q-avatar
                color="blue-1"
                text-color="primary"
                icon="work"
                size="md"
                class="q-mr-md"
              />
              <div>
                <div class="text-weight-bold text-subtitle1">
                  {{ form.titulo || 'Título Pendiente' }}
                </div>
                <div class="text-caption text-grey-8">
                  {{ form.proyecto?.nombre || 'Sin proyecto' }}
                </div>
              </div>
            </div>

            <q-separator spaced />

            <div class="q-gy-sm">
              <div class="row justify-between q-mb-sm">
                <span class="text-grey-7">Área:</span>
                <span class="text-weight-medium">
                  {{ form.area?.nombre || '—' }}
                </span>
              </div>
              <div class="row justify-between q-mb-sm">
                <span class="text-grey-7">Rol:</span>
                <span class="text-weight-medium">
                  {{ form.rol?.nombre || '—' }}
                </span>
              </div>
              <div class="row justify-between q-mb-sm">
                <span class="text-grey-7">Urgencia:</span>
                <q-badge
                  :color="getUrgencyColor(form.urgencia?.nombre)"
                  :label="form.urgencia?.nombre || '—'"
                />
              </div>
            </div>

            <q-separator spaced />

            <div class="text-weight-medium q-mb-sm">Requisitos Clave:</div>
            
            <div v-if="primarySkills.length > 0" class="q-mb-sm">
              <div class="text-caption text-primary text-weight-bold">
                Primarios (Obligatorios)
              </div>
              <div class="text-body2 text-grey-9">
                {{ primarySkills.map(s => s.nombre).join(', ') }}
              </div>
            </div>
            
            <div v-if="secondarySkills.length > 0">
              <div class="text-caption text-teal text-weight-bold">
                Secundarios (Deseables)
              </div>
              <div class="text-body2 text-grey-9">
                {{ secondarySkills.map(s => s.nombre).join(', ') }}
              </div>
            </div>

          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- MODAL AGREGAR SKILL -->
    <q-dialog v-model="skillModalOpen">
      <q-card style="width: 450px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Agregar Skill a la Vacante</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-btn-toggle
            v-model="newSkill.esTecnico"
            spread
            no-caps
            toggle-color="primary"
            color="white"
            text-color="black"
            :options="[
              { label: 'Skill Técnico', value: true },
              { label: 'Habilidad Blanda', value: false }
            ]"
          />

          <q-select
            filled
            use-input
            input-debounce="0"
            v-model="newSkill.skillObj"
            :options="availableSkillsFiltered"
            option-label="nombre"
            label="Buscar habilidad..."
            behavior="menu"
          />

          <q-select
            filled
            v-model="newSkill.nivel"
            :options="niveles"
            option-label="nombre"
            label="Nivel Mínimo"
          />

          <div v-if="newSkill.esTecnico">
            <div class="text-caption q-mb-xs">
              Importancia en el Matching:
            </div>
            <q-radio
              v-model="newSkill.tipoImportancia"
              val="Primario"
              label="Primario (Indispensable - Mayor Peso)"
              color="primary"
            />
            <q-radio
              v-model="newSkill.tipoImportancia"
              val="Secundario"
              label="Secundario (Deseable - Menor Peso)"
              color="teal"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            unelevated
            label="Agregar"
            color="primary"
            @click="addSkill"
            :disable="!newSkill.skillObj || !newSkill.nivel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// ==== MOCK DATA (EN LÍNEA CON TU BD) ====
const departamentos = [
  { id: 1, nombre: 'Tecnología' },
  { id: 2, nombre: 'Recursos Humanos' }
]

const areas = [
  { id: 1, nombre: 'Desarrollo Backend', depId: 1 },
  { id: 2, nombre: 'Desarrollo Frontend', depId: 1 },
  { id: 3, nombre: 'Arquitectura', depId: 1 },
  { id: 4, nombre: 'Selección', depId: 2 }
]

const cuentas = [
  { id: 1, nombre: 'BBVA' },
  { id: 2, nombre: 'Interbank' },
  { id: 3, nombre: 'Claro' }
]

const proyectos = [
  { id: 1, nombre: 'Proyecto DataHub', cuentaId: 1 },
  { id: 2, nombre: 'Proyecto Modernización Legacy', cuentaId: 1 },
  { id: 3, nombre: 'Proyecto CRM360', cuentaId: 2 },
  { id: 4, nombre: 'Proyecto Retail Analytics', cuentaId: 3 }
]

const roles = [
  { id: 1, nombre: 'Backend Developer Sr' },
  { id: 2, nombre: 'Frontend Developer' },
  { id: 3, nombre: 'Data Engineer' }
]

const urgencias = [
  { id: 1, nombre: 'Baja' },
  { id: 2, nombre: 'Media' },
  { id: 3, nombre: 'Alta' }
]

const niveles = [
  { id: 1, nombre: 'Inicial' },
  { id: 2, nombre: 'Intermedio' },
  { id: 3, nombre: 'Avanzado' }
]

const dbSkills = [
  { id: 1, nombre: 'Node.js', typeId: 1 },
  { id: 2, nombre: 'SQL', typeId: 1 },
  { id: 3, nombre: 'Vue.js', typeId: 1 },
  { id: 4, nombre: 'Comunicación', typeId: 2 },
  { id: 5, nombre: 'Liderazgo', typeId: 2 }
]

// ==== STATE ====
const form = ref({
  cuenta: null,
  proyecto: null,
  titulo: '',
  departamento: null,
  area: null,
  rol: null,
  urgencia: urgencias[1], // Media
  fechaInicio: '',
  skills: []   // { nombre, nivel, tipoImportancia, esTecnico }
})

const skillModalOpen = ref(false)
const newSkill = ref({
  esTecnico: true,
  skillObj: null,
  nivel: niveles[1],
  tipoImportancia: 'Primario'
})

// ==== COMPUTED (CASCADAS) ====
const filteredAreas = computed(() => {
  if (!form.value.departamento) return []
  return areas.filter(a => a.depId === form.value.departamento.id)
})

const filteredProyectos = computed(() => {
  if (!form.value.cuenta) return []
  return proyectos.filter(p => p.cuentaId === form.value.cuenta.id)
})

const availableSkillsFiltered = computed(() => {
  const typeNeeded = newSkill.value.esTecnico ? 1 : 2
  return dbSkills.filter(s => s.typeId === typeNeeded)
})

const primarySkills = computed(() =>
  form.value.skills.filter(s => s.tipoImportancia === 'Primario')
)

const secondarySkills = computed(() =>
  form.value.skills.filter(s => s.tipoImportancia === 'Secundario')
)

// ==== HELPERS ====
const resetArea = () => { form.value.area = null }
const resetProyecto = () => { form.value.proyecto = null }

const getUrgencyColor = (val) => {
  if (val === 'Alta') return 'negative'
  if (val === 'Media') return 'warning'
  return 'positive'
}

const getSkillColor = (importance) => {
  if (importance === 'Primario') return 'primary'
  if (importance === 'Secundario') return 'teal'
  return 'purple'
}

// ==== SKILLS ====
const openSkillModal = () => {
  newSkill.value = {
    esTecnico: true,
    skillObj: null,
    nivel: niveles[1],
    tipoImportancia: 'Primario'
  }
  skillModalOpen.value = true
}

const addSkill = () => {
  if (!newSkill.value.skillObj || !newSkill.value.nivel) return

  const importanciaFinal = newSkill.value.esTecnico
    ? newSkill.value.tipoImportancia
    : 'Soft Skill'

  form.value.skills.push({
    id: newSkill.value.skillObj.id,
    nombre: newSkill.value.skillObj.nombre,
    nivel: newSkill.value.nivel.nombre,
    esTecnico: newSkill.value.esTecnico,
    tipoImportancia: importanciaFinal
  })
  skillModalOpen.value = false
}

const removeSkill = (index) => {
  form.value.skills.splice(index, 1)
}

// ==== GUARDADO ====
const saveVacancy = () => {
  if (!form.value.titulo || !form.value.rol || form.value.skills.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'Complete los campos obligatorios y agregue al menos 1 skill.'
    })
    return
  }

  console.log('Payload para API:', form.value)
  $q.notify({ type: 'positive', message: 'Vacante registrada exitosamente' })
}
</script>

<style scoped>
.bg-page {
  background: #f4f3f9;
}

.main-card {
  border-radius: 12px;
}

/* Header local */
.title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}
.subtitle {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
}

/* Secciones */
.section-header {
  display: flex;
  align-items: flex-start;
}
.section-title {
  font-weight: 600;
  font-size: 15px;
}
.section-subtitle {
  font-size: 12px;
  color: #6b7280;
}

/* Borde punteado */
.dashed-border {
  border: 2px dashed #d1d5db;
}

/* Vista previa */
.sticky-top {
  position: sticky;
  top: 20px;
  z-index: 1;
}
.preview-card {
  border-radius: 12px;
}

/* === SKILL CHIPS (arreglo visual) === */
.skill-chip {
  border-radius: 999px;
  padding: 4px 12px;
  height: auto;              /* importante para que quepan las 2 líneas */
}

.skill-chip__content {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.skill-chip__name {
  font-weight: 600;
  font-size: 12px;
}

.skill-chip__meta {
  font-size: 10px;
  opacity: 0.9;
}
</style>
