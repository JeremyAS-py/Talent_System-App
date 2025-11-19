<template>
  <q-page class="bg-page q-pa-xl">

    <!-- HEADER TOP CONSISTENTE -->
    <q-card class="header-card row items-center q-pa-lg">
      <q-icon name="work" size="40px" color="white" />
      <div class="q-ml-md">
        <h4 class="title">Registro de nueva Vacante</h4>
        <p class="subtitle">Define los requisitos de la posición</p>
      </div>
    </q-card>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="row q-col-gutter-xl q-mt-xl">

      <!-- FORM -->
      <div class="col-12 col-lg-7">
        <q-card class="q-pa-xl card-section">

          <!-- INFO GENERAL -->
          <div class="section-block">
            <h6 class="section-title">Información General</h6>

            <div class="row q-col-gutter-md q-mt-sm">

              <q-input class="col-12" filled label="Título de la vacante *" v-model="form.title"
                prefix-icon="badge" />

              <q-select class="col-6" filled label="Área *"
                :options="areas" v-model="form.area" />

              <q-select class="col-6" filled label="Rol / Seniority *"
                :options="roles" v-model="form.role" />

              <q-input class="col-6" filled type="date"
                label="Fecha estimada de inicio *" v-model="form.startDate" />

              <q-select class="col-6" filled label="Urgencia"
                :options="urgencyOptions" v-model="form.urgency" />

            </div>
          </div>

          <q-separator spaced />

          <!-- SKILLS -->
          <div class="section-block">
            <h6 class="section-title">Skills Requeridos</h6>

            <div class="q-mt-md">
              <q-chip
                v-for="(sk, index) in form.skills"
                :key="index"
                removable @remove="removeSkill(index)"
                color="primary" text-color="white" class="q-mr-sm q-mb-sm"
              >
                <q-icon name="school" class="q-mr-sm" />
                {{ sk.name }} — {{ sk.level }}
              </q-chip>

              <div>
                <q-btn flat icon="add" color="primary" label="Agregar Skill"
                       @click="showSkillModal = true" />
              </div>
            </div>
          </div>

          <!-- ACCIONES -->
          <div class="q-mt-xl flex justify-end q-gutter-md">
            <q-btn label="Cancelar" flat color="primary" @click="cancel" />
            <q-btn label="Registrar Vacante" unelevated color="primary" @click="save" />
          </div>

        </q-card>
      </div>

      <!-- VISTA PREVIA DOPE -->
      <div class="col-12 col-lg-5">
        <q-card class="q-pa-xl card-section preview-card">

          <h6 class="section-title">Vista Previa</h6>

          <div class="q-mt-md preview">

            <div class="preview-item">
              <b>Título:</b> {{ form.title || "—" }}
            </div>

            <div class="preview-item">
              <b>Área:</b> {{ form.area || "—" }}
            </div>

            <div class="preview-item">
              <b>Rol:</b> {{ form.role || "—" }}
            </div>

            <div class="preview-item">
              <b>Inicio:</b> {{ form.startDate || "—" }}
            </div>

            <div class="preview-item">
              <b>Urgencia:</b> {{ form.urgency }}
            </div>

            <div class="q-mt-md">
              <b>Skills requeridos:</b>
              <ul>
                <li v-for="sk in form.skills" :key="sk.name">
                  {{ sk.name }} — {{ sk.level }}
                </li>
              </ul>
            </div>

          </div>

        </q-card>
      </div>

    </div>

    <!-- MODAL SKILL -->
    <q-dialog v-model="showSkillModal">
      <q-card class="q-pa-lg" style="min-width: 380px;">
        <h6 class="section-title">Agregar Skill</h6>

        <q-input filled v-model="skillForm.name" label="Nombre del skill *"
                 class="q-mt-md" />

        <q-select filled v-model="skillForm.level" class="q-mt-md"
                  :options="['Básico', 'Intermedio', 'Avanzado']"
                  label="Nivel requerido *" />

        <div class="q-mt-lg flex justify-end q-gutter-sm">
          <q-btn flat color="primary" label="Cancelar" @click="resetSkillForm" />
          <q-btn unelevated color="primary" label="Agregar" @click="addSkill" />
        </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const form = ref({
  title: "",
  area: "",
  role: "",
  startDate: "",
  urgency: "Media",
  skills: []
})

const areas = ["IT", "Data", "Marketing", "Infraestructura", "Operaciones"]
const roles = ["Junior", "Mid", "Senior", "Lead"]
const urgencyOptions = ["Alta", "Media", "Baja"]

const showSkillModal = ref(false)
const skillForm = ref({ name: "", level: "" })

function addSkill() {
  if (!skillForm.value.name || !skillForm.value.level) {
    return $q.notify({ type: "negative", message: "Completa todos los campos" })
  }
  form.value.skills.push({ ...skillForm.value })
  resetSkillForm()
}

function resetSkillForm() {
  skillForm.value = { name: "", level: "" }
  showSkillModal.value = false
}

function removeSkill(index) {
  form.value.skills.splice(index, 1)
}

function save() {
  if (!form.value.title || !form.value.area || !form.value.role) {
    return $q.notify({ type: "negative", message: "Completa los campos obligatorios" })
  }
  $q.notify({ type: "positive", message: "Vacante registrada correctamente" })
}

function cancel() {
  $q.notify({ type: "info", message: "Cancelado" })
}
</script>

<style scoped>
.bg-page {
  background: #F4F3F9;
}

/* HEADER */
.header-card {
  background: #2469BC;
  border-radius: 12px;
  color: white;
}

/* TITLES */
.title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  font-family: Inter;
}

.subtitle {
  margin: 0;
  opacity: 0.85;
  font-size: 14px;
  font-family: Roboto;
}

/* CARD STYLE */
.card-section {
  border: 1px solid #BDC7D9;
  border-radius: 14px;
}

/* SECTION TITLE */
.section-title {
  font-weight: 700;
  font-size: 16px;
  color: #2469BC;
  font-family: Inter;
}

/* PREVIEW */
.preview-item {
  margin-bottom: 6px;
}

.preview-card {
  min-height: 300px;
}
</style>
