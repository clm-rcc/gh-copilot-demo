<template>
  <transition name="cart-panel">
    <div 
      v-if="isOpen" 
      class="cart-panel-overlay"
      @click="closeCart"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div 
        id="cart-panel"
        class="cart-panel" 
        @click.stop
        role="document"
      >
        <div class="cart-header">
          <h2 id="cart-title">Shopping Cart</h2>
          <button 
            @click="closeCart" 
            class="close-button"
            aria-label="Close cart"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="cartStore.items.length === 0" class="cart-empty">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p>Your cart is empty</p>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items">
            <div 
              v-for="item in cartStore.items" 
              :key="item.id" 
              class="cart-item"
            >
              <img 
                :src="item.image_url" 
                :alt="item.title"
                class="cart-item-image"
                @error="handleImageError"
              />
              <div class="cart-item-info">
                <h3 class="cart-item-title">{{ item.title }}</h3>
                <p class="cart-item-artist">{{ item.artist }}</p>
                <p class="cart-item-price">${{ item.price.toFixed(2) }}</p>
              </div>
              <button 
                @click="removeItem(item.id)" 
                class="remove-button"
                :aria-label="`Remove ${item.title} from cart`"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="cart-footer">
            <div class="cart-total">
              <span class="total-label">Total:</span>
              <span class="total-amount">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <button 
              @click="clearAll" 
              class="clear-button"
              aria-label="Clear all items from cart"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cartStore = useCartStore()

const closeCart = () => {
  emit('close')
}

const removeItem = (albumId: number) => {
  cartStore.removeFromCart(albumId)
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/80x80/667eea/white?text=Album'
}

// Handle escape key to close cart
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeCart()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.cart-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.cart-panel {
  background: white;
  width: 100%;
  max-width: 450px;
  height: 100vh;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #667eea;
  color: white;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-button:focus {
  outline: 2px solid white;
  outline-offset: 2px;
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #999;
  flex: 1;
}

.cart-empty svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.cart-empty p {
  font-size: 1.2rem;
  margin: 0;
}

.cart-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.cart-item:hover {
  background: #f0f0f0;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cart-item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.cart-item-artist {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #666;
}

.cart-item-price {
  margin: 0;
  font-size: 1.125rem;
  font-weight: bold;
  color: #667eea;
}

.remove-button {
  background: none;
  border: none;
  color: #ff4757;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.remove-button:hover {
  background: rgba(255, 71, 87, 0.1);
}

.remove-button:focus {
  outline: 2px solid #ff4757;
  outline-offset: 2px;
}

.cart-footer {
  border-top: 1px solid #e0e0e0;
  padding: 1.5rem;
  background: white;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.total-label {
  font-weight: 600;
  color: #333;
}

.total-amount {
  font-weight: bold;
  color: #667eea;
  font-size: 1.5rem;
}

.clear-button {
  width: 100%;
  padding: 0.875rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-button:hover {
  background: #e03e4c;
  transform: translateY(-2px);
}

.clear-button:focus {
  outline: 2px solid #ff4757;
  outline-offset: 2px;
}

/* Transitions */
.cart-panel-enter-active,
.cart-panel-leave-active {
  transition: all 0.3s ease;
}

.cart-panel-enter-from .cart-panel,
.cart-panel-leave-to .cart-panel {
  transform: translateX(100%);
}

.cart-panel-enter-from,
.cart-panel-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
  }
}
</style>
