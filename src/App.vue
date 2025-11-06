<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Test der Backend-Verbindung
const backendStatus = ref<string>('Prüfe Verbindung...')
const backendData = ref<any>(null)

onMounted(async () => {
  try {
    console.log('🔍 Versuche Backend zu erreichen: http://localhost:8000/api/hello')
    const response = await fetch('http://localhost:8000/api/hello', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    console.log('✅ Response erhalten:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('📦 Daten:', data)
    backendData.value = data
    backendStatus.value = '✅ Backend verbunden'
  } catch (error) {
    backendStatus.value = `❌ Backend nicht erreichbar: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    console.error('❌ Backend-Fehler:', error)
  }
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🎄 Adventskalender-Manager</h1>
      <p class="subtitle">Plane und verwalte deine handgemachten Adventskalender</p>
    </header>

    <main class="app-main">
      <div class="status-card">
        <h2>System-Status</h2>
        <p><strong>Backend:</strong> {{ backendStatus }}</p>
        <div v-if="backendData" class="backend-info">
          <p><strong>Nachricht:</strong> {{ backendData.message }}</p>
          <p><strong>Datenbank:</strong> {{ backendData.database }}</p>
          <p><strong>Zeit:</strong> {{ new Date(backendData.timestamp).toLocaleString('de-DE') }}</p>
        </div>
      </div>

      <div class="info-card">
        <h2>Nächste Schritte</h2>
        <ul>
          <li>✅ Datenbank eingerichtet</li>
          <li>✅ Server läuft</li>
          <li>✅ Frontend-Backend-Kommunikation funktioniert</li>
          <li>⏭️ Vue Router installieren</li>
          <li>⏭️ Authentifizierung implementieren</li>
        </ul>
      </div>
    </main>

    <footer class="app-footer">
      <p>Projekt für DHBW T4 - Carla Erb (ON24-3)</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.status-card,
.info-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-card h2,
.info-card h2 {
  margin-top: 0;
  color: #667eea;
}

.backend-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.backend-info p {
  margin: 0.5rem 0;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.info-card li:last-child {
  border-bottom: none;
}

.app-footer {
  background: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
  margin-top: auto;
}

.app-footer p {
  margin: 0;
}
</style>
