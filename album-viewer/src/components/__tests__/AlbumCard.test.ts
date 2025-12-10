import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AlbumCard from '../AlbumCard.vue'
import { useCartStore } from '../../stores/cart'
import type { Album } from '../../types/album'

const mockAlbum: Album = {
  id: 1,
  title: 'Test Album',
  artist: 'Test Artist',
  price: 9.99,
  image_url: 'https://example.com/image.jpg'
}

describe('AlbumCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should render album information', () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })
    
    expect(wrapper.text()).toContain('Test Album')
    expect(wrapper.text()).toContain('Test Artist')
    expect(wrapper.text()).toContain('$9.99')
  })

  it('should display album image', () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(img.attributes('alt')).toBe('Test Album')
  })

  it('should show "Add to Cart" button when album is not in cart', () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })
    
    const button = wrapper.find('.btn-primary')
    expect(button.text()).toBe('Add to Cart')
  })

  it('should show "Remove from Cart" button when album is in cart', async () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    await wrapper.vm.$nextTick()
    
    const button = wrapper.find('.btn-remove')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Remove from Cart')
  })

  it('should add album to cart when "Add to Cart" button is clicked', async () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })
    
    const store = useCartStore()
    const button = wrapper.find('.btn-primary')
    
    await button.trigger('click')
    
    expect(store.items).toHaveLength(1)
    expect(store.items[0]).toEqual(mockAlbum)
  })

  it('should remove album from cart when "Remove from Cart" button is clicked', async () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    await wrapper.vm.$nextTick()
    
    const button = wrapper.find('.btn-remove')
    await button.trigger('click')
    
    expect(store.items).toHaveLength(0)
  })

  it('should have correct ARIA labels', async () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })
    
    let button = wrapper.find('.btn-primary')
    expect(button.attributes('aria-label')).toBe('Add to cart')
    
    const store = useCartStore()
    store.addToCart(mockAlbum)
    
    await wrapper.vm.$nextTick()
    
    button = wrapper.find('.btn-remove')
    expect(button.attributes('aria-label')).toBe('Remove from cart')
  })

  it('should handle image error', async () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })
    
    const img = wrapper.find('img')
    await img.trigger('error')
    
    expect(img.element.src).toContain('placeholder')
  })
})
