<script setup lang="ts">
import {WebHostDomain} from "@/global/EnviromentDefine.ts";

const googleLogin = async ()=>{
  window.location.href = WebHostDomain+'api/User/GoogleLogin';
};

</script>

<template >
  <el-row justify="center" align="middle" style="height: 100vh;">
    <el-col :span="6">
  <el-card justify="center" class="box-card"  >
    <div>
      <el-button @click="googleLogin">
        Google Login
      </el-button>
    </div>

  </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
p {
  margin-top: 12px;
  word-break: break-all;
}
</style>