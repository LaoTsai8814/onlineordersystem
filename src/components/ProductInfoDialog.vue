<template>
  <el-dialog
    v-model="visible"
    :title="formdata.id ? '編輯產品' : '新增產品'"
    width="500px"
    @close="handleClose"
  >
    <el-form :model="formdata" :rules="rules" ref="formRef" label-width="80px" class="mt-4">
      <!-- 產品名稱 -->
      <el-form-item label="產品名稱" prop="name">
        <el-input v-model="formdata.name" placeholder="請輸入產品名稱" />
      </el-form-item>

      <!-- 產品分類 -->
      <el-form-item label="分類" prop="category">
        <el-select v-model="formdata.category" placeholder="選擇分類" class="w-full">
          <el-option label="主食" value="Main" />
          <el-option label="飲品" value="Drink" />
          <el-option label="小吃" value="Snack" />
        </el-select>
      </el-form-item>

      <!-- 價格與庫存 -->
      <div class="flex gap-4">
        <el-form-item label="價格" prop="price" class="flex-1">
          <el-input-number v-model="formdata.price" :min="0" class="w-full" />
        </el-form-item>
        <el-form-item label="庫存" prop="stock" class="flex-1">
          <el-input-number v-model="formdata.stock" :min="0" class="w-full" />
        </el-form-item>
      </div>

      <!-- 產品描述 -->
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formdata.description"
          type="textarea"
          rows="3"
          placeholder="請輸入產品描述..."
        />
      </el-form-item>

      <!-- 圖片上傳與預覽 -->
      <el-form-item label="產品圖片">
        <div class="upload-container">
          <el-upload
            class="product-uploader"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
          >
            <img v-if="previewUrl" :src="previewUrl" class="preview-img" />
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
          <p class="text-xs text-gray-400 mt-2">點擊圖片進行更換</p>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          確認提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import type { FormInstance, FormRules, UploadFile } from 'element-plus';
import { AddProduct, GetProductById } from '@/services/ProductService.ts';
import { useUserStore } from '@/global/userStore.ts';

// 1. 定義 Props 與 Emits
const props = defineProps<{
  modelValue: boolean;
  initialData?: any; // 用於編輯時傳入舊資料
}>();

const emit = defineEmits(['update:modelValue', 'success']);

// 2. 狀態管理
const visible = ref(false);
const submitting = ref(false);
const formRef = ref<FormInstance>();
const previewUrl = ref('');
const rawFile = ref<File | null>(null);

const formdata = ref({
  id: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: '',
});

// 3. 驗證規則
const rules: FormRules = {
  name: [{ required: true, message: '請輸入名稱', trigger: 'blur' }],
  category: [{ required: true, message: '請選擇分類', trigger: 'change' }],
  price: [{ required: true, message: '請設定價格', trigger: 'blur' }],
};

// 4. 監聽彈窗開啟
watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val && props.initialData) {
    // 編輯模式：帶入初始資料
    formdata.value = { ...props.initialData };
    previewUrl.value = props.initialData.imageUrl || '';
  } else if (val) {
    // 新增模式：重置表單
    resetForm();
  }
});

watch(visible, (val) => emit('update:modelValue', val));

// 5. 處理檔案上傳預覽
const handleFileChange = (file: UploadFile) => {
  if (file.raw) {
    rawFile.value = file.raw;
    previewUrl.value = URL.createObjectURL(file.raw); // 產生臨時預覽 URL
  }
};

const resetForm = () => {
  formdata.value = { id: '', name: '', category: '', price: 0, stock: 0, description: '' };
  previewUrl.value = '';
  rawFile.value = null;
};

const handleClose = () => {
  formRef.value?.resetFields();
};

// 6. 提交表單
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      try {
        // 這裡需要封裝成 FormData 才能傳送圖片檔案給 C# 後端
        const formData = new FormData();
        formData.append('Id', formdata.value.id);
        formData.append('Name', formdata.value.name);
        formData.append('Category', formdata.value.category);
        formData.append('Price', formdata.value.price.toString());
        formData.append('Stock', formdata.value.stock.toString());
        formData.append('Description', formdata.value.description);

        if (rawFile.value) {
          formData.append('formFile', rawFile.value);
        }

        await AddProduct(formData);
        console.log('提交資料:', formdata.value);

        emit('success');
        visible.value = false;
        const userStore = useUserStore();


      } catch (error) {
        console.error('提交失敗', error);
      } finally {
        submitting.value = false;
      }
    }
  });
};
</script>

<style scoped>
.product-uploader {
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: border-color 0.3s;
}

.product-uploader:hover {
  border-color: #409eff;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.w-full {
  width: 100%;
}
</style>