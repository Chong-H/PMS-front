// src/stores/accDtos.ts
import { defineStore } from 'pinia';
import type { AccountDto } from '@/pojo/AccountDto'; // 假设你有 AccountDto 类型定义
import { getAllAccAPI } from '@/api';


export const useAccDtosStore = defineStore('accDtos', {
    state: () => ({
      accDtos: [] as AccountDto[], // 定义 state，仅存储 AccDtos 数据
      accFiltered: [] as AccountDto[], // 存储过滤后的数据
    }),
  });