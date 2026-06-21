<template>
  <div class="shop-form-page">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="title-text">{{ isEditMode ? '修改我的商店資訊' : '建立我的唯一商店' }}</span>
        </div>
      </template>

      <el-form
          ref="ruleFormRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          label-position="top"
      >
        <el-form-item label="商店圖片" prop="imageFile">
          <el-upload
              v-model:file-list="fileList"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :class="{ 'is-limit': fileList.length >= 1 }"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="商店名稱" prop="shopname">
          <el-input v-model="form.shopname" placeholder="請輸入名稱" />
        </el-form-item>

        <el-form-item label="商店描述" prop="shopdescription">
          <el-input v-model="form.shopdescription" type="textarea" :rows="3" placeholder="請填寫簡介以吸引顧客" />
        </el-form-item>

        <el-form-item label="商店地址" prop="shopaddress">
          <el-input v-model="form.shopaddress" placeholder="請輸入地址" />
        </el-form-item>

        <el-form-item label="商店營業狀態" prop="isshopopen">
          <el-switch
              v-model="form.isshopopen"
              active-text="營業中"
              inactive-text="休息中"
          />
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button size="large" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="large" :loading="submitting" @click="submitForm(ruleFormRef)">
          確認儲存
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { AddShop, UpdateShopByShopId, GetShopByShopId } from '@/services/ShopService.ts'
import { useUserStore } from '@/global/userStore.ts'
import type { ShopForm } from '@/ViewModels/Shop/ShopDTO.ts'

const router = useRouter()
const userStore = useUserStore()
const ruleFormRef = ref<FormInstance>()
const fileList = ref<any[]>([])
const submitting = ref(false)

// 根據 userStore 的 userInfo 是否有 shopid 來直接判斷是新增還是修改
const isEditMode = computed(() => !!userStore.userInfo?.shopid)

// 本地表單資料響應
const form = ref<ShopForm>({
  shopid: '',
  shopname: '',
  shopdescription: '',
  shopaddress: '',
  isshopopen: false,
  imageFile: null
})

// 監聽圖片變化（網址或檔案）處理預覽
watch(() => form.value.imageFile, (newVal) => {
  if (typeof newVal === 'string' && newVal !== '') {
    fileList.value = [{ url: newVal }];
  } else if (newVal instanceof File) {
    // 檔案類型交給 el-upload 自行處理，不重複塞 url 避免破壞原生機制
  } else {
    fileList.value = [];
  }
}, { immediate: true });

const rules = reactive<FormRules>({
  shopname: [{ required: true, message: '請輸入商店名稱', trigger: 'blur' }],
  shopdescription: [{ required: true, message: '請輸入描述', trigger: 'blur' }],
  shopaddress: [{ required: true, message: '請輸入地址', trigger: 'blur' }],
  imageFile: [{ required: true, message: '請上傳商店圖片', trigger: 'change' }]
})

const handleChange = (uploadFile: any) => {
  form.value.imageFile = uploadFile.raw;
  ruleFormRef.value?.validateField('imageFile');
}

const handleRemove = () => {
  form.value.imageFile = null;
  fileList.value = [];
}

const handleCancel = () => {
  router.back()
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      const formData = new FormData();
      formData.append('Name', form.value.shopname);
      formData.append('Description', form.value.shopdescription);
      formData.append('Address', form.value.shopaddress);
      formData.append('IsOpen', String(form.value.isshopopen));
      formData.append('UserId', userStore.userInfo?.id || '');

      if (form.value.imageFile instanceof File) {
        formData.append('formFile', form.value.imageFile);
      }

      try {
        if (isEditMode.value) {
          formData.append('Id', form.value.shopid)
          await UpdateShopByShopId(formData);
          ElMessage.success('商店資訊更新成功')
        } else {
          // 重點：新增成功後，後端通常會回傳新建立的 ShopInfo 物件或該店的 ID
          const response = await AddShop(formData);
          if(response)
            ElMessage.success('成功建立您的唯一商店！')
        }

        // 儲存成功後直接導回商店詳情/管理主頁
        await router.push('/shopInfo');
      } catch (error) {
        console.error('Submit error:', error)
        ElMessage.error('儲存失敗，請稍後再試')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 如果是修改模式，進頁面自動回顯已有數據
onMounted(async () => {
  if (isEditMode.value && userStore.userInfo?.shopid) {
    try {
      const shopData = await GetShopByShopId(userStore.userInfo.shopid)
      if (shopData) {
        form.value = {
          shopid: shopData.id,
          shopname: shopData.name,
          shopdescription: shopData.description,
          shopaddress: shopData.address,
          isshopopen: shopData.isOpen,
          imageFile: shopData.image // 塞入舊圖片網址觸發監聽回顯
        }
      }
    } catch (error) {
      console.error('載入商店資料失敗:', error)
    }
  }
})
</script>

<style scoped>
.shop-form-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.card-header {
  font-weight: bold;
  font-size: 18px;
  color: #303133;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.is-limit .el-upload--picture-card) {
  display: none !important;
}
</style>