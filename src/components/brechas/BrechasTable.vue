<template>
  <q-card flat bordered style="border-radius: 25px">
    <q-card-section class="q-pt-lg q-px-xl">
      <div v-if="vacancyTitle" class="text-h5 text-weight-bold q-mb-xs">
        {{ vacancyTitle }}
      </div>
      <div class="text-h6 text-weight-bold q-mb-md">Detalle de Postulantes</div>

      <q-table
        :rows="rows"
        :columns="columns"
        row-key="candidato"
        flat
        bordered
        separator="horizontal"
        :loading="isLoading"
        no-data-label="No hay datos para mostrar. Por favor, seleccione una vacante."
        :rows-per-page-options="[10, 20, 30, 50]"
        v-model:pagination="pagination"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  vacancyTitle: {
    type: String,
    default: '',
  },
})

const pagination = ref({
  rowsPerPage: 10,
})

const columns = [
  {
    name: 'candidato',
    required: true,
    label: 'Candidato',
    align: 'left',
    field: 'candidato',
    sortable: true,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'area',
    label: 'Área',
    align: 'left',
    field: 'area',
    sortable: true,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'departamento',
    label: 'Departamento',
    align: 'left',
    field: 'departamento',
    sortable: true,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'rolActual',
    label: 'Rol Actual',
    align: 'left',
    field: 'rolActual',
    sortable: true,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'brechaPercentage',
    label: '% Brecha',
    align: 'center',
    field: 'brechaPercentage',
    sortable: true,
    format: (val) => `${(val * 100).toFixed(0)}%`,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'left',
    field: 'estado',
    sortable: true,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'skillsFaltantes',
    label: 'Skills Faltantes (Brechas)',
    align: 'left',
    field: 'skillsFaltantes',
    sortable: false,
    headerStyle: 'font-weight: bold;',
    style: 'white-space: pre-wrap;', // Para manejar saltos de línea si los hay
  },
]
</script>

<style scoped>
.q-table th {
  font-weight: 700 !important;
  font-size: 16px;
}
</style>
