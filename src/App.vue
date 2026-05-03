<script setup lang="ts">
import {  RouterView } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue';
import HeaderBar from '@/components/HeaderBar.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { orderSignalR } from '@/services/SignalRService';
import { ElNotification } from 'element-plus';

const messages = ref<string[]>([]);

onMounted(async () => {
  await orderSignalR.start();

  // 註冊監聽事件
  orderSignalR.onReceiveUpdate((id, status) => {
    messages.value.push(`訂單 ${id} 狀態更新為: ${status}`);

    ElNotification({
      title: '訂單更新',
      message: `訂單 ${id} 目前狀態：${status}`,
      type: 'success',
    });
  });
});

onUnmounted(() => {
  // 離開頁面時視情況關閉連線，或保持連線在 App.vue
});
</script>

<template>
  <div class="common-layout">
    <el-container class="main-layout-container">

      <el-header  class="custom-header">

        <HeaderBar />
      </el-header>

      <el-container class="sub-container">

          <NavigationBar />


        <el-main class="custom-main">
          <RouterView />
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<style scoped>
/* 確保佈局撐滿 100% 視窗高度 */
.main-layout-container {
  height: 100vh;
  width: 100vw;
}

.custom-header {
  background-color: #ffffff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0; /* 清除 Header 預設內邊距，讓 HeaderBar 能貼齊邊緣 */

}

.sub-container {
  overflow: hidden; /* 防止子容器出現重複捲軸 */
}



.custom-main {
  background-color: #f5f7fa; /* 淺灰色背景，專業後台感 */
  padding: 20px;
  overflow-y: auto;
}

/* 移除 el-main 內容自動撐開可能造成的間隙 */
:deep() {
  --el-main-padding: 20px;
}
</style>

