// 購物車內的項目 (繼承 Product 並加上數量屬性)
import type { ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';

export interface CartItem extends ProductInfo {
  quantity: number;
}