<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}
const ruleForm = reactive({
  usrname:'',
  usremail:'',
  pass: '',
  checkPass: '',

})
const rules = reactive<FormRules<typeof ruleForm>>({

  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
})
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<template>
  <div class="login-container">

    <el-card class="login-card" shadow="always">
      <template #header>
        <div class="card-header">
          <h2 style="text-align: center; margin: 0;">System Register</h2>
        </div>
      </template>

      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        label-position="top"
        class="demo-ruleForm"
      >
        <el-form-item label="Username" prop="usr">
          <el-input v-model="ruleForm.usrname" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Email" prop="usr">
          <el-input v-model="ruleForm.usremail" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item label="Confirm Password" prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
            show-password
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%;">
            Submit
          </el-button>
          <div style="margin-top: 10px; width: 100%; text-align: center;">
            <el-link @click="resetForm(ruleFormRef)" :underline="false">Reset Fields</el-link>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<style scoped>
/* 讓容器撐滿整個內容區並居中 */
.login-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  min-height: calc(100vh - 120px); /* 扣除 Header 的高度，讓它在視窗中間 */
  width: 100%;
}

/* 限制卡片寬度 */
.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
}

/* 按鈕容器微調 */
.form-actions {
  margin-top: 30px;
}

.form-actions :deep() {
  display: flex;
  flex-direction: column;
  margin-left: 0 !important;
}
</style>


