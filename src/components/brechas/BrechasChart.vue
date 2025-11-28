<template>
  <q-card flat bordered class="full-height" style="border-radius: 25px">
    <q-card-section class="q-pt-lg q-px-xl">
      <div class="row q-col-gutter-md">
        <div class="col">
          <div class="text-h6 text-weight-bold q-mb-md">Comparativa de Skills</div>
          <div class="chart-container">
            <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
            <div v-else class="chart-placeholder">
              No hay datos para mostrar.
            </div>
          </div>
        </div>
        <div class="col">
          <div class="text-h6 text-weight-bold q-mb-md">Análisis de Brechas</div>
          <div class="chart-container">
            <Bar v-if="brechaChartData" :data="brechaChartData" :options="brechaChartOptions" />
            <div v-else class="chart-placeholder">
              No hay datos para mostrar.
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
});

const aggregatedData = computed(() => {
  if (!props.rows || props.rows.length === 0) {
    return null;
  }

  const skillMap = new Map();
  props.rows.forEach(row => {
    if (!skillMap.has(row.skill)) {
      skillMap.set(row.skill, {
        disponible: [],
        requerido: [],
        brecha: [],
      });
    }
    skillMap.get(row.skill).disponible.push(row.disponible);
    skillMap.get(row.skill).requerido.push(row.requerido);
    skillMap.get(row.skill).brecha.push(row.brecha);
  });

  const labels = Array.from(skillMap.keys());
  const avgDisponible = [];
  const avgRequerido = [];
  const avgBrecha = [];

  labels.forEach(skill => {
    const skillData = skillMap.get(skill);
    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    avgDisponible.push(avg(skillData.disponible));
    avgRequerido.push(avg(skillData.requerido));
    avgBrecha.push(avg(skillData.brecha));
  });

  return {
    labels,
    avgDisponible,
    avgRequerido,
    avgBrecha,
  };
});

const chartData = computed(() => {
  if (!aggregatedData.value) {
    return null;
  }
  return {
    labels: aggregatedData.value.labels,
    datasets: [
      {
        label: 'Disponible (Avg)',
        backgroundColor: '#42A5F5',
        data: aggregatedData.value.avgDisponible,
      },
      {
        label: 'Requerido (Avg)',
        backgroundColor: '#90CAF9',
        data: aggregatedData.value.avgRequerido,
      },
    ],
  };
});

const brechaChartData = computed(() => {
  if (!aggregatedData.value) {
    return null;
  }
  return {
    labels: aggregatedData.value.labels,
    datasets: [
      {
        label: 'Brecha (Avg)',
        backgroundColor: aggregatedData.value.avgBrecha.map(b => b < 0 ? '#EF5350' : '#66BB6A'),
        data: aggregatedData.value.avgBrecha,
      },
    ],
  }
});


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const brechaChartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
    },
  },
   plugins: {
    legend: {
      display: false
    }
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 350px;
}
.chart-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
}
</style>
