import { api } from '@/plugins/axios.ts';
import type { UserRole } from '@/ViewModels/User/UserRole.ts';
import type { ResponseDTO } from '@/ViewModels/ResponseDTO.ts';
import type {
  AddRoleToUserRequestDTO,
  AddRoleToUserResponseDTO,
  GetRoleFromUserResponseDTO
} from '@/ViewModels/User/RoleDTO.ts';
import { jwtDecode } from 'jwt-decode';
import { GlobalUser } from '@/ViewModels/User/GlobalUser.ts';
import { useUserStore } from '@/global/userStore.ts';

export async function OnGoogleLogin() {
  await api.get("User/GoogleLogin");

}
export async function GetUserRoleClaim():Promise<boolean>
{
  const res:ResponseDTO<GetRoleFromUserResponseDTO> = await api.get('User/GetUserRoleClaims');

  console.log(res);
  if(res.isSuccess){
    const userStore = useUserStore();
    userStore.addUserRoles(res.data.roleTypes);
    console.log("res.Data.RoleTypes");
    console.log(res.data.roleTypes);
    return true;
  }
  return false;


}
export async function AddPersonlInfo(role:UserRole,address:string,phone:string):Promise<boolean>
{
  const dto: AddRoleToUserRequestDTO = {
    RoleType: role,
    Address:address,
    PhoneNumber:phone
  };
  console.log(dto);
  const res:ResponseDTO<AddRoleToUserResponseDTO> = await api.put("User/AddPersonlInfo", dto)
  if(res.isSuccess){
    console.log("Added UserRoleClaim");
    const userStore = useUserStore()
    userStore.addUserRole(role);
    return true;
  }
  else{
    console.log(res.errorMessage);
    return false;
  }
}
export function JWTDecode(str:string){
  const jsonobj:any = jwtDecode(str);
  console.log("JSONOBJ"+jsonobj);
  const usr = new GlobalUser();
  const email = jsonobj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
  const usrid = jsonobj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  const usrname = jsonobj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  const shopid = jsonobj["ShopId"]
  if(shopid!==undefined){
    usr.shopid = shopid;
  }
  usr.id = usrid;
  usr.email = email;
  usr.username = usrname;

  usr.token = str;
  console.log(usr);
  const userStore = useUserStore()
  userStore.setUser(usr);
  localStorage.setItem('token', usr.token);
}

//Not Developed yet
export async function GetCustomerCartCount(): Promise<number> {
  return 0; // 自動包裝為 Promise.resolve(0)
}
