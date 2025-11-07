<template>
  <div class="progress-bar-container">
    <div class="progress-header">
      <div class="progress-info">
        <span class="progress-label">Fortschritt</span>
        <span class="progress-count">{{ packed }} / {{ total }}</span>
      </div>
      <span class="progress-percentage">{{ percentage }}%</span>
    </div>

    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: percentage + '%' }"
        :class="progressClass"
      ></div>
    </div>

    <p class="progress-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props
const props = defineProps<{
  packed: number;
  total: number;
}>();

// Computed
const percentage = computed(() => {
  if (props.total === 0) return 0;
  return Math.round((props.packed / props.total) * 100);
});

const progressClass = computed(() => {
  const percent = percentage.value;
  if (percent === 100) return 'complete';
  if (percent >= 75) return 'high';
  if (percent >= 50) return 'medium';
  if (percent >= 25) return 'low';
  return 'start';
});

const message = computed(() => {
  const percent = percentage.value;
  if (percent === 100) return '🎉 Alle Säckchen gepackt!';
  if (percent >= 75) return '💪 Fast geschafft!';
  if (percent >= 50) return '👍 Guter Fortschritt!';
  if (percent >= 25) return '🚀 Weiter so!';
  if (percent > 0) return '📦 Los geht\'s!';
  return '🎯 Beginne mit dem ersten Säckchen!';
});
</script>

<style scoped>
.progress-bar-container {
  background-color: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.progress-count {
  font-size: 1.1rem;
  font-weight: 700;
  color: #42b983;
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: #42b983;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 24px;
  background-color: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  margin-bottom: 0.8rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.5s ease, background 0.3s ease;
  position: relative;
}

/* Progress Colors */
.progress-fill.start {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

.progress-fill.low {
  background: linear-gradient(90deg, #ffa500 0%, #ff6b6b 100%);
}

.progress-fill.medium {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.progress-fill.high {
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
}

.progress-fill.complete {
  background: linear-gradient(90deg, #42b983 0%, #2d8659 100%);
}

/* Progress Message */
.progress-message {
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-muted);
  margin: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .progress-bar-container {
    padding: 1.2rem;
  }

  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .progress-percentage {
    font-size: 1.2rem;
  }

  .progress-bar {
    height: 20px;
  }
}
</style>
