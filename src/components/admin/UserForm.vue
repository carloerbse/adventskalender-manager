<script setup lang="ts">
import { ref } from 'vue';

// Props & Emits
const emit = defineEmits<{
  submit: [data: { username: string; password: string; role: 'user' | 'admin' }];
  cancel: [];
}>();

// Form State
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref<'user' | 'admin'>('user');
const errors = ref<Record<string, string>>({});

/**
 * Validiert das Formular
 */
function validateForm(): boolean {
  errors.value = {};

  if (!username.value.trim()) {
    errors.value.username = 'Benutzername ist erforderlich';
  } else if (username.value.trim().length < 3) {
    errors.value.username = 'Benutzername muss mindestens 3 Zeichen lang sein';
  }

  if (!password.value) {
    errors.value.password = 'Passwort ist erforderlich';
  } else if (password.value.length < 6) {
    errors.value.password = 'Passwort muss mindestens 6 Zeichen lang sein';
  }

  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwörter stimmen nicht überein';
  }

  return Object.keys(errors.value).length === 0;
}

/**
 * Sendet das Formular ab
 */
function handleSubmit() {
  if (!validateForm()) return;

  emit('submit', {
    username: username.value.trim(),
    password: password.value,
    role: role.value,
  });

  // Form zurücksetzen
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
  role.value = 'user';
  errors.value = {};
}

/**
 * Bricht ab
 */
function handleCancel() {
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
  role.value = 'user';
  errors.value = {};
  emit('cancel');
}
</script>

<template>
  <div class="user-form">
    <h3>👤 Neuen Benutzer erstellen</h3>

    <form @submit.prevent="handleSubmit">
      <!-- Benutzername -->
      <div class="form-group">
        <label for="username">Benutzername</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="z.B. maria.mueller"
          maxlength="50"
          :class="{ error: errors.username }"
        />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
      </div>

      <!-- Passwort -->
      <div class="form-group">
        <label for="password">Passwort</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Mindestens 6 Zeichen"
          :class="{ error: errors.password }"
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <!-- Passwort bestätigen -->
      <div class="form-group">
        <label for="confirmPassword">Passwort bestätigen</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="Passwort wiederholen"
          :class="{ error: errors.confirmPassword }"
        />
        <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
      </div>

      <!-- Rolle -->
      <div class="form-group">
        <label for="role">Rolle</label>
        <select id="role" v-model="role">
          <option value="user">Normaler Benutzer</option>
          <option value="admin">Administrator</option>
        </select>
        <small class="help-text">
          Admins können alle Benutzer verwalten
        </small>
      </div>

      <!-- Buttons -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="handleCancel">
          Abbrechen
        </button>
        <button type="submit" class="btn-primary">
          Benutzer erstellen
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.user-form {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.user-form h3 {
  margin: 0 0 1.5rem 0;
  color: var(--color-heading);
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--vt-c-blue-500);
}

.form-group input.error {
  border-color: #ff4444;
}

.error-message {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #ff4444;
}

.help-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #646cff;
  color: white;
}

.btn-primary:hover {
  background: #535bf2;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--color-background-mute);
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-background-soft);
  border-color: var(--color-border-hover);
}
</style>
