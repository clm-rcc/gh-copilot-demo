import { test, expect } from '@playwright/test'

test.describe('Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should display empty cart initially', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForSelector('.header')
    
    // Cart icon should be visible
    const cartButton = page.locator('.cart-button')
    await expect(cartButton).toBeVisible()
    
    // Badge should not be visible when cart is empty
    const badge = page.locator('.cart-badge')
    await expect(badge).not.toBeVisible()
  })

  test('should add album to cart', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Click "Add to Cart" on first album
    const firstAlbum = page.locator('.album-card').first()
    await firstAlbum.locator('.btn-primary').click()
    
    // Badge should appear with count of 1
    const badge = page.locator('.cart-badge')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('1')
    
    // Button should change to "Remove from Cart"
    await expect(firstAlbum.locator('.btn-remove')).toBeVisible()
    await expect(firstAlbum.locator('.btn-remove')).toHaveText('Remove from Cart')
  })

  test('should add multiple albums to cart', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Add first two albums to cart
    const albums = page.locator('.album-card')
    await albums.nth(0).locator('.btn-primary').click()
    await albums.nth(1).locator('.btn-primary').click()
    
    // Badge should show count of 2
    const badge = page.locator('.cart-badge')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('2')
  })

  test('should open cart panel when cart icon is clicked', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForSelector('.cart-button')
    
    // Click cart icon
    await page.locator('.cart-button').click()
    
    // Cart panel should be visible
    await expect(page.locator('.cart-panel')).toBeVisible()
    await expect(page.locator('#cart-title')).toHaveText('Shopping Cart')
  })

  test('should show empty cart message when cart is empty', async ({ page }) => {
    await page.goto('/')
    
    // Open cart
    await page.locator('.cart-button').click()
    
    // Should show empty message
    await expect(page.locator('.cart-empty')).toBeVisible()
    await expect(page.locator('.cart-empty')).toContainText('Your cart is empty')
  })

  test('should display cart items in cart panel', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Add an album to cart
    const firstAlbum = page.locator('.album-card').first()
    const albumTitle = await firstAlbum.locator('.album-title').textContent()
    await firstAlbum.locator('.btn-primary').click()
    
    // Open cart
    await page.locator('.cart-button').click()
    
    // Cart should show the item
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(1)
    await expect(page.locator('.cart-panel')).toContainText(albumTitle!)
  })

  test('should remove item from cart panel', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Add an album to cart
    await page.locator('.album-card').first().locator('.btn-primary').click()
    
    // Open cart
    await page.locator('.cart-button').click()
    
    // Click remove button
    await page.locator('.remove-button').click()
    
    // Cart should be empty
    await expect(page.locator('.cart-empty')).toBeVisible()
    
    // Badge should not be visible
    await expect(page.locator('.cart-badge')).not.toBeVisible()
  })

  test('should close cart panel when close button is clicked', async ({ page }) => {
    await page.goto('/')
    
    // Open cart
    await page.locator('.cart-button').click()
    await expect(page.locator('.cart-panel')).toBeVisible()
    
    // Click close button
    await page.locator('.close-button').click()
    
    // Cart panel should be closed
    await expect(page.locator('.cart-panel')).not.toBeVisible()
  })

  test('should close cart panel when overlay is clicked', async ({ page }) => {
    await page.goto('/')
    
    // Open cart
    await page.locator('.cart-button').click()
    await expect(page.locator('.cart-panel')).toBeVisible()
    
    // Click overlay
    await page.locator('.cart-panel-overlay').click({ position: { x: 10, y: 10 } })
    
    // Cart panel should be closed
    await expect(page.locator('.cart-panel')).not.toBeVisible()
  })

  test('should display correct total price', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Get prices of first two albums
    const albums = page.locator('.album-card')
    const price1Text = await albums.nth(0).locator('.price').textContent()
    const price2Text = await albums.nth(1).locator('.price').textContent()
    
    const price1 = parseFloat(price1Text!.replace('$', ''))
    const price2 = parseFloat(price2Text!.replace('$', ''))
    const expectedTotal = price1 + price2
    
    // Add both albums to cart
    await albums.nth(0).locator('.btn-primary').click()
    await albums.nth(1).locator('.btn-primary').click()
    
    // Open cart
    await page.locator('.cart-button').click()
    
    // Check total price
    const totalText = await page.locator('.total-amount').textContent()
    const total = parseFloat(totalText!.replace('$', ''))
    expect(total).toBeCloseTo(expectedTotal, 2)
  })

  test('should clear all items when clear cart is clicked', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Add two albums to cart
    const albums = page.locator('.album-card')
    await albums.nth(0).locator('.btn-primary').click()
    await albums.nth(1).locator('.btn-primary').click()
    
    // Open cart
    await page.locator('.cart-button').click()
    
    // Set up dialog handler
    page.on('dialog', dialog => dialog.accept())
    
    // Click clear cart
    await page.locator('.clear-button').click()
    
    // Cart should be empty
    await expect(page.locator('.cart-empty')).toBeVisible()
  })

  test('should persist cart across page reloads', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Add an album to cart
    const firstAlbum = page.locator('.album-card').first()
    const albumTitle = await firstAlbum.locator('.album-title').textContent()
    await firstAlbum.locator('.btn-primary').click()
    
    // Badge should show 1
    await expect(page.locator('.cart-badge')).toHaveText('1')
    
    // Reload page
    await page.reload()
    
    // Wait for page to load
    await page.waitForSelector('.cart-button')
    
    // Badge should still show 1
    await expect(page.locator('.cart-badge')).toHaveText('1')
    
    // Open cart
    await page.locator('.cart-button').click()
    
    // Cart should still contain the item
    await expect(page.locator('.cart-panel')).toContainText(albumTitle!)
  })

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForSelector('.cart-button')
    
    // Focus cart button using Tab
    await page.keyboard.press('Tab')
    
    // Open cart with Enter
    await page.keyboard.press('Enter')
    
    // Cart should open
    await expect(page.locator('.cart-panel')).toBeVisible()
    
    // Close with Escape
    await page.keyboard.press('Escape')
    
    // Cart should close
    await expect(page.locator('.cart-panel')).not.toBeVisible()
  })

  test('should have correct ARIA attributes', async ({ page }) => {
    await page.goto('/')
    
    // Cart button should have ARIA attributes
    const cartButton = page.locator('.cart-button')
    await expect(cartButton).toHaveAttribute('aria-label', 'Shopping cart')
    await expect(cartButton).toHaveAttribute('aria-expanded', 'false')
    
    // Open cart
    await cartButton.click()
    
    // aria-expanded should be true
    await expect(cartButton).toHaveAttribute('aria-expanded', 'true')
    
    // Cart panel should have ARIA attributes
    const overlay = page.locator('.cart-panel-overlay')
    await expect(overlay).toHaveAttribute('role', 'dialog')
    await expect(overlay).toHaveAttribute('aria-modal', 'true')
  })

  test('should take screenshot of cart feature', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Take screenshot of empty state
    await page.screenshot({ path: 'e2e/screenshots/cart-empty-state.png', fullPage: true })
    
    // Add albums to cart
    const albums = page.locator('.album-card')
    await albums.nth(0).locator('.btn-primary').click()
    await albums.nth(1).locator('.btn-primary').click()
    
    // Take screenshot with items in cart
    await page.screenshot({ path: 'e2e/screenshots/cart-with-badge.png', fullPage: true })
    
    // Open cart panel
    await page.locator('.cart-button').click()
    
    // Take screenshot of cart panel
    await page.screenshot({ path: 'e2e/screenshots/cart-panel-open.png', fullPage: true })
  })
})
