import { reactive } from "vue";

// 扩展store类型定义，允许字符串值
interface StoreState {
  VFcode: string;
  DECScode: string;
  communicationcode: string;
  pkeyalice: string | null;
  skeyalice: CryptoKey | null;
  pkeybob: string | null;
  aeskey: string | null;       // 当前选中的 AES key
  aesKeyList: string;          // AES 密钥列表 JSON
  backendAuthKey: string;      // 后端鉴权 token
}

function initAesKey(): string | null {
  try {
    const idx = localStorage.getItem('PMS_AESKEY_SELECTED');
    if (idx === null) return null;
    const keys = JSON.parse(localStorage.getItem('PMS_AESKEY_LIST') || '[]');
    return keys[parseInt(idx, 10)] || null;
  } catch {
    return null;
  }
}

export const store = reactive<StoreState>({
  VFcode: "-1",
  DECScode: "9",
  communicationcode: "init",
  pkeyalice: null,
  skeyalice: null,
  pkeybob: null,
  aeskey: initAesKey(),
  aesKeyList: localStorage.getItem('PMS_AESKEY_LIST') || '',
  backendAuthKey: localStorage.getItem('PMS_BACKEND_AUTH_KEY') || '',
});
