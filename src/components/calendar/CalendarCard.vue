<script setup lang="ts">
import { computed } from 'vue';
import type { Calendar } from '../../types';

// Props
const props = defineProps<{
  calendar: Calendar;
}>();

// Events
const emit = defineEmits<{
  delete: [id: number];
  edit: [id: number];
  open: [id: number];
}>();

// Computed
const progressPercentage = computed(() => {
  if (props.calendar.total_pouches === 0) return 0;
  return Math.round((props.calendar.packed_count / props.calendar.total_pouches) * 100);
});

const progressColor = computed(() => {
  const percentage = progressPercentage.value;
  if (percentage === 100) return '#102E19'; // Weihnachtsgrün
  if (percentage >= 50) return '#A60B08'; // Weihnachtsrot
  return '#76584C'; // Braun
});

// Methoden
function handleDelete() {
  if (confirm(`Möchtest du den Kalender "${props.calendar.name}" wirklich löschen?`)) {
    emit('delete', props.calendar.id);
  }
}
</script>

<template>
  <div class="calendar-card" @click="emit('open', calendar.id)">
    <div class="calendar-header">
      <h3>{{ calendar.name }}</h3>
      <div class="calendar-actions" @click.stop>
        <button @click="emit('open', calendar.id)" class="btn-icon" title="Öffnen">
          📖
        </button>
        <button @click="emit('edit', calendar.id)" class="btn-icon" title="Bearbeiten">
          ✏️
        </button>
        <button @click="handleDelete" class="btn-icon btn-danger" title="Löschen">
          🗑️
        </button>
      </div>
    </div>

    <p class="calendar-description">{{ calendar.description || 'Keine Beschreibung' }}</p>

    <div class="calendar-progress">
      <div class="progress-info">
        <span>Fortschritt:</span>
        <strong>{{ calendar.packed_count }}/{{ calendar.total_pouches }} gepackt</strong>
        <span class="progress-percentage">({{ progressPercentage }}%)</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progressPercentage}%`, backgroundColor: progressColor }"
        ></div>
      </div>
    </div>

    <div class="calendar-footer">
      <small>Erstellt: {{ new Date(calendar.created_at).toLocaleDateString('de-DE') }}</small>
    </div>
  </div>
</template>

<style scoped>
.calendar-card {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.calendar-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #A60B08;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 700;
}

.calendar-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--hover-bg);
  transform: scale(1.1);
}

.btn-danger:hover {
  background: #A60B08;
  border-color: #A60B08;
}

.calendar-description {
  color: var(--text);
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.4;
  font-weight: 500;
}

.calendar-progress {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.progress-percentage {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--progress-bg);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.calendar-footer {
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.calendar-footer small {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* CSS-Variablen für Theming */
:root {
  --card-bg: var(--surface);
  --border-color: var(--border);
  --text-color: var(--text);
  --text-secondary: var(--text-secondary);
  --hover-bg: var(--surface-hover);
  --progress-bg: #e0dbd5;
}
</style>
