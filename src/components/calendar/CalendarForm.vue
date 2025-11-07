<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCalendarStore } from '../../stores/calendar';

// Props
const props = defineProps<{
  calendarId?: number;
}>();

const router = useRouter();
const calendarStore = useCalendarStore();

// Form State
const name = ref('');
const description = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

// Validation
const nameError = ref<string | null>(null);

// Beim Mounten: Kalender laden falls Edit-Modus
onMounted(async () => {
  if (props.calendarId) {
    try {
      await calendarStore.loadCalendar(props.calendarId);
      if (calendarStore.currentCalendar) {
        name.value = calendarStore.currentCalendar.name;
        description.value = calendarStore.currentCalendar.description;
      }
    } catch (err) {
      error.value = 'Kalender konnte nicht geladen werden';
    }
  }
});

// Validierung
function validateForm(): boolean {
  nameError.value = null;

  if (!name.value.trim()) {
    nameError.value = 'Name ist erforderlich';
    return false;
  }

  if (name.value.length > 100) {
    nameError.value = 'Name darf maximal 100 Zeichen lang sein';
    return false;
  }

  if (description.value.length > 500) {
    error.value = 'Beschreibung darf maximal 500 Zeichen lang sein';
    return false;
  }

  return true;
}

// Submit-Handler
async function handleSubmit() {
  if (!validateForm()) return;

  loading.value = true;
  error.value = null;

  try {
    if (props.calendarId) {
      // Update
      await calendarStore.updateCalendar(props.calendarId, name.value.trim(), description.value.trim());
      router.push(`/calendar/${props.calendarId}`);
    } else {
      // Create
      const newCalendar = await calendarStore.createCalendar(name.value.trim(), description.value.trim());
      router.push(`/calendar/${newCalendar.id}`);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
  } finally {
    loading.value = false;
  }
}

// Cancel-Handler
function handleCancel() {
  if (props.calendarId) {
    router.push(`/calendar/${props.calendarId}`);
  } else {
    router.push('/dashboard');
  }
}
</script>

<template>
  <div class="calendar-form-container">
    <h2>{{ calendarId ? 'Kalender bearbeiten' : 'Neuer Kalender' }}</h2>

    <form @submit.prevent="handleSubmit" class="calendar-form">
      <!-- Fehler-Anzeige -->
      <div v-if="error" class="error-message">
        ❌ {{ error }}
      </div>

      <!-- Name -->
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="z.B. Weihnachten 2025"
          maxlength="100"
          required
          :disabled="loading"
          :class="{ 'input-error': nameError }"
        />
        <span v-if="nameError" class="field-error">{{ nameError }}</span>
        <small>{{ name.length }}/100 Zeichen</small>
      </div>

      <!-- Beschreibung -->
      <div class="form-group">
        <label for="description">Beschreibung</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="Optionale Beschreibung des Kalenders..."
          rows="4"
          maxlength="500"
          :disabled="loading"
        ></textarea>
        <small>{{ description.length }}/500 Zeichen</small>
      </div>

      <!-- Buttons -->
      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary" :disabled="loading">
          Abbrechen
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? '⏳ Speichert...' : (calendarId ? 'Speichern' : 'Erstellen') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.calendar-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.calendar-form-container h2 {
  margin-bottom: 2rem;
  color: var(--text-color);
}

.calendar-form {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 2rem;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #c62828;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.input-error {
  border-color: #c62828 !important;
}

.field-error {
  display: block;
  color: #c62828;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-group small {
  display: block;
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--hover-bg);
}

.btn-primary {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.btn-primary:hover:not(:disabled) {
  background: #1976d2;
  border-color: #1976d2;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-form-container {
    padding: 1rem;
  }

  .calendar-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
