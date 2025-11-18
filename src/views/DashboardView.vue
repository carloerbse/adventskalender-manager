<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import CalendarList from '../components/calendar/CalendarList.vue'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>🎄 Adventskalender-Manager</h1>
      <div class="user-info">
        <span>👤 {{ authStore.user?.username }}</span>
        <router-link 
          v-if="authStore.isAdmin" 
          to="/admin" 
          class="btn-admin"
        >
          👑 Admin
        </router-link>
        <button @click="handleLogout" class="btn-logout">Abmelden</button>
      </div>
    </header>

    <main class="dashboard-content">
      <div class="welcome-section">
        <h2>Willkommen zurück, {{ authStore.user?.username }}! 🎅</h2>
        <p>Verwalte deine Adventskalender und behalte den Überblick über alle 24 Säckchen.</p>
      </div>

      <!-- Kalender-Liste -->
      <CalendarList />
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info span {
  font-weight: 500;
}

.btn-admin {
  padding: 0.5rem 1rem;
  background: rgba(255, 193, 7, 0.2);
  border: 2px solid #ffc107;
  color: #ffc107;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-admin:hover {
  background: rgba(255, 193, 7, 0.3);
  transform: translateY(-1px);
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-section h2 {
  color: #213547;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #666;
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .user-info {
    flex-direction: column;
  }
}
</style>
