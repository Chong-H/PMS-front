<template>
  <div class="page-shell">
    <n-card class="card-panel hero-card" bordered>
      <div class="hero-top">
        <div>
          <p class="eyebrow">New Account</p>
          <h2 class="page-title">Add Account</h2>
          <p class="page-subtitle">Create a new credential entry in the vault.</p>
        </div>
      </div>

      <div class="form-grid">
        <n-input v-model:value="form.web" placeholder="Web / App name" />
        <n-input v-model:value="form.acc" placeholder="Account / Username" />
        <n-input v-model:value="form.pin" placeholder="Password" />
        <n-input v-model:value="form.description" placeholder="Description" />
        <n-input v-model:value="form.classify" placeholder="Classify" />
      </div>

      <div class="form-actions">
        <n-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
          Add Account
        </n-button>
        <n-button size="large" @click="handleReset">Reset</n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { NButton, NCard, NInput } from 'naive-ui';
import { addAccountAPI } from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const submitting = ref(false);

const form = reactive({
  web: '',
  acc: '',
  pin: '',
  description: '',
  classify: '',
});

async function handleSubmit() {
  submitting.value = true;
  try {
    await addAccountAPI({
      web: form.web || null,
      acc: form.acc || null,
      pin: form.pin || null,
      description: form.description || null,
      classify: form.classify || null,
    });
    alert('Account added successfully');
    handleReset();
    router.push('/Browse');
  } catch (error) {
    console.error('新增账号失败:', error);
    alert(`Add failed: ${(error as Error).message}`);
  } finally {
    submitting.value = false;
  }
}

function handleReset() {
  form.web = '';
  form.acc = '';
  form.pin = '';
  form.description = '';
  form.classify = '';
}
</script>

<style scoped>
.hero-card {
  padding: 24px;
}

.hero-top {
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}

.form-actions {
  display: flex;
  gap: 12px;
}
</style>
