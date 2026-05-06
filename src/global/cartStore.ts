import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CartItem } from '@/ViewModels/Cart/CartDTO.ts';
import type { ProductInfo } from '@/ViewModels/Product/ProductDTO.ts';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  function addItem(product: CartItem) {
    const existingItem = items.value.find(i => i.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  }

  function addItemWithQuantity(product: ProductInfo,quantity: number):void {
    const existingItem = items.value.find(i => i.id === product.id);
    if (existingItem) {
      existingItem.quantity+=quantity;
    } else {
      items.value.push({ ...product, quantity: quantity });
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

  return { items, totalPrice, totalItems, addItem,addItemWithQuantity, removeItem, updateQuantity, clearCart };
});