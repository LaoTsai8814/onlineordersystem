<script lang="ts" setup>
import { ref } from 'vue';

import CustomerDashboard from '@/views/Dashboard/CustomerDashboard.vue';
import ShopDashboard from '@/views/Dashboard/ShopDashboard.vue';
import { useUserStore } from '@/global/userStore.ts';
import { UserRole } from '@/ViewModels/User/UserRole.ts';
import AdminDashboard from '@/views/Dashboard/AdminDashboard.vue';

const userStore = useUserStore();


const activeName = ref('')

if(userStore.getUserRoles().includes(UserRole.Customer)){
  activeName.value = 'Customer';
}
else if(userStore.getUserRoles().includes(UserRole.ShopOwner)){
  activeName.value = 'ShopOwner';
}
else if(userStore.getUserRoles().includes(UserRole.Admin)){
  activeName.value = 'Admin';
}

</script>
<template>
  <el-tabs
    v-model="activeName"
    type="card"
    class="demo-tabs"

  >
    <el-tab-pane v-if="userStore.getUserRoles().includes(UserRole.Customer)" label="Customer" name="Customer">
      <CustomerDashboard ></CustomerDashboard>
    </el-tab-pane>
    <el-tab-pane v-if="userStore.getUserRoles().includes(UserRole.ShopOwner)" label="ShopOwner" name="ShopOwner">
      <ShopDashboard ></ShopDashboard>
    </el-tab-pane>
    <el-tab-pane v-if="userStore.getUserRoles().includes(UserRole.Admin)" label="Admin" name="Admin">
      <AdminDashboard ></AdminDashboard>
    </el-tab-pane>
  </el-tabs>
  <el-container >

  </el-container>
</template>



<style>

</style>