import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Album } from '../types/album'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<Album[]>([])

  // Load cart from localStorage on initialization
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('album-cart')
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        // Validate that parsed data is an array
        if (Array.isArray(parsed)) {
          // Validate each item has required Album properties
          const validItems = parsed.filter(item => 
            item && 
            typeof item === 'object' &&
            typeof item.id === 'number' &&
            typeof item.title === 'string' &&
            typeof item.artist === 'string' &&
            typeof item.price === 'number' &&
            typeof item.image_url === 'string'
          )
          items.value = validItems
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    try {
      localStorage.setItem('album-cart', JSON.stringify(items.value))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  // Getters
  const itemCount = computed(() => items.value.length)
  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + item.price, 0)
  )
  const isInCart = computed(() => (albumId: number) => 
    items.value.some(item => item.id === albumId)
  )

  // Actions
  const addToCart = (album: Album) => {
    if (!isInCart.value(album.id)) {
      items.value.push(album)
      saveCart()
    }
  }

  const removeFromCart = (albumId: number) => {
    const index = items.value.findIndex(item => item.id === albumId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  // Initialize cart on store creation
  loadCart()

  return {
    items,
    itemCount,
    totalPrice,
    isInCart,
    addToCart,
    removeFromCart,
    clearCart
  }
})
