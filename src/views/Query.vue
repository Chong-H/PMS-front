<template>
    <div>
        <center><h2>PMS Query Page:</h2></center>
    <h2>INPUT Acc Web</h2>
    </div>
    <label>INPUT Acc Web</label>
    <main>
      <h2>Accounts</h2>
      <div class="cards-wrapper">
              <AccountDisplay v-for="AccDto in AccDtos" :key="AccDto.id ?? undefined" :AccDto="AccDto"
                   />
          </div>
    </main>
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
          AccDtos.value = Array.from(response.data);
        } catch (error) {
            console.error('获取所有交易记录失败:', error);
        }
    }
    init.value = false;
});













</script>

<style scoped>
.user-layout {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

@media (min-width: 768px) {
    .user-layout {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .user-form,
    .query-form,
    .collectibles-list,
    .users-list,
    .edit-form {
        flex: 1 1 45%;
    }
}
</style>
