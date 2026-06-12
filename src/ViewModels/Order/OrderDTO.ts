export interface CheckOutCartRequestDTO
{
  userId:string;
  shopId:string
  cartItemIds:string[]

}
export interface GetOrdersByShopIdResponseDTO{
  orderList:GetOrderResponseDTO[]
}
export interface GetOrderResponseDTO{
  orderId:string,
  orderTime:string
  status:number
  customerId:string
  customerName:string
  customerPhone:string
  customerAddress:string
}