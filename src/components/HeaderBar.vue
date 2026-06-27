<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/global/userStore.ts';
import { ShoppingCart } from '@element-plus/icons-vue';
import { UserRole } from '@/ViewModels/User/UserRole.ts';
import { GetCustomerCartCount } from '@/services/UserService.ts';

const islogin = defineModel<boolean>('islogin');
const userStore = useUserStore();
const customerCartCount = ref(0);


const getCustomerCartCount=async  () => {
  customerCartCount.value = await GetCustomerCartCount()
};
</script>
<template>
  <div class="headerbar-container justify-end">
    <el-menu  mode="horizontal" :ellipsis="false" class="nav-menu " router >
      <div class="flex-grow" />

      <el-menu-item v-if="userStore.getUserRoles().includes(UserRole.ShopOwner)" index="orderInfo">我的訂單</el-menu-item>
      <el-menu-item v-if="userStore.getUserRoles().includes(UserRole.Customer)" index="cart">
        <el-badge :value="customerCartCount" class="item">
          <el-icon><ShoppingCart/></el-icon> 購物車
        </el-badge>
      </el-menu-item>
      <el-sub-menu v-if="userStore.isLogin" index="4">
        <template #title>個人中心</template>
        <el-menu-item index="4-1">帳號設定</el-menu-item>
        <el-menu-item @click="userStore.logout()">登出</el-menu-item>
      </el-sub-menu>
      <el-menu-item v-if="!userStore.isLogin" index="/login">
        <template #title>登入</template>

      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1; /* 就像 WPF 的 Width="*" */
}


</style>