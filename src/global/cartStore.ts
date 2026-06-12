import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CartItem } from '@/ViewModels/Cart/CartDTO.ts';
import type { ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';
import { useUserStore } from '@/global/userStore.ts';
import { getAllCartItems, removeItemFromCart } from '@/services/CartService.ts';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const selectedItems = ref<string[]>([]);


  // 計算已勾選商品的總金額
  const totalPrice = computed(() => {
    return items.value
      .filter(item => selectedItems.value.includes(item.cartItemId))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const GetAllCartItems = async () => {
    const userStore = useUserStore();
    items.value = await getAllCartItems(userStore.userInfo.id);
  };
  const shopIdCartItems = computed(() => {

    return Array.from(new Set(items.value.map(item => item.shopId)))

  })
  const GetItemWithShopId = computed(()=>{
    return (shopId:string):CartItem[] => {
      return items.value.filter((item) => item.shopId === shopId);
    }
  })

  function addItem(product: CartItem,unitPrice: number) {
    const existingItem = items.value.find(i => i.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1,unitPrice: unitPrice });
    }
  }

  // 全選狀態（Computed）
  const isAllSelected = computed({
    get() {
      return items.value.length > 0 && selectedItems.value.length === items.value.length;
    },
    set(val: boolean) {
      if (val) {
        selectedItems.value = items.value.map(item => item.cartItemId);
      } else {
        selectedItems.value = [];
      }
    }
  });



  function addItemWithQuantity(product: ProductInfo,quantity: number,unitprice:number,cartId:string):void {
    const existingItem = items.value.find(i => i.id === product.id);
    if (existingItem) {
      existingItem.quantity+=quantity;
    } else {
      items.value.push({ ...product, quantity: quantity,unitPrice:unitprice,cartItemId:cartId});
    }
  }

   function removeItem(id: string) {

      items.value = items.value.filter(i => i.id !== id);

  }

  function updateQuantity(id: string, qty: number) {
    const item = items.value.find(i => i.id === id);
    if (item) item.quantity = qty;

  }

  function clearCart() {
    items.value = [];
  }

  return { items,selectedItems, totalPrice, totalItems,GetAllCartItems,isAllSelected, addItem,addItemWithQuantity, removeItem, updateQuantity, clearCart,shopIdCartItems,GetItemWithShopId };
});