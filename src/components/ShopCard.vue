<template>
  <el-card class="shop-card" :body-style="{ padding: '0px' }" shadow="hover">
    <div class="image-container">
      <el-image
        :src="WebHostDomain+shop.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'"
        fit="cover"
        class="shop-image"
      />
      <el-tag
        class="status-tag"
        :type="shop.isOpen ? 'success' : 'danger'"
        effect="dark"
        round
      >
        {{ shop.isOpen ? '營業中' : '休息中' }}
      </el-tag>
    </div>

    <div class="shop-content">
      <div class="shop-header">
        <span class="shop-name">{{ shop.name }}</span>
        <div class="rating-box">
          <el-icon color="#f7ba2a"><StarFilled /></el-icon>
          <span class="rating-text">{{ shop.rating }}</span>
        </div>
      </div>
      <div class="shop-info">
        <el-icon><Document/></el-icon>
        <span class="address-text">{{ shop.description }}</span>
      </div>
      <div class="shop-info">
        <el-icon><Location /></el-icon>
        <span class="address-text">{{ shop.address }}</span>
      </div>

      <div class="shop-tags">
        <el-tag
          v-for="tag in shop.tags"
          :key="tag"
          size="small"
          class="tag-item"
          effect="plain"
        >
          {{ tag }}
        </el-tag>
      </div>

      <!-- 【重點修正】根據 isEditMode 顯示不同按鈕或隱藏 -->
      <div class="action-area mt-4">
        <!-- 模式 A: 作者/編輯模式 -> 顯示編輯商店 -->
        <el-button
          v-if="isEditMode"
          type="primary"
          class="view-btn"
          @click="$emit('view-detail', shop.id)"
        >
          編輯商店
        </el-button>

        <!-- 模式 B: 顧客模式 -> 顯示進入商店 (或者你可以選擇完全隱藏) -->
        <el-button
          v-else
          type="success"
          plain
          class="view-btn"
          @click="$emit('enter-shop', shop.id)"
        >
          進入點餐
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { StarFilled, Location, Document } from '@element-plus/icons-vue';
import { WebHostDomain } from '@/global/EnviromentDefine.ts';
import type { ShopInfo } from '@/ViewModels/Shop/ShopDTO.ts';


interface Props {
  shop: ShopInfo;
  isEditMode?: boolean;
}

// 使用 withDefaults 設定預設值
const props = withDefaults(defineProps<Props>(), {
  isEditMode: false
});

// 定義事件：增加 enter-shop 給顧客用
defineEmits(['view-detail', 'enter-shop']);
</script>


<style scoped>
.shop-card {
  width: 300px;
  border-radius: 12px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.image-container {
  position: relative;
  height: 180px;
  width: 100%;
}

.shop-image {
  width: 100%;
  height: 100%;
}

.status-tag {
  position: absolute;
  top: 12px;
  right: 12px;
}

.shop-content {
  padding: 16px;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.shop-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-text {
  font-size: 14px;
  color: #606266;
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 13px;
  margin-bottom: 12px;
}

.address-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shop-tags {
  margin-bottom: 16px;
  height: 24px;
  overflow: hidden;
}

.tag-item {
  margin-right: 6px;
}

.view-btn {
  width: 100%;
  border-radius: 8px;
}
</style>