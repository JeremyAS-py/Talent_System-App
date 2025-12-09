<template>
  <q-card flat bordered style="border-radius: 25px">
    <q-card-section class="q-pt-lg q-px-xl">
      <div v-if="vacancyTitle" class="text-h5 text-weight-bold q-mb-xs">
        {{ vacancyTitle }}
      </div>
      <div class="text-h6 text-weight-bold q-mb-md">Detalle de Brechas</div>

      <q-table
        :rows="rows"
        :columns="columns"
        :row-key="(row) => row.candidato + row.skill"
        flat
        bordered
        separator="horizontal"
        :loading="isLoading"
        no-data-label="No hay datos para mostrar. Por favor, genere el reporte."
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
    name: 'habilidadRequerida',
    label: 'Habilidad Requerida',
    align: 'left',
    field: 'skill',
    sortable: true,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'nivelRequerido',
    label: 'Nivel Requerido',
    align: 'center',
    field: 'requerido',
    sortable: true,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'nivelActual',
    label: 'Nivel Actual',
    align: 'center',
    field: 'disponible',
    sortable: true,
    headerStyle: 'font-weight: bold;',
  },
  {
    name: 'brecha',
    label: 'Brecha (%)',
    align: 'center',
    field: 'brecha',
    sortable: true,
    headerStyle: 'font-weight: bold;',
    classes: (row) => {
      const brecha = row.brecha
      if (typeof brecha === 'number') {
        return brecha < 0
          ? 'text-negative text-weight-bold'
          : 'text-positive text-weight-bold'
      }
      return ''
    },
  },
]
</script>

<style scoped>
.q-table th {
  font-weight: 700 !important;
  font-size: 16px;
}
</style>
