<template>
  <div v-if="shop" class="shop-detail-page">
    <div class="shop-banner">
      <el-image
          :src=" shop.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'"
          fit="cover"
          class="banner-image"
      />
      <div class="banner-mask"></div>
      <div class="banner-content">
        <el-tag
            class="status-tag mb-3"
            :type="shop.isOpen ? 'success' : 'danger'"
            effect="dark"
            size="large"
            round
        >
          {{ shop.isOpen ? '營業中' : '休息中' }}
        </el-tag>
        <h1 class="shop-title">{{ shop.name }}</h1>
      </div>
    </div>

    <el-row :gutter="30" class="content-container">
      <el-col :xs="24" :md="16">
        <el-card class="info-card" shadow="never">
          <h2 class="section-title">我的商店資訊</h2>

          <div class="info-item">
            <el-icon class="info-icon"><Document /></el-icon>
            <div class="info-text">
              <span class="label">商店簡介：</span>
              <p class="desc-p">{{ shop.description || '暫無簡介，建議填寫以吸引顧客' }}</p>
            </div>
          </div>

          <el-divider />

          <div class="info-item">
            <el-icon class="info-icon"><Location /></el-icon>
            <div class="info-text">
              <span class="label">店家地址：</span>
              <span>{{ shop.address || '暫無地址' }}</span>
            </div>
          </div>

          <el-divider />
          <!--
          <div class="info-item flex-column">
            <span class="label">商店標籤：</span>
            <div class="shop-tags mt-2">
              <el-tag
                  v-for="tag in shop.tags"
                  :key="tag"
                  size="default"
                  class="tag-item"
                  effect="plain"
              >
                {{ tag }}
              </el-tag>
              <span v-if="!shop.tags || shop.tags.length === 0" class="text-gray">暫無標籤</span>
            </div>
          </div>
          -->
        </el-card>
      </el-col>

      <el-col :xs="24" :md="8">
        <el-card class="action-card" shadow="hover">
          <div class="rating-section">
            <span class="rating-label">目前商店評分</span>
            <div class="rating-box">
              <el-icon :size="28" color="#f7ba2a"><StarFilled /></el-icon>
              <span class="rating-score">{{ shop.rating || '0.0' }}</span>
            </div>
          </div>

          <el-divider />

          <div class="action-area">
            <el-button
                type="primary"
                size="large"
                class="action-btn"
                @click="handleEdit"
            >
              修改商店資訊 / 菜單
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <div v-else-if="hasLoaded && !shop" class="no-shop-container">
    <el-empty
        description="您目前尚未建立任何商店"
        image="https://element-plus.org/images/element-plus-logo.svg"
    >
      <el-button type="success" size="large" @click="handleCreateShop">
        立即建立我的唯一商店
      </el-button>
    </el-empty>
  </div>

  <div v-else class="loading-container">
    <el-skeleton :rows="5" animated />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { StarFilled, Location, Document } from '@element-plus/icons-vue';
import { useUserStore } from "@/global/userStore.ts";
import { GetShopByShopId } from "@/services/ShopService.ts";
import type { ShopInfo } from '@/ViewModels/Shop/ShopDTO.ts';

const router = useRouter();
const userStore = useUserStore();

const shop = ref<ShopInfo | null>(null);
const hasLoaded = ref(false); // 用來標記 API 是否加載完畢

// 導向編輯頁面
const handleEdit = () => {
  if (!shop.value) return;
  router.push(`/shopInfo/edit`);
};

// 導向創建商店頁面
const handleCreateShop = () => {
  router.push('/shopInfo/create');
};

onMounted(async () => {
  try {
    // 檢查商家帳號內是否已經綁定唯一的 shopid
    if (userStore.userInfo?.shopid) {
      shop.value = await GetShopByShopId(userStore.userInfo.shopid);
      console.log(shop.value);
    } else {
      // 如果沒有 shopid，代表該商家還沒開過店
      shop.value = null;
    }
  } catch (error) {
    console.error("獲取商店資料失敗:", error);
  } finally {
    hasLoaded.value = true; // 關閉 Skeleton 讀取效果
  }
});
</script>

<style scoped>
/* (保留先前的 CSS 樣式，僅新增下方無商店時的置中樣式) */
.shop-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
}
.shop-banner {
  position: relative;
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.banner-image { width: 100%; height: 100%; }
.banner-mask {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6));
}
.banner-content { position: absolute; bottom: 30px; left: 30px; color: #ffffff; z-index: 2; }
.shop-title { font-size: 32px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.content-container { margin-top: 20px; }
.section-title { font-size: 20px; color: #303133; margin-top: 0; margin-bottom: 24px; font-weight: 600; }
.info-card, .action-card { border-radius: 12px; border: 1px solid #e4e7ed; }
.info-item { display: flex; align-items: flex-start; gap: 12px; }
.flex-column { flex-direction: column; align-items: flex-start; }
.info-icon { font-size: 20px; color: #409eff; margin-top: 2px; }
.info-text { flex: 1; font-size: 15px; color: #606266; line-height: 1.6; }
.label { font-weight: bold; color: #303133; display: inline-block; margin-bottom: 4px; }
.desc-p { margin: 4px 0 0 0; white-space: pre-wrap; }
.shop-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.rating-section { display: flex; flex-direction: column; align-items: center; padding: 10px 0; }
.rating-label { font-size: 14px; color: #909399; margin-bottom: 8px; }
.rating-box { display: flex; align-items: center; gap: 8px; }
.rating-score { font-size: 28px; font-weight: bold; color: #303133; }
.action-btn { width: 100%; height: 50px; font-size: 16px; font-weight: bold; border-radius: 8px; }
.text-gray { color: #909399; font-size: 14px; }
.loading-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
.mb-3 { margin-bottom: 12px; }
.mt-2 { margin-top: 8px; }

/* 創建新商店的區塊樣式 */
.no-shop-container {
  max-width: 600px;
  margin: 100px auto;
  padding: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .shop-banner { height: 220px; border-radius: 0; margin-left: -20px; margin-right: -20px; }
  .banner-content { bottom: 15px; left: 15px; }
  .shop-title { font-size: 22px; }
  .action-card { margin-top: 20px; }
}
</style>