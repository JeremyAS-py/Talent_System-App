<template>
  <q-card flat bordered class="full-height" style="border-radius: 25px">
    <q-card-section class="q-pt-lg q-px-xl">
      <div class="text-h6 text-weight-bold q-mb-md">Comparativa de Skills</div>

      <div class="row items-center q-gutter-x-lg q-mb-xl">
        <div class="row items-center">
          <div class="legend-box bg-primary q-mr-sm"></div>
          <div class="text-subtitle2">Disponible</div>
        </div>
        <div class="row items-center">
          <div class="legend-box bg-blue-3 q-mr-sm"></div>
          <div class="text-subtitle2">Requerido</div>
        </div>
      </div>

      <div class="chart-container">
        <div class="chart-placeholder">
          <q-img
            src="~assets/dashboard/busqueda.png"
            style="max-height: 400px; max-width: 100%"
            fit="contain"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
// Script setup is simple for now, can be expanded with props to receive chart data
</script>

<style scoped>
.legend-box {
  width: 15px;
  height: 15px;
  border-radius: 3px;
}

.chart-placeholder {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 400px; /* Fixed height for the chart image container */
}
</style>
