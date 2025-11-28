<template>
  <q-card flat bordered class="full-height" style="border-radius: 25px">
    <q-card-section class="q-pt-lg q-px-xl">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="text-h6 text-weight-bold q-mb-md">Comparativa de Skills (Promedio)</div>
          <div class="chart-container">
            <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
            <div v-else class="chart-placeholder">No hay datos de skills para mostrar.</div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-h6 text-weight-bold q-mb-md">
            Análisis de Brechas por Skill (Promedio)
          </div>
          <div class="chart-container">
            <Bar v-if="brechaChartData" :data="brechaChartData" :options="brechaChartOptions" />
            <div v-else class="chart-placeholder">
              No hay datos de brechas por skill para mostrar.
            </div>
          </div>
        </div>

        <div class="col-12 q-mt-lg">
          <div class="text-h6 text-weight-bold q-mb-md">
            Análisis de Brechas por Colaborador (Promedio)
          </div>
          <div class="chart-container">
            <Bar
              v-if="colaboradorBrechaChartData"
              :data="colaboradorBrechaChartData"
              :options="colaboradorBrechaChartOptions"
            />
            <div v-else class="chart-placeholder">
              No hay datos de brechas por colaborador para mostrar.
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
})

// Función auxiliar para calcular el promedio
const avg = (arr) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)

// --- Comparativa de Skills y Brechas por Skill ---
const aggregatedData = computed(() => {
  if (!props.rows || props.rows.length === 0) return null;

  const skillMap = new Map();

  props.rows.forEach((row) => {
    if (!row.skill) return;

    if (!skillMap.has(row.skill)) {
      skillMap.set(row.skill, {
        disponible: [],
        requerido: [],
        brecha: [],
      });
    }

    const skillData = skillMap.get(row.skill);
    skillData.disponible.push(row.disponible);
    skillData.requerido.push(row.requerido);
    skillData.brecha.push(row.brecha);
  });

  const labels = Array.from(skillMap.keys());
  const avgDisponible = [];
  const avgRequerido = [];
  const avgBrecha = [];

  labels.forEach((skill) => {
    const skillData = skillMap.get(skill);

    const numericDisponible = skillData.disponible
      .map((d) => parseFloat(d))
      .filter((d) => !isNaN(d));
    avgDisponible.push(avg(numericDisponible));

    const numericRequerido = skillData.requerido
      .map((r) => parseFloat(r))
      .filter((r) => !isNaN(r));
    avgRequerido.push(avg(numericRequerido));

    const numericBrecha = skillData.brecha
      .map((b) => parseFloat(b))
      .filter((b) => !isNaN(b));
    avgBrecha.push(avg(numericBrecha));
  });

  return {
    labels,
    avgDisponible,
    avgRequerido,
    avgBrecha,
  };
});

const chartData = computed(() => {
  if (!aggregatedData.value) return null

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
  }
})

const brechaChartData = computed(() => {
  if (!aggregatedData.value) return null

  return {
    labels: aggregatedData.value.labels,
    datasets: [
      {
        label: 'Brecha (Avg)',
        backgroundColor: aggregatedData.value.avgBrecha.map((b) => (b < 0 ? '#EF5350' : '#66BB6A')),
        data: aggregatedData.value.avgBrecha,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Nivel (Ponderado o Escala)',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Skills',
      },
    },
  },
}

const brechaChartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Brecha (%)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Skills',
      },
    },
  },
  plugins: {
    legend: { display: false },
  },
}

// --- Brechas por Colaborador ---
const colaboradorBrechaData = computed(() => {
  if (!props.rows || props.rows.length === 0) return null;

  const colaboradorMap = new Map();

  props.rows.forEach((row) => {
    const candidato = row.candidato;
    if (!candidato) return;

    if (!colaboradorMap.has(candidato)) {
      colaboradorMap.set(candidato, { brechas: [] });
    }
    colaboradorMap.get(candidato).brechas.push(row.brecha);
  });

  const labels = Array.from(colaboradorMap.keys());
  const avgBrechas = labels.map((candidato) => {
    const data = colaboradorMap.get(candidato);
    const numericBrechas = data.brechas
      .map((b) => parseFloat(b))
      .filter((b) => !isNaN(b));
    return avg(numericBrechas);
  });

  return {
    labels,
    avgBrechas,
  };
});

const colaboradorBrechaChartData = computed(() => {
  if (!colaboradorBrechaData.value) return null;

  return {
    labels: colaboradorBrechaData.value.labels,
    datasets: [
      {
        label: 'Brecha Promedio (%)',
        backgroundColor: colaboradorBrechaData.value.avgBrechas.map((b) =>
          b < 0 ? '#EF5350' : '#66BB6A'
        ),
        data: colaboradorBrechaData.value.avgBrechas,
      },
    ],
  };
});

const colaboradorBrechaChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Brecha Promedio (%)',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Candidatos Disponibles',
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(2) + '%';
          }
          return label;
        },
      },
    },
  },
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
