<template>
  <div class="page-shell">
    <n-card class="card-panel hero-card" bordered>
      <div class="hero-top">
        <div>
          <p class="eyebrow">System Configuration</p>
          <h2 class="page-title">Settings</h2>
          <p class="page-subtitle">Manage global security keys and backend parameters.</p>
        </div>
        <n-space>
          <n-button type="primary" @click="handleSave">保存配置</n-button>
          <n-button @click="handleReset">重置默认</n-button>
        </n-space>
      </div>

      <n-alert class="warning-block" type="info" title="Configuration notice">
        Configurations are securely stored in your local session or state store.
      </n-alert>

      <div class="settings-form">
        <n-form label-placement="top" class="form-container">

          <!-- AES 密钥列表 -->
          <n-form-item label="AES 密钥列表（选中项用于解密）">
            <div class="aes-list">
              <div
                v-for="(key, idx) in aesKeys"
                :key="idx"
                class="aes-row"
                :class="{ selected: selectedIndex === idx }"
              >
                <n-radio
                  :checked="selectedIndex === idx"
                  @change="selectKey(idx)"
                />
                <span class="aes-value">{{ key }}</span>
                <n-button
                  size="tiny"
                  type="error"
                  quaternary
                  @click="removeKey(idx)"
                >
                  ✕
                </n-button>
              </div>

              <div v-if="!aesKeys.length" class="aes-empty">
                暂无 AES 密钥，请添加
              </div>

              <div class="aes-add-row">
                <n-input
                  v-model:value="newKeyInput"
                  placeholder="输入新 AES 密钥"
                  style="flex:1"
                />
                <n-button size="small" @click="addKey">添加</n-button>
              </div>
            </div>
          </n-form-item>

          <n-form-item label="BACKEND_AUTH_KEY">
            <n-input
              v-model:value="backendAuthKey"
              type="password"
              show-password-on="click"
              placeholder="Enter backend auth key..."
            />
          </n-form-item>
        </n-form>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NAlert, NButton, NCard, NSpace, NForm, NFormItem, NInput, NRadio } from 'naive-ui';
import { store } from '@/stores/storeAuth';

const LS_KEYS = 'PMS_AESKEY_LIST';
const LS_SELECTED = 'PMS_AESKEY_SELECTED';
const LS_AUTH_KEY = 'PMS_BACKEND_AUTH_KEY';

const aesKeys = ref<string[]>([]);
const selectedIndex = ref(-1);
const newKeyInput = ref('');
const backendAuthKey = ref('');

function loadFromStorage() {
  // 加载 AES 密钥列表
  try {
    const raw = localStorage.getItem(LS_KEYS);
    aesKeys.value = raw ? JSON.parse(raw) : [];
  } catch {
    aesKeys.value = [];
  }

  // 加载选中索引
  const savedIdx = localStorage.getItem(LS_SELECTED);
  selectedIndex.value = savedIdx !== null ? parseInt(savedIdx, 10) : (aesKeys.value.length > 0 ? 0 : -1);

  // 加载后端鉴权 key
  backendAuthKey.value = (store as any).backendAuthKey || localStorage.getItem(LS_AUTH_KEY) || '';
}

function saveToStorage() {
  // 保存 AES 密钥列表
  localStorage.setItem(LS_KEYS, JSON.stringify(aesKeys.value));
  localStorage.setItem(LS_SELECTED, String(selectedIndex.value));

  // 同步到 store
  (store as any).aesKeyList = JSON.stringify(aesKeys.value);
  (store as any).aeskey = selectedIndex.value >= 0 && selectedIndex.value < aesKeys.value.length
    ? aesKeys.value[selectedIndex.value]
    : null;

  // 保存后端鉴权 key
  (store as any).backendAuthKey = backendAuthKey.value;
  localStorage.setItem(LS_AUTH_KEY, backendAuthKey.value);
}

function addKey() {
  const trimmed = newKeyInput.value.trim();
  if (!trimmed) return;
  if (aesKeys.value.includes(trimmed)) {
    alert('该密钥已存在');
    return;
  }
  aesKeys.value.push(trimmed);
  newKeyInput.value = '';
  // 如果这是第一个 key，自动选中
  if (selectedIndex.value < 0) {
    selectedIndex.value = 0;
  }
}

function removeKey(idx: number) {
  aesKeys.value.splice(idx, 1);
  if (selectedIndex.value === idx) {
    selectedIndex.value = aesKeys.value.length > 0 ? 0 : -1;
  } else if (selectedIndex.value > idx) {
    selectedIndex.value--;
  }
}

function selectKey(idx: number) {
  selectedIndex.value = idx;
}

function handleSave() {
  try {
    saveToStorage();
    alert('保存配置成功！');
  } catch (error) {
    console.error('保存失败:', error);
    alert('保存配置失败');
  }
}

function handleReset() {
  aesKeys.value = [];
  selectedIndex.value = -1;
  newKeyInput.value = '';
  backendAuthKey.value = '';
  localStorage.removeItem(LS_KEYS);
  localStorage.removeItem(LS_SELECTED);
  localStorage.removeItem(LS_AUTH_KEY);
  (store as any).aesKeyList = '';
  (store as any).aeskey = null;
  (store as any).backendAuthKey = '';
  alert('已重置配置');
}

onMounted(() => {
  loadFromStorage();
});
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
  margin-bottom: 24px;
}

.settings-form {
  max-width: 640px;
}

/* AES 密钥列表 */
.aes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.aes-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  transition: all 0.15s;
}

.aes-row.selected {
  border-color: #2563eb;
  background: #eff6ff;
}

.aes-value {
  flex: 1;
  font-family: monospace;
  font-size: 0.88rem;
  color: #334155;
  word-break: break-all;
}

.aes-empty {
  padding: 12px;
  color: #94a3b8;
  text-align: center;
  font-size: 0.9rem;
}

.aes-add-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

@media (max-width: 700px) {
  .hero-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>