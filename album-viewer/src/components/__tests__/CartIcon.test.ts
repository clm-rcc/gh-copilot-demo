import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CartIcon from '../CartIcon.vue'
import { useCartStore } from '../../stores/cart'

describe('CartIcon', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should render the cart button', () => {
    const wrapper = mount(CartIcon, {
      props: { isCartOpen: false }
    })
    
    expect(wrapper.find('.cart-button').exists()).toBe(true)
  })

  it('should show badge when items are in cart', async () => {
    const wrapper = mount(CartIcon, {
      props: { isCartOpen: false }
    })
    
    const store = useCartStore()
    store.addToCart({
      id: 1,
      title: 'Test Album',
      artist: 'Test Artist',
      price: 9.99,
      image_url: 'https://example.com/image.jpg'
    })
    
    await wrapper.vm.$nextTick()
    
    const badge = wrapper.find('.cart-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('1')
  })

  it('should not show badge when cart is empty', () => {
    const wrapper = mount(CartIcon, {
      props: { isCartOpen: false }
    })
    
    expect(wrapper.find('.cart-badge').exists()).toBe(false)
  })

  it('should emit toggle event when clicked', async () => {
    const wrapper = mount(CartIcon, {
      props: { isCartOpen: false }
    })
    
    await wrapper.find('.cart-button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('toggle')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('should have correct aria attributes', () => {
    const wrapper = mount(CartIcon, {
      props: { isCartOpen: false }
    })
    
    const button = wrapper.find('.cart-button')
    expect(button.attributes('aria-label')).toBe('Shopping cart')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(button.attributes('aria-controls')).toBe('cart-panel')
  })

  it('should update aria-expanded when cart is opened', () => {
    const wrapper = mount(CartIcon, {
      props: { isCartOpen: true }
    })
    
    const button = wrapper.find('.cart-button')
    expect(button.attributes('aria-expanded')).toBe('true')
  })
})
