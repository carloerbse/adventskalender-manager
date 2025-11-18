<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCalendarStore } from '../stores/calendar';
import { usePouchStore } from '../stores/pouch';
import { exportCalendar } from '../composables/useApi';
import ProgressBar from '../components/common/ProgressBar.vue';
import PouchList from '../components/pouch/PouchList.vue';

const route = useRoute();
const router = useRouter();
const calendarStore = useCalendarStore();
const pouchStore = usePouchStore();

const calendarId = ref(parseInt(route.params.id as string));
const isShuffling = ref(false);
const showShuffleConfirm = ref(false);
const isExporting = ref(false);

onMounted(async () => {
  try {
    await calendarStore.loadCalendar(calendarId.value);
    await pouchStore.fetchPouches(calendarId.value);
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

async function handleUpdatePouch(pouchId: number, content: string, notes: string, is_packed: boolean) {
  // Aktuelle Scroll-Position speichern
  const scrollPosition = window.scrollY;
  
  try {
    await pouchStore.updatePouch(pouchId, content, notes, is_packed);
    // Kalender neu laden um Fortschritt zu aktualisieren
    await calendarStore.loadCalendar(calendarId.value);
    
    // Scroll-Position wiederherstellen nach dem nächsten DOM-Update
    await new Promise(resolve => setTimeout(resolve, 0));
    window.scrollTo(0, scrollPosition);
  } catch (error) {
    alert('Fehler beim Aktualisieren des Säckchens');
  }
}

async function handleTogglePouch(pouchId: number) {
  // Aktuelle Scroll-Position speichern
  const scrollPosition = window.scrollY;
  
  try {
    await pouchStore.togglePacked(pouchId);
    // Kalender neu laden um Fortschritt zu aktualisieren
    await calendarStore.loadCalendar(calendarId.value);
    
    // Scroll-Position wiederherstellen nach dem nächsten DOM-Update
    await new Promise(resolve => setTimeout(resolve, 0));
    window.scrollTo(0, scrollPosition);
  } catch (error) {
    alert('Fehler beim Umschalten des Status');
  }
}

async function handleReload() {
  try {
    await pouchStore.fetchPouches(calendarId.value);
  } catch (error) {
    console.error('Fehler beim Neuladen:', error);
  }
}

function showShuffleDialog() {
  showShuffleConfirm.value = true;
}

function cancelShuffle() {
  showShuffleConfirm.value = false;
}

async function confirmShuffle() {
  showShuffleConfirm.value = false;
  isShuffling.value = true;

  try {
    await calendarStore.shuffleCalendar(calendarId.value);
    // Säckchen neu laden nach dem Mischen
    await pouchStore.fetchPouches(calendarId.value);
    alert('✅ Die Säckchen wurden erfolgreich gemischt!');
  } catch (error) {
    alert('❌ Fehler beim Mischen der Säckchen');
  } finally {
    isShuffling.value = false;
  }
}

// Export-Funktionen
async function handleExportJSON() {
  isExporting.value = true;
  try {
    await exportCalendar(calendarId.value, 'json');
    // Erfolg - Download wird automatisch gestartet
  } catch (error) {
    alert('❌ Fehler beim Exportieren als JSON');
  } finally {
    isExporting.value = false;
  }
}

async function handleExportCSV() {
  isExporting.value = true;
  try {
    await exportCalendar(calendarId.value, 'csv');
    // Erfolg - Download wird automatisch gestartet
  } catch (error) {
    alert('❌ Fehler beim Exportieren als CSV');
  } finally {
    isExporting.value = false;
  }
}

// Fortschritt berechnen
const progress = computed(() => pouchStore.getProgress());
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
          <button @click="showShuffleDialog" class="btn btn-shuffle" :disabled="isShuffling">
            {{ isShuffling ? '🔄 Wird gemischt...' : '🎲 Mischen' }}
          </button>
          <button @click="handleExportJSON" class="btn btn-export" :disabled="isExporting">
            {{ isExporting ? '⏳ Exportiere...' : '📥 JSON' }}
          </button>
          <button @click="handleExportCSV" class="btn btn-export" :disabled="isExporting">
            {{ isExporting ? '⏳ Exportiere...' : '📊 CSV' }}
          </button>
          <button @click="handleEdit" class="btn btn-secondary">
            ✏️ Bearbeiten
          </button>
          <button @click="handleDelete" class="btn btn-danger">
            🗑️ Löschen
          </button>
        </div>
      </div>

      <!-- Shuffle Confirmation Dialog -->
      <div v-if="showShuffleConfirm" class="modal-overlay" @click="cancelShuffle">
        <div class="modal-content" @click.stop>
          <h2>🎲 Säckchen mischen?</h2>
          <p>
            Möchtest du die Inhalte aller 24 Säckchen wirklich zufällig neu verteilen?
          </p>
          <p class="warning">
            ⚠️ Diese Aktion kann nicht rückgängig gemacht werden!
          </p>
          <div class="modal-actions">
            <button @click="cancelShuffle" class="btn btn-secondary">
              Abbrechen
            </button>
            <button @click="confirmShuffle" class="btn btn-primary">
              Ja, mischen!
            </button>
          </div>
        </div>
      </div>

      <!-- Calendar Info -->
      <div class="calendar-info">
        <h1>{{ calendarStore.currentCalendar.name }}</h1>
        <p class="description">{{ calendarStore.currentCalendar.description || 'Keine Beschreibung' }}</p>

        <!-- Info Box -->
        <div class="info-box">
          <p><strong>Erstellt:</strong> {{ new Date(calendarStore.currentCalendar.created_at).toLocaleDateString('de-DE') }}</p>
          <p><strong>ID:</strong> #{{ calendarStore.currentCalendar.id }}</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <ProgressBar
        :packed="progress.packed"
        :total="progress.total"
      />

      <!-- Pouches Section -->
      <div class="pouches-section">
        <PouchList
          :pouches="pouchStore.pouches"
          :loading="pouchStore.loading"
          :error="pouchStore.error"
          @update="handleUpdatePouch"
          @toggle="handleTogglePouch"
          @reload="handleReload"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-detail {
  min-height: 100vh;
  background: var(--background);
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
  color: #A60B08;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.calendar-content {
  max-width: 1400px;
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
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  transition: all 0.2s;
}

.btn-back:hover {
  background: var(--surface-hover);
  border-color: var(--christmas-green);
}

.calendar-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn-secondary {
  background: #76584C;
  color: white;
  border-color: #76584C;
}

.btn-secondary:hover {
  background: #5d4439;
}

.btn-danger {
  background: #A60B08;
  color: white;
  border-color: #A60B08;
}

.btn-danger:hover {
  background: #5E0D01;
}

.btn-shuffle {
  background: #76584C;
  color: white;
  border-color: #76584C;
}

.btn-shuffle:hover:not(:disabled) {
  background: #5d4439;
}

.btn-shuffle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-export {
  background: #102E19;
  color: white;
  border-color: #102E19;
}

.btn-export:hover:not(:disabled) {
  background: #1a4525;
}

.btn-export:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #102E19;
  color: white;
  border-color: #102E19;
}

.btn-primary:hover {
  background: #1a4525;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;
}

.modal-content {
  background: var(--background);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  animation: slideUp 0.3s ease-out;
  border: 3px solid var(--border);
}

.modal-content h2 {
  margin: 0 0 1rem 0;
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 800;
}

.modal-content p {
  margin: 1rem 0;
  color: var(--text);
  line-height: 1.6;
  font-weight: 500;
}

.modal-content .warning {
  color: #A60B08;
  font-weight: 600;
  background: #fee;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid #A60B08;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.modal-actions .btn {
  min-width: 120px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.calendar-info {
  background: var(--surface);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border: 2px solid var(--border);
}

.calendar-info h1 {
  margin: 0 0 1rem 0;
  color: #A60B08;
  font-weight: 800;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.05rem;
  line-height: 1.6;
  font-weight: 500;
}

.info-box {
  padding-top: 1.5rem;
  border-top: 2px solid var(--border);
}

.info-box p {
  margin: 0.5rem 0;
  color: var(--text);
  font-weight: 600;
}

.pouches-section {
  background: var(--surface);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--border);
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
