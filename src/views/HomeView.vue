<template>
  <div class="container">
    <header class="welcome">
      <h1>Welcome to PMS</h1>
    </header>

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

import { AccountDto } from '@/pojo/AccountDto';
import AccountDisplay from '@/components/AccountDisplay.vue';

import { reactive } from 'vue';


const init: Ref<boolean> = ref(true);
const isEditing = ref(false);
const AccDtos: Ref<AccountDto[]> = ref([] as AccountDto[]);



onMounted(async () => {
    if (1) {                                   
        try {
            const response = await getAllAccAPI(); // 等待 Promise 解决
          // 将 Iterable 转换为数组
          AccDtos.value = Array.from(response.data);
        //   .filter(
        //         trans => ( 
        //             (  trans.buyerId==store.userId&&trans.ifReadByBuyer==0 )||
        //             (  trans.sellerId==store.userId&&trans.ifReadBySeller==0)
        //          ) 
        //  ).reverse();

          
        } catch (error) {
            console.error('获取所有交易记录失败:', error);
        }
    }
    init.value = false;
});

</script>

<style>
  /* 基本样式 */
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #005c29; 
    color: #fffbfb; /* 深灰色文字 */
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  header {
    text-align: center;
    margin-bottom: 20px;
  }

  header h1 {
    font-size: 2rem;
    color: #333333; /* 深灰色标题 */
    margin: 0;
  }

  main {
    width: 100%;
    max-width: 600px;
    background: #f9f9f9; /* 浅灰色背景 */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* 微弱阴影 */
  }

  .warning {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .warning label {
    font-size: 1.2rem;
    color: #ff0000; /* 红色警告标签 */
    font-weight: bold;
    margin-bottom: 10px;
  }

  .warning h2 {
    font-size: 1.5rem;
    color: #333333; /* 深灰色警告内容 */
    text-align: center;
    margin: 0;
  }
</style>
