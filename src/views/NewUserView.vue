<script setup lang="ts">
import { ref } from 'vue'
import { UserRole } from '@/ViewModels/User/UserRole.ts'
import { AddPersonlInfo, JWTDecode } from '@/services/UserService.ts';
import router from '@/router'

const props = defineProps(['token'])

if (props['token']) {
  JWTDecode(props.token)
} else {
  router.push('/OnErrorOccur')
}

// 1. 定義表單資料結構，並設定初始值
const formData = ref({
  role: UserRole.Customer,
  address: '',
  phone: ''
})

// 當 Radio 變更時同步更新（如果需要額外邏輯可以寫在這，否則 v-model 已經會自動同步）
const handleChange = (val: UserRole) => {
  formData.value.role = val
}

// 2. 提交表單，將整包資料送給後端 API
const OnSubmit = async () => {
  // 簡單的前端防呆驗證
  if (!formData.value.address.trim() || !formData.value.phone.trim()) {
    alert('請填寫完整的地址與電話號碼！')
    return
  }

  // 將資料包裝成物件傳送（請確認你的 AddUserRoleClaim API 是否支援接收這些欄位）
  const result = await AddPersonlInfo(
     formData.value.role,
     formData.value.address,
     formData.value.phone
  )

  if (result) {
    await router.push('/dashboard')
  }
}
</script>

<template>
  <el-row type="flex" justify="center" align="middle" style="margin-top: 20px;">
    <el-col :span="12">
      <el-card class="box-card">
        <template #header>
          <span>角色選擇與資料填寫</span>
        </template>

        <el-form label-position="top">

          <el-form-item label="請選擇您的角色">
            <el-radio-group v-model="formData.role" @change="handleChange">
              <el-radio :value="UserRole.Customer">顧客</el-radio>
              <el-radio :value="UserRole.ShopOwner">商家</el-radio>
              <el-radio :value="UserRole.Admin">管理員</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="電話號碼">
            <el-input
              v-model="formData.phone"
              placeholder="請輸入電話號碼（例如：0912345678）"
              clearable
            />
          </el-form-item>

          <el-form-item label="完整地址">
            <el-input
              v-model="formData.address"
              type="textarea"
              :rows="2"
              placeholder="請輸入您的完整收件或營業地址"
              clearable
            />
          </el-form-item>

        </el-form>
      </el-card>

      <el-button type="primary" style="margin-top: 15px; width: 100%;" @click="OnSubmit">
        Submit
      </el-button>
    </el-col>
  </el-row>
</template>