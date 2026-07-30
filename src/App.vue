<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

const sidebarOpen = ref(false);
const isMobile = ref(false);
const isDesktop = ref(false);

function checkWidth() {
  isMobile.value = window.innerWidth < 768;
  isDesktop.value = window.innerWidth > 1200;
  if (isDesktop.value) {
    sidebarOpen.value = true;
  }
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function handleNavClick() {
  if (isMobile.value) {
    sidebarOpen.value = false;
  }
}

onMounted(() => {
  checkWidth();
  window.addEventListener('resize', checkWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth);
});
</script>


<template>
  <div class="app-shell">
    <!-- 切换按钮 -->
    <button class="menu-toggle" @click="toggleSidebar" v-if="!sidebarOpen">☰</button>

    <!-- 侧边栏抽屉 -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="brand-badge">P</div>
          <div>
            <div class="brand-title">PMS System</div>
            <div class="brand-subtitle">Secure vault</div>
          </div>
        </div>
        <button class="close-btn" @click="sidebarOpen = false" v-if="!isDesktop">✕</button>
      </div>

      <nav class="nav-list">
        <RouterLink to="/" class="menu-item" @click="handleNavClick">🏠 Dashboard</RouterLink>
        <RouterLink to="/Queryview" class="menu-item" @click="handleNavClick">🔍 Query</RouterLink>
        <RouterLink to="/Browse" class="menu-item" @click="handleNavClick">📂 Browse</RouterLink>
        <RouterLink to="/add-account" class="menu-item" @click="handleNavClick">➕ Add Account</RouterLink>
        <RouterLink to="/settings" class="menu-item" @click="handleNavClick">⚙️ Settings</RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="footer-pill">© 2026 PMS</div>
      </div>
    </aside>

    <!-- 遮罩层（手机端点击关闭） -->
    <div v-if="sidebarOpen && isMobile" class="backdrop" @click="sidebarOpen = false" />

    <div class="main-panel">
      

      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>



<style scoped>
/* ── 全局容器 ── */
.app-shell {
  height: 100vh;
  overflow: hidden;
  display: flex;
  background: transparent;
}

/* ── 切换按钮 ── */
.menu-toggle {
  position: fixed;
  top: 18px;
  left: 18px;
  z-index: 1001;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: #0f172a;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.menu-toggle:hover {
  background: #1e293b;
}

/* ── 侧边栏（桌面端：流式推入；手机端：浮层） ── */
.sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  color: #e2e8f0;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
  transition: margin-left 0.3s ease;
}

/* 关闭时向左滑出（仅非桌面端） */
@media (max-width: 1200px) {
  .sidebar:not(.open) {
    margin-left: -280px;
  }
}

/* 桌面端 > 1200px：侧边栏常驻，☰ 按钮隐藏 */
@media (min-width: 1201px) {
  .sidebar {
    margin-left: 0 !important;
  }

  .menu-toggle {
    display: none !important;
  }
}

/* 手机端用固定浮层 + 遮罩 */
@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1002;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    margin-left: 0 !important;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-badge {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  color: white;
}

.brand-title {
  font-weight: 700;
  color: white;
}

.brand-subtitle {
  font-size: 0.8rem;
  color: #94a3b8;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

/* ── 导航 ── */
.nav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 12px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(255,255,255,0.08);
  color: white;
}

.router-link-active {
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.26), rgba(96, 165, 250, 0.22));
  color: white;
  font-weight: 600;
}

/* ── 脚注 ── */
.sidebar-footer {
  margin-top: auto;
}

.footer-pill {
  padding: 10px 12px;
  border-radius: 999px;
  text-align: center;
  color: #94a3b8;
  background: rgba(255,255,255,0.05);
  font-size: 0.78rem;
}

/* ── 遮罩层（仅手机端） ── */
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(0,0,0,0.35);
}

/* ── 主面板 ── */
.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-height: 100vh;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 18px 24px;
  padding-left: 70px;
  border-radius: 18px;
  background: rgba(255,255,255,0.8);
  border: 1px solid rgba(226,232,240,0.9);
  box-shadow: 0 10px 30px rgba(15,23,42,0.05);
}

.topbar h1 {
  margin: 0;
  font-size: 1.2rem;
  color: #0f172a;
}

.topbar-badge {
  padding: 8px 12px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.content-area {
  flex: 1;
  overflow: auto;
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .main-panel {
    padding: 12px;
  }

  .topbar {
    padding: 12px 16px;
    padding-left: 60px;
    margin-bottom: 12px;
  }

  .topbar h1 {
    font-size: 1rem;
  }

  .topbar-badge {
    padding: 4px 10px;
    font-size: 0.75rem;
  }

  .menu-toggle {
    top: 12px;
    left: 12px;
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
}
</style>