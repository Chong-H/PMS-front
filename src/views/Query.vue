<template>
  <div class="page-shell">
    <n-card class="card-panel query-card" bordered>
      <div class="query-header">
        <div>
          <p class="eyebrow">Query</p>
          <h2 class="page-title">PMS Query Page</h2>
          <p class="page-subtitle">Search accounts by website or app name.</p>
        </div>
      </div>

      <n-space vertical size="large">
        <div class="field-block">
          <label>Input account web</label>
          <n-input v-model:value="inputValue" placeholder="Input Web/App" />
        </div>

        <n-button type="primary" @click="filterAccDtos">Query</n-button>
      </n-space>

      <div class="result-list">
        <div v-if="accDtosStore.accFiltered.length" class="results-grid">
          <AccountDisplay v-for="AccDto in accDtosStore.accFiltered" :key="AccDto.id ?? undefined" :AccDto="AccDto" />
        </div>
        <div v-else class="empty-state">No results yet. Try a search term.</div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NCard, NInput, NSpace } from 'naive-ui';
import { useAccDtosStore } from '@/stores/accDtos';
import AccountDisplay from '@/components/AccountDisplay.vue';

const inputValue = ref('');
const accDtosStore = useAccDtosStore();

// 进入页面时清空过滤结果，用户点击 Query 按钮才搜索
accDtosStore.accFiltered = [];

function filterAccDtos() {
  if (!inputValue.value) {
    accDtosStore.accFiltered = accDtosStore.accDtos;
    return;
  }

  accDtosStore.accFiltered = accDtosStore.accDtos.filter((accDto) =>
    accDto.web != null && accDto.web.includes(inputValue.value)
  );
}

</script>

<style scoped>
.query-card {
  padding: 24px;
}

.query-header {
  margin-bottom: 18px;
}

.result-list {
  margin-top: 20px;
}

.results-grid {
  display: grid;
  gap: 14px;
}

.empty-state {
  padding: 18px;
  border-radius: 14px;
  background: #f8fafc;
  color: #64748b;
  text-align: center;
}
</style>
