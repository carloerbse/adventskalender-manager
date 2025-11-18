<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '../../types';
import { useAuthStore } from '../../stores/auth';

// Props
const props = defineProps<{
  users: User[];
  loading: boolean;
}>();

// Emits
const emit = defineEmits<{
  deleteUser: [userId: number];
  changeRole: [userId: number, newRole: 'user' | 'admin'];
}>();

// Auth Store (um den aktuellen User zu kennen)
const authStore = useAuthStore();

/**
 * Formatiert Datum für Anzeige
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Bestätigung vor dem Löschen
 */
function handleDelete(user: User) {
  if (confirm(`Benutzer "${user.username}" wirklich löschen?\n\nAlle Kalender dieses Benutzers werden ebenfalls gelöscht!`)) {
    emit('deleteUser', user.id);
  }
}

/**
 * Rolle ändern
 */
function handleRoleChange(user: User) {
  const newRole = user.role === 'admin' ? 'user' : 'admin';
  const roleText = newRole === 'admin' ? 'zum Administrator' : 'zum normalen Benutzer';
  
  if (confirm(`"${user.username}" wirklich ${roleText} machen?`)) {
    emit('changeRole', user.id, newRole);
  }
}

/**
 * Prüft ob User der aktuelle User ist (darf sich nicht selbst löschen)
 */
function isCurrentUser(userId: number): boolean {
  return authStore.user?.id === userId;
}
</script>

<template>
  <div class="user-list">
    <h3>📋 Alle Benutzer</h3>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>⏳ Lade Benutzer...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="empty">
      <p>👥 Noch keine Benutzer vorhanden</p>
    </div>

    <!-- User Table -->
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Benutzername</th>
            <th>Rolle</th>
            <th>Kalender</th>
            <th>Erstellt am</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :class="{ 'current-user': isCurrentUser(user.id) }">
            <td>{{ user.id }}</td>
            <td>
              <strong>{{ user.username }}</strong>
              <span v-if="isCurrentUser(user.id)" class="badge-current">Sie</span>
            </td>
            <td>
              <span class="badge" :class="user.role === 'admin' ? 'badge-admin' : 'badge-user'">
                {{ user.role === 'admin' ? '👑 Admin' : '👤 User' }}
              </span>
            </td>
            <td>{{ user.calendar_count || 0 }}</td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td class="actions">
              <!-- Rolle ändern -->
              <button
                v-if="!isCurrentUser(user.id)"
                class="btn-icon"
                :title="user.role === 'admin' ? 'Zu User machen' : 'Zu Admin machen'"
                @click="handleRoleChange(user)"
              >
                {{ user.role === 'admin' ? '👤' : '👑' }}
              </button>

              <!-- Löschen -->
              <button
                v-if="!isCurrentUser(user.id)"
                class="btn-icon btn-delete"
                title="Benutzer löschen"
                @click="handleDelete(user)"
              >
                🗑️
              </button>

              <span v-if="isCurrentUser(user.id)" class="text-muted">
                (Sie selbst)
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.user-list {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
}

.user-list h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text);
  font-size: 1.25rem;
  font-weight: 700;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--background);
}

th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 700;
  color: var(--text);
  border-bottom: 2px solid var(--border);
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  font-weight: 500;
}

tbody tr {
  transition: background 0.2s;
}

tbody tr:hover {
  background: var(--background);
}

tbody tr.current-user {
  background: var(--surface-hover);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-admin {
  background: rgba(166, 11, 8, 0.15);
  color: #A60B08;
}

.badge-user {
  background: rgba(16, 46, 25, 0.15);
  color: #102E19;
}

.badge-current {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.125rem 0.5rem;
  background: rgba(118, 88, 76, 0.2);
  color: #76584C;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-icon {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: var(--color-background-mute);
  cursor: pointer;
  font-size: 1.125rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--color-background);
  transform: scale(1.1);
}

.btn-delete:hover {
  background: rgba(166, 11, 8, 0.15);
}

.text-muted {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .table-container {
    font-size: 0.875rem;
  }

  th,
  td {
    padding: 0.5rem;
  }

  .btn-icon {
    padding: 0.375rem 0.5rem;
    font-size: 1rem;
  }
}
</style>
