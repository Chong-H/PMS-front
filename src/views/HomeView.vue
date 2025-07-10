<template>
  <div class="container"style="display: flex; gap: 20px;">
    <div>
    <header class="header">
      <h1>Welcome to PMS</h1>
      <button type="button" @click="handleagree" class="query-button">协商</button>
      <button type="button" @click="getAccDtos" class="query-button">Obtain</button>
    </header>
    </div>

    <div>
      
    </div>
    <main class="warning-section">
      <div class="warning">
        <label>WARNING:</label>
        <h2>Not for Official, Not for Money, No Responsible for Potential Risks</h2>
      </div>
      
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { getAllAccAPI,Negotiate } from '@/api';
import {useAccDtosStore} from "@/stores/accDtos"
import { AccountDto } from '@/pojo/AccountDto';
import AccountDisplay from '@/components/AccountDisplay.vue';
import {store} from '@/stores/storeAuth'
import { reactive } from 'vue';


const init: Ref<boolean> = ref(true);
const isEditing = ref(false);
 const AccDtos: Ref<AccountDto[]> = ref([] as AccountDto[]);

 const accDtosStore = useAccDtosStore(); // 创建 Store 实例


 async function getAccDtos() {
    try {
      if(store.VFcode!=null){
          const response = await getAllAccAPI(store.VFcode); // 等待 Promise 解决
          
          AccDtos.value = Array.from(response.data);
          accDtosStore.accDtos = Array.from(response.data);
          alert("obtain succees");
      }else{
          alert("please verify first");
      }
          
        } catch (error) {
            console.error('获取所有账号失败:', error);
     }
}

// 密钥协商处理函数
async function handleagree() {
  try {
    // 1. 确保Alice的密钥对存在
    if (!store.pkeyalice || !store.skeyalice) {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveKey"]
      );
      
      // 导出并存储公钥
      const publicKeyBytes = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      store.pkeyalice = arrayBufferToBase64(publicKeyBytes);
      
      // 存储私钥（需注意：实际应用中应安全存储）
      store.skeyalice = keyPair.privateKey;
      
      alert("生成成功，pkeyalice已存储到store中");
    }

    // 2. 与服务器协商获取Bob的公钥
    const response = await Negotiate(store.VFcode);
    store.pkeybob = response.pkeybob;
    
    // 导入Bob的公钥
    const pkeybobArrayBuffer = base64ToArrayBuffer(store.pkeybob);
    const pkeybobCryptoKey = await window.crypto.subtle.importKey(
      "spki", // 使用spki格式导入X.509证书格式的公钥
      pkeybobArrayBuffer,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      []
    );
    
    alert("协商成功，pkeybob已存储到store中");

    // 3. 确保Alice私钥存在
    if (!store.skeyalice) {
      throw new Error("Alice的私钥不存在，请先生成密钥对");
    }

    // 4. 计算共享AES密钥
    const aesKey = await window.crypto.subtle.deriveKey(
      { name: "ECDH", public: pkeybobCryptoKey }, // 使用导入的CryptoKey对象
      store.skeyalice,
      { name: "AES-GCM", length: 128 },
      true, // 设为可导出以便存储
      ["encrypt", "decrypt"]
    );

    // 5. 导出并存储AES密钥
    const aesKeyArrayBuffer = await window.crypto.subtle.exportKey("raw", aesKey);

    
    // store.aeskey = arrayBufferToBase64(aesKeyArrayBuffer);
    
    // //alert("协商成功，AES密钥已生成并存储到store中"+store.aeskey);
    // console.log("协商成功，AES密钥已生成并存储到store中"+ store.aeskey);
    // 强制截断/填充为16字节（128位）
  const fixedKeyArray = new Uint8Array(16); // 初始化16字节数组
  const originalKeyArray = new Uint8Array(aesKeyArrayBuffer);
  // 复制原始密钥的前16字节（不足则补0，超出则截断）
  fixedKeyArray.set(originalKeyArray.slice(0, 16));

  // 转为Base64存储
  store.aeskey = arrayBufferToBase64(fixedKeyArray.buffer);

  // 验证长度
  console.log("处理后的AES密钥字节长度:", fixedKeyArray.byteLength); // 必须是16
  console.log("存储的Base64密钥:", store.aeskey); // 此时Base64长度应为24
  } catch (error) {
    console.error('密钥协商失败:', error);
    alert(`协商失败: ${(error as Error).message || String(error)}`);
  }
}

// 工具函数：ArrayBuffer转Base64（修复版本）
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  // 使用扩展运算符替代apply，避免类型错误
  return btoa(String.fromCharCode(...bytes));
}

// 工具函数：Base64转ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}


onMounted(async () => {
    // if (1) {                                   
    //     try {
    //       const response = await getAllAccAPI(); // 等待 Promise 解决
          
    //       AccDtos.value = Array.from(response.data);
    //       accDtosStore.accDtos = Array.from(response.data);

          
    //     } catch (error) {
    //         console.error('获取所有交易记录失败:', error);
    //     }
    // }
    if(store.communicationcode=="init"){
        // 生成一个随机的10位数字
        const random10Digit = Math.floor(1000000000 + Math.random() * 9000000000);

        // 其存储到store中
        store.communicationcode = random10Digit.toString();

        console.log("生成的10位随机数：", random10Digit);
    }
    init.value = false;
});

</script>

<style>
  
 

  .container {
    display: flex;
    flex-direction: column;
    
    min-height: 100vh;
  width: 100%;
  }

  header {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }

  header h1 {
    width: 100%;
    font-size: 2rem;
    color: #00fd00; /* 深灰色标题 */
    margin: 0;
  }

  main {

    flex: 1;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  position: relative;
  width: 100%;
    background: hsl(0, 0%, 15%); /* 浅灰色背景 */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* 微弱阴影 */
  }

  .warning {
    width: 100%;
    /* display: flex; */
    flex-direction: column;
    text-align: center;
    margin: 0;
  }

  .warning label {
    width: 100%;
    font-size: 1.2rem;
    color: #ff0000; /* 红色警告标签 */
    font-weight: bold;
    margin-bottom: 10px;
  }

  .warning h2 {
    font-size: 1.5rem;
    color: #f8552c; /* 深灰色警告内容 */
    text-align: center;
    margin: 0;width: 100%;

  }
  .query-button {
    padding: 12px 20px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f8f9fa;
    color: #666;
    border: 1px solid #ddd;
}
</style>
