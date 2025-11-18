// src/stores/admin.ts
// Pinia Store für Admin-Bereich (Benutzerverwaltung)

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types';
import { getAllUsers, createUser, deleteUser, updateUserRole } from '../composables/useApi';

export const useAdminStore = defineStore('admin', () => {
  // State
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Lädt alle Benutzer (Admin only)
   */
  async function fetchUsers() {
    loading.value = true;
    error.value = null;

    try {
      const data = await getAllUsers();
      users.value = data.users;
    } catch (err: any) {
      error.value = err.message || 'Fehler beim Laden der Benutzer';
      console.error('Fehler beim Laden der Benutzer:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Erstellt einen neuen Benutzer (Admin only)
   */
  async function addUser(username: string, password: string, role: 'user' | 'admin' = 'user') {
    loading.value = true;
    error.value = null;

    try {
      const data = await createUser(username, password, role);
      
      // Neu erstellten Benutzer zur Liste hinzufügen
      if (data.user) {
        users.value.unshift(data.user);
      }

      return data;
    } catch (err: any) {
      error.value = err.message || 'Fehler beim Erstellen des Benutzers';
      console.error('Fehler beim Erstellen des Benutzers:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Löscht einen Benutzer (Admin only)
   */
  async function removeUser(userId: number) {
    loading.value = true;
    error.value = null;

    try {
      await deleteUser(userId);
      
      // Benutzer aus der Liste entfernen
      users.value = users.value.filter(u => u.id !== userId);
    } catch (err: any) {
      error.value = err.message || 'Fehler beim Löschen des Benutzers';
      console.error('Fehler beim Löschen des Benutzers:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Ändert die Rolle eines Benutzers (Admin only)
   */
  async function changeUserRole(userId: number, newRole: 'user' | 'admin') {
    loading.value = true;
    error.value = null;

    try {
      const data = await updateUserRole(userId, newRole);
      
      // Benutzer in der Liste aktualisieren
      const index = users.value.findIndex(u => u.id === userId);
      if (index !== -1 && data.user) {
        users.value[index] = data.user;
      }

      return data;
    } catch (err: any) {
      error.value = err.message || 'Fehler beim Ändern der Benutzerrolle';
      console.error('Fehler beim Ändern der Benutzerrolle:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Setzt den Store zurück
   */
  function reset() {
    users.value = [];
    loading.value = false;
    error.value = null;
  }

  return {
    // State
    users,
    loading,
    error,
    
    // Actions
    fetchUsers,
    addUser,
    removeUser,
    changeUserRole,
    reset,
  };
});
