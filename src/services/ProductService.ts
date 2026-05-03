import type { AddProductResponseDTO, GetProductResponseDTO, ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';
import api from '@/plugins/axios.ts';
import type { ResponseDTO } from '@/ViewModels/ResponseDTO.ts';
import { useUserStore } from '@/global/userStore.ts';

export async function AddProduct(formdata:FormData): Promise<AddProductResponseDTO> {
   const userStore = useUserStore();

  formdata.append("ShopId", userStore.getShopId());
  try{
    const res:ResponseDTO<AddProductResponseDTO> =  await api.post("/Product/AddProduct", formdata);
    return res.data as AddProductResponseDTO;
  }
  catch(ex){
    console.error(ex);
    throw ex;
  }
}
export async function GetProductById(shopId:string): Promise<ProductInfo[]> {
  try{
    const res:ResponseDTO<GetProductResponseDTO> = await api.post("/Product/GetProductsByShopId", { shopId: shopId });
    return res.data.products
  }
  catch (ex){
    console.error(ex);
    throw ex;
  }


}