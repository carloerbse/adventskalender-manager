<script setup lang="ts">
import LoginForm from '../components/auth/LoginForm.vue'
</script>

<template>
  <div class="login-view">
    <div class="hero-section">
      <h1>🎄 Adventskalender Manager</h1>
      <p>Plane deine handgemachten Adventskalender mit 24 Säckchen</p>
    </div>

    <LoginForm />
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #A60B08 0%, #102E19 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-section {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  color: white;
  font-weight: 800;
}

.hero-section p {
  font-size: 1.1rem;
  opacity: 0.95;
  color: #CFCABF;
  font-weight: 600;
}

@media (max-width: 600px) {
  .hero-section h1 {
    font-size: 1.8rem;
  }

  .hero-section p {
    font-size: 1rem;
  }
}
</style>
