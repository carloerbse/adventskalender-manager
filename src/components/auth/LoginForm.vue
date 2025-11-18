<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

async function handleSubmit() {
  const success = await authStore.login({
    username: username.value,
    password: password.value,
  })

  if (success) {
    // Weiterleitung zum Dashboard
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="login-form">
    <h2>🔐 Anmelden</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Benutzername</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Benutzername"
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
          placeholder="Passwort"
          required
          minlength="6"
          :disabled="authStore.isLoading"
        />
      </div>

      <div v-if="authStore.error" class="error-message">
        ❌ {{ authStore.error }}
      </div>

      <button type="submit" :disabled="authStore.isLoading" class="btn-primary">
        {{ authStore.isLoading ? 'Wird angemeldet...' : 'Anmelden' }}
      </button>
    </form>

    <p class="form-footer">
      Noch kein Konto?
      <router-link to="/register">Hier registrieren</router-link>
    </p>
  </div>
</template>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  text-align: center;
  color: #A60B08;
  margin-bottom: 1.5rem;
  font-weight: 800;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: var(--text);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  background: white;
  font-weight: 500;
  color: var(--text);
}

.form-group input:focus {
  outline: none;
  border-color: #A60B08;
}

.form-group input:disabled {
  background: #CFCABF;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background: #fee;
  border: 1px solid #A60B08;
  border-radius: 4px;
  color: #5E0D01;
  margin-bottom: 1rem;
  text-align: center;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #A60B08 0%, #5E0D01 100%);
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
  background: linear-gradient(135deg, #5E0D01 0%, #A60B08 100%);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #76584C;
}

.form-footer a {
  color: #102E19;
  text-decoration: none;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
  color: #0a1f11;
}
</style>
