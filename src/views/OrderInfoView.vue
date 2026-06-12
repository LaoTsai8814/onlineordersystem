

<template>
  <el-card class="table-card" style="margin-top: 20px;">
    <template #header>
      <div class="card-header">
        <span>User Management</span>
        <el-input
          v-model="search"
          size="default"
          placeholder="Search by Name / Phone / ID"
          style="width: 250px"
          clearable
        />
      </div>
    </template>

    <el-table :data="filterTableData" style="width: 100%" hover>
      <el-table-column label="ID" prop="id" width="120" />
      <el-table-column label="Date" prop="date" width="150" />
      <el-table-column label="Name" prop="name" min-width="120" />
      <el-table-column label="PhoneNumber" prop="phone" width="180" />
      <el-table-column align="right" label="Operations" width="220">
        <template #default="scope">
          <el-button-group v-if="scope.row.status === 0">
            <el-button size="small" @click="handleView(scope.$index, scope.row)">View</el-button>

            <el-button size="small" type="primary" plain @click="handleAccept(scope.$index, scope.row)">Accept</el-button>

            <el-button size="small" type="danger" plain @click="handleDeny(scope.$index, scope.row)">Deny</el-button>

          </el-button-group>
          <el-button-group v-if="scope.row.status === 1">
            <el-button size="small" @click="handleView(scope.$index, scope.row)">View</el-button>

            <el-button size="small" type="primary" plain @click="handleComplete(scope.$index, scope.row)">Completet</el-button>

            <el-button size="small" type="danger" plain @click="handleCancle(scope.$index, scope.row)">Cancle</el-button>

          </el-button-group>

        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { GetOrderByShopId, UpdateOrder } from '@/services/OrderService.ts';
import { useUserStore } from '@/global/userStore.ts';
import type { GetOrderResponseDTO } from '@/ViewModels/Order/OrderDTO.ts';

// 定義前端 Table 專用的資料結構
interface UserOrderInfo {
  id: string
  date: string
  name: string
  phone: string
  address: string
  customerId: string
  status: number
}

const userStore = useUserStore();
const tableData = ref<UserOrderInfo[]>([]);
const search = ref('');
const getAllAvailableOrder = async () => {
  try {
    const res = await GetOrderByShopId(userStore.getShopId());
    console.log(res);
    // 這裡做對應沒問題，很棒的習慣！
    tableData.value = res.data.orderList.map((order: GetOrderResponseDTO) => {
      return {
        id: String(order.orderId), // 轉成字串確保後續搜尋不會因型態出錯
        date: order.orderTime,
        name: order.customerName,
        phone: String(order.customerPhone),
        status: order.status,
        address: order.customerAddress,
        customerId: String(order.customerId)
      }
    });
  } catch (error) {
    console.error('獲取訂單資料失敗：', error);
  }
}
onMounted(async () => {
    await getAllAvailableOrder();
  }


);

// --- 邏輯優化（已修正 Ref 沒點 value 的噴錯問題） ---
const filterTableData = computed(() => {
  const keyword = search.value.toLowerCase().trim();

  // 修正點：沒輸入關鍵字時，必須回傳 tableData.value 而不是 tableData
  if (!keyword) return tableData.value;

  return tableData.value.filter((data) => {
    return (
      (data.name && data.name.toLowerCase().includes(keyword)) ||
      (data.phone && data.phone.includes(keyword)) ||
      (data.id && data.id.includes(keyword))
    );
  });
});

const handleAccept = async (index: number, row: UserOrderInfo) => {
  await UpdateOrder(row.id,true);
  await getAllAvailableOrder();

}
const handleDeny = async (index: number, row: UserOrderInfo) => {

  await UpdateOrder(row.id,false);
  await getAllAvailableOrder();
}


const handleComplete = async (index: number, row: UserOrderInfo) => {

  await UpdateOrder(row.id,false);
  await getAllAvailableOrder();
}
const handleCancle = async (index: number, row: UserOrderInfo) => {

  await UpdateOrder(row.id,false);
  await getAllAvailableOrder();
}
const handleView = (index: number, row: UserOrderInfo) => console.log('View:', index, row)
</script>
<style scoped>

</style>