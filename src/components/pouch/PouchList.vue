<template>
  <div class="pouch-list">
    <div class="list-header">
      <h2>24 Säckchen</h2>
      <p class="subtitle">Fülle die Säckchen mit Inhalten und markiere sie als gepackt</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Lädt Säckchen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="$emit('reload')" class="btn-secondary">
        Erneut versuchen
      </button>
    </div>

    <!-- Säckchen Grid -->
    <div v-else class="pouches-grid">
      <PouchItem
        v-for="pouch in pouches"
        :key="pouch.id"
        :pouch="pouch"
        @update="handleUpdate"
        @toggle="handleToggle"
      />
    </div>

    <!-- Empty State (sollte nie vorkommen, da automatisch 24 erstellt werden) -->
    <div v-if="!loading && !error && pouches.length === 0" class="empty-state">
      <p>Keine Säckchen gefunden</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PouchItem from './PouchItem.vue';
import type { Pouch } from '../../types';

// Props
defineProps<{
  pouches: Pouch[];
  loading: boolean;
  error: string | null;
}>();

// Emits
const emit = defineEmits<{
  update: [pouchId: number, content: string, notes: string, is_packed: boolean];
  toggle: [pouchId: number];
  reload: [];
}>();

// Handlers
function handleUpdate(pouchId: number, content: string, notes: string, is_packed: boolean) {
  emit('update', pouchId, content, notes, is_packed);
}

function handleToggle(pouchId: number) {
  emit('toggle', pouchId);
}
</script>

<style scoped>
.pouch-list {
  width: 100%;
}

.list-header {
  margin-bottom: 2rem;
}

.list-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--color-text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: rgba(255, 0, 0, 0.05);
  border-radius: 8px;
  gap: 1rem;
}

.error-state p {
  color: #d32f2f;
  font-size: 1rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-muted);
}

/* Pouches Grid */
.pouches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

/* Responsive */
/* Mobile: 1 Spalte */
@media (max-width: 640px) {
  .pouches-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .list-header h2 {
    font-size: 1.5rem;
  }
}

/* Tablet: 2 Spalten */
@media (min-width: 641px) and (max-width: 1024px) {
  .pouches-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop klein: 3 Spalten */
@media (min-width: 1025px) and (max-width: 1400px) {
  .pouches-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop groß: 4 Spalten */
@media (min-width: 1401px) {
  .pouches-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Buttons */
.btn-secondary {
  padding: 0.6rem 1.2rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
