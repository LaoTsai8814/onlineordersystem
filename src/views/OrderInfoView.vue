<template>
  <el-card class="table-card" style="margin-top: 20px;">
    <template #header>
      <div class="card-header">
        <span class="title">🏪 訂單管理中心 (Order Management)</span>
        <el-input
            v-model="search"
            size="default"
            placeholder="搜尋訂單編號 / 姓名 / 電話"
            style="width: 280px"
            clearable
            prefix-icon="Search"
        />
      </div>
    </template>

    <el-table :data="filterTableData" style="width: 100%" stripe highlight-current-row>
      <el-table-column label="訂單編號" prop="id" width="120" />
      <el-table-column label="下單時間" prop="date" width="180" />
      <el-table-column label="顧客姓名" prop="name" width="120" />
      <el-table-column label="聯絡電話" prop="phone" width="150" />
      <el-table-column label="外送地址" prop="address" min-width="200" show-overflow-tooltip />

      <el-table-column label="訂單狀態" width="130" align="center">
        <template #default="scope">
          <el-tag :type="getStatusTag(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作選項" width="240">
        <template #default="scope">
          <el-button size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>

          <el-button-group v-if="scope.row.status === 0" style="margin-left: 10px;">
            <el-button size="small" type="success" plain @click="handleUpdateStatus(scope.row.id, 1)">
              接單
            </el-button>
            <el-button size="small" type="danger" plain @click="handleUpdateStatus(scope.row.id, 3)">
              拒絕
            </el-button>
          </el-button-group>

          <el-button-group v-if="scope.row.status === 1" style="margin-left: 10px;">
            <el-button size="small" type="primary" plain @click="handleUpdateStatus(scope.row.id, 2)">
              完成
            </el-button>
            <el-button size="small" type="danger" plain @click="handleUpdateStatus(scope.row.id, 3)">
              取消
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { GetOrderByShopId, UpdateOrder } from '@/services/OrderService.ts';
import { useUserStore } from '@/global/userStore.ts';
import type { GetOrderResponseDTO } from '@/ViewModels/Order/OrderDTO.ts';

interface UserOrderInfo {
  id: string;
  date: string;
  name: string;
  phone: string;
  address: string;
  customerId: string;
  status: number;
}

const userStore = useUserStore();
const tableData = ref<UserOrderInfo[]>([]);
const search = ref('');

// 獲取所有訂單
const getAllAvailableOrder = async () => {
  try {
    const res = await GetOrderByShopId(userStore.getShopId());
    tableData.value = res.data.orderList.map((order: GetOrderResponseDTO) => ({
      id: String(order.orderId),
      date: order.orderTime,
      name: order.customerName,
      phone: String(order.customerPhone),
      status: order.status, // 狀態碼
      address: order.customerAddress,
      customerId: String(order.customerId)
    }));
  } catch (error) {
    ElMessage.error('獲取訂單資料失敗');
    console.error(error);
  }
};

onMounted(async () => {
  await getAllAvailableOrder();
});

// 關鍵字搜尋邏輯
const filterTableData = computed(() => {
  const keyword = search.value.toLowerCase().trim();
  if (!keyword) return tableData.value;

  return tableData.value.filter((data) => {
    return (
        (data.name && data.name.toLowerCase().includes(keyword)) ||
        (data.phone && data.phone.includes(keyword)) ||
        (data.id && data.id.includes(keyword))
    );
  });
});

// 統一狀態變更 Method (傳入目標狀態碼)
const handleUpdateStatus = async (orderId: string, nextStatus: number) => {
  try {
    // 建議後端 UpdateOrder 改為接收訂單 ID 與目標狀態碼
    await UpdateOrder(orderId, nextStatus);
    ElMessage.success('訂單狀態已更新');
    await getAllAvailableOrder(); // 重新整理列表
  } catch (error) {
    ElMessage.error('操作失敗，請稍後再試');
  }
};

const handleView = (index: number, row: UserOrderInfo) => {
  console.log('查看訂單詳情：', row);
};

// 狀態標籤顏色對應
const getStatusTag = (status: number) => {
  switch (status) {
    case 0: return 'warning'; // 待處理
    case 1: return 'primary'; // 進行中
    case 2: return 'success'; // 已完成
    case 3: return 'info';    // 已取消
    default: return '';
  }
};

// 狀態文字對應
const getStatusText = (status: number) => {
  switch (status) {
    case 0: return '待接單';
    case 1: return '配送中/製作中';
    case 2: return '已完成';
    case 3: return '已取消';
    default: return '未知狀態';
  }
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-weight: bold;
  font-size: 16px;
}
</style>