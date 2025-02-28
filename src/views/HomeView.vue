<template>
  <div class="container">
    <div>
    <header class="header">
      <h1>Welcome to PMS</h1>
    </header>
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
import { getAllAccAPI } from '@/api';
import {useAccDtosStore} from "@/stores/accDtos"
import { AccountDto } from '@/pojo/AccountDto';
import AccountDisplay from '@/components/AccountDisplay.vue';

import { reactive } from 'vue';


const init: Ref<boolean> = ref(true);
const isEditing = ref(false);
 const AccDtos: Ref<AccountDto[]> = ref([] as AccountDto[]);

 const accDtosStore = useAccDtosStore(); // 创建 Store 实例



onMounted(async () => {
    if (1) {                                   
        try {
          const response = await getAllAccAPI(); // 等待 Promise 解决
          
          AccDtos.value = Array.from(response.data);
          accDtosStore.accDtos = Array.from(response.data);

          
        } catch (error) {
            console.error('获取所有交易记录失败:', error);
        }
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
</style>
