
<script lang="ts" setup>
import { ref } from 'vue';
import { Expand, Fold, Food, InfoFilled, Monitor, Setting, Shop, Tickets } from '@element-plus/icons-vue';
import { useUserStore } from '@/global/userStore.ts';
import { UserRole } from '@/ViewModels/User/UserRole.ts';

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const OnHamburgerButtonClick= ()=>{
  isCollapse.value=!isCollapse.value


}
const userStore = useUserStore();
</script>
<template class="d-flex justify-start" >

  <div class="side-nav-container " v-if="userStore.isLogin">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      router
    >
      <el-menu-item @click="OnHamburgerButtonClick" >
          <el-icon>
            <fold v-if="isCollapse"></fold>
            <expand v-if="!isCollapse"></expand>
          </el-icon>
          <template #title></template>
      </el-menu-item>
      <el-menu-item index="/dashboard">
        <el-icon><monitor/></el-icon>
        <template #title>

          <span>Dashboard</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/shop" v-if="userStore.getUserRoles().includes(UserRole.Customer)">
        <el-icon>< <shop/></el-icon>
        <template #title>Shops</template>
      </el-menu-item>
      <el-menu-item index="/product" v-if="userStore.getUserRoles().includes(UserRole.ShopOwner)" :disabled="!userStore.isShopCreated()">
        <el-icon>< <food/></el-icon>
        <template #title>Product</template>
      </el-menu-item>
      <el-menu-item index="/order" :disabled="userStore.getUserRoles().includes(UserRole.ShopOwner)&&!userStore.isShopCreated()">
        <el-icon>< <tickets/></el-icon>
        <template #title>Orders</template>
      </el-menu-item>
      <el-menu-item index="/shopInfo" v-if="userStore.getUserRoles().includes(UserRole.ShopOwner)">
        <el-icon><info-filled/></el-icon>
        <template #title>ShopInfo</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>Settings</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>


<style scoped>


/* 2. Slide Menu 主體 */
.side-nav-container {
  display: flex;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: white;
  z-index: 2000;

  /* 平滑動畫效果 (像 XAML 的 Storyboard) */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* 陰影效果增加層次感 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

  /* 頂部留白給按鈕 */
  padding-top: 70px;
}

/* 3. 處理折疊與展開的寬度 */
/* 這裡利用 Element Plus 的 class 或是自定義 class 控制 */
.el-menu-vertical-demo {
  border-right: none;
  height: 100%;
}


</style>
