import type { UserRole } from '@/ViewModels/User/UserRole.ts';

export class GlobalUser {
  id: number = 0;
  username: string = "";
  email: string = "";
  token: string = "";


  roles: UserRole[] = [];

  expiresAt?: number;
  // 1. 建立一個靜態方法專門處理反序列化
  static deserialize(jsonString: string | null): GlobalUser {
    if (!jsonString) {
      return new GlobalUser(); // 返回一個帶有預設值的空物件
    }

    try {
      const data = JSON.parse(jsonString);
      const user = new GlobalUser();

      // 2. 使用 Object.assign 將資料注入實例
      // 這樣 user 才會真正擁有 GlobalUser 類別的方法
      Object.assign(user, data);

      return user;
    } catch (error) {
      console.error("反序列化 GlobalUser 失敗:", error);
      return new GlobalUser();
    }
  }
}