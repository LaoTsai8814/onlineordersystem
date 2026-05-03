<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { AddShop, UpdateShopByShopId } from '@/services/ShopService.ts'; // 建議更名為 UpsertShop 或根據 action 判斷
import { useUserStore } from '@/global/userStore.ts';
import type { ShopForm } from '@/ViewModels/Shop/ShopDTO.ts';

// 1. defineModel 設定為選擇性，並提供預設值 (ViewModel 結構)
const dialogVisible = defineModel<boolean>('drawdialog', { default: false });
const form = defineModel<ShopForm>('formdata', {
  default: () => ({
    shopid:'',
    shopname: '',
    shopdescription: '',
    shopaddress: '',
    isshopopen: false,
    imageFile: null
  })
});

const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore();
const fileList = ref<any[]>([]);

// 2. 監聽數據變化，處理圖片預覽
watch(() => form.value.imageFile, (newVal) => {
  if (typeof newVal === 'string' && newVal !== '') {
    // 如果是圖片網址 (修改模式)
    fileList.value = [{ url: newVal }];
  } else if (newVal instanceof File) {
    // 如果是新選取的檔案 (不需手動更新 fileList，el-upload 會處理)
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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      const formData = new FormData();
      formData.append('Name', form.value.shopname);
      formData.append('Description', form.value.shopdescription);
      formData.append('Address', form.value.shopaddress);
      formData.append('IsOpen', String(form.value.isshopopen));
      formData.append('UserId', userStore.userInfo?.id || '');

      // 只有當它是 File 類型時才上傳，避免傳送舊的 URL 字串到後端檔案欄位
      if (form.value.imageFile instanceof File) {
        formData.append('formFile', form.value.imageFile);
      }

      try {
        // 這裡可以根據 form.value 是否有 ID 來判斷呼叫 AddShop 還是 UpdateShop
        if(form.value.shopid) {
          formData.append('Id',form.value.shopid)
          await UpdateShopByShopId(formData);
        }
        else{
          await AddShop(formData);

        }
        dialogVisible.value = false;
        emit('success');
      } catch (error) {
        console.error('Submit error:', error);
      }
    }
  })
}

const emit = defineEmits(['success']);
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="form.shopname ? '編輯商店' : '新增商店'"
    width="500px"
    destroy-on-close
  >
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
        <el-input v-model="form.shopdescription" type="textarea" :rows="3" />
      </el-form-item>

      <el-form-item label="商店地址" prop="shopaddress">
        <el-input v-model="form.shopaddress" placeholder="請輸入地址" />
      </el-form-item>

      <el-form-item label="商店營業狀態" prop="isshopopen">
        <el-switch v-model="form.isshopopen" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Confirm
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.is-limit .el-upload--picture-card) {
  display: none !important;
}
</style>