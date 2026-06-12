import type { ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';
import api from '@/plugins/axios.ts';
import type {
  AddCartItemRequestDTO,
  CartItem,
  CartItemDTO, GetCartItemDTO,
  GetCartItemResponseDTO
} from '@/ViewModels/Cart/CartDTO.ts';
import type { ResponseDTO } from '@/ViewModels/ResponseDTO.ts';

export async function addItemToCart(product: ProductInfo,quantity:number,userId:string):Promise<void> {
  try{
    const res = await api.post("/Cart/AddToCart", <AddCartItemRequestDTO>{cartItemDTO:{
      productId:product.id,
      userId:userId,
      quantity:quantity,
      unitPrice:product.price
    }});
  }
  catch(err){
    console.error(err);
  }
}
export async function getAllCartItems(userId:string): Promise<CartItem[]> {
  try {
    const res:ResponseDTO<GetCartItemResponseDTO> = await api.post("/Cart/GetCartItems",{userId:userId})
    const cartItems: CartItem[] = res.data.cartItemDTO.map((item) => {
      return {
        ...item.product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        cartItemId:item.id
      };
    });
    return cartItems;
  }
  catch(err){
    console.error(err);
    throw err
  }
}
export async function removeItemFromCart(cartItemId: string): Promise<boolean> {
  try {
    const res: ResponseDTO<any> = await api.post("/Cart/RemoveFromCart", {
      cartItemId: cartItemId
    });

    return res.isSuccess;

  } catch (err) {
    console.error("API 呼叫失敗:", err);
    return false;
  }
}
export async function updateCart(cartItemId: string,val:number): Promise<boolean> {
  try {
    const res:ResponseDTO<any> = await api.put("/Cart/UpdateCartItem", {cartItemId:cartItemId, quantity:val});
    console.log(res)
    return res.isSuccess;
  }
  catch (err) {
    console.error(err);
    return false;
  }
}