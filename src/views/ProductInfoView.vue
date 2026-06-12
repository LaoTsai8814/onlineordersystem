<template>
  <div class="grid-container">
    <ProductCard
      v-for="p in productList"
      :key="p.id"
      :product="p"
      :isShopOwner="true"
      @view-detail="handleViewDetail"
      @add-to-cart="handleAddToCart"
    />
  </div>
  <el-button  type="primary" @click="drawer=true" >
    <el-icon>
      <Plus />
    </el-icon>
    <span>新增</span>
  </el-button>
  <ProductInfoDialog v-model:initialData="initdata" @success="handleOnSuccess" v-model:model-value="drawer"></ProductInfoDialog>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue';
import { onMounted, ref } from 'vue';
import ProductInfoDialog from '@/components/ProductInfoDialog.vue';
import { Plus } from '@element-plus/icons-vue';
import type { ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';
import { GetProductById, GetProductsByProductId } from '@/services/ProductService.ts';
import { useUserStore } from '@/global/userStore.ts';
import { UserRole } from '@/ViewModels/User/UserRole.ts';

const drawer = ref<boolean>(false);
const isShopOwner = defineModel<boolean>('isShopOwner')
const productList = ref<ProductInfo[]>([

]);

const initdata = ref<ProductInfo>();

onMounted(async () => {
  const userStore = useUserStore();
  productList.value=await GetProductById(userStore.getShopId());
  isShopOwner.value = userStore.getUserRoles().includes(UserRole.ShopOwner)
})

const handleViewDetail = async (id: string) => {


  drawer.value = true;

  initdata.value = await GetProductsByProductId(id);
  console.log(initdata.value);
  console.log('查看產品:', id);
};

const handleAddToCart = (product: any) => {
  console.log('加入購物車:', product.name);
};
const handleOnSuccess = async () => {
  productList.value = await GetProductById(useUserStore().getShopId());
}

</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>