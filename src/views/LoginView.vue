<template>
  <div class="page-shell">
    <n-card class="card-panel form-card" bordered>
      <p class="eyebrow">Authentication</p>
      <h2 class="page-title">Please Log In</h2>
      <p class="page-subtitle">Enter your verification code and the preferred encryption mode.</p>

      <n-space vertical size="large">
        <div class="field-block">
          <label>Verification code</label>
          <n-input v-model:value="inputValue" placeholder="Input verification code" />
        </div>

        <div class="field-block">
          <label>Encryption algorithm</label>
          <n-input v-model:value="DecodeSignal" placeholder="Input algorithm" />
        </div>

        <n-button type="primary" @click="handleVerify">Submit</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NCard, NInput, NSpace } from 'naive-ui';
import { store } from '@/stores/storeAuth';

const inputValue = ref('');
const DecodeSignal = ref('');

function handleVerify() {
  store.VFcode = inputValue.value;
  store.DECScode = DecodeSignal.value === 'aes' ? 'SKeySKeySKeySKey' : 'SKeiSKeiSKeiSKei';
  alert('submit successfully');
}
</script>

<style scoped>
.form-card {
  padding: 24px;
  max-width: 560px;
  margin: 0 auto;
}
</style>
  