<template>
  <div class="page-shell">
    <n-card class="card-panel hero-card" bordered>
      <div class="hero-top">
        <div>
          <p class="eyebrow">Secure workspace</p>
          <h2 class="page-title">Welcome to PMS</h2>
          <p class="page-subtitle">Manage credentials with a calmer, clearer experience.</p>
        </div>
      </div>

      <n-alert class="warning-block" type="warning" title="Security notice">
        Not for official use, not for money, no responsibility for potential risks.
      </n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NCard } from 'naive-ui';
</script>

<style scoped>
.hero-card {
  padding: 24px;
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.warning-block {
  margin-top: 8px;
}

@media (max-width: 700px) {
  .hero-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
