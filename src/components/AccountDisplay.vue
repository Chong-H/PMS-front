<template>
  <div class="account-card">
    <div class="account-header">
      <div>
        <h3>{{ AccDto.web || 'Unnamed account' }}</h3>
      </div>
      <span class="meta-badge">{{ AccDto.classify || 'General' }}</span>
    </div>

    <p><strong>Account:</strong> {{ revealed ? resolveValue(AccDto.acc) : '******' }}</p>
    <p><strong>Pin:</strong> {{ revealed ? resolveValue(AccDto.pin) : '******' }}</p>
    <p><strong>Description:</strong> {{ AccDto.description || 'No description provided.' }}</p>

    <!-- 2FA 账号：显示 TOTP 验证码 + Copy 按钮 -->
    <div v-if="isTwoFactor" class="totp-block">
      <strong>TOTP:</strong>
      <span class="totp-code" :class="{ 'totp-expired': !totpValid }">{{ totpCode || '—' }}</span>
      <n-button size="small" @click="copyTotp" :disabled="!totpCode">Copy</n-button>
    </div>

    <div class="actions">
      <n-button size="small" @click="toggleReveal">{{ revealed ? '隐藏' : '查看' }}</n-button>
      <n-button size="small" @click="openEditModal">Edit</n-button>
      <n-button size="small" type="error" @click="handleDelete">Delete</n-button>
    </div>

    <!-- 编辑弹窗表单 -->
    <n-modal
      v-model:show="editModalVisible"
      preset="card"
      :title="`编辑账号 #${props.AccDto.id ?? ''}`"
      style="width: 520px; max-width: 90vw"
      :bordered="false"
    >
      <n-form label-placement="top">
        <n-form-item label="Web / App 名称">
          <n-input v-model:value="editForm.web" />
        </n-form-item>
        <n-form-item label="Account / 用户名">
          <n-input v-model:value="editForm.acc" />
        </n-form-item>
        <n-form-item label="Pin / 密码">
          <n-input v-model:value="editForm.pin" type="password" show-password-on="click" />
        </n-form-item>
        <n-form-item label="Description（明文，不加密）">
          <n-input v-model:value="editForm.description" />
        </n-form-item>
        <n-form-item label="Classify / 分类">
          <n-input v-model:value="editForm.classify" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="edit-footer">
          <n-button @click="cancelEdit">取消</n-button>
          <n-button type="primary" :loading="editSubmitting" @click="submitEdit">
            保存
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import type { AccountDto } from '@/pojo/AccountDto';
import { store } from '@/stores/storeAuth';
import { decrypt, encrypt } from '@/stores/decode';
import { deleteAccountAPI, updateAccountAPI } from '@/api';
import { generateTOTP } from '@/lib/totp';

interface Props {
  AccDto: AccountDto;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'deleted', id: number): void; (e: 'updated'): void }>();

const message = useMessage();
const revealed = ref(false);

// 编辑弹窗状态
const editModalVisible = ref(false);
const editSubmitting = ref(false);
const editForm = reactive({
  web: '',
  acc: '',
  pin: '',
  description: '',
  classify: '',
});
// 保存打开弹窗时的原始数据，用于对比是否有变化
const originalEditData = reactive({
  web: '',
  acc: '',
  pin: '',
  description: '',
  classify: '',
});

// 判断是否为 2FA 账号（classify 为 2fa，大小写不敏感）
const isTwoFactor = computed(() => props.AccDto.classify?.trim().toLowerCase() === '2fa');

const totpCode = ref('');
const totpValid = ref(true);

function toggleReveal() {
  revealed.value = !revealed.value;
}

/** 解密 key：纯 AES key（不再使用 classify 派生） */
function getDecryptKey(): string {
  return store.aeskey ?? '';
}

function resolveValue(value: string | null | undefined) {
  if (!store.aeskey) return 'no key';
  try {
    const derivedKey = getDecryptKey();
    return decrypt(value ?? '', derivedKey) ?? '';
  } catch {
    return '[decrypt error]';
  }
}

/** 解密得到 TOTP secret（pin 字段） */
function getTotpSecret(): string {
  if (!store.aeskey) return '';
  try {
    const derivedKey = getDecryptKey();
    return decrypt(props.AccDto.pin ?? '', derivedKey) ?? '';
  } catch {
    return '';
  }
}

/** 刷新 TOTP 验证码 */
function refreshTotp() {
  if (!isTwoFactor.value) {
    totpCode.value = '';
    return;
  }
  try {
    totpCode.value = generateTOTP(getTotpSecret());
    // 计算剩余有效秒数，接近过期时标红
    const remaining = 30 - (Math.floor(Date.now() / 1000) % 30);
    totpValid.value = remaining > 5;
  } catch {
    totpCode.value = '';
    totpValid.value = false;
  }
}

/** 复制 TOTP 验证码到剪贴板 */
async function copyTotp() {
  if (!totpCode.value) return;
  try {
    await navigator.clipboard.writeText(totpCode.value);
    message.success(`Copied ${totpCode.value}`, { duration: 1000 });
  } catch {
    // 降级方案：使用 execCommand 复制
    try {
      const textarea = document.createElement('textarea');
      textarea.value = totpCode.value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      message.success(`Copied ${totpCode.value}`, { duration: 1000 });
    } catch (err) {
      console.error('复制失败:', err);
      message.error('Copy failed', { duration: 1000 });
    }
  }
}

let totpTimer: number | null = null;

onMounted(() => {
  if (isTwoFactor.value) {
    refreshTotp();
    // 每秒刷新一次，保证验证码实时更新
    totpTimer = window.setInterval(refreshTotp, 1000);
  }
});

onUnmounted(() => {
  if (totpTimer !== null) {
    window.clearInterval(totpTimer);
    totpTimer = null;
  }
});

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

/** 解密明文，供编辑表单回填 */
function decryptForEdit(field: string | null | undefined): string {
  if (!store.aeskey) return field ?? '';
  try {
    const key = getDecryptKey();
    return decrypt(field ?? '', key) ?? field ?? '';
  } catch {
    return field ?? '';
  }
}

/** 打开编辑弹窗，将原始数据解密后填入表单 */
function openEditModal() {
  if (!props.AccDto.id) return;
  editForm.web = props.AccDto.web ?? '';
  editForm.acc = decryptForEdit(props.AccDto.acc);
  editForm.pin = decryptForEdit(props.AccDto.pin);
  editForm.description = props.AccDto.description ?? '';
  editForm.classify = props.AccDto.classify ?? '';

  // 记录打开时的原始明文，用于对比变化
  originalEditData.web = editForm.web;
  originalEditData.acc = editForm.acc;
  originalEditData.pin = editForm.pin;
  originalEditData.description = editForm.description;
  originalEditData.classify = editForm.classify;

  editModalVisible.value = true;
}

/** 取消编辑，直接关闭 */
function cancelEdit() {
  editModalVisible.value = false;
}

/** 提交编辑：对比变化，有变化才更新 DB（账密用纯 AES 加密） */
async function submitEdit() {
  if (!props.AccDto.id) return;

  // 对比是否有变化（web 非加密字段直接比较，acc/pin 用解密后的明文比较）
  const changed =
    editForm.web !== originalEditData.web ||
    editForm.acc !== originalEditData.acc ||
    editForm.pin !== originalEditData.pin ||
    editForm.description !== originalEditData.description ||
    editForm.classify !== originalEditData.classify;

  if (!changed) {
    message.info('没有改动，无需更新', { duration: 1000 });
    editModalVisible.value = false;
    return;
  }

  editSubmitting.value = true;
  try {
    const payload: Partial<AccountDto> = {
      id: props.AccDto.id,
      web: editForm.web || null,
      description: editForm.description || null,
      classify: editForm.classify || null,
    };

    // 仅当账/密有改动时才重新加密（纯 AES key）
    if (editForm.acc !== originalEditData.acc) {
      payload.acc = editForm.acc ? encrypt(editForm.acc, getDecryptKey()) : null;
    } else {
      payload.acc = props.AccDto.acc; // 未改则保留原密文
    }
    if (editForm.pin !== originalEditData.pin) {
      payload.pin = editForm.pin ? encrypt(editForm.pin, getDecryptKey()) : null;
    } else {
      payload.pin = props.AccDto.pin; // 未改则保留原密文
    }

    await updateAccountAPI(payload);
    message.success('更新成功', { duration: 1000 });
    editModalVisible.value = false;
    emit('updated');
  } catch (error) {
    console.error('更新失败:', error);
    message.error(`Update failed: ${(error as Error).message}`, { duration: 1000 });
  } finally {
    editSubmitting.value = false;
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

.edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}

.totp-block {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
}

.totp-code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #0369a1;
}

.totp-code.totp-expired {
  color: #dc2626;
}

p {
  margin: 6px 0;
  color: #475569;
}

@media (max-width: 767px) {
  .account-card {
    padding: 10px;
    font-size: 0.78rem;
  }
  .account-card h3 {
    font-size: 0.92rem;
  }
  .meta-badge {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
  .actions .n-button {
    font-size: 0.75rem !important;
    padding: 2px 10px !important;
  }
}
</style>