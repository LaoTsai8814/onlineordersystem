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

      <el-button
        type="primary"
        class="view-btn"
        @click="$emit('view-detail', shop.id)"
      >
        編輯商店
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import { StarFilled, Location, Document } from '@element-plus/icons-vue';
import { WebHostDomain } from '@/global/EnviromentDefine.ts';

defineProps({
  shop: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      name: '預設商店',
      description: '',
      image: '',
      rating: 4.5,
      address: '台北市某個角落',
      isOpen: true,
      tags: ['美食', '咖啡']
    })
  }
});

defineEmits(['view-detail']);
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