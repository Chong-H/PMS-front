<template>
  <div class="page-shell">
    <n-card class="card-panel browse-card" bordered>
      


      <div class="toolbar">
        <n-button type="primary" @click="loadAccounts">Refresh</n-button>
      </div>


      <!-- 分类标签（无 All 选项） -->
      <div class="category-bar" v-if="categories.length">
        <n-tag
          v-for="cat in categories"
          :key="cat"
          size="large"
          :type="selectedClassify === cat ? 'primary' : 'default'"
          style="cursor:pointer"
          @click="toggleCategory(cat)"
        >
          {{ cat }}
        </n-tag>
      </div>

      <!-- 分页导航 -->
      <div class="pagination-bar">
        <n-button
          size="small"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          ◀ Prev
        </n-button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <n-button
          size="small"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next ▶
        </n-button>
      </div>

      <div class="results-grid">
        <AccountDisplay
          v-for="AccDto in paginatedAccounts"
          :key="AccDto.id ?? undefined"
          :AccDto="AccDto"
          @deleted="handleDeleted"
          @updated="handleUpdated"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NAlert, NButton, NCard, NTag } from 'naive-ui';
import { getAllAccAPI, saveAccountsToCache, loadAccountsFromCache } from '@/api';
import { useAccDtosStore } from '@/stores/accDtos';
import AccountDisplay from '@/components/AccountDisplay.vue';

const accDtosStore = useAccDtosStore();
const selectedClassify = ref<string | null>(null);

const categories = computed(() => {
  const set = new Set<string>();
  for (const a of accDtosStore.accDtos) {
    if (a.classify) set.add(a.classify);
  }
  return [...set].sort();
});

function toggleCategory(cat: string) {
  selectedClassify.value = selectedClassify.value === cat ? null : cat;
  currentPage.value = 1;
}

const displayedAccounts = computed(() => {
  if (!selectedClassify.value) return accDtosStore.accDtos;
  return accDtosStore.accDtos.filter((a) => a.classify === selectedClassify.value);
});

const PAGE_SIZE = 20;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(displayedAccounts.value.length / PAGE_SIZE))
);

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return displayedAccounts.value.slice(start, start + PAGE_SIZE);
});

function goToPage(page: number) {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value));
}

/** 从 API 拉取并缓存 */
async function loadAccounts() {
  try {
    const accounts = await getAllAccAPI();
    saveAccountsToCache(accounts);
    accDtosStore.accDtos = accounts;
    currentPage.value = 1;
  } catch (error) {
    console.error('加载账号失败:', error);
    alert(`Load failed: ${(error as Error).message}`);
  }
}

function handleDeleted() {
  // DB 已修改 → 拉取最新列表并缓存
  void loadAccounts();
}

function handleUpdated() {
  // DB 已修改 → 拉取最新列表并缓存
  void loadAccounts();
}

onMounted(() => {
  // 优先从缓存加载，不触发 API 请求
  const cached = loadAccountsFromCache();
  if (cached) {
    accDtosStore.accDtos = cached;
  }
  // 没有缓存时：也不自动请求，用户可点 Refresh
});
</script>

<style scoped>
.browse-card {
  padding: 24px;
}

.warning-block {
  margin: 16px 0 20px;
}

.toolbar {
  margin-bottom: 16px;
}

.toolbar .n-button {
  font-size: 0.95rem;
  padding: 8px 20px;
}

.category-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 18px;
}

.pagination-bar .n-button {
  font-size: 0.95rem;
  padding: 8px 20px;
}

.page-info {
  font-size: 0.95rem;
  color: #475569;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}
</style>
