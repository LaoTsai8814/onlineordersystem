// 購物車內的項目 (繼承 Product 並加上數量屬性)
import type { ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';

export interface CartItem extends ProductInfo {
  quantity: number;
  unitPrice: number;
  cartItemId:string;

}
export interface AddCartItemRequestDTO
{
  cartItemDTO:CartItemDTO;
}
export interface GetCartItemRequestDTO
{
  userId:string;
}
export interface GetCartItemResponseDTO{
  cartItemDTO:GetCartItemDTO[];
}
export interface GetCartItemDTO
{
  product:ProductInfo;
  quantity:number
  unitPrice:number
  id:string;
}
export interface RemoveCartItemRequestDTO
{
  cartItemId:string;
}
export interface CartItemDTO
{
  productId:string
  userId:string
  quantity:number
  unitPrice:number
}