# Cart Management Feature

## Overview
The cart management feature allows users to add and remove albums from a shopping cart, view cart contents, and persist their selections across page reloads.

## Features

### 1. Cart Icon in Header
- **Location**: Top-right corner of the application header
- **Badge**: Shows the number of items currently in the cart
- **Animation**: Badge appears with a pop animation when items are added
- **Accessibility**: Fully keyboard accessible with proper ARIA labels

### 2. Add/Remove Albums
- **Add to Cart**: Click the "Add to Cart" button on any album card
- **Remove from Cart**: 
  - Option 1: Click "Remove from Cart" button on the album card
  - Option 2: Use the remove button in the cart panel
- **Visual Feedback**: Button text and style change based on cart state
- **Duplicate Prevention**: Cannot add the same album twice

### 3. Cart Panel
- **Access**: Click the cart icon in the header
- **Features**:
  - View all items in the cart
  - See album details (image, title, artist, price)
  - Remove individual items
  - Clear entire cart
  - View total price
- **Close Options**:
  - Click the X button
  - Click outside the panel (overlay)
  - Press Escape key

### 4. Data Persistence
- Cart contents are automatically saved to browser localStorage
- Cart state persists across page reloads
- Data validation ensures only valid album data is loaded

## Technical Implementation

### State Management
- **Library**: Pinia (Vue 3 state management)
- **Store**: `src/stores/cart.ts`
- **Features**:
  - Reactive cart state
  - Computed properties for count and total
  - Actions for add, remove, and clear operations
  - localStorage integration

### Components

#### CartIcon.vue
- Displays the cart button with item count badge
- Props: `isCartOpen` (boolean)
- Emits: `toggle` event when clicked
- Features: ARIA attributes for accessibility

#### CartPanel.vue
- Slide-out drawer displaying cart contents
- Props: `isOpen` (boolean)
- Emits: `close` event
- Features:
  - Empty state message
  - Item list with images and prices
  - Total price calculation
  - Clear cart confirmation
  - Keyboard navigation (Escape to close)

#### AlbumCard.vue (Updated)
- Added cart integration
- Dynamic button text and styling
- Uses cart store to check item status

### App.vue (Updated)
- Integrated CartIcon in header
- Added CartPanel component
- Cart state management

## Accessibility

### Keyboard Navigation
- Tab to focus cart icon
- Enter to open cart
- Escape to close cart
- Tab through cart items
- Enter to activate buttons

### ARIA Attributes
- `aria-label` on all interactive elements
- `aria-expanded` on cart button
- `role="dialog"` and `aria-modal` on cart panel
- `aria-labelledby` for cart title
- `aria-label` on remove buttons with item names

### Screen Reader Support
- All images have alt text
- Badge includes screen reader text
- Clear semantic HTML structure

## Testing

### Unit Tests (10 tests)
- Cart store functionality
- Add/remove operations
- localStorage persistence
- Data validation
- Error handling

### Component Tests (27 tests)
- CartIcon rendering and interactions
- CartPanel state and operations
- AlbumCard cart integration
- User interactions
- Accessibility attributes

### E2E Tests (15 tests)
- Complete user workflows
- Cart operations
- Data persistence
- Keyboard accessibility
- Visual regression (screenshots)

**Total: 52 tests with 100% pass rate**

## Usage Examples

### Adding an Album to Cart
```javascript
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
cartStore.addToCart(album)
```

### Removing an Album from Cart
```javascript
cartStore.removeFromCart(albumId)
```

### Checking if Album is in Cart
```javascript
const isInCart = cartStore.isInCart(albumId)
```

### Clearing the Cart
```javascript
cartStore.clearCart()
```

## Browser Compatibility
- Modern browsers with localStorage support
- Graceful fallback if localStorage is unavailable
- Responsive design for mobile and desktop

## Security
- Input validation on localStorage data
- XSS prevention through Vue's built-in escaping
- No vulnerabilities found in CodeQL scan
- All production dependencies security audited

## Performance
- Lazy loading for album images
- Optimized re-renders with Vue's reactivity
- Efficient localStorage operations
- Minimal bundle size impact (~6KB gzipped with Pinia)

## Future Enhancements (Out of Scope)
- Server-side cart persistence
- Quantity management
- Checkout process
- Price calculations with discounts
- Cart expiration
- Multi-cart support
