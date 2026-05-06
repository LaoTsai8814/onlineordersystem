<script setup lang="ts">
import { DocumentAdd } from '@element-plus/icons-vue';
import AddShopInfoDialog from '@/components/AddShopInfoDialog.vue';
import { onMounted, ref } from 'vue';
import type { ShopForm, ShopInfo } from '@/ViewModels/Shop/ShopDTO.ts';
import ShopCard from '@/components/ShopCard.vue';
import { GetShopByShopId, GetShopByUserId } from '@/services/ShopService.ts';
import { useUserStore } from '@/global/userStore.ts';
import type { FormInstance } from 'element-plus';

const drawdialog = ref(false);
const loading = ref(false); // 新增 loading 狀態
const userStore = useUserStore();
const shops = ref<ShopInfo[]>([]);

const editformdata= ref<ShopForm>({
  shopid:'',
  shopname: '',
  shopdescription: '',
  shopaddress: '',
  isshopopen: false,
  imageFile: null
});
const fetchShops = async () => {
  loading.value = true;
  try {
    // 確保 userId 存在再發送請求
    if (userStore.userInfo?.id) {

      const res = await GetShopByUserId(userStore.userInfo.id);
      console.log(res);
      shops.value = res;
      userStore.isShopCreated()
    }
  } catch (error) {
    console.error("獲取商店列表失敗:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchShops);

const handleDetail = async (id: string) => {
  const res = await GetShopByShopId(id);
  console.log(res);
  editformdata.value = {
    shopid:res.id,
    shopname: res.name,
    shopdescription: res.description,
    shopaddress: res.address,
    isshopopen: res.isOpen,
    imageFile: res.image // 這裡是 URL 字串
  };
  console.log(res);
  console.log(editformdata);
  drawdialog.value = true;
};

// 當彈窗關閉且成功新增後，可能需要重新刷新列表
const handleSuccess = () => {
  fetchShops();
};
</script>

<template>
  <div class="p-8 flex gap-6 flex-wrap" v-loading="loading">
    <ShopCard
      v-for="item in shops"
      :key="item.id"
      :shop="item"
      :is-edit-mode="true"
      @view-detail="handleDetail"
    >

    </ShopCard>

    <el-card
      v-if="shops.length === 0"
      @click="drawdialog = true"
      class="add-card flex-center"
      shadow="hover"
    >
      <el-icon :size="40" color="#409EFC">
        <DocumentAdd />
      </el-icon>
      <p class="mt-2">點擊新增店家</p>
    </el-card>
  </div>
  <AddShopInfoDialog
    v-model:drawdialog="drawdialog"
    v-model:formdata="editformdata"
    @success="handleSuccess"
  />

</template>

<style scoped>
.add-card {
  width: 300px; /* 建議與 ShopCard 寬度一致 */
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px dashed #dcdfe6; /* 使用虛線更有「新增」的感覺 */
  transition: all 0.3s;
}

.add-card:hover {
  border-color: #409EFC;
  background-color: #f5f7fa;
}

.flex-center :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mt-2 {
  margin-top: 8px;
  color: #606266;
}
</style>