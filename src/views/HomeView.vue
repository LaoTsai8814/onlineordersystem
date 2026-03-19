<script lang="ts" setup> // 使用 setup 語法糖更簡潔
import { watch } from 'vue';
import { useUserStore } from '@/global/userStore.ts';
import { useRouter } from 'vue-router'; // 建議使用 useRouter hook

const userStore = useUserStore();
const router = useRouter();

// 直接放在頂層，不需要等 onMounted
watch(
  () => userStore.isLogin,
  (isLoggedIn) => {
    console.log("登入狀態改變：", isLoggedIn);
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="intro-container">
    <section class="hero-section">
      <div class="hero-content">
        <h1>品味城市，即刻送達</h1>
        <p class="subtitle">我們致力於將在地最優質的餐廳，以最快的速度送到您的餐桌。</p>
        <div class="hero-btns">
          <el-button type="primary" size="large" round>探索菜單</el-button>
          <el-button size="large" plain round>了解更多</el-button>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>© 2026 Urban Eats Group. 專注於味蕾的饗宴。</p>
    </footer>
  </div>
</template>

<style scoped>
/* 1. 確保外層容器不向外溢出 */
.intro-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-section {
  /* 使用 min-height 確保內容不會被切掉 */
  min-height: calc(100vh - 80px);
  width: 100%;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
  url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200') center/cover no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  /* 修正全螢幕寬度可能出現的橫向滾動條 */
  box-sizing: border-box;
}

.hero-content {
  padding: 0 20px;
  max-width: 800px;
}

.hero-content h1 {
  font-size: clamp(2rem, 8vw, 3.5rem); /* 響應式字體大小 */
  margin-bottom: 24px;
  font-weight: 700;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  line-height: 1.6;
  opacity: 0.9;
}

.hero-btns  {
  padding: 12px 30px;
  font-size: 1.1rem;
  transition: transform 0.2s;
}

.hero-btns :hover {
  transform: translateY(-2px);
}

.footer {
  background: #1a1a1a;
  color: #888;
  text-align: center;
  padding: 40px 20px;
  margin-top: auto; /* 將 footer 推到底部 */
}
</style>