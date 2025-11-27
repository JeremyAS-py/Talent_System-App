<template>
  <div class="login-container row no-wrap">
    <!-- PANEL IZQUIERDO -->
    <div class="left-panel column justify-center items-start q-pa-xl">
      <h6 class="text-h3 text-white text-bold">
        Bienvenido al <br />
        Sistema de Gestión <br />
        de Talento Interno
      </h6>
      <div class="row q-gutter-md hero-icons">
        <q-icon name="groups" size="64px" color="white" />
        <q-icon name="work" size="64px" color="white" />
        <q-icon name="trending_up" size="64px" color="white" />
        <q-icon name="search" size="64px" color="white" />
      </div>
    </div>

    <!-- PANEL DERECHO -->
    <div class="right-panel column justify-center items-center">
      <q-card class="q-pa-xl shadow-3 rounded-lg login-card">
        <div class="text-h4 text-center q-mb-lg">Login</div>

        <q-input
          v-model="email"
          outlined
          label="Email"
          class="q-mb-md"
          placeholder="example@gmail.com"
        />

        <q-input
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          outlined
          label="Contraseña"
          class="q-mb-lg"
        >
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn
          color="primary"
          unelevated
          class="full-width"
          label="Iniciar Sesión"
          @click="login"
        />
      </q-card>
    </div>
  </div>
</template>

<style>
.login-container {
  width: 100%;
  height: 100vh;
}

/* Panel izquierdo */
.left-panel {
  width: 50%;
  background: #1565c0;
  color: white;
  box-shadow: 10px 0px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center; /* centra verticalmente (porque column) */
  align-items: center; /* centra horizontalmente */
}
.hero-icons {
  margin-top: -5rem; /* más cerca del texto */
}

.left-panel h1 {
  max-width: 420px;
  font-size: 2.4rem;
  line-height: 1.15;
}

.left-panel .row {
  justify-content: space-between;
}

.right-panel {
  width: 50%;
  background: #f4f6fb;
}

.login-card {
  width: 380px;
  border-radius: 20px;
}
</style>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      isPwd: true, // para mostrar/ocultar contraseña
      loading: false,
    }
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.$q.notify({
          type: 'warning',
          message: 'Ingresa tu email y contraseña.',
          position: 'bottom',
        })
        return
      }

      this.loading = true
      try {
        const endpointURL = '/api/auth/login' // ajusta si tu backend usa otro prefijo
        const userData = {
          email: this.email,
          password: this.password,
        }

        const response = await this.$api.post(endpointURL, userData)

        // El backend devuelve AuthResponseDto:
        // { token, email, rol, usuarioId, colaboradorId, nombreCompleto }
        const data = response.data

        // Guarda lo que necesites en localStorage (o Pinia)
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', data.email)
        localStorage.setItem('rol', data.rol)
        localStorage.setItem('usuarioId', data.usuarioId)
        if (data.colaboradorId != null) {
          localStorage.setItem('colaboradorId', data.colaboradorId)
        }
        if (data.nombreCompleto) {
          localStorage.setItem('nombreCompleto', data.nombreCompleto)
        }

        this.$q.notify({
          type: 'positive',
          message: 'Inicio de sesión exitoso.',
          position: 'bottom',
        })

        // Redirigir al layout principal
        this.$router.push('/app/vista-general')
      } catch (error) {
        const msg =
          error.response?.data?.message || 'Credenciales inválidas o error en el servidor.'
        this.$q.notify({
          type: 'negative',
          message: msg,
          position: 'bottom',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
