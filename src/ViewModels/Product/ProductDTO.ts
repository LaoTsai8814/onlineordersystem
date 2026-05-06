export interface AddProductRequestDTO{


}
export interface AddProductResponseDTO{


}
export interface GetProductRequestDTO{
  shopId: string;
}
export interface GetProductResponseDTO{
  products:ProductInfo[]
}
export interface GetProductByProductIdResponseDTO
{
  product:ProductInfo;
}
export interface ProductInfo {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category?: string;
}