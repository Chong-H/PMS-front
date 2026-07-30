<template>
  <div class="account-card">
    <div class="account-header">
      <div>
        <p class="eyebrow">Account</p>
        <h3>{{ AccDto.web || 'Unnamed account' }}</h3>
      </div>
      <span class="meta-badge">{{ AccDto.classify || 'General' }}</span>
    </div>

    <p><strong>ID:</strong> {{ AccDto.id ?? '—' }}</p>
    <p><strong>Account:</strong> {{ revealed ? resolveValue(AccDto.acc) : '******' }}</p>
    <p><strong>Pin:</strong> {{ revealed ? resolveValue(AccDto.pin) : '******' }}</p>
    <p><strong>Description:</strong> {{ AccDto.description || 'No description provided.' }}</p>

    <div class="actions">
      <n-button size="small" @click="toggleReveal">{{ revealed ? '隐藏' : '查看' }}</n-button>
      <n-button size="small" @click="handleEdit">Edit</n-button>
      <n-button size="small" type="error" @click="handleDelete">Delete</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NButton } from 'naive-ui';
import type { AccountDto } from '@/pojo/AccountDto';
import { store } from '@/stores/storeAuth';
import { decrypt, generateKey } from '@/stores/decode';
import { deleteAccountAPI, updateAccountAPI } from '@/api';

interface Props {
  AccDto: AccountDto;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'deleted', id: number): void; (e: 'updated'): void }>();

const revealed = ref(false);

function toggleReveal() {
  revealed.value = !revealed.value;
}

function resolveValue(value: string | null | undefined) {
  if (!store.aeskey) return 'no key';
  try {
    const derivedKey = generateKey(props.AccDto.classify, store.aeskey);
    return decrypt(value ?? '', derivedKey) ?? '';
  } catch {
    return '[decrypt error]';
  }
}

async function handleDelete() {
  if (!props.AccDto.id) return;
  try {
    await deleteAccountAPI(props.AccDto.id);
    emit('deleted', props.AccDto.id);
  } catch (error) {
    console.error('删除失败:', error);
    alert(`Delete failed: ${(error as Error).message}`);
  }
}

async function handleEdit() {
  if (!props.AccDto.id) return;

  const web = window.prompt('Edit web', props.AccDto.web ?? '') ?? props.AccDto.web ?? '';
  const acc = window.prompt('Edit account', props.AccDto.acc ?? '') ?? props.AccDto.acc ?? '';
  const pin = window.prompt('Edit pin', props.AccDto.pin ?? '') ?? props.AccDto.pin ?? '';
  const description = window.prompt('Edit description', props.AccDto.description ?? '') ?? props.AccDto.description ?? '';
  const classify = window.prompt('Edit classify', props.AccDto.classify ?? '') ?? props.AccDto.classify ?? '';

  try {
    await updateAccountAPI({
      id: props.AccDto.id,
      web,
      acc,
      pin,
      description,
      classify,
    });
    emit('updated');
  } catch (error) {
    console.error('更新失败:', error);
    alert(`Update failed: ${(error as Error).message}`);
  }
}
</script>

<style scoped>
.account-card {
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.meta-badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

p {
  margin: 6px 0;
  color: #475569;
}
</style>