import type { ResponseDTO } from '@/ViewModels/ResponseDTO.ts';
import api from '@/plugins/axios.ts';
import type {
  GetShopByShopIdResponseDTO,
  GetUserShopResponseDTO,
  ShopForm,
  ShopInfo
} from '@/ViewModels/Shop/ShopDTO.ts';
import { WebHostDomain } from '@/global/EnviromentDefine.ts';

export async function AddShop(formdata: FormData):Promise<boolean>
{
  const res:ResponseDTO<any> = await api.post('/Shop/AddShop', formdata, {
  });
  return res.isSuccess;
}
export async function GetShopByUserId(id: string):Promise<ShopInfo[]>
{
  const res:ResponseDTO<GetUserShopResponseDTO> = await api.post('/Shop/GetShopByUserId', {userId: id});
  if(res.isSuccess)
    return res.data.shopDTOs;
  return []
}
export async function GetShopByShopId(id: string): Promise<ShopInfo> {
  try {
    // 假設 ResponseDTO 包含 isSuccess, data, message
    const res: ResponseDTO<GetShopByShopIdResponseDTO> = await api.post('/Shop/GetShopByShopId', { shopId: id });
    res.data.shopDTO.image = WebHostDomain+res.data.shopDTO.image;
    return res.data.shopDTO;

  } catch (error) {
    // 這裡可以根據需求決定是否要在這裡 console.log 或統一處理
    console.error(`[API Error] GetShopByShopId (${id}):`, error);
    throw error; // 繼續拋出讓呼叫端的 try-catch 捕捉
  }
}
export async function UpdateShopByShopId( formdata: FormData):Promise<void>{
  try{
    const res = await api.put(`/Shop/UpdateShop`, formdata, {})
  }
  catch(error){
    console.error(`[API Error] UpdateShopByShopId :`, error);
  }
}
export async function GetAllAvailableShop():Promise<ShopInfo[]> {
  const res:ResponseDTO<GetUserShopResponseDTO> = await api.get(`/Shop/GetAllAvailableShop`);
  return res.data.shopDTOs;
}
export async function GetShopNameById(id: string):Promise<string> {
  try{
    const res:ResponseDTO<string> = await api.get('/Shop/GetShopNameById/'+id);

    return res.data as string;
  }
  catch(error){
    console.error(`[API Error] GetShopNameById (${id}):`, error);
    throw error;
  }

}