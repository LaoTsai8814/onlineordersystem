<template>
  <div class="customer-order-container" style="max-width: 800px; margin: 20px auto; padding: 0 15px;">
    <h3 style="margin-bottom: 20px;">🛍️ 我的訂單歷史 (My Orders)</h3>

    <div v-if="customerOrders.length === 0" style="text-align: center; margin-top: 50px;">
      <el-empty description="目前沒有訂單紀錄" />
    </div>

    <el-card
        v-for="order in customerOrders"
        :key="order.id"
        class="order-card"
        style="margin-bottom: 20px;"
    >
      <div class="order-header">
        <span class="order-id">訂單號：#{{ order.id }}</span>
        <el-tag :type="getStatusTag(order.status)">{{ getStatusText(order.status) }}</el-tag>
      </div>

      <div class="order-body" style="margin: 15px 0;">
        <p><strong>下單時間：</strong>{{ order.date }}</p>
        <p><strong>外送地址：</strong>{{ order.address }}</p>
      </div>

      <div class="order-steps" style="margin: 20px 0 10px 0;">
        <el-steps :active="getStepActive(order.status)" finish-status="success" simple size="small">
          <el-step title="提交訂單" />
          <el-step title="商家接單" />
          <el-step title="美味送達" />
        </el-steps>
      </div>

      <div class="order-footer" style="text-align: right;">
        <el-button size="default" @click="viewOrderDetail(order.id)">訂單詳情</el-button>

        <el-button
            v-if="order.status === 0"
            size="default"
            type="danger"
            plain
            @click="cancelMyOrder(order.id)"
        >
          取消訂單
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {GetOrderByCustomerId, GetOrderByShopId, UpdateOrder} from '@/services/OrderService.ts'; // 假設你有依據客戶ID抓資料的API
import { useUserStore } from '@/global/userStore.ts';

interface CustomerOrder {
  id: string;
  date: string;
  address: string;
  status: number;
}


const customerOrders = ref<CustomerOrder[]>([]);

const fetchCustomerOrders = async (usrId: string) => {
  try {
    // 這裡替換成你拿取顧客個人訂單的 API
    const res = await GetOrderByCustomerId(usrId);
    customerOrders.value = res.map((order: any) => ({
      id: String(order.orderId),
      date: order.orderTime,
      address: order.customerAddress,
      status: order.status
    }));
  } catch (error) {
    console.error('取得歷史訂單失敗', error);
  }
};

onMounted(async () => {
  const userStore = useUserStore();
  await fetchCustomerOrders(userStore.userInfo.id);
});

const cancelMyOrder = async (orderId: string) => {
  try {
    await ElMessageBox.confirm('確定要取消這筆訂單嗎？', '提示', {
      confirmButtonText: '確定取消',
      cancelButtonText: '再想想',
      type: 'warning',
    });

    await UpdateOrder(orderId, 3);
    ElMessage.success('訂單已成功取消');
    const userStore = useUserStore();
    await fetchCustomerOrders(userStore.userInfo.id);
  } catch {
    // 使用者點擊取消，不做任何事
  }
};

const viewOrderDetail = (id: string) => {
  console.log('跳轉到訂單明細頁面，ID:', id);
};

// 狀態控制邏輯
const getStatusTag = (status: number) => {
  if (status === 0) return 'warning';
  if (status === 1) return 'primary';
  if (status === 2) return 'success';
  return 'info';
};

const getStatusText = (status: number) => {
  if (status === 0) return '等待商家接單';
  if (status === 1) return '商家已接單，製作/配送中';
  if (status === 2) return '訂單已完成';
  return '訂單已取消';
};

// 計算進度條走到第幾步
const getStepActive = (status: number) => {
  if (status === 0) return 1;
  if (status === 1) return 2;
  if (status === 2) return 3;
  return 0; // 取消則不亮燈
};
</script>

<style scoped>
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}
.order-id {
  font-weight: bold;
  color: #333;
}
.order-body p {
  margin: 6px 0;
  color: #666;
  font-size: 14px;
}
</style>