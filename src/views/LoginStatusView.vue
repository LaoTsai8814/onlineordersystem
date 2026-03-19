<script setup lang="ts">
import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/global/userStore.ts';
  import { useRouter } from 'vue-router';
  import { GetUserRoleClaim, JWTDecode } from '@/services/UserService.ts';

  const props = defineProps(['token']);
  const successstr = ref('Login Successfully');
  const errorstr = ref('Login Error');
  const isSuccess = ref(false);
  const userStore = useUserStore();
  const router = useRouter();
onMounted(async()=>{

  if (props['token']) {
    isSuccess.value = true;
    JWTDecode(props.token);
    if(!await GetUserRoleClaim()){
      await router.push('/OnErrorOccur');
    }
    await router.push('/dashboard');
  }
  else{
    isSuccess.value = false;
    await router.push('/OnErrorOccur');
  }
  console.log('透過 Prop 接收到的 Token:', props.token);
})

</script>

<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card class="box-card">
        <el-text v-if="isSuccess" slot="title" class="title-text">
          {{ successstr }}
        </el-text>
        <el-text v-else slot="title" class="title-text">
          {{ errorstr }}
        </el-text>

      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>