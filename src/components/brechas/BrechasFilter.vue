<template>
  <div>
    <q-card flat bordered class="q-mb-lg" style="border-radius: 10px">
      <q-card-section class="q-py-md">
        <div class="row q-gutter-md items-center">
          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroVacante"
              :options="vacantes"
              option-value="vacanteId"
              option-label="titulo"
              label="Vacante"
              emit-value
              map-options
              style="width: 250px"
              @update:model-value="emitFilters"
              :loading="cargandoVacantes"
              :disable="cargandoVacantes"
            />
          </div>
          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroDepartamento"
              :options="departamentos"
              option-value="departamentoId"
              option-label="nombre"
              label="Departamento"
              emit-value
              map-options
              style="width: 250px"
              @update:model-value="emitFilters"
            />
          </div>

          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroArea"
              :options="areasFiltradas"
              option-value="areaId"
              option-label="nombre"
              label="Área"
              emit-value
              map-options
              style="width: 180px"
              @update:model-value="emitFilters"
            />
          </div>

          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroRol"
              :options="roles"
              option-value="rolId"
              option-label="nombre"
              label="Rol"
              emit-value
              map-options
              style="width: 180px"
              @update:model-value="emitFilters"
            />
          </div>

          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroSkill"
              :options="skills"
              option-value="skillId"
              option-label="nombre"
              label="Skill"
              emit-value
              map-options
              style="width: 180px"
              @update:model-value="emitFilters"
            />
          </div>

          <div class="col-auto">
            <q-select
              outlined
              dense
              v-model="filtroPeriodo"
              :options="['Último año', 'Último semestre']"
              label="Período"
              style="width: 180px"
              @update:model-value="emitFilters"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { api } from 'boot/axios'

const emit = defineEmits(['update:filters'])

// --- Data para Filtros ---
const filtroVacante = ref(null);
const filtroDepartamento = ref(null)
const filtroArea = ref(null)
const filtroRol = ref(null)
const filtroSkill = ref(null)
const filtroPeriodo = ref('Último año')

const vacantes = ref([])
const departamentos = ref([])
const areas = ref([])
const roles = ref([])
const skills = ref([])

// --- Estados de Carga y Error ---
const cargandoVacantes = ref(false);


const fetchVacantes = async () => {
  cargandoVacantes.value = true;
  try {
    const response = await api.get('/api/Vacante');
    if (Array.isArray(response.data) && response.data.every(item => 'vacanteId' in item && 'titulo' in item)) {
        vacantes.value = response.data;
    } else {
        console.error('La estructura de datos de las vacantes no es la esperada.');
        vacantes.value = [];
    }
  } catch (error) {
    console.error('Error fetching vacantes:', error);
    vacantes.value = [];
  } finally {
    cargandoVacantes.value = false;
  }
};

const fetchDepartamentos = async () => {
  try {
    const response = await api.get('/api/Departamento')
    departamentos.value = [{ departamentoId: null, nombre: 'Todos los Departamentos' }, ...response.data]
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

const fetchAreas = async () => {
  try {
    const response = await api.get('/api/Area/areas')
    areas.value = [{ areaId: null, nombre: 'Todas las Áreas', departamentoId: null }, ...response.data]
  } catch (error) {
    console.error('Error fetching areas:', error)
  }
}

const fetchRoles = async () => {
  try {
    const response = await api.get('/api/Rol')
    roles.value = [{ rolId: null, nombre: 'Todos los Roles' }, ...response.data]
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const fetchSkills = async () => {
  try {
    const response = await api.get('/api/Skill')
    skills.value = [{ skillId: null, nombre: 'Todos los Skills' }, ...response.data]
  } catch (error) {
    console.error('Error fetching skills:', error)
  }
}

onMounted(() => {
  fetchVacantes();
  fetchDepartamentos()
  fetchAreas()
  fetchRoles()
  fetchSkills()
})

const areasFiltradas = computed(() => {
  if (!filtroDepartamento.value) {
    return areas.value;
  }
  const filtered = areas.value.filter(area => area.departamentoId === filtroDepartamento.value);
  return [{ areaId: null, nombre: 'Todas las Áreas', departamentoId: null }, ...filtered.filter(a => a.areaId !== null)];
});

watch(filtroDepartamento, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    filtroArea.value = null; // Reset area when department changes
    emitFilters();
  }
});

const emitFilters = () => {
  const selectedVacante = vacantes.value.find(v => v.vacanteId === filtroVacante.value);
  emit('update:filters', {
    vacanteId: filtroVacante.value,
    vacanteTitle: selectedVacante ? selectedVacante.titulo : '',
    departamento: filtroDepartamento.value,
    areaId: filtroArea.value,
    rol: filtroRol.value,
    skill: filtroSkill.value,
    periodo: filtroPeriodo.value,
  })
}
</script>
