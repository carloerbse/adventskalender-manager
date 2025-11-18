<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAdminStore } from '../stores/admin';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import UserForm from '../components/admin/UserForm.vue';
import UserList from '../components/admin/UserList.vue';

const adminStore = useAdminStore();
const authStore = useAuthStore();
const router = useRouter();

const showCreateForm = ref(false);
const successMessage = ref<string | null>(null);

/**
 * Lädt alle Benutzer beim Mounting
 */
onMounted(async () => {
  // Prüfen ob User wirklich Admin ist
  if (!authStore.user || authStore.user.role !== 'admin') {
    alert('Sie haben keine Berechtigung für diesen Bereich.');
    router.push('/dashboard');
    return;
  }

  await adminStore.fetchUsers();
});

/**
 * Erstellt einen neuen Benutzer
 */
async function handleCreateUser(data: { username: string; password: string; role: 'user' | 'admin' }) {
  try {
    await adminStore.addUser(data.username, data.password, data.role);
    showCreateForm.value = false;
    
    successMessage.value = `Benutzer "${data.username}" erfolgreich erstellt!`;
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Fehler beim Erstellen des Benutzers');
  }
}

/**
 * Löscht einen Benutzer
 */
async function handleDeleteUser(userId: number) {
  try {
    await adminStore.removeUser(userId);
    
    successMessage.value = 'Benutzer erfolgreich gelöscht!';
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Fehler beim Löschen des Benutzers');
  }
}

/**
 * Ändert die Rolle eines Benutzers
 */
async function handleChangeRole(userId: number, newRole: 'user' | 'admin') {
  try {
    await adminStore.changeUserRole(userId, newRole);
    
    successMessage.value = 'Benutzerrolle erfolgreich geändert!';
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Fehler beim Ändern der Benutzerrolle');
  }
}
</script>

<template>
  <div class="admin-dashboard">
    <div class="container">
      <header class="page-header">
        <h1>👑 Admin-Dashboard</h1>
        <p class="subtitle">Benutzerverwaltung für Administratoren</p>
      </header>

      <!-- Success Message -->
      <div v-if="successMessage" class="alert alert-success">
        ✅ {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="adminStore.error" class="alert alert-error">
        ❌ {{ adminStore.error }}
      </div>

      <!-- Create User Button/Form -->
      <div class="create-section">
        <button
          v-if="!showCreateForm"
          class="btn-create"
          @click="showCreateForm = true"
        >
          ➕ Neuen Benutzer erstellen
        </button>

        <UserForm
          v-if="showCreateForm"
          @submit="handleCreateUser"
          @cancel="showCreateForm = false"
        />
      </div>

      <!-- User List -->
      <UserList
        :users="adminStore.users"
        :loading="adminStore.loading"
        @delete-user="handleDeleteUser"
        @change-role="handleChangeRole"
      />

      <!-- Back Button -->
      <div class="back-section">
        <router-link to="/dashboard" class="btn-back">
          ← Zurück zum Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: var(--background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--text);
  font-weight: 800;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  color: var(--text);
  font-size: 1.125rem;
  font-weight: 500;
}

.alert {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease-out;
}

.alert-success {
  background: rgba(16, 46, 25, 0.1);
  border: 2px solid #102E19;
  color: #102E19;
}

.alert-error {
  background: rgba(166, 11, 8, 0.1);
  border: 2px solid #A60B08;
  color: #A60B08;
}

.create-section {
  margin-bottom: 2rem;
}

.btn-create {
  padding: 0.875rem 1.75rem;
  background: #A60B08;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-create:hover {
  background: #5E0D01;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(166, 11, 8, 0.3);
}

.back-section {
  margin-top: 2rem;
  text-align: center;
}

.btn-back {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  color: var(--text);
  border: 2px solid var(--border);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-back:hover {
  background: var(--surface-hover);
  border-color: var(--christmas-green);
  transform: translateY(-1px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem 0.5rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
