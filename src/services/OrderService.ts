import type {
  GetCustomerOrderResponseDTO,
  GetOrderResponseDTO,
  GetOrdersByShopIdResponseDTO
} from '@/ViewModels/Order/OrderDTO.ts';
import type { ResponseDTO } from '@/ViewModels/ResponseDTO.ts';
import api from '@/plugins/axios.ts';

export async function addOrder(userid: string,cartids:string[]): Promise<void> {
  try {
    const res:ResponseDTO<any> = await api.post("/Order/AddOrder",{
      userId:userid,
      cartItemIds:cartids,


    })
  }
  catch(err) {
    console.error(err);
    throw err;
  }
}
export async function GetOrderByShopId(shopId:string): Promise<ResponseDTO<GetOrdersByShopIdResponseDTO>> {
  try{
    return await api.post("/Order/GetOrdersByShopId", { shopId: shopId });
  }
  catch(err) {
    console.error(err);
    throw err;
  }
}
export async function UpdateOrder(orderId:string,isAccepted:number): Promise<void>
{
  try{
    const res = await api.post("/Order/UpdateOrderStatus",{orderId:orderId,orderStatus:isAccepted});
  }
  catch(err) {
    console.error(err);
    throw err;
  }

}
export async function GetOrderByCustomerId(CustomerId:string):Promise<GetOrderResponseDTO[]>{
  const response:ResponseDTO<GetCustomerOrderResponseDTO> = await api.post("/Order/GetOrdersByCustomerId",{userId: CustomerId});
  return response.data.orderList
}