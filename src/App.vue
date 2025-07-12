<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>


<template>
  <el-container
    class="layout-container-demo"
    :style="{ height: windowHeight * 0.9 + 'px', width: windowWidth * 0.9 + 'px' }"
  >
  <div class="app-container">
    <header class="nav-header">
      <!-- 这里是刘海导航栏 -->
      <nav class="nav-content">
    
        <RouterLink to="/">Home</RouterLink>
     
        <RouterLink to="/Queryview">Query</RouterLink>

        <RouterLink to="/Browse">Browse</RouterLink>

        <RouterLink to="/Log">Login</RouterLink>
      </nav>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
  </el-container>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 核心：宽度包含padding和border */
}
.app-container, .container {
  max-width: 1440px; /* 根据设计需求调整 */
  margin: 0 auto; /* 水平居中 */
}
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  /* position: fixed; */
}

.nav-header {
  background: linear-gradient(to bottom, rgb(232, 255, 255), rgb(147, 255, 255));
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  z-index: 100;
}

.nav-content {
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
}
</style>
