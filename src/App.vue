<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>


<template>
  <div class="app-container">
    <header class="nav-header">
      <!-- 这里是刘海导航栏 -->
      <nav class="nav-content">
    
        <RouterLink to="/">Home</RouterLink>
     
        <RouterLink to="/Queryview">Query</RouterLink>

        <RouterLink to="/Browse">Browse</RouterLink>
      </nav>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>


<!-- 组件局部样式 -->
<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  /* position: fixed; */
}

.nav-header {
  width: 100%;
  background: linear-gradient(to bottom, darkslategrey, darkslategrey);
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  z-index: 100;
}

.nav-content {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  position: relative;
  width: 100%;
}
</style>
