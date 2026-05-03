//Not Used
export interface AddShopRequestDTO{

}

export interface AddShopResponseDTO{
  id:string;
}
//NotUsed
export interface GetUserShopRequestDTO{
  userid:string;
}
export interface GetUserShopResponseDTO{
  shopDTOs : ShopInfo[];
}
export interface GetShopByShopIdRequestDTO{
  shopId: string;
}
export interface GetShopByShopIdResponseDTO{
  shopDTO : ShopInfo;
}
export interface ShopInfo {
  id: string,
  name: string,
  description:string,
  image: string,
  rating: number,
  address: string,
  isOpen: boolean,

}
export interface ShopForm {
  shopid: string;
  shopname: string;
  shopdescription: string;
  shopaddress: string;
  isshopopen: boolean;
  imageFile: File | string | null;
}