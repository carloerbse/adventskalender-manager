<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showSuccess = ref(false)

async function handleSubmit() {
  // Passwort-Best ätigung prüfen
  if (password.value !== passwordConfirm.value) {
    authStore.error = 'Passwörter stimmen nicht überein'
    return
  }

  const success = await authStore.register({
    username: username.value,
    password: password.value,
  })

  if (success) {
    showSuccess.value = true
    // Nach 2 Sekunden zum Login weiterleiten
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}
</script>

<template>
  <div class="register-form">
    <h2>📝 Registrieren</h2>

    <div v-if="showSuccess" class="success-message">
      ✅ Registrierung erfolgreich! Du wirst weitergeleitet...
    </div>

    <form v-else @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Benutzername</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Mindestens 3 Zeichen"
          required
          minlength="3"
          :disabled="authStore.isLoading"
        />
      </div>

      <div class="form-group">
        <label for="password">Passwort</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Mindestens 6 Zeichen"
          required
          minlength="6"
          :disabled="authStore.isLoading"
        />
      </div>

      <div class="form-group">
        <label for="password-confirm">Passwort bestätigen</label>
        <input
          id="password-confirm"
          v-model="passwordConfirm"
          type="password"
          placeholder="Passwort wiederholen"
          required
          minlength="6"
          :disabled="authStore.isLoading"
        />
      </div>

      <div v-if="authStore.error" class="error-message">
        ❌ {{ authStore.error }}
      </div>

      <button type="submit" :disabled="authStore.isLoading" class="btn-primary">
        {{ authStore.isLoading ? 'Wird registriert...' : 'Registrieren' }}
      </button>
    </form>

    <p class="form-footer">
      Bereits ein Konto?
      <router-link to="/login">Hier anmelden</router-link>
    </p>
  </div>
</template>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.register-form h2 {
  text-align: center;
  color: #667eea;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.success-message {
  padding: 1rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  color: #155724;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
}

.error-message {
  padding: 0.75rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c00;
  margin-bottom: 1rem;
  text-align: center;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.form-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
