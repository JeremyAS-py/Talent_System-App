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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

// ======= CATALOGOS DESDE API =======
const departamentos = ref([])   // /api/departamento
const areas = ref([])           // /api/area/areas
const cuentas = ref([])         // /api/cuenta/cuentas
const proyectos = ref([])       // /api/proyecto/proyectos
const roles = ref([])           // /api/perfil/perfiles (Perfil = Rol estándar)
const urgencias = ref([])       // /api/urgencia/urgencias
const dbSkills = ref([])        // /api/skill
const niveles = ref([])         // /api/niveldominio
const loadingCatalogos = ref(false)

// ==== STATE FORM ====
const form = ref({
  cuenta: null,
  proyecto: null,
  titulo: '',
  departamento: null,
  area: null,
  rol: null,          // Perfil
  urgencia: null,
  fechaInicio: '',
  skills: []          // { id, nombre, nivel, nivelId, esTecnico, tipoImportancia, peso, critico }
})

const skillModalOpen = ref(false)
const newSkill = ref({
  esTecnico: true,
  skillObj: null,
  nivel: null,
  tipoImportancia: 'Primario'
})

// ======= CARGA INICIAL DE CATALOGOS =======
const loadCatalogos = async () => {
  try {
    loadingCatalogos.value = true

    const [
      depRes,
      areaRes,
      cuentaRes,
      proyectoRes,
      perfilRes,
      urgenciaRes,
      skillRes,
      nivelRes
    ] = await Promise.all([
      api.get('/api/departamento'),
      api.get('/api/area/areas'),
      api.get('/api/cuenta/cuentas'),
      api.get('/api/proyecto/proyectos'),
      api.get('/api/perfil/perfiles'),
      api.get('/api/urgencia/urgencias'),
      api.get('/api/skill'),
      api.get('/api/niveldominio')
    ])

    departamentos.value = depRes.data.map(d => ({
      id: d.departamentoId,
      nombre: d.nombre
    }))

    areas.value = areaRes.data.map(a => ({
      id: a.areaId,
      nombre: a.nombre,
      departamentoId: a.departamentoId
    }))

    cuentas.value = cuentaRes.data.map(c => ({
      id: c.cuentaId,
      nombre: c.nombre
    }))

    proyectos.value = proyectoRes.data.map(p => ({
      id: p.proyectoId,
      nombre: p.nombre,
      cuentaId: p.cuentaId
    }))

    roles.value = perfilRes.data.map(p => ({
      id: p.perfilId,
      nombre: p.nombre
    }))

    urgencias.value = urgenciaRes.data.map(u => ({
      id: u.urgenciaId,
      nombre: u.nombre
    }))

    dbSkills.value = skillRes.data.map(s => ({
      id: s.skillId,
      nombre: s.nombre,
      tipoSkillId: s.tipoSkillId,   // 1 = técnico, 2 = blando (asumido)
      critico: s.critico
    }))

    niveles.value = nivelRes.data.map(n => ({
      id: n.nivelId,
      nombre: n.nombre
    }))

    // Urgencia por defecto: Media si existe, si no la primera
    if (!form.value.urgencia && urgencias.value.length > 0) {
      const media = urgencias.value.find(u => u.nombre === 'Media')
      form.value.urgencia = media || urgencias.value[0]
    }
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Error cargando catálogos de vacantes.'
    })
  } finally {
    loadingCatalogos.value = false
  }
}

onMounted(() => {
  loadCatalogos()
})

// ======= COMPUTED (CASCADAS) =======
const filteredAreas = computed(() => {
  if (!form.value.departamento) return []
  return areas.value.filter(a => a.departamentoId === form.value.departamento.id)
})

const filteredProyectos = computed(() => {
  if (!form.value.cuenta) return []
  return proyectos.value.filter(p => p.cuentaId === form.value.cuenta.id)
})

const availableSkillsFiltered = computed(() => {
  const typeNeeded = newSkill.value.esTecnico ? 1 : 2
  return dbSkills.value.filter(s => s.tipoSkillId === typeNeeded)
})

const primarySkills = computed(() =>
  form.value.skills.filter(s => s.tipoImportancia === 'Primario')
)

const secondarySkills = computed(() =>
  form.value.skills.filter(s => s.tipoImportancia === 'Secundario')
)

// ======= HELPERS =======
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

// ======= SKILLS =======
const openSkillModal = () => {
  newSkill.value = {
    esTecnico: true,
    skillObj: null,
    nivel: niveles.value[1] || niveles.value[0] || null, // por defecto Intermedio si existe
    tipoImportancia: 'Primario'
  }
  skillModalOpen.value = true
}

const addSkill = () => {
  if (!newSkill.value.skillObj || !newSkill.value.nivel) return

  const importanciaFinal = newSkill.value.esTecnico
    ? newSkill.value.tipoImportancia
    : 'Soft Skill'

  const peso =
    importanciaFinal === 'Primario'
      ? 2
      : 1

  const critico =
    newSkill.value.esTecnico && newSkill.value.tipoImportancia === 'Primario'

  form.value.skills.push({
    id: newSkill.value.skillObj.id,           // SkillId
    nombre: newSkill.value.skillObj.nombre,
    nivel: newSkill.value.nivel.nombre,
    nivelId: newSkill.value.nivel.id,        // NivelDeseado
    esTecnico: newSkill.value.esTecnico,
    tipoImportancia: importanciaFinal,
    peso,
    critico
  })

  skillModalOpen.value = false
}

const removeSkill = (index) => {
  form.value.skills.splice(index, 1)
}

// ======= GUARDADO: POST /api/vacante =======
const saveVacancy = async () => {
  if (!form.value.titulo || !form.value.rol || form.value.skills.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'Complete los campos obligatorios y agregue al menos 1 skill.'
    })
    return
  }

  const skillsPayload = form.value.skills.map(s => ({
    SkillId: s.id,
    NivelDeseado: s.nivelId,
    Peso: s.peso,
    Critico: s.critico
  }))

  const payload = {
    Titulo: form.value.titulo,
    PerfilId: form.value.rol.id,
    CuentaId: form.value.cuenta ? form.value.cuenta.id : null,
    ProyectoId: form.value.proyecto ? form.value.proyecto.id : null,
    FechaInicio: form.value.fechaInicio || new Date().toISOString().substring(0, 10),
    UrgenciaId: form.value.urgencia ? form.value.urgencia.id : 1,
    Estado: 'Abierta',
    Descripcion: '',
    Skills: skillsPayload
  }

  try {
    console.log('Payload para API:', payload)
    await api.post('/api/vacante', payload)
    $q.notify({
      type: 'positive',
      message: 'Vacante registrada exitosamente.'
    })

    // Si quieres, aquí puedes limpiar el formulario:
    // form.value = { ... }
  } catch (error) {
    console.error(error)
    const msg =
      error.response?.data?.message ||
      'Error al registrar la vacante en el servidor.'
    $q.notify({
      type: 'negative',
      message: msg
    })
  }
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
