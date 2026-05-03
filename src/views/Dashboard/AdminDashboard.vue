<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/global/userStore.ts';
import { UserRole } from '@/ViewModels/User/UserRole.ts';

const userStore = useUserStore()
const customerrole = ref(userStore.userInfo.roles.includes(UserRole.Customer))
const shopownerrole = ref(userStore.userInfo.roles.includes(UserRole.ShopOwner))
watch(()=>{return customerrole.value;},
  (newval)=>{
    if(newval){
      if(userStore.userInfo.roles.includes(UserRole.Customer)){
        customerrole.value = newval;
      }
      else{
        userStore.addUserRole(UserRole.Customer);
      }
    }
    else{
      userStore.removeUserRole(UserRole.Customer);
    }
  }
)
watch(()=>{return shopownerrole.value;},
  (newval)=>{
    if(newval){
      if(userStore.userInfo.roles.includes(UserRole.ShopOwner)){
        shopownerrole.value = newval;
      }
      else{
        userStore.addUserRole(UserRole.ShopOwner);
      }
    }
    else{
      userStore.removeUserRole(UserRole.ShopOwner);
    }
  }
)

</script>
<template>
  <el-text>
    Customer Role
  </el-text>
  <el-switch
    v-model="customerrole"
    size="large"
    active-text="Open"
    inactive-text="Close"
  />
  <br />
  <el-text>
    ShopOwner Role
  </el-text>
  <el-switch
    v-model="shopownerrole"
    size="large"
    active-text="Open"
    inactive-text="Close"
  />
  <br />

</template>


