<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  ArrowRight,
  CaretBottom,
  CaretTop,
  Warning,
} from '@element-plus/icons-vue'

interface User {
  id: string
  date: string
  name: string
  phone: string
  address: string
}

// --- 統計數據配置 (抽離後更易維護) ---
const statistics = [
  { title: 'Daily active users', value: 98500, diff: '24%', trend: 'up', tooltip: 'Number of users who logged into the product in one day' },
  { title: 'Monthly Active Users', value: 693700, diff: '12%', trend: 'down', tooltip: 'Number of users who logged into the product in one month' },
  { title: 'New transactions today', value: 72000, diff: '16%', trend: 'up' },
]

// --- 表格數據 ---
const search = ref('')
const tableData: User[] = [
  {
    id: 'ww1234',
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
    phone: '01923456789',
  },
]

// --- 邏輯優化 ---
const filterTableData = computed(() => {
  const keyword = search.value.toLowerCase().trim()
  if (!keyword) return tableData
  return tableData.filter(
    (data) =>
      data.name.toLowerCase().includes(keyword) ||
      data.phone.toLowerCase().includes(keyword) ||
      data.id.toLowerCase().includes(keyword)
  )
})

const handleEdit = (index: number, row: User) => console.log('Edit:', index, row)
const handleDelete = (index: number, row: User) => console.log('Delete:', index, row)
const handleView = (index: number, row: User) => console.log('View:', index, row)
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col v-for="item in statistics" :key="item.title" :xs="24" :sm="12" :md="8" class="mb-4">
        <div class="statistic-card shadow-sm">
          <el-statistic :value="item.value">
            <template #title>
              <div class="statistic-header">
                {{ item.title }}
                <el-tooltip v-if="item.tooltip" effect="dark" :content="item.tooltip" placement="top">
                  <el-icon class="icon-warning"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>than last period</span>
              <span :class="item.trend === 'up' ? 'green' : 'red'">
                {{ item.diff }}
                <el-icon>
                  <component :is="item.trend === 'up' ? CaretTop : CaretBottom" />
                </el-icon>
              </span>
            </div>
            <div class="footer-item" v-if="item.title.includes('New')">
              <el-icon class="clickable-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

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
            <el-button-group>
              <el-button size="small" @click="handleView(scope.$index, scope.row)">View</el-button>
              <el-button size="small" type="primary" plain @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
              <el-button size="small" type="danger" plain @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 4px;
}

.statistic-card {
  padding: 24px;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;
}

.statistic-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--el-box-shadow-light);
}

.statistic-header {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.icon-warning {
  margin-left: 4px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  cursor: help;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.green { color: var(--el-color-success); font-weight: bold; }
.red { color: var(--el-color-error); font-weight: bold; }

.mb-4 { margin-bottom: 1rem; }

.clickable-icon {
  cursor: pointer;
  transition: color 0.2s;
}
.clickable-icon:hover {
  color: var(--el-color-primary);
}
</style>