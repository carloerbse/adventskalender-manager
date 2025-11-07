// src/stores/pouch.ts
// Pinia Store für Säckchen-Verwaltung

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Pouch } from '../types';

const API_BASE = 'http://localhost:8000/api';

export const usePouchStore = defineStore('pouch', () => {
  // State
  const pouches = ref<Pouch[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Lädt alle 24 Säckchen eines Kalenders
   */
  async function fetchPouches(calendarId: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE}/calendars/${calendarId}/pouches`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Laden der Säckchen');
      }

      const data = await response.json();
      pouches.value = data.pouches || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('Fehler beim Laden der Säckchen:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Aktualisiert ein Säckchen
   */
  async function updatePouch(
    pouchId: number,
    content: string,
    notes: string,
    is_packed: boolean
  ): Promise<Pouch> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE}/pouches/${pouchId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          notes,
          is_packed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Aktualisieren des Säckchens');
      }

      const data = await response.json();
      const updatedPouch = data.pouch;

      // Lokales Array aktualisieren
      const index = pouches.value.findIndex((p) => p.id === pouchId);
      if (index !== -1) {
        pouches.value[index] = updatedPouch;
      }

      return updatedPouch;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('Fehler beim Aktualisieren des Säckchens:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Schaltet den is_packed Status eines Säckchens um
   */
  async function togglePacked(pouchId: number): Promise<Pouch> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE}/pouches/${pouchId}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Umschalten des Status');
      }

      const data = await response.json();
      const updatedPouch = data.pouch;

      // Lokales Array aktualisieren
      const index = pouches.value.findIndex((p) => p.id === pouchId);
      if (index !== -1) {
        pouches.value[index] = updatedPouch;
      }

      return updatedPouch;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('Fehler beim Umschalten des Status:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Berechnet den Fortschritt (gepackte Säckchen)
   */
  function getProgress(): { total: number; packed: number; percentage: number } {
    const total = pouches.value.length;
    const packed = pouches.value.filter((p) => p.is_packed).length;
    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;

    return { total, packed, percentage };
  }

  /**
   * Setzt den Store zurück
   */
  function $reset() {
    pouches.value = [];
    loading.value = false;
    error.value = null;
  }

  return {
    // State
    pouches,
    loading,
    error,

    // Actions
    fetchPouches,
    updatePouch,
    togglePacked,
    getProgress,
    $reset,
  };
});
