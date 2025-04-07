<template>
    <div class="container" style="display: flex; gap: 20px;">
      <div>
      <header class="header">
        <h1>Please Log In</h1>
      </header>
      </div>
      <h2>Input  Verification Code</h2>
      <input v-model="inputValue" placeholder="Input " class="input-field"  />
      <h2>Input  Encrypt Algorithm</h2>
      <input v-model="DecodeSignal" placeholder="Input " class="input-field" />
      <h2> </h2>
      <label>    </label>
      
      <button type="button" @click="handleVerify" class="query-button">Submit</button>
      <div>
       
      </div>
    </div>
    

</template>
  
  <script setup lang="ts">
  import { ref, onMounted, type Ref } from 'vue';
  import { getAllAccAPI } from '@/api';
  import {useAccDtosStore} from "@/stores/accDtos"
  import { AccountDto } from '@/pojo/AccountDto';
  import AccountDisplay from '@/components/AccountDisplay.vue';
  import {store} from '@/stores/storeAuth'
  import { reactive } from 'vue';
  
  
  const init: Ref<boolean> = ref(true);
  const isEditing = ref(false);
   const AccDtos: Ref<AccountDto[]> = ref([] as AccountDto[]);
  
   const accDtosStore = useAccDtosStore(); // 创建 Store 实例
   const inputValue = ref(''); // 绑定输入框的值
   let DecodeSignal=ref('');
  
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
      init.value = false;
  });
  async function handleVerify() {
    store.VFcode=(inputValue.value);
    store.DECScode=(DecodeSignal.value=="aes"?"SKeySKeySKeySKey":"SKeiSKeiSKeiSKei");
//     try {
//           const response = await getAllAccAPI(); // 等待 Promise 解决
          
//           AccDtos.value = Array.from(response.data);
//           accDtosStore.accDtos = Array.from(response.data);

          
//         } catch (error) {
//             console.error('获取所有交易记录失败:', error);
//      }
     
//   if (!inputValue.value) {
//     // 如果输入框为空，清空过滤结果
//     accDtosStore.accFiltered = [];
//     return;
//   }

//   // 根据输入框的值过滤 accDtos 数据
//   accDtosStore.accFiltered = accDtosStore.accDtos.filter((accDto) =>
//     accDto.web!=null&&accDto.web.includes(inputValue.value)
//   );
    alert("submit successfully");

}
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
    .input-field {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #4299e1;
  outline: none;
}
  </style>
  