<template>
  <el-card :body-style="{ padding: '0px' }" class="product-card" shadow="hover">
    <!-- 1. 圖片區：固定比例與高度 -->
    <div class="image-wrapper">
      <el-image :src="WebHostDomain+product.image" fit="cover" class="product-image">
        <template #error>
          <div class="image-placeholder">
            <el-icon :size="40"><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <div v-if="product.stock <= 0" class="out-of-stock-overlay">
        <span>售完</span>
      </div>
    </div>

    <!-- 2. 內容區：強制 Flex 垂直排列並固定高度 -->
    <div class="content-container">
      <div class="header-section">
        <h3 class="product-title" :title="product.name">{{ product.name }}</h3>
        <el-tag size="small" type="info" effect="plain">{{ product.category }}</el-tag>
      </div>

      <!-- 描述文字：固定兩行高度，超出的部分顯示省略號 -->
      <p class="product-description">
        {{ product.description || '暫無產品描述資訊' }}
      </p>

      <!-- 3. 底部區：關鍵在於 margin-top: auto -->
      <div class="footer-section">
        <span class="product-price">${{ product.price }}</span>
        <div class="action-buttons">
          <el-input-number v-if="!isShopOwner"  size="small" v-model="num" :min="0" :max="product.stock" @change="handleChange" />
          <el-button v-if="!isShopOwner"
            type="primary"
            circle
            size="small"
            :icon="ShoppingCart"
            @click.stop="$emit('add-to-cart', product,num)"
            :disabled="product.stock <= 0"
          />
          <el-button v-if="isShopOwner"
            circle
            size="small"
            :icon="View"
            @click.stop="$emit('view-detail', product.id)"
          />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ShoppingCart, View, Picture } from '@element-plus/icons-vue';
import type { ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';
import { WebHostDomain } from '@/global/EnviromentDefine.ts';
import { ref } from 'vue'

const isShopOwner = defineModel<boolean>('isShopOwner');
defineProps<{ product: ProductInfo }>();
defineEmits(['view-detail', 'add-to-cart']);


const num = ref(1)
const handleChange = (value: number | undefined) => {

}
</script>

<style scoped>
.product-card {
  width: 100%; /* 固定寬度 */
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  gap: 100px;       /* 設置卡片間距 */
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 180px; /* 固定圖片高度 */
  background-color: #f5f7fa;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
}

/* 內容區塊的關鍵設定 */
.content-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 160px; /* 【重要】固定內容區高度，確保所有卡片等高 */
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.product-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
  color: #303133;
  /* 標題過長時自動省略 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.product-description {
  font-size: 0.85rem;
  color: #909399;
  margin: 0;
  /* 實作多行文字截斷 (固定兩行) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  height: 2.8em; /* 對應 line-height * 2 */
}

.footer-section {
  /* 【重點】將底部區塊推到最下方，不論描述長短，這裡都會對齊 */
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f2f6fc;
}

.product-price {
  font-size: 1.2rem;
  color: #f56c6c;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  backdrop-filter: blur(2px);
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #a8abb2;
}
</style>