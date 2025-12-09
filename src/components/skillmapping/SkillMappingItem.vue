<template>
  <q-card class="colaborador-card q-mb-md">
    <q-card-section>
      <div class="row items-center">
        <!-- Columna Izquierda: Avatar -->
        <div class="col-auto">
          <q-avatar size="100px" color="grey-3" text-color="grey-6" icon="person" />
        </div>

        <!-- Columna Central: Info del Colaborador -->
        <div class="col q-pl-md">
          <div class="row items-center">
            <div class="colaborador-nombre q-mr-sm" v-html="highlightedFullName"></div>
          </div>
          <div class="colaborador-departamento text-weight-bold">
            {{ colaborador.areaNombre || colaborador.departamentoNombre }}
          </div>
          <div class="colaborador-rol" v-html="highlightedRole"></div>
          <div class="text-caption text-grey-5">
            Última actualización: {{ colaborador.fechaAlta || 'N/A' }}
          </div>
        </div>

        <!-- Columna de Skills -->
        <div class="col-7 q-px-lg">
          <div class="row q-col-gutter-x-lg">
            <!-- Skills Técnicos -->
            <div class="col-12 col-sm-6">
              <div class="skills-titulo">Hard Skills</div>
              <div class="skills-chips">
                <q-chip
                  v-for="skill in colaborador.technicalSkills.slice(0, 3)"
                  :key="skill.id"
                  dense
                  color="light-blue-2"
                  text-color="primary"
                  class="skill-chip text-weight-medium"
                >
                  {{ skill.nombre }}
                </q-chip>
                <q-chip
                  v-if="colaborador.technicalSkills.length > 3"
                  dense
                  outline
                  color="grey-7"
                  class="skill-chip-more"
                >
                  +{{ colaborador.technicalSkills.length - 3 }}
                </q-chip>
                <div v-if="!colaborador.technicalSkills.length" class="text-caption text-grey-6">
                  No hay skills técnicos.
                </div>
              </div>
            </div>

            <!-- Skills Blandos -->
            <div class="col-12 col-sm-6">
              <div class="skills-titulo">Soft Skills</div>
              <div class="skills-chips">
                <q-chip
                  v-for="skill in colaborador.softSkills.slice(0, 3)"
                  :key="skill.id"
                  dense
                  color="green-2"
                  text-color="positive"
                  class="skill-chip text-weight-medium"
                >
                  {{ skill.nombre }}
                </q-chip>
                <q-chip
                  v-if="colaborador.softSkills.length > 3"
                  dense
                  outline
                  color="grey-7"
                  class="skill-chip-more"
                >
                  +{{ colaborador.softSkills.length - 3 }}
                </q-chip>
                <div v-if="!colaborador.softSkills.length" class="text-caption text-grey-6">
                  No hay skills blandos.
                </div>
              </div>
            </div>

            <!-- Idiomas -->
            <div class="col-12 q-mt-md">
              <div class="skills-titulo">Idiomas</div>
              <div class="skills-chips">
                <q-chip
                  v-for="skill in colaborador.languageSkills.slice(0, 3)"
                  :key="skill.id"
                  dense
                  color="orange-2"
                  text-color="orange-9"
                  class="skill-chip text-weight-medium"
                >
                  {{ skill.nombre }}
                </q-chip>
                <q-chip
                  v-if="colaborador.languageSkills.length > 3"
                  dense
                  outline
                  color="grey-7"
                  class="skill-chip-more"
                >
                  +{{ colaborador.languageSkills.length - 3 }}
                </q-chip>
                <div v-if="!colaborador.languageSkills.length" class="text-caption text-grey-6">
                  No hay idiomas.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Acciones -->
        <div class="col-auto text-right">
          <div class="colaborador-acciones">
            <q-btn dense round color="primary" size="md">
              <q-icon name="img:icons/SkillMapIcon/agregar.png" size="20px" />
            </q-btn>
            <q-btn dense round color="primary" size="md">
              <q-icon name="img:icons/SkillMapIcon/editar.png" size="20px" />
            </q-btn>
            <q-btn dense round color="primary" size="md">
              <q-icon name="img:icons/SkillMapIcon/tres-puntos.png" size="20px" />
            </q-btn>
          </div>
          <!-- Botón Ver Perfil -->
          <div class="q-mt-md">
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Ver Perfil"
              class="full-width"
              @click="irAPerfil"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  colaborador: {
    type: Object,
    required: true,
    default: () => ({
      nombres: 'Nombre',
      apellidos: 'Apellidos',
      departamentoNombre: 'Departamento',
      areaNombre: 'Área',
      rolNombre: 'Rol',
      fechaAlta: 'N/A',
      technicalSkills: [],
      softSkills: [],
      languageSkills: [],
    }),
  },
  searchTerm: {
    type: String,
    default: '',
  },
})

const highlight = (text, term) => {
  if (!term) {
    return text
  }
  const regex = new RegExp(`(${term})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const highlightedFullName = computed(() => {
  const fullName = `${props.colaborador.nombres || ''} ${props.colaborador.apellidos || ''}`
  return highlight(fullName, props.searchTerm)
})

const highlightedRole = computed(() => {
  return highlight(props.colaborador.rolNombre || '', props.searchTerm)
})

function irAPerfil() {
  // Ajusta el name/path a como tengas definida la ruta en tu router
  router.push({
    name: 'perfil-colaborador', // o path: '/app/perfil-colaborador/' + props.colaborador.colaboradorId
    params: { id: props.colaborador.colaboradorId },
  })
}
</script>

<style scoped>
.colaborador-card {
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.colaborador-nombre {
  font-size: 22px;
  font-weight: 700;
  color: #0f4a92;
}

.colaborador-departamento {
  font-size: 15px;
  color: #555;
}

.colaborador-rol {
  font-size: 14px;
  color: #777;
}

.skills-titulo {
  font-size: 14px;
  font-weight: 600;
  color: #0f4a92;
  margin-bottom: 8px;
}

.skills-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.skill-chip {
  font-size: 17px;
  border-radius: 8px;
}

.skill-chip-more {
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
}

.colaborador-acciones {
  display: flex;
  gap: 8px; /* separación entre botones */
}

:deep(mark) {
  background-color: #ffecb3;
  padding: 0 2px;
  border-radius: 3px;
  font-weight: 600;
}
</style>
