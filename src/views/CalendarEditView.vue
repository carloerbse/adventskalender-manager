<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CalendarForm from '../components/calendar/CalendarForm.vue';

const route = useRoute();
const router = useRouter();

// Unterscheiden zwischen "new" und "edit" Mode
const isEditMode = computed(() => route.params.id !== undefined && route.params.id !== 'new');
const calendarId = computed(() => isEditMode.value ? parseInt(route.params.id as string) : undefined);

function handleBack() {
  if (isEditMode.value && calendarId.value) {
    router.push(`/calendar/${calendarId.value}`);
  } else {
    router.push('/dashboard');
  }
}
</script>

<template>
  <div class="calendar-edit-view">
    <div class="edit-container">
      <button @click="handleBack" class="btn-back">
        ← Zurück
      </button>

      <CalendarForm :calendar-id="calendarId" />
    </div>
  </div>
</template>

<style scoped>
.calendar-edit-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.edit-container {
  max-width: 800px;
  margin: 0 auto;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .calendar-edit-view {
    padding: 1rem;
  }
}
</style>
