<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="my-card full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-grey-8">Estado de Candidatos</div>
            <div class="text-caption text-grey-6">Proporción de Aptos vs No Aptos</div>
          </q-card-section>
          <q-card-section class="flex flex-center" style="height: 250px">
            <Doughnut v-if="statusData" :data="statusData" :options="doughnutOptions" />
            <div v-else class="text-grey-5">Sin datos</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered class="my-card full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-grey-8">Brecha Promedio por Área</div>
            <div class="text-caption text-grey-6">
              Nivel de skills faltantes promedio según el área
            </div>
          </q-card-section>
          <q-card-section style="height: 250px">
            <Bar v-if="areaData" :data="areaData" :options="areaOptions" />
            <div v-else class="text-grey-5 flex flex-center full-height">Sin datos</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="my-card full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-grey-8">
              Top Skills Faltantes (Brechas Técnicas)
            </div>
            <div class="text-caption text-grey-6">
              Habilidades que más se repiten como nulas o faltantes
            </div>
          </q-card-section>
          <q-card-section style="height: 300px">
            <Bar v-if="skillsData" :data="skillsData" :options="skillsOptions" />
            <div v-else class="text-grey-5 flex flex-center full-height">
              No se detectaron skills faltantes
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="my-card full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-grey-8">
              Brecha por Colaborador Individual
            </div>
            <div class="text-caption text-grey-6">
              Porcentaje faltante tal cual se muestra en la tabla
            </div>
          </q-card-section>
          <q-card-section style="height: 300px">
            <Bar v-if="colaboradorData" :data="colaboradorData" :options="colaboradorOptions" />
            <div v-else class="text-grey-5 flex flex-center full-height">
              Sin datos de colaboradores
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
})

// ==========================================
// 1. CHART: ESTADO
// ==========================================
const statusData = computed(() => {
  if (!props.rows.length) return null

  const aptos = props.rows.filter((r) => r.estado?.toUpperCase().trim() === 'APTO').length
  const noAptos = props.rows.filter((r) => r.estado?.toUpperCase().trim() === 'NO APTO').length

  return {
    labels: ['Apto', 'No Apto'],
    datasets: [
      {
        data: [aptos, noAptos],
        backgroundColor: ['#4CAF50', '#EF5350'],
        hoverOffset: 4,
      },
    ],
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
}

// ==========================================
// 2. CHART: DISTRIBUCIÓN POR ÁREA
// ==========================================
const areaData = computed(() => {
  if (!props.rows.length) return null

  const areaMap = {}

  props.rows.forEach((row) => {
    const area = row.area || 'Sin Área'
    if (!areaMap[area]) {
      areaMap[area] = { total: 0, count: 0 }
    }
    // Asumimos que matchPercentage ES la Brecha (según tu indicación)
    areaMap[area].total += row.matchPercentage * 100
    areaMap[area].count += 1
  })

  const labels = Object.keys(areaMap)
  const data = labels.map((area) => (areaMap[area].total / areaMap[area].count).toFixed(1))

  return {
    labels,
    datasets: [
      {
        label: '% Brecha Promedio',
        data,
        backgroundColor: '#26A69A',
        borderRadius: 4,
      },
    ],
  }
})

const areaOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true, max: 100, title: { display: true, text: '% Brecha Promedio' } },
  },
  plugins: { legend: { display: false } },
}

// ==========================================
// 3. CHART: SKILLS FALTANTES
// ==========================================
const skillsData = computed(() => {
  if (!props.rows.length) return null

  const skillCounts = {}

  props.rows.forEach((row) => {
    if (!row.skillsFaltantes) return
    const skills = row.skillsFaltantes.split(',')
    skills.forEach((skillRaw) => {
      let cleanSkill = skillRaw.replace(/\(Nulo\)/gi, '').trim()
      if (cleanSkill) {
        skillCounts[cleanSkill] = (skillCounts[cleanSkill] || 0) + 1
      }
    })
  })

  const sortedSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)

  return {
    labels: sortedSkills.map(([name]) => name),
    datasets: [
      {
        label: 'Frecuencia',
        data: sortedSkills.map(([, count]) => count),
        backgroundColor: '#FF7043',
        barThickness: 20,
        borderRadius: 4,
      },
    ],
  }
})

const skillsOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
  plugins: { legend: { display: false } },
}

// ==========================================
// 4. CHART: BRECHA POR COLABORADOR
// ==========================================
const colaboradorData = computed(() => {
  if (!props.rows.length) return null

  const labels = props.rows.map((r) => r.candidato)

  // CORRECCIÓN: Usamos directamente el matchPercentage * 100
  const data = props.rows.map((r) => (r.matchPercentage * 100).toFixed(0))

  return {
    labels,
    datasets: [
      {
        label: '% Brecha',
        data,
        backgroundColor: data.map((val) => (val > 50 ? '#EF5350' : '#42A5F5')),
        borderRadius: 4,
      },
    ],
  }
})

const colaboradorOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: { display: true, text: '% Brecha (Según Tabla)' },
    },
    x: {
      ticks: {
        autoSkip: false,
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
  plugins: { legend: { display: false } },
}
</script>

<style scoped>
.my-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.my-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}
</style>
