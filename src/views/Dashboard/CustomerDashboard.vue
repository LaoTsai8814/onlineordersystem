<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/global/userStore.ts';



const recentOrders = ref([
  { orderId: 'ORD-2026-001', shopName: '老王牛肉麵', amount: 180, status: '外送中' },
  { orderId: 'ORD-2026-002', shopName: '珍珠奶茶專賣店', amount: 65, status: '已完成' },
]);

const getStatusType = (status: string) => {
  if (status === '外送中') return 'warning';
  if (status === '已完成') return 'success';
  return 'info';
};
const userStore = useUserStore();
const handleLogout = () => {

};
</script>
<template>
  <el-container class="dashboard-container">
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>進行中的訂單</template>
              <div class="card-value">2</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>我的購物金</template>
              <div class="card-value">$ 500</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>我的收藏</template>
              <div class="card-value">12 間餐廳</div>
            </el-card>
          </el-col>
        </el-row>

        <h3 style="margin-top: 30px">最近訂單</h3>
        <el-card>
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="orderId" label="訂單編號" width="180" />
            <el-table-column prop="shopName" label="餐廳" />
            <el-table-column prop="amount" label="金額">
              <template #default="scope">
                $ {{ scope.row.amount }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="狀態">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" >查看詳情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>



<style scoped>
.dashboard-container {
  height: 100vh;
  background-color: #f5f7fa;
}


.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
}
</style>