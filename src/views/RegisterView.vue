<script setup lang="ts">
import RegisterForm from '../components/auth/RegisterForm.vue'
</script>

<template>
  <div class="register-view">
    <div class="hero-section">
      <h1>🎄 Adventskalender Manager</h1>
      <p>Erstelle dein Konto und starte mit der Planung</p>
    </div>

    <RegisterForm />
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-section p {
  font-size: 1.1rem;
  opacity: 0.9;
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
