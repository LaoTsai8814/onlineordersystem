<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ShopInfo } from '@/ViewModels/Shop/ShopDTO.ts';
import ShopCard from '@/components/ShopCard.vue';
import { GetAllAvailableShop } from '@/services/ShopService.ts';
import { useRouter } from 'vue-router';

// 假設從路由獲取 userId 或從 Store 獲取
const props = defineProps<{ userId: string }>();
const router = useRouter();

const loading = ref(false);
const shops = ref<ShopInfo[]>([]);

const fetchShops = async () => {
  loading.value = true;
  try {
    // 顧客視角：獲取該使用者的所有商店（或特定清單）
    shops.value = await GetAllAvailableShop();
  } catch (error) {
    console.error("獲取商店列表失敗:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchShops);

// 顧客點擊卡片時，通常是「進入商店」而不是「編輯詳細資料」
const enterShop = (shopId: string) => {
  router.push({ name: 'ShopDetail', params: { id: shopId } });
};
</script>

<template>
  <div class="p-8" v-loading="loading">
    <h2 class="page-title">推薦商家</h2>

    <!-- 唯讀佈局：只顯示現有商店 -->
    <div class="flex gap-6 flex-wrap">
      <ShopCard
        v-for="item in shops"
        :key="item.id"
        :shop="item"
        :is-edit-mode="false"
        @click="enterShop(item.id)"
        class="readonly-card"
      />

      <!-- 如果沒有商店，顯示空狀態而不是新增按鈕 -->
      <el-empty
        v-if="shops.length === 0 && !loading"
        description="目前沒有可用的商店"
        class="w-full"
      />
    </div>
  </div>
</template>

<style scoped>
.page-title {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.readonly-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.readonly-card:hover {
  transform: scale(1.02); /* 給顧客一點點回饋感 */
}

.w-full {
  width: 100%;
}
</style>