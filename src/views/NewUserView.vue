<script setup lang="ts">
import { ref } from 'vue'
import  { UserRole } from '@/ViewModels/User/UserRole.ts';
import { AddUserRoleClaim, JWTDecode } from '@/services/UserService.ts';
import router from '@/router';
// 2. 綁定資料（通常從後端取得 int，例如 1）
// 這裡 ref 會自動推導或明確指定型別為 UserStatus
const currentStatus = ref<UserRole>(UserRole.Customer)
const props = defineProps(['token']);
if (props['token']) {
  JWTDecode(props.token);

}
else{
  router.push('/OnErrorOccur');
}
const handleChange = async (val: UserRole) => {
  currentStatus.value = val
}
const OnSubmit = async (data: UserRole) => {
  const result = await AddUserRoleClaim(data);

  if(result){
    await router.push('/dashboard');
  }

}
</script>

<template>
  <el-row type="flex" justify="center" align="middle" style="margin-top: 20px;">
    <el-col :span="12">
      <el-card class="box-card">
        <template #header>
          <span>角色選擇</span>
        </template>

        <el-radio-group v-model="currentStatus" @change="handleChange">
          <el-radio :value="UserRole.Customer">顧客</el-radio>
          <el-radio :value="UserRole.ShopOwner">商家</el-radio>
          <el-radio :value="UserRole.Admin">管理員</el-radio>
        </el-radio-group>


      </el-card>
      <el-button @click="OnSubmit(currentStatus)">
        Submit
      </el-button>
    </el-col>
  </el-row>
</template>