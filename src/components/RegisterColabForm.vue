<template>
  <div class="register-colab-page">
    <!-- HEADER AZUL -->
    <header class="header">
      <div class="header-inner">
        <div class="header-left">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            class="back-btn"
            @click="$router.back()"
          />
          <div class="header-text">
            <h1>Registro de nuevo Colaborador</h1>
            <p>Movilidad interna inteligente basada en skills</p>
          </div>
        </div>
        <q-icon name="group" size="48px" class="header-people-icon" />
      </div>
    </header>

    <!-- CONTENIDO BLANCO -->
    <main class="main-container">
      <div class="content-grid">
        <!-- COLUMNA IZQUIERDA -->
        <div class="left-column">
          <!-- INFO PERSONAL -->
          <section class="card">
            <div class="card-title-row">
              <span class="card-title">Información Personal</span>
            </div>

            <div class="fields-grid">
              <div class="field">
                <label>DNI</label>
                <q-input
                  dense
                  outlined
                  v-model="form.dni"
                  maxlength="8"
                  @input="onDniInput"
                  :error="form.dni !== '' && !dniValid"
                  error-message="El DNI debe tener exactamente 8 dígitos."
                />
              </div>
              <div class="field">
                <label>Nombres</label>
                <q-input dense outlined v-model="form.nombres" />
              </div>
              <div class="field">
                <label>Apellidos</label>
                <q-input dense outlined v-model="form.apellidos" />
              </div>
              <div class="field">
                <label>Email</label>
                <q-input
                  dense
                  outlined
                  v-model="form.correo"
                  type="email"
                  :error="form.correo !== '' && !emailValid"
                  error-message="Formato de correo inválido (ej: usuario@dominio.com)"
                />
              </div>
              <div class="field full-width">
                <label>Contraseña</label>
                <q-input
                  dense
                  outlined
                  v-model="form.password"
                  :type="showPassword ? 'password' : 'text'"
                >
                  <template #append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </section>

          <!-- INFO PROFESIONAL -->
          <section class="card">
            <div class="card-title-row">
              <span class="card-title">Información Profesional</span>
            </div>

            <div class="fields-grid">
              <div class="field">
                <label>Departamento</label>
                <q-select
                  dense
                  outlined
                  v-model="form.departamentoId"
                  :options="departamentoOptions"
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona un departamento"
                />
              </div>

              <div class="field">
                <label>Rol</label>
                <q-select
                  dense
                  outlined
                  v-model="form.rolId"
                  :options="rolOptions"
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona un rol"
                />
              </div>

              <div class="field">
                <label>Fecha de inicio</label>
                <q-input dense outlined v-model="form.fechaInicio" type="date" />
              </div>

              <div class="field">
                <label>Área</label>
                <q-select
                  dense
                  outlined
                  v-model="form.areaId"
                  :options="filteredAreaOptions"
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona un área"
                />
              </div>

              <div class="field full-width disponible-row">
                <q-checkbox
                  v-model="form.disponibleMovilidad"
                  label="Disponible para movilidad interna"
                />
              </div>
            </div>
          </section>
        </div>

        <!-- COLUMNA DERECHA SKILLS / CERTIFICACIONES -->
        <section class="card card-skills">
          <div class="card-title-row center">
            <span class="card-title">Skills y Competencias</span>
          </div>

          <!-- ===== SKILLS ===== -->
          <div class="skills-block">
            <div class="skills-header-row">
              <span class="block-title">Skills</span>
              <q-btn
                flat
                dense
                icon="add"
                label="Agregar Skill"
                class="text-primary"
                @click="openSkillDialogForNew"
              />
            </div>

            <div class="skills-table">
              <div class="skills-table-header">
                <span class="col-main">Nombre de Skill</span>
                <span>Categoría</span>
                <span>Nivel</span>
                <span>Años / Experiencia</span>
                <span>Acciones</span>
              </div>

              <div v-if="!form.skills.length" class="skills-table-empty">
                No hay skills registradas.
              </div>

              <div v-else class="skills-table-body">
                <div
                  v-for="(skill, index) in form.skills"
                  :key="index"
                  class="skills-table-row"
                >
                  <div class="cell main">
                    <span>{{ skill.nombre }}</span>
                  </div>
                  <div class="cell">
                    <span>{{ skill.categoria || '-' }}</span>
                  </div>
                  <div class="cell">
                    <span>{{ skill.nivelNombre || '-' }}</span>
                  </div>
                  <div class="cell">
                    <span>{{ skill.aniosExp || '-' }}</span>
                  </div>
                  <div class="cell actions-cell">
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      size="sm"
                      @click="openSkillDialogForEdit(index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== CERTIFICACIONES ===== -->
          <div class="cert-block">
            <div class="skills-header-row">
              <span class="block-title">Certificaciones</span>
              <q-btn
                flat
                dense
                icon="add"
                label="Agregar Certificación"
                class="text-primary"
                @click="openCertDialogForNew"
              />
            </div>

            <div class="skills-table">
              <div class="skills-table-header">
                <span class="col-main">Certificación</span>
                <span>Descripción</span>
                <span>Fecha de obtención</span>
                <span>Acciones</span>
              </div>

              <div v-if="!form.certificaciones.length" class="skills-table-empty">
                No hay certificaciones registradas.
              </div>

              <div v-else class="skills-table-body">
                <div
                  v-for="(cert, index) in form.certificaciones"
                  :key="index"
                  class="skills-table-row"
                >
                  <div class="cell main">
                    <span>{{ cert.nombre }}</span>
                  </div>
                  <div class="cell">
                    <span>{{ cert.descripcion || '-' }}</span>
                  </div>
                  <div class="cell">
                    <span>{{ cert.fechaObtencion || '-' }}</span>
                  </div>
                  <div class="cell actions-cell">
                    <q-btn
                      flat
                      round
                      dense
                      icon="edit"
                      size="sm"
                      @click="openCertDialogForEdit(index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- BOTÓN REGISTRAR ABAJO A LA DERECHA -->
      <div class="actions-row">
        <q-btn
          color="primary"
          class="register-btn"
          unelevated
          label="Registrar colaborador"
          :disable="!formValid"
          @click="onSubmit"
        />
      </div>
    </main>

    <!-- ========== DIALOGO SKILL ========== -->
    <q-dialog v-model="skillDialog.open" persistent>
      <q-card style="min-width: 520px; max-width: 600px">
        <q-card-section class="text-h6">
          {{ skillDialog.mode === 'new' ? 'Agregar Skill' : 'Editar Skill' }}
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-gutter-md">
            <!-- Nombre del Skill -->
            <q-select
              dense
              outlined
              v-model="skillDialog.form.skillId"
              :options="skillOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Nombre del Skill *"
              :rules="[(val) => !!val || 'Selecciona un skill']"
              @update:model-value="onSkillSelected"
            />

            <!-- Categoría -->
            <q-select
              dense
              outlined
              v-model="skillDialog.form.tipoSkillId"
              :options="tipoSkillOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Categoría *"
              :rules="[(val) => !!val || 'Selecciona una categoría']"
            />

            <!-- Nivel (slider) -->
            <div>
              <div class="text-subtitle2 q-mb-xs">Nivel</div>
              <q-slider
                v-model.number="skillDialog.form.sliderValue"
                :min="0"
                :max="2"
                :step="1"
                snap
              />
              <div class="row justify-between text-caption q-mt-xs">
                <span>Principiante</span>
                <span>Intermedio</span>
                <span>Avanzado</span>
              </div>
            </div>

            <!-- Años de experiencia -->
            <q-input
              dense
              outlined
              v-model="skillDialog.form.aniosExp"
              label="Años de experiencia"
              type="number"
              min="0"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="onConfirmSkill" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ========== DIALOGO CERTIFICACION ========== -->
    <q-dialog v-model="certDialog.open" persistent>
      <q-card style="min-width: 520px; max-width: 600px">
        <q-card-section class="text-h6">
          {{ certDialog.mode === 'new' ? 'Agregar Certificación' : 'Editar Certificación' }}
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-gutter-md">
            <!-- SELECT DE CERTIFICACIÓN -->
            <q-select
              dense
              outlined
              v-model="certDialog.form.certificacionId"
              :options="certificacionOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Nombre de la certificación *"
              :rules="[(val) => !!val || 'Selecciona una certificación']"
              @update:model-value="onCertSelected"
            />

            <!-- Descripción (se autocompleta pero se puede editar) -->
            <q-select
              dense
              outlined
              v-model="certDialog.form.descripcion"
              type="textarea"
              label="Descripción"
            />

            <!-- Fecha de obtención -->
            <q-input
              dense
              outlined
              v-model="certDialog.form.fechaObtencion"
              type="date"
              label="Fecha de obtención"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click="onConfirmCert" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'RegisterColabForm',

  data() {
    return {
      // ===== FORMULARIO =====
      form: {
        // Info personal
        dni: '',
        nombres: '',
        apellidos: '',
        correo: '',
        password: '',

        // Info profesional
        departamentoId: null,
        rolId: null,
        areaId: null,
        fechaInicio: '',
        disponibleMovilidad: false,

        // Skills y certificaciones
        skills: [],
        certificaciones: [],
      },

      showPassword: true,

      // Selects
      departamentoOptions: [],
      rolOptions: [],
      areaOptions: [],
      filteredAreaOptions: [],

      // Catálogos para skills
      skillCatalog: [],
      skillOptions: [],
      tipoSkillOptions: [],
      nivelOptions: [],

      // Catálogo certificaciones
      certificacionCatalog: [],
      certificacionOptions: [],

      // Dialog Skill
      skillDialog: {
        open: false,
        mode: 'new',
        editIndex: -1,
        form: {
          skillId: null,
          nombre: '',
          tipoSkillId: null,
          categoria: '',
          sliderValue: 0,
          nivelId: null,
          nivelNombre: '',
          aniosExp: '',
        },
      },

      // Dialog Certificación
      certDialog: {
        open: false,
        mode: 'new',
        editIndex: -1,
        form: {
          certificacionId: null,
          nombre: '',
          descripcion: '',
          fechaObtencion: '',
        },
      },
    }
  },

  computed: {
    dniValid() {
      return /^[0-9]{8}$/.test(this.form.dni)
    },
    emailValid() {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
      return emailRegex.test(this.form.correo)
    },
    passwordValid() {
      return !!this.form.password && this.form.password.length >= 8
    },
    personalValid() {
      if (!this.form.nombres || !this.form.apellidos) return false
      if (!this.dniValid) return false
      if (!this.emailValid) return false
      if (!this.passwordValid) return false
      return true
    },
    profesionalValid() {
      if (!this.form.rolId) return false
      if (!this.form.areaId) return false
      if (!this.form.departamentoId) return false
      return true
    },
    formValid() {
      return this.personalValid && this.profesionalValid
    },
  },

  watch: {
    'form.departamentoId': function (newDept) {
      if (!newDept) {
        this.filteredAreaOptions = [...this.areaOptions]
        return
      }
      this.filteredAreaOptions = this.areaOptions.filter(
        (a) => a.departamentoId === newDept
      )

      if (
        this.form.areaId &&
        !this.filteredAreaOptions.some((a) => a.value === this.form.areaId)
      ) {
        this.form.areaId = null
      }
    },

    'form.areaId': function (newArea) {
      if (!newArea) return
      const area = this.areaOptions.find((a) => a.value === newArea)
      if (area && area.departamentoId && this.form.departamentoId !== area.departamentoId) {
        this.form.departamentoId = area.departamentoId
      }
    },
  },

  async mounted() {
    await this.cargarCombos()
  },

  methods: {
    resetForm() {
      this.form = {
        dni: '',
        nombres: '',
        apellidos: '',
        correo: '',
        password: '',
        departamentoId: null,
        rolId: null,
        areaId: null,
        fechaInicio: '',
        disponibleMovilidad: false,
        skills: [],
        certificaciones: [],
      }

      this.showPassword = true
      this.skillDialog.open = false
      this.certDialog.open = false
    },

    onDniInput() {
      this.form.dni = (this.form.dni || '').replace(/\D/g, '').slice(0, 8)
    },

    async cargarCombos() {
      const api = this.$api

      try {
        const [rolesRes, deptRes, areaRes, skillRes, tipoRes, nivelRes, certRes] =
          await Promise.all([
            api.get('/api/Rol'),
            api.get('/api/Departamento'),
            api.get('/api/Area/areas'),
            api.get('/api/Skill'),
            api.get('/api/Skill/tiposkill'),
            api.get('/api/Nivel/niveles'),
            api.get('/api/Certificacion'),
          ])

        // ROL
        this.rolOptions = (rolesRes.data ?? []).map((r) => ({
          label: r.nombre ?? r.Nombre,
          value: r.rolId ?? r.RolId,
        }))

        // DEPARTAMENTO
        this.departamentoOptions = (deptRes.data ?? []).map((d) => ({
          label: d.nombre ?? d.Nombre,
          value: d.departamentoId ?? d.DepartamentoId,
        }))

        // AREA
        this.areaOptions = (areaRes.data ?? []).map((a) => ({
          label: a.nombre ?? a.Nombre,
          value: a.areaId ?? a.AreaId,
          departamentoId: a.departamentoId ?? a.DepartamentoId ?? null,
        }))
        this.filteredAreaOptions = [...this.areaOptions]

        // SKILL CATALOGO
        this.skillCatalog = (skillRes.data ?? []).map((s) => ({
          value: s.skillId ?? s.SkillId,
          label: s.nombre ?? s.Nombre,
          tipoSkillId: s.tipoSkillId ?? s.TipoSkillId ?? null,
          tipoSkillNombre: s.tipoSkillNombre ?? s.TipoSkillNombre ?? '',
        }))
        this.skillOptions = this.skillCatalog.map((s) => ({
          value: s.value,
          label: s.label,
        }))

        // TIPOSKILL
        this.tipoSkillOptions = (tipoRes.data ?? []).map((t) => ({
          value: t.tipoSkillId ?? t.TipoSkillId,
          label: t.nombre ?? t.Nombre,
        }))

        // NIVELES
        this.nivelOptions = (nivelRes.data ?? []).map((n) => ({
          value: n.nivelId ?? n.NivelId,
          label: n.nombre ?? n.Nombre,
        }))
        this.nivelOptions.sort((a, b) => (a.value ?? 0) - (b.value ?? 0))

        // CERTIFICACIONES
        this.certificacionCatalog = (certRes.data ?? []).map((c) => ({
          value: c.certificacionId ?? c.CertificacionId,
          label: c.nombre ?? c.Nombre,
          descripcion: c.descripcion ?? c.Descripcion ?? '',
        }))
        this.certificacionOptions = this.certificacionCatalog.map((c) => ({
          value: c.value,
          label: c.label,
        }))
      } catch (e) {
        console.error('Error cargando combos:', e)
      }
    },

    // ========== SKILLS ==========
    openSkillDialogForNew() {
      this.skillDialog.mode = 'new'
      this.skillDialog.editIndex = -1
      this.skillDialog.form = {
        skillId: null,
        nombre: '',
        tipoSkillId: null,
        categoria: '',
        sliderValue: 0,
        nivelId: null,
        nivelNombre: '',
        aniosExp: '',
      }
      this.skillDialog.open = true
    },

    openSkillDialogForEdit(index) {
      const s = this.form.skills[index]
      if (!s) return

      let sliderValue = 1
      const nivelIndex = this.nivelOptions.findIndex((n) => n.value === s.nivelId)
      if (nivelIndex >= 0) sliderValue = nivelIndex

      this.skillDialog.mode = 'edit'
      this.skillDialog.editIndex = index
      this.skillDialog.form = {
        skillId: s.skillId ?? null,
        nombre: s.nombre,
        tipoSkillId: s.tipoSkillId ?? null,
        categoria: s.categoria,
        sliderValue,
        nivelId: s.nivelId ?? null,
        nivelNombre: s.nivelNombre ?? '',
        aniosExp: s.aniosExp,
      }
      this.skillDialog.open = true
    },

    onSkillSelected(skillId) {
      const selected = this.skillCatalog.find((s) => s.value === skillId)
      if (!selected) return

      this.skillDialog.form.nombre = selected.label
      this.skillDialog.form.tipoSkillId = selected.tipoSkillId
      this.skillDialog.form.categoria = selected.tipoSkillNombre
    },

    onConfirmSkill() {
      if (!this.skillDialog.form.skillId) {
        this.$q.notify({
          type: 'warning',
          message: 'Selecciona un skill.',
        })
        return
      }
      if (!this.skillDialog.form.tipoSkillId) {
        this.$q.notify({
          type: 'warning',
          message: 'Selecciona una categoría.',
        })
        return
      }

      const nivelIndex = this.skillDialog.form.sliderValue || 0
      const nivelInfo = this.nivelOptions[nivelIndex] || { value: null, label: '' }

      const skillData = {
        skillId: this.skillDialog.form.skillId,
        nombre: this.skillDialog.form.nombre,
        tipoSkillId: this.skillDialog.form.tipoSkillId,
        categoria:
          this.tipoSkillOptions.find((t) => t.value === this.skillDialog.form.tipoSkillId)
            ?.label || this.skillDialog.form.categoria,
        nivelId: nivelInfo.value,
        nivelNombre: nivelInfo.label,
        aniosExp: this.skillDialog.form.aniosExp,
      }

      if (this.skillDialog.mode === 'new') {
        this.form.skills.push(skillData)
      } else if (this.skillDialog.mode === 'edit' && this.skillDialog.editIndex >= 0) {
        this.form.skills.splice(this.skillDialog.editIndex, 1, skillData)
      }

      this.skillDialog.open = false
    },

    onDeleteSkill(index) {
      this.$q
        .dialog({
          title: 'Confirmar',
          message: '¿Seguro que deseas eliminar esta skill?',
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.form.skills.splice(index, 1)
        })
    },

    // ========== CERTIFICACIONES ==========
    openCertDialogForNew() {
      this.certDialog.mode = 'new'
      this.certDialog.editIndex = -1
      this.certDialog.form = {
        certificacionId: null,
        nombre: '',
        descripcion: '',
        fechaObtencion: '',
      }
      this.certDialog.open = true
    },

    openCertDialogForEdit(index) {
      const c = this.form.certificaciones[index]
      if (!c) return

      this.certDialog.mode = 'edit'
      this.certDialog.editIndex = index
      this.certDialog.form = {
        certificacionId: c.certificacionId ?? null,
        nombre: c.nombre,
        descripcion: c.descripcion,
        fechaObtencion: c.fechaObtencion,
      }
      this.certDialog.open = true
    },

    onCertSelected(certId) {
      const selected = this.certificacionCatalog.find((c) => c.value === certId)
      if (!selected) return

      this.certDialog.form.nombre = selected.label
      this.certDialog.form.descripcion = selected.descripcion
    },

    onConfirmCert() {
      if (!this.certDialog.form.certificacionId) {
        this.$q.notify({
          type: 'warning',
          message: 'El nombre de la certificación es obligatorio.',
        })
        return
      }

      const certData = {
        certificacionId: this.certDialog.form.certificacionId,
        nombre: this.certDialog.form.nombre,
        descripcion: this.certDialog.form.descripcion,
        fechaObtencion: this.certDialog.form.fechaObtencion,
      }

      if (this.certDialog.mode === 'new') {
        this.form.certificaciones.push(certData)
      } else if (this.certDialog.mode === 'edit' && this.certDialog.editIndex >= 0) {
        this.form.certificaciones.splice(this.certDialog.editIndex, 1, certData)
      }

      this.certDialog.open = false
    },

    // ========== SUBMIT ==========
    async onSubmit() {
      if (!this.formValid) {
        this.$q.notify({
          type: 'negative',
          message: 'Completa todos los campos obligatorios correctamente.',
          position: 'top-right',
        })
        return
      }

      const api = this.$api

      const payloadColaborador = {
        nombres: this.form.nombres,
        apellidos: this.form.apellidos,
        dni: this.form.dni,
        email: this.form.correo,
        password: this.form.password,
        rolId: this.form.rolId,
        areaId: this.form.areaId,
        departamentoId: this.form.departamentoId,
        disponibleMovilidad: this.form.disponibleMovilidad,
        activo: true,
      }

      try {
        // 1) Crear colaborador
        const res = await api.post('/api/Colaborador', payloadColaborador)
        const colaboradorCreado = res.data
        const colaboradorId =
          colaboradorCreado.colaboradorId ?? colaboradorCreado.ColaboradorId

        // 2) Registrar skills
        if (this.form.skills.length) {
          await api.post(`/api/ColaboradorSkill/${colaboradorId}/skills`, this.form.skills)
        }

        // 3) Registrar certificaciones (solo campos que el backend necesita)
        if (this.form.certificaciones.length) {
          const certPayload = this.form.certificaciones.map((c) => ({
            certificacionId: c.certificacionId,
            fechaObtencion: c.fechaObtencion, // 'YYYY-MM-DD'
          }))

          await api.post(`/api/ColaboradorCertificacion/${colaboradorId}`, certPayload)
        }

        this.$q.notify({
          type: 'positive',
          message: 'Colaborador registrado correctamente.',
          position: 'top-right',
        })
        this.resetForm()
      } catch (err) {
        console.error(err)
        const backendMessage =
          err?.response?.data?.message ||
          err?.response?.data?.title ||
          'Error al registrar colaborador.'
        this.$q.notify({
          type: 'negative',
          message: backendMessage,
          position: 'top-right',
        })
      }
    },
  },
}
</script>

<style>
.register-colab-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5fb;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.header {
  background-color: #2469bc;
  height: 140px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.header-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: #ffffff;
  color: #2469bc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
}

.header-text h1 {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 700;
}

.header-text p {
  margin: 0;
  font-size: 12px;
}

.header-people-icon {
  color: #ffffff;
}

/* MAIN */
.main-container {
  width: 100%;
  margin: 0;
  padding: 24px 64px 40px;
  box-sizing: border-box;
  margin-top: -20px;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  column-gap: 32px;
  align-items: stretch;
}

/* COLUMNA IZQUIERDA */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* CARDS */
.card {
  background-color: #ffffff;
  border-radius: 18px;
  border: 1px solid #e3e7f4;
  padding: 22px 28px 24px;
  box-sizing: border-box;
  box-shadow: 0 8px 20px rgba(21, 44, 101, 0.06);
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.card-title-row.center {
  justify-content: center;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1b1c1d;
}

/* GRID CAMPOS */
.fields-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 28px;
  row-gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field label {
  font-size: 13px;
  color: #1b1c1d;
}

.field.full-width {
  grid-column: 1 / -1;
}

.disponible-row {
  margin-top: 8px;
}

/* SKILLS / CERTS */
.card-skills {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skills-block,
.cert-block {
  width: 100%;
}

.skills-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.block-title {
  font-size: 14px;
  font-weight: 600;
}

/* TABLA SKILLS / CERTS */
.skills-table {
  margin-top: 8px;
  width: 100%;
  background-color: #f6f6fb;
  border-radius: 12px;
  padding: 12px 16px;
  box-sizing: border-box;
  max-height: 260px;
  overflow-y: auto;
}

.skills-table-header {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr 1.4fr 1fr;
  font-size: 13px;
  font-weight: 600;
  color: #1b1c1d;
  padding-bottom: 6px;
  border-bottom: 1px solid #d4dbe8;
}

.skills-table-header span.col-main {
  text-decoration: underline;
}

.skills-table-empty {
  padding: 10px 2px 4px;
  font-size: 12px;
  color: #8a8fa3;
}

.skills-table-body {
  margin-top: 4px;
}

.skills-table-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr 1.4fr 1fr;
  align-items: center;
  font-size: 13px;
  color: #333;
  padding: 8px 0;
  border-bottom: 1px solid #dfe3f0;
}

.skills-table-row:last-child {
  border-bottom: none;
}

.cell {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cell.main {
  gap: 6px;
}

.actions-cell {
  justify-content: flex-start;
  gap: 4px;
}

/* BOTÓN REGISTRAR */
.actions-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}

.register-btn {
  min-width: 260px;
  height: 56px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .header-inner {
    padding: 0 16px;
  }

  .main-container {
    padding: 16px;
    margin-top: 0;
  }

  .content-grid {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }

  .card {
    padding: 20px;
  }
}
</style>
