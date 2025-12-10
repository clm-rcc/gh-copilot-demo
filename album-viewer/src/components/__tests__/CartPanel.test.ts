import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CartPanel from '../CartPanel.vue'
import { useCartStore } from '../../stores/cart'
import type { Album } from '../../types/album'

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

describe('CartPanel', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should not render when isOpen is false', () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: false }
    })
    
    expect(wrapper.find('.cart-panel-overlay').exists()).toBe(false)
  })

  it('should render when isOpen is true', () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    expect(wrapper.find('.cart-panel-overlay').exists()).toBe(true)
  })

  it('should show empty cart message when cart is empty', () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    expect(wrapper.find('.cart-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('Your cart is empty')
  })

  it('should display cart items', async () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.cart-items').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Album')
    expect(wrapper.text()).toContain('Test Artist')
    expect(wrapper.text()).toContain('$9.99')
  })

  it('should display multiple cart items', async () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    store.addToCart(mockAlbum2)
    
    await wrapper.vm.$nextTick()
    
    const items = wrapper.findAll('.cart-item')
    expect(items).toHaveLength(2)
  })

  it('should display total price', async () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    store.addToCart(mockAlbum2)
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Total:')
    expect(wrapper.text()).toContain('$24.98')
  })

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    await wrapper.find('.close-button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('should emit close event when overlay is clicked', async () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    await wrapper.find('.cart-panel-overlay').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('should not emit close when panel content is clicked', async () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    await wrapper.find('.cart-panel').trigger('click')
    
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('should remove item when remove button is clicked', async () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    await wrapper.vm.$nextTick()
    
    const removeButton = wrapper.find('.remove-button')
    await removeButton.trigger('click')
    
    expect(store.items).toHaveLength(0)
  })

  it('should clear cart when clear button is clicked and confirmed', async () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    store.addToCart(mockAlbum2)
    
    await wrapper.vm.$nextTick()
    
    const clearButton = wrapper.find('.clear-button')
    await clearButton.trigger('click')
    
    expect(confirmSpy).toHaveBeenCalled()
    expect(store.items).toHaveLength(0)
    
    confirmSpy.mockRestore()
  })

  it('should not clear cart when clear is canceled', async () => {
    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    await wrapper.vm.$nextTick()
    
    const clearButton = wrapper.find('.clear-button')
    await clearButton.trigger('click')
    
    expect(confirmSpy).toHaveBeenCalled()
    expect(store.items).toHaveLength(1)
    
    confirmSpy.mockRestore()
  })

  it('should have correct ARIA attributes', () => {
    const wrapper = mount(CartPanel, {
      props: { isOpen: true }
    })
    
    const overlay = wrapper.find('.cart-panel-overlay')
    expect(overlay.attributes('role')).toBe('dialog')
    expect(overlay.attributes('aria-modal')).toBe('true')
    expect(overlay.attributes('aria-labelledby')).toBe('cart-title')
    
    const panel = wrapper.find('.cart-panel')
    expect(panel.attributes('role')).toBe('document')
  })
})
