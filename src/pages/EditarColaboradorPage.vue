<template>
  <q-page class="q-pa-lg">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-primary text-weight-bold">
        Editar Colaborador
      </div>

      <div class="row q-gutter-sm">
        <q-btn outline color="primary" label="Cancelar" @click="volver" />
        <q-btn
          color="primary"
          unelevated
          label="Guardar"
          :loading="loading"
          @click="guardar"
        />
      </div>
    </div>

    <!-- CARD PRINCIPAL -->
    <q-card flat bordered class="q-pa-lg">
      <q-form @submit.prevent="guardar">
        <div class="row q-col-gutter-md">
          <!-- DNI (solo lectura) -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.dni"
              label="DNI"
              outlined
              dense
              readonly
            />
          </div>

          <!-- Nombres (solo lectura) -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.nombres"
              label="Nombres"
              outlined
              dense
              readonly
            />
          </div>

          <!-- Apellidos (solo lectura) -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.apellidos"
              label="Apellidos"
              outlined
              dense
              readonly
            />
          </div>

          <!-- Email (se puede cambiar) -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.email"
              label="Email"
              outlined
              dense
              type="email"
              :rules="[v => !!v || 'Requerido']"
            />
          </div>

          <!-- Password opcional -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.password"
              label="Nueva contraseña (opcional)"
              outlined
              dense
              type="password"
              hint="Déjalo vacío si no deseas cambiarla"
            />
          </div>

          <!-- Rol -->
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.rolId"
              :options="roles"
              option-label="nombre"
              option-value="rolId"
              emit-value
              map-options
              label="Rol"
              outlined
              dense
              :rules="[v => !!v || 'Requerido']"
            />
          </div>

          <!-- Departamento -->
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.departamentoId"
              :options="departamentos"
              option-label="nombre"
              option-value="departamentoId"
              emit-value
              map-options
              label="Departamento"
              outlined
              dense
              :rules="[v => !!v || 'Requerido']"
              @update:model-value="autoCorregirArea"
            />
          </div>

          <!-- Área -->
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.areaId"
              :options="areasFiltradas"
              option-label="nombre"
              option-value="areaId"
              emit-value
              map-options
              label="Área"
              outlined
              dense
              :rules="[v => !!v || 'Requerido']"
            />
          </div>

          <!-- Disponible -->
          <div class="col-12 col-md-4">
            <q-toggle
              v-model="form.disponibleMovilidad"
              label="Disponible para movilidad"
            />
          </div>

          <!-- Activo -->
          <div class="col-12 col-md-4">
            <q-toggle
              v-model="form.activo"
              label="Activo"
            />
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <div class="row justify-end">
          <q-btn
            color="primary"
            unelevated
            label="Guardar Cambios"
            type="submit"
            :loading="loading"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(false)

const roles = ref([])
const departamentos = ref([])
const areas = ref([])

const form = ref({
  dni: '',
  nombres: '',
  apellidos: '',
  email: '',
  rolId: null,
  areaId: null,
  departamentoId: null,
  disponibleMovilidad: false,
  activo: true,
  password: '' // opcional
})

const id = computed(() => route.params.id)

// Áreas filtradas por departamento (como en registro)
const areasFiltradas = computed(() => {
  if (!form.value.departamentoId) return areas.value

  return areas.value.filter(a => {
    const deptId = a.departamentoId ?? a.DepartamentoId
    return deptId === form.value.departamentoId
  })
})

// Si cambias el departamento y el área ya no pertenece, se limpia el área
function autoCorregirArea () {
  if (!form.value.areaId) return

  const areaActual = areas.value.find(a => {
    const areaId = a.areaId ?? a.AreaId
    return areaId === form.value.areaId
  })

  if (!areaActual) return

  const deptArea = areaActual.departamentoId ?? areaActual.DepartamentoId ?? null

  if (deptArea && deptArea !== form.value.departamentoId) {
    form.value.areaId = null
  }
}

async function cargarCatalogos () {
  try {
    const [rRes, dRes, aRes] = await Promise.all([
      api.get('/api/Rol'),
      api.get('/api/Departamento'),
      // 🔴 IMPORTANTE: este es el endpoint correcto, igual que en "nuevo colaborador"
      api.get('/api/Area/areas')
    ])

    roles.value = rRes.data ?? []
    departamentos.value = dRes.data ?? []
    areas.value = aRes.data ?? []
  } catch (err) {
    console.error('Error cargando catálogos', err)
    $q.notify({
      type: 'negative',
      message: 'No se pudieron cargar roles, departamentos y áreas.'
    })
  }
}

async function cargarColaborador () {
  try {
    const { data } = await api.get(`/api/Colaborador/${id.value}`)

    form.value.dni = data.dni
    form.value.nombres = data.nombres
    form.value.apellidos = data.apellidos
    form.value.email = data.email
    form.value.rolId = data.rolId
    form.value.areaId = data.areaId
    form.value.departamentoId = data.departamentoId
    form.value.disponibleMovilidad = !!data.disponibleMovilidad
    form.value.activo = data.activo ?? true
  } catch (err) {
    console.error('Error cargando colaborador', err)
    $q.notify({
      type: 'negative',
      message: 'No se pudo cargar la información del colaborador.'
    })
    router.push({ name: 'skill-mapping' })
  }
}

async function guardar () {
  loading.value = true
  try {
    const payload = {
      dni: form.value.dni,
      nombres: form.value.nombres,
      apellidos: form.value.apellidos,
      email: form.value.email,
      rolId: form.value.rolId,
      areaId: form.value.areaId,
      departamentoId: form.value.departamentoId,
      disponibleMovilidad: form.value.disponibleMovilidad,
      activo: form.value.activo
    }

    // Password opcional: solo la mando si tiene contenido
    if (form.value.password && form.value.password.trim().length > 0) {
      payload.password = form.value.password.trim()
    }

    await api.put(`/api/Colaborador/${id.value}`, payload)

    $q.notify({
      type: 'positive',
      message: 'Colaborador actualizado correctamente.'
    })

    router.push({ name: 'perfil-colaborador', params: { id: id.value } })
  } catch (err) {
    console.error('Error al actualizar colaborador', err)

    const backendMessage =
      err?.response?.data?.message ||
      err?.response?.data?.title ||
      'Error al actualizar. Revisa email duplicado o datos inválidos.'

    $q.notify({
      type: 'negative',
      message: backendMessage
    })
  } finally {
    loading.value = false
  }
}

function volver () {
  router.push({ name: 'perfil-colaborador', params: { id: id.value } })
}

onMounted(async () => {
  await cargarCatalogos()
  await cargarColaborador()
})
</script>
