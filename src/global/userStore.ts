import { defineStore } from 'pinia'
import { GlobalUser } from '@/ViewModels/User/GlobalUser.ts'
import router from '@/router';
import type { UserRole } from '@/ViewModels/User/UserRole.ts';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: !!localStorage.getItem('token'),
    userInfo: GlobalUser.deserialize(localStorage.getItem('user'))
  }),
  actions: {
    // 設定 user 資訊
    setUser(user: GlobalUser) {
      this.userInfo = user
      this.isLogin = true
      localStorage.setItem('user', JSON.stringify(user))
      this.setToken(user.token);
    },
    setToken(token:string){
      localStorage.setItem('token', token)
    },
    addUserRole(userRoles: UserRole)
    {
      const user = this.userInfo;
      user.roles.push(userRoles) ;
      localStorage.setItem('user', JSON.stringify(user))
    },
    addUserRoles(userRoles: UserRole[])
    {
      const user = this.userInfo;
      userRoles.forEach(role => {user.roles.push(role) });
      localStorage.setItem('user', JSON.stringify(user))
    },
    getUserRoles():UserRole[] {
      return this.userInfo.roles;

    },
    isShopCreated(): boolean {
      return !!this.userInfo.shopid;
    },
    getShopId():string {
      return this.userInfo.shopid;
    },

    removeUserRole(userRole: UserRole) {
      this.userInfo.roles = this.userInfo.roles.filter(item => item !== userRole);
    },

    // 登出
    async logout() {
      this.isLogin = false
      this.userInfo = new GlobalUser();
      localStorage.clear();
      await router.push('/home')
    },
    // 確認是否登入
    IsLogin()
    {

      return this.isLogin
    }
  }
})
