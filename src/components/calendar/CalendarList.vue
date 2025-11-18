<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCalendarStore } from '../../stores/calendar';
import CalendarCard from './CalendarCard.vue';

const router = useRouter();
const calendarStore = useCalendarStore();

// Beim Mounten Kalender laden
onMounted(async () => {
  try {
    await calendarStore.loadCalendars();
  } catch (error) {
    console.error('Fehler beim Laden der Kalender:', error);
  }
});

// Event-Handler
function handleCreateNew() {
  router.push('/calendar/new');
}

function handleOpenCalendar(id: number) {
  router.push(`/calendar/${id}`);
}

function handleEditCalendar(id: number) {
  router.push(`/calendar/${id}/edit`);
}

async function handleDeleteCalendar(id: number) {
  try {
    await calendarStore.deleteCalendar(id);
  } catch (error) {
    alert(`Fehler beim Löschen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}
</script>

<template>
  <div class="calendar-list">
    <div class="list-header">
      <h2>Meine Kalender</h2>
      <button @click="handleCreateNew" class="btn btn-primary">
        ➕ Neuer Kalender
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="calendarStore.loading" class="loading">
      <p>⏳ Lade Kalender...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="calendarStore.error" class="error">
      <p>❌ {{ calendarStore.error }}</p>
      <button @click="calendarStore.loadCalendars()" class="btn">Erneut versuchen</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="calendarStore.calendars.length === 0" class="empty-state">
      <p class="empty-icon">📅</p>
      <h3>Noch keine Kalender vorhanden</h3>
      <p>Erstelle deinen ersten Adventskalender und beginne mit der Planung!</p>
      <button @click="handleCreateNew" class="btn btn-primary">
        ➕ Ersten Kalender erstellen
      </button>
    </div>

    <!-- Calendar Grid -->
    <div v-else class="calendar-grid">
      <CalendarCard
        v-for="calendar in calendarStore.calendars"
        :key="calendar.id"
        :calendar="calendar"
        @open="handleOpenCalendar"
        @edit="handleEditCalendar"
        @delete="handleDeleteCalendar"
      />
    </div>
  </div>
</template>

<style scoped>
.calendar-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.list-header h2 {
  margin: 0;
  color: var(--text);
  font-weight: 700;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:hover {
  background: var(--surface-hover);
  transform: translateY(-1px);
  border-color: var(--christmas-green);
}

.btn-primary {
  background: #A60B08;
  color: white;
  border-color: #A60B08;
}

.btn-primary:hover {
  background: #5E0D01;
  border-color: #5E0D01;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
}

.error p {
  color: #A60B08;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text);
  margin-bottom: 1rem;
  font-weight: 700;
}

.empty-state p {
  color: var(--text);
  margin-bottom: 2rem;
  font-weight: 500;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-list {
    padding: 1rem;
  }

  .list-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .calendar-grid {
    grid-template-columns: 1fr;
  }
}
</style>
