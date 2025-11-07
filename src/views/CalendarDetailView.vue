<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCalendarStore } from '../stores/calendar';

const route = useRoute();
const router = useRouter();
const calendarStore = useCalendarStore();

const calendarId = ref(parseInt(route.params.id as string));

onMounted(async () => {
  try {
    await calendarStore.loadCalendar(calendarId.value);
  } catch (error) {
    console.error('Fehler beim Laden des Kalenders:', error);
  }
});

function handleBack() {
  router.push('/dashboard');
}

function handleEdit() {
  router.push(`/calendar/${calendarId.value}/edit`);
}

async function handleDelete() {
  if (confirm(`Möchtest du den Kalender "${calendarStore.currentCalendar?.name}" wirklich löschen?`)) {
    try {
      await calendarStore.deleteCalendar(calendarId.value);
      router.push('/dashboard');
    } catch (error) {
      alert('Fehler beim Löschen des Kalenders');
    }
  }
}
</script>

<template>
  <div class="calendar-detail">
    <!-- Loading -->
    <div v-if="calendarStore.loading" class="loading">
      <p>⏳ Lade Kalender...</p>
    </div>

    <!-- Error -->
    <div v-else-if="calendarStore.error || !calendarStore.currentCalendar" class="error">
      <p>❌ Kalender nicht gefunden</p>
      <button @click="handleBack" class="btn">Zurück zum Dashboard</button>
    </div>

    <!-- Calendar Content -->
    <div v-else class="calendar-content">
      <!-- Header -->
      <div class="calendar-header">
        <button @click="handleBack" class="btn-back">
          ← Zurück
        </button>
        <div class="calendar-actions">
          <button @click="handleEdit" class="btn btn-secondary">
            ✏️ Bearbeiten
          </button>
          <button @click="handleDelete" class="btn btn-danger">
            🗑️ Löschen
          </button>
        </div>
      </div>

      <!-- Calendar Info -->
      <div class="calendar-info">
        <h1>{{ calendarStore.currentCalendar.name }}</h1>
        <p class="description">{{ calendarStore.currentCalendar.description || 'Keine Beschreibung' }}</p>
        
        <!-- Progress -->
        <div class="progress-section">
          <h3>Fortschritt</h3>
          <div class="progress-display">
            <span class="progress-text">
              {{ calendarStore.currentCalendar.packed_count }} / {{ calendarStore.currentCalendar.total_pouches }} Säckchen gepackt
            </span>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ 
                  width: `${(calendarStore.currentCalendar.packed_count / calendarStore.currentCalendar.total_pouches) * 100}%`
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="info-box">
          <p><strong>Erstellt:</strong> {{ new Date(calendarStore.currentCalendar.created_at).toLocaleDateString('de-DE') }}</p>
          <p><strong>ID:</strong> #{{ calendarStore.currentCalendar.id }}</p>
        </div>
      </div>

      <!-- Pouches Section (Placeholder for Phase 4) -->
      <div class="pouches-section">
        <h2>24 Säckchen</h2>
        <div class="placeholder">
          <p>🎁 Die Säckchen-Verwaltung wird in Phase 4 implementiert.</p>
          <p class="hint">Hier kannst du bald die Inhalte der 24 Säckchen verwalten.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  max-width: 600px;
  margin: 0 auto;
}

.error p {
  color: #ff5252;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.calendar-content {
  max-width: 1000px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f5f5f5;
}

.calendar-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-secondary {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.btn-secondary:hover {
  background: #1976d2;
}

.btn-danger {
  background: #ff5252;
  color: white;
  border-color: #ff5252;
}

.btn-danger:hover {
  background: #d32f2f;
}

.calendar-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.calendar-info h1 {
  margin: 0 0 1rem 0;
  color: #213547;
}

.description {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.05rem;
  line-height: 1.6;
}

.progress-section {
  margin-bottom: 2rem;
}

.progress-section h3 {
  margin-bottom: 1rem;
  color: #213547;
}

.progress-display {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 6px;
}

.progress-text {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #213547;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
  border-radius: 6px;
}

.info-box {
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.info-box p {
  margin: 0.5rem 0;
  color: #666;
}

.pouches-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pouches-section h2 {
  margin: 0 0 1.5rem 0;
  color: #213547;
}

.placeholder {
  text-align: center;
  padding: 3rem;
  background: #f5f5f5;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.placeholder p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.hint {
  color: #999;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .calendar-detail {
    padding: 1rem;
  }

  .calendar-header {
    flex-direction: column;
    gap: 1rem;
  }

  .calendar-actions {
    width: 100%;
  }

  .btn {
    flex: 1;
  }
}
</style>
