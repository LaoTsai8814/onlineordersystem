import type {
  AddProductResponseDTO,
  GetProductByProductIdResponseDTO,
  GetProductResponseDTO, GetProductsByShopIdResponseDTO,
  ProductInfo
} from '@/ViewModels/Product/ProductDTO.ts';
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
  console.log(shopId);
  try{
    const res:ResponseDTO<GetProductResponseDTO> = await api.post("/Product/GetProductsByShopId", { shopId: shopId });
    return res.data.products
  }
  catch (ex){
    console.error(ex);
    throw ex;
  }


}
export async function GetProductsByProductId(productId:string): Promise<ProductInfo> {
  try{
    console.log(productId);
    const res:ResponseDTO<GetProductByProductIdResponseDTO> = await api.post("/Product/GetProductByProductId", { productId: productId });
    console.log(res);
    return res.data.product as ProductInfo;
  }
  catch(ex){
    console.error(ex);
    throw ex;
  }

}

export async function GetAllAvailableProducts(): Promise<ProductInfo[]> {
    try{
      const res:ResponseDTO<GetProductsByShopIdResponseDTO> = await api.get("/Product/GetAllAvailableProduct");

      return res.data.products as ProductInfo[];
    }
    catch(err){
      console.error(err);
      return []
    }


}

export async function UpdateProducts(formData:FormData): Promise<void> {
  try{
    const userStore = useUserStore();
    formData.append("ShopId", userStore.getShopId());
    const res:ResponseDTO<void> = await api.put("/Product/UpdateProduct", formData);

  }
  catch (ex){
    console.error(ex);
    throw ex;
  }

}