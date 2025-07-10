import { reactive } from "vue";

// 扩展store类型定义，允许字符串值
interface StoreState {
  VFcode: string;
  DECScode: string;
  communicationcode: string;
  pkeyalice: string | null;    // 显式允许字符串或null
  skeyalice: CryptoKey | null; // 私钥为CryptoKey对象
  pkeybob: string | null;      // 公钥为Base64字符串
  aeskey: string | null;       // AES密钥为Base64字符串
}
// 使用类型定义创建响应式对象
export const store = reactive<StoreState>({
  VFcode: "-1",
  DECScode: "9",
  communicationcode: "init",
  pkeyalice: null,
  skeyalice: null,
  pkeybob: null,
  aeskey: null,
});
