<template>
  <div class="perfil_colab-wrapper">
    <div class="perfil_colab">
      <!-- Panel blanco de fondo -->
      <div class="rectangle-116"></div>
      <div class="text"></div>
      <div class="text_01"></div>

      <!-- Título -->
      <div class="perfil-de-colaborador">
        <span class="perfildecolaborador_span">Perfil de Colaborador</span>
      </div>

      <!-- Botón Editar -->
      <div class="rectangle-70" @click="editarPerfil"></div>
      <div class="editar" @click="editarPerfil">
        <span class="editar_span">Editar</span>
      </div>

      <!-- Botón Cerrar -->
      <div class="rectangle-70_01" @click="cerrarPerfil"></div>
      <div class="cerrar" @click="cerrarPerfil">
        <span class="cerrar_span">Cerrar</span>
      </div>

      <!-- DATOS DEL COLABORADOR -->
      <div class="perfil-datos" v-if="colaborador">
        <div class="dato-principal">{{ colaborador.nombres }} {{ colaborador.apellidos }}</div>
        <div class="dato-secundario">
          {{ colaborador.areaNombre || colaborador.departamentoNombre || 'Área no asignada' }}
        </div>
        <div class="dato-terciario">
          {{ colaborador.rolNombre || 'Rol no asignado' }}
        </div>
      </div>

      <!-- Avatar con inicial -->
      <div class="avatar-perfil">
        {{ colaborador?.nombres ? colaborador.nombres.charAt(0).toUpperCase() : '?' }}
      </div>

      <!-- ===== BLOQUE DE SKILLS ===== -->
      <div class="skills-wrapper">
        <!-- Hard Skill -->
        <div class="skills-card">
          <div class="skills-title">Hard Skill</div>

          <template v-if="hardSkills.length">
            <table class="skills-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Nivel</th>
                  <th class="col-anios">Años</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="skill in hardSkills" :key="skill.id">
                  <td>{{ skill.nombre }}</td>
                  <td>{{ skill.nivel }}</td>
                  <td class="col-anios">{{ skill.aniosExp }} años</td>
                </tr>
              </tbody>
            </table>
          </template>
          <div v-else class="skills-empty">Sin hard skills registradas</div>
        </div>

        <!-- Idioma -->
        <div class="skills-card">
          <div class="skills-title">Idioma</div>

          <template v-if="languageSkills.length">
            <table class="skills-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Nivel</th>
                  <th class="col-anios">Años</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="idioma in languageSkills" :key="idioma.id">
                  <td>{{ idioma.nombre }}</td>
                  <td>{{ idioma.nivel }}</td>
                  <td class="col-anios">{{ idioma.aniosExp }} años</td>
                </tr>
              </tbody>
            </table>
          </template>
          <div v-else class="skills-empty">Sin idiomas registrados</div>
        </div>

        <!-- Soft Skill -->
        <div class="skills-card">
          <div class="skills-title">Soft Skill</div>

          <template v-if="softSkills.length">
            <table class="skills-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Nivel</th>
                  <th class="col-anios">Años</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="skill in softSkills" :key="skill.id">
                  <td>{{ skill.nombre }}</td>
                  <td>{{ skill.nivel }}</td>
                  <td class="col-anios">{{ skill.aniosExp }} años</td>
                </tr>
              </tbody>
            </table>
          </template>
          <div v-else class="skills-empty">Sin soft skills registradas</div>
        </div>

        <!-- Certificaciones -->
        <div class="skills-card">
          <div class="skills-title">Certificaciones</div>

          <template v-if="certifications.length">
            <table class="skills-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th class="col-anios">Fecha de obtención</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cert in certifications" :key="cert.id">
                  <td>{{ cert.nombre }}</td>
                  <td class="col-anios">{{ formatFecha(cert.fechaObtencion) }}</td>
                </tr>
              </tbody>
            </table>
          </template>
          <div v-else class="skills-empty">Sin certificaciones registradas</div>
        </div>
      </div>
      <!-- ===== FIN BLOQUE DE SKILLS ===== -->
    </div>
  </div>
</template>

<script>
import { api } from 'boot/axios'

export default {
  name: 'PerfilColab',

  data() {
    return {
      colaborador: null,
      hardSkills: [],
      languageSkills: [],
      softSkills: [],
      certifications: [],
    }
  },

  async mounted() {
    await this.cargarDatos()
  },

  methods: {
    async cargarDatos() {
      const id = this.$route.params.id // /app/perfil-colaborador/:id

      // 1) Datos del colaborador
      const { data: colaborador } = await api.get(`/api/Colaborador/${id}`)
      this.colaborador = colaborador

      // 2) Skills del colaborador
      const { data: allSkills } = await api.get(`/api/ColaboradorSkill/${id}/skills`)

      this.hardSkills = allSkills
        .filter((s) => s.tipoSkillNombre === 'Hard Skill')
        .map((s) => ({
          id: s.skillId,
          nombre: s.skillNombre,
          nivel: s.nivelNombre,
          aniosExp: s.aniosExp,
        }))

      this.languageSkills = allSkills
        .filter((s) => s.tipoSkillNombre === 'Idioma')
        .map((s) => ({
          id: s.skillId,
          nombre: s.skillNombre,
          nivel: s.nivelNombre,
          aniosExp: s.aniosExp,
        }))

      this.softSkills = allSkills
        .filter((s) => s.tipoSkillNombre === 'Soft Skill')
        .map((s) => ({
          id: s.skillId,
          nombre: s.skillNombre,
          nivel: s.nivelNombre,
          aniosExp: s.aniosExp,
        }))

      // 3) Certificaciones
      const { data: certs } = await api.get(`/api/ColaboradorCertificacion/${id}`)

      this.certifications = certs.map((c) => ({
        id: c.certificacionId,
        nombre: c.nombreCertificacion,
        fechaObtencion: c.fechaObtencion,
      }))
    },

    formatFecha(fecha) {
      if (!fecha) return ''
      return new Date(fecha).toLocaleDateString('es-PE')
    },

    cerrarPerfil() {
      this.$router.push({ name: 'skill-mapping' })
    },

    editarPerfil() {
      this.$router.push({
        name: 'editar-colaborador',
        params: { id: this.$route.params.id },
      })
    },
  },
}
</script>

<style>
/* Panel blanco */
.rectangle-116 {
  width: 1547.4px;
  height: 912.8px;
  left: 90.66px;
  top: 166.19px;
  position: absolute;
  background: white;
  border-radius: 16px;
}

.text {
  width: 0px;
  height: 27.59px;
  left: 110.07px;
  top: 264.53px;
  position: absolute;
}

.text_01 {
  width: 0px;
  height: 27.59px;
  left: 562.5px;
  top: 264.32px;
  position: absolute;
}

/* Título principal */
.perfildecolaborador_span {
  color: black;
  font-size: 40px;
  font-family: Roboto, sans-serif;
  font-weight: 700;
}

.perfil-de-colaborador {
  width: 484.11px;
  height: 56.38px;
  left: 194.13px;
  top: 89.53px; /* volvemos al valor que ya se veía bien */
  position: absolute;
}

/* Botones */
.rectangle-70 {
  width: 215.44px;
  height: 70.77px;
  left: 1085.73px;
  top: 57.05px;
  position: absolute;
  background: #0f4a92;
  border-radius: 23px;
  cursor: pointer;
}

.editar_span {
  color: white;
  font-size: 20px;
  font-family: Roboto, sans-serif;
  font-weight: 700;
}

.editar {
  width: 73.5px;
  height: 28.79px;
  left: 1156.71px;
  top: 79.81px;
  position: absolute;
  cursor: pointer;
}

.rectangle-70_01 {
  width: 215.44px;
  height: 70.77px;
  left: 1365.8px;
  top: 56.91px;
  position: absolute;
  background: #0f4a92;
  border-radius: 23px;
  cursor: pointer;
}

.cerrar_span {
  color: white;
  font-size: 20px;
  font-family: Roboto, sans-serif;
  font-weight: 700;
}

.cerrar {
  width: 79.84px;
  height: 28.79px;
  left: 1432.98px;
  top: 79.67px;
  position: absolute;
  cursor: pointer;
}

/* Avatar con inicial (misma posición que tenías antes) */
.avatar-perfil {
  width: 191.37px;
  height: 183.52px;
  left: 180.98px;
  top: 234.51px;
  position: absolute;
  border-radius: 9999px;
  background: linear-gradient(135deg, #1e5fd8, #4f8cff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 90px;
  font-weight: 700;
  color: #ffffff;
  font-family: Roboto, sans-serif;
}

/* DATOS DEL COLABORADOR */
.perfil-datos {
  position: absolute;
  left: 420px;
  top: 260px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dato-principal {
  font-size: 34px;
  font-weight: 700;
  color: #0f4a92;
}

.dato-secundario {
  font-size: 22px;
  font-weight: 500;
  color: #444;
}

.dato-terciario {
  font-size: 18px;
  color: #666;
}

/* ===== BLOQUE SKILLS ===== */

.skills-wrapper {
  position: absolute;
  left: 132px;
  right: 132px;
  top: 480px; /* misma altura aproximada que la versión que te gustó */
  display: flex;
  gap: 32px;
}

.skills-card {
  flex: 1;
  background: #f4f4f4;
  border-radius: 19px;
  padding: 24px 28px 32px;
  min-height: 220px;
}

.skills-title {
  font-size: 20px;
  font-weight: 700;
  font-family: Roboto, sans-serif;
  margin-bottom: 14px;
}

/* Tabla de skills */
.skills-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Roboto, sans-serif;
  font-size: 14px;
}

.skills-table thead tr {
  border-bottom: 1px solid #d1d5db;
}

.skills-table th,
.skills-table td {
  padding: 6px 4px;
  text-align: left;
}

.skills-table th {
  font-weight: 600;
  color: #4b5563;
}

.skills-table tbody tr:nth-child(odd) {
  background-color: #f9fafb;
}

.skills-table tbody tr:nth-child(even) {
  background-color: #f3f4f6;
}

.col-anios {
  text-align: right;
  white-space: nowrap;
}

.skills-empty {
  margin-top: 4px;
  font-size: 13px;
  color: #777;
}

/* ===== CONTENEDOR GENERAL ===== */

.perfil_colab {
  width: 1716.19px;
  height: 1132.11px;
  position: relative;
  background: #f4f3f9;
  overflow: visible;
  zoom: 0.75;
}

.perfil_colab-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding-bottom: 40px;
}
</style>
