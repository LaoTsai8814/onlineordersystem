<template>
  <div class="grid-container">
    <ProductCard
      v-for="p in productList"
      :key="p.id"
      :product="p"
      :isShopOwner="false"

      @view-detail="handleViewDetail"
      @add-to-cart="handleAddToCart"
    />
  </div>


</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue';
import { onMounted, ref } from 'vue';
import ProductInfoDialog from '@/components/ProductInfoDialog.vue';
import { Plus } from '@element-plus/icons-vue';
import type { ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';
import { GetAllAvailableProducts, GetProductById, GetProductsByProductId } from '@/services/ProductService.ts';
import { useUserStore } from '@/global/userStore.ts';
import { UserRole } from '@/ViewModels/User/UserRole.ts';
import { useCartStore } from '@/global/cartStore.ts';
import { addItemToCart } from '@/services/CartService.ts';

const drawer = ref<boolean>(false);
const isShopOwner = defineModel<boolean>('isShopOwner')
const productList = ref<ProductInfo[]>([]);

const initdata = ref<ProductInfo>();

onMounted(async () => {
  const userStore = useUserStore();
  productList.value=await GetAllAvailableProducts();

})

const handleViewDetail = async (id: string) => {


  drawer.value = true;

  initdata.value = await GetProductsByProductId(id);
  console.log(initdata.value);
  console.log('查看產品:', id);
};

const handleAddToCart = (product: ProductInfo,quantity: number,cartId:string) => {
  const cartStore = useCartStore();
  const userStore = useUserStore();
  cartStore.addItemWithQuantity(product, quantity,product.price,cartId);
  addItemToCart(product,quantity,userStore.userInfo.id)
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