import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'
import type { Album } from '../../types/album'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
})

const mockAlbum: Album = {
  id: 1,
  title: 'Test Album',
  artist: 'Test Artist',
  price: 9.99,
  image_url: 'https://example.com/image.jpg'
}

const mockAlbum2: Album = {
  id: 2,
  title: 'Test Album 2',
  artist: 'Test Artist 2',
  price: 14.99,
  image_url: 'https://example.com/image2.jpg'
}

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with an empty cart', () => {
    const store = useCartStore()
    expect(store.items).toEqual([])
    expect(store.itemCount).toBe(0)
    expect(store.totalPrice).toBe(0)
  })

  it('should add an album to the cart', () => {
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    expect(store.items).toHaveLength(1)
    expect(store.items[0]).toEqual(mockAlbum)
    expect(store.itemCount).toBe(1)
    expect(store.totalPrice).toBe(9.99)
  })

  it('should not add duplicate albums to the cart', () => {
    const store = useCartStore()
    store.addToCart(mockAlbum)
    store.addToCart(mockAlbum)
    
    expect(store.items).toHaveLength(1)
    expect(store.itemCount).toBe(1)
  })

  it('should remove an album from the cart', () => {
    const store = useCartStore()
    store.addToCart(mockAlbum)
    store.removeFromCart(mockAlbum.id)
    
    expect(store.items).toHaveLength(0)
    expect(store.itemCount).toBe(0)
    expect(store.totalPrice).toBe(0)
  })

  it('should calculate total price correctly', () => {
    const store = useCartStore()
    store.addToCart(mockAlbum)
    store.addToCart(mockAlbum2)
    
    expect(store.totalPrice).toBeCloseTo(24.98, 2)
  })

  it('should check if an album is in the cart', () => {
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    expect(store.isInCart(mockAlbum.id)).toBe(true)
    expect(store.isInCart(mockAlbum2.id)).toBe(false)
  })

  it('should clear the cart', () => {
    const store = useCartStore()
    store.addToCart(mockAlbum)
    store.addToCart(mockAlbum2)
    store.clearCart()
    
    expect(store.items).toHaveLength(0)
    expect(store.itemCount).toBe(0)
    expect(store.totalPrice).toBe(0)
  })

  it('should persist cart to localStorage', () => {
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    const savedCart = localStorage.getItem('album-cart')
    expect(savedCart).toBeTruthy()
    const parsed = JSON.parse(savedCart!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].id).toBe(mockAlbum.id)
  })

  it('should load cart from localStorage on initialization', () => {
    // Pre-populate localStorage
    localStorage.setItem('album-cart', JSON.stringify([mockAlbum]))
    
    // Create a new store instance
    setActivePinia(createPinia())
    const store = useCartStore()
    
    expect(store.items).toHaveLength(1)
    expect(store.items[0].id).toBe(mockAlbum.id)
    expect(store.itemCount).toBe(1)
  })

  it('should handle corrupted localStorage data gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('album-cart', 'invalid json')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    setActivePinia(createPinia())
    const store = useCartStore()
    
    expect(store.items).toEqual([])
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
