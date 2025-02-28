<template>
    <div class="container">
    <div>
        <center><h2>PMS Query Page:</h2></center>
    <h2>INPUT Acc Web</h2>
    </div>
    <label>INPUT Acc Web</label>
    <input v-model="inputValue" placeholder="Input Web/App" class="input-field"  />
    <button type="button" @click="filterAccDtos" class="query-button">Query</button>
    <h2>Accounts</h2>
    <main>
      
      <div class="cards-wrapper">
              <AccountDisplay v-for="AccDto in accDtosStore.accFiltered" :key="AccDto.id ?? undefined" :AccDto="AccDto"
                   />
          </div>
    </main>
    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { getAllAccAPI } from '@/api';
import {useAccDtosStore} from "@/stores/accDtos"
import axios from 'axios';
import { AccountDto } from '@/pojo/AccountDto';
import AccountDisplay from '@/components/AccountDisplay.vue';

import { reactive } from 'vue';

const inputValue = ref(''); // 绑定输入框的值
const init: Ref<boolean> = ref(true);
const isEditing = ref(false);
const AccDtos: Ref<AccountDto[]> = ref([] as AccountDto[]);
    const accDtosStore = useAccDtosStore(); // 创建 Store 实例
onMounted(async () => {
    if (1) {                                   
        try {
            const response = await getAllAccAPI(); // 等待 Promise 解决
          AccDtos.value = Array.from(response.data);
        } catch (error) {
            console.error('获取所有交易记录失败:', error);
        }
    }
    init.value = false;
});

async function filterAccDtos() {
    try {
          const response = await getAllAccAPI(); // 等待 Promise 解决
          
          AccDtos.value = Array.from(response.data);
          accDtosStore.accDtos = Array.from(response.data);

          
        } catch (error) {
            console.error('获取所有交易记录失败:', error);
     }
     
  if (!inputValue.value) {
    // 如果输入框为空，清空过滤结果
    accDtosStore.accFiltered = [];
    return;
  }

  // 根据输入框的值过滤 accDtos 数据
  accDtosStore.accFiltered = accDtosStore.accDtos.filter((accDto) =>
    accDto.web!=null&&accDto.web.includes(inputValue.value)
  );
}













</script>

<style scoped>
.user-layout {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
}

@media (min-width: 768px) {
    .user-layout {
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
    }

    .user-form,
    .query-form,
    .collectibles-list,
    .users-list,
    .edit-form {
        flex: 1 1 45%;
        width: 100%;
    }
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
  }

.input-field {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 25px;
    /* 圆角输入框 */
    font-size: 16px;
    transition: border-color 0.3s;
    /* 过渡效果 */
}
.button {
    background: #f8f9fa;
    color: #666;
    border: 1px solid #ddd;
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
