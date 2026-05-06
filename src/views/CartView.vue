<template>
  <div class="cart-container">
    <el-row :gutter="20">
      <!-- 左側：商品列表 -->
      <el-col :xs="24" :md="16">
        <el-card shadow="never" class="cart-list-card">
          <template #header>
            <div class="cart-header">
              <span>購物車 ({{ cartStore.totalItems }} 件商品)</span>
              <el-button type="danger" link @click="cartStore.clearCart">清空購物車</el-button>
            </div>
          </template>

          <div v-if="cartStore.items.length === 0" class="empty-cart">
            <el-empty description="購物車空空如也" />
          </div>

          <div v-else class="cart-item" v-for="item in cartStore.items" :key="item.id">
            <el-image :src="WebHostDomain + item.image" fit="cover" class="item-image" />

            <div class="item-info">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-category">{{ item.category }}</p>
              <div class="item-price-row">
                <span class="item-price">${{ item.price }}</span>
                <div class="item-actions">
                  <el-input-number
                    v-model="item.quantity"
                    :min="1"
                    size="small"
                    @change="(val) => cartStore.updateQuantity(item.id, val)"
                  />
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    @click="cartStore.removeItem(item.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右側：結算明細 -->
      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="summary-card">
          <h3 class="summary-title">訂單摘要</h3>
          <div class="summary-row">
            <span>商品總計</span>
            <span>${{ cartStore.totalPrice }}</span>
          </div>
          <div class="summary-row">
            <span>運費</span>
            <span class="free-shipping">免運費</span>
          </div>
          <el-divider />
          <div class="summary-row total">
            <span>總額</span>
            <span class="total-amount">${{ cartStore.totalPrice }}</span>
          </div>
          <el-button type="primary" class="checkout-btn" size="large" @click="handleCheckout">
            前往結帳
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue';
import { useCartStore } from '@/global/cartStore.ts'; // 假設你建立此 Store
import { WebHostDomain } from '@/global/EnviromentDefine.ts';
import { ElMessage } from 'element-plus';

const cartStore = useCartStore();

const handleCheckout = () => {
  if (cartStore.items.length === 0) {
    ElMessage.warning('購物車內沒有商品');
    return;
  }
  // 實作結帳邏輯
  console.log('進行結帳...', cartStore.items);
};
</script>

<style scoped>
.cart-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f2f6fc;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  margin: 0;
  font-size: 1.1rem;
}

.item-category {
  color: #909399;
  font-size: 0.85rem;
  margin: 4px 0;
}

.item-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 1.2rem;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-card {
  position: sticky;
  top: 20px;
}

.summary-title {
  margin-top: 0;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #606266;
}

.total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #303133;
}

.total-amount {
  color: #f56c6c;
}

.free-shipping {
  color: #67c23a;
}

.checkout-btn {
  width: 100%;
  margin-top: 20px;
}
</style>