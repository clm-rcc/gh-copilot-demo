<template>
  <div class="cart-icon-container">
    <button 
      @click="toggleCart" 
      class="cart-button"
      aria-label="Shopping cart"
      :aria-expanded="isCartOpen"
      aria-controls="cart-panel"
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
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <span v-if="itemCount > 0" class="cart-badge" aria-label="`${itemCount} items in cart`">
        {{ itemCount }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'

interface Props {
  isCartOpen: boolean
}

interface Emits {
  (e: 'toggle'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)

const toggleCart = () => {
  emit('toggle')
}
</script>

<style scoped>
.cart-icon-container {
  position: relative;
}

.cart-button {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

.cart-button:hover {
  background: white;
  color: #667eea;
  transform: scale(1.1);
}

.cart-button:focus {
  outline: 2px solid white;
  outline-offset: 2px;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  border: 2px solid white;
  animation: badge-pop 0.3s ease;
}

@keyframes badge-pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
