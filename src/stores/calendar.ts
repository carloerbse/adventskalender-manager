// src/stores/calendar.ts
// Pinia Store für Kalender-Management

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Calendar } from '../types';
import {
  fetchCalendars,
  fetchCalendar,
  createCalendar as apiCreateCalendar,
  updateCalendar as apiUpdateCalendar,
  deleteCalendar as apiDeleteCalendar,
  shuffleCalendar as apiShuffleCalendar,
} from '../composables/useApi';

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const calendars = ref<Calendar[]>([]);
  const currentCalendar = ref<Calendar | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const calendarCount = computed(() => calendars.value.length);

  // Actions
  /**
   * Lädt alle Kalender des aktuellen Users
   */
  async function loadCalendars() {
    loading.value = true;
    error.value = null;

    try {
      calendars.value = await fetchCalendars();
      console.log(`✅ ${calendars.value.length} Kalender geladen`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('❌ Fehler beim Laden der Kalender:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lädt einen einzelnen Kalender nach ID
   */
  async function loadCalendar(id: number) {
    loading.value = true;
    error.value = null;

    try {
      currentCalendar.value = await fetchCalendar(id);
      console.log(`✅ Kalender ${id} geladen`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('❌ Fehler beim Laden des Kalenders:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Erstellt einen neuen Kalender
   */
  async function createCalendar(name: string, description: string = '') {
    loading.value = true;
    error.value = null;

    try {
      const newCalendar = await apiCreateCalendar(name, description);
      calendars.value.unshift(newCalendar); // Am Anfang der Liste hinzufügen
      console.log(`✅ Kalender "${name}" erstellt`);
      return newCalendar;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('❌ Fehler beim Erstellen des Kalenders:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Aktualisiert einen bestehenden Kalender
   */
  async function updateCalendar(id: number, name: string, description: string = '') {
    loading.value = true;
    error.value = null;

    try {
      const updatedCalendar = await apiUpdateCalendar(id, name, description);
      
      // Kalender in der Liste aktualisieren
      const index = calendars.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        calendars.value[index] = updatedCalendar;
      }

      // Aktuellen Kalender aktualisieren, falls es der gleiche ist
      if (currentCalendar.value?.id === id) {
        currentCalendar.value = updatedCalendar;
      }

      console.log(`✅ Kalender ${id} aktualisiert`);
      return updatedCalendar;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('❌ Fehler beim Aktualisieren des Kalenders:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Löscht einen Kalender
   */
  async function deleteCalendar(id: number) {
    loading.value = true;
    error.value = null;

    try {
      await apiDeleteCalendar(id);
      
      // Kalender aus der Liste entfernen
      calendars.value = calendars.value.filter((c) => c.id !== id);

      // Aktuellen Kalender zurücksetzen, falls es der gelöschte ist
      if (currentCalendar.value?.id === id) {
        currentCalendar.value = null;
      }

      console.log(`✅ Kalender ${id} gelöscht`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('❌ Fehler beim Löschen des Kalenders:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Mischt die Säckchen-Inhalte eines Kalenders zufällig neu
   */
  async function shuffleCalendar(id: number) {
    loading.value = true;
    error.value = null;

    try {
      await apiShuffleCalendar(id);
      
      // Nach dem Mischen den Kalender neu laden, um die aktuellen Daten zu haben
      // Dies stellt sicher, dass die UI die neuen Säckchen-Inhalte anzeigt
      await loadCalendar(id);

      console.log(`🎲 Kalender ${id} gemischt`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('❌ Fehler beim Mischen des Kalenders:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Setzt den Store zurück (z.B. bei Logout)
   */
  function reset() {
    calendars.value = [];
    currentCalendar.value = null;
    loading.value = false;
    error.value = null;
  }

  return {
    // State
    calendars,
    currentCalendar,
    loading,
    error,
    // Computed
    calendarCount,
    // Actions
    loadCalendars,
    loadCalendar,
    createCalendar,
    updateCalendar,
    deleteCalendar,
    shuffleCalendar,
    reset,
  };
});
