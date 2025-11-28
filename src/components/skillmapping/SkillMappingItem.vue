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
            <div class="colaborador-nombre q-mr-sm">{{ colaborador.nombres }} {{ colaborador.apellidos }}</div>
          </div>
          <div class="colaborador-departamento text-weight-bold">
            {{ colaborador.areaNombre || colaborador.departamentoNombre }}
          </div>
          <div class="colaborador-rol">{{ colaborador.rolNombre }}</div>
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
          <div class="q-mt-md">
            <q-btn unelevated rounded color="primary" label="Ver Perfil" class="full-width" />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
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
})
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
}

.skill-chip {
  font-size: 17px;
  border-radius: 8px;
}
.colaborador-acciones {
  display: flex;
  gap: 8px; /* separación entre botones */
}
</style>
