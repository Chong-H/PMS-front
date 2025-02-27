<template>
    <div class="wrapper">
        <label>id      </label>
        <label>{{ AccDto.id == null?null:AccDto.id}}   </label>
        <label>web</label>
        <label>{{ AccDto.web }}</label>
        <label>acc{{ (AccDto.acc  ) }}  </label>
        <label>pin {{AccDto.pin }}</label>
        <label>description{{ AccDto.description }} </label>
        <label>   classify {{AccDto.classify}}</label>
        
        <!-- <button @click="emit('read', trans)">知道了</button>
        <button @click="emit('unread', trans)">设为未读</button> -->
    </div>
</template>

<script setup lang="ts">

import { AccountDto } from '@/pojo/AccountDto';

interface Props {
    AccDto: AccountDto,
}

const {
    AccDto,
} = defineProps<Props>();

// const emit = defineEmits<{
//     (event: 'read', trans: TransactionDto): void,
//     (event: 'unread', trans: TransactionDto): void,

// }>();

</script>


<style scoped>
/* label竖置 */
.wrapper {
    border: 1px solid #ddd;
    /* 边框 */
    border-radius: 8px;
    /* 圆角 */
    padding: 16px;
    /* 内边距 */
    background-color: black;
    /* 背景颜色 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 阴影 */
    margin-bottom: 20px;
    
}
</style>