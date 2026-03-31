# Aforro

React Native shopping flow prototype with two main screens:

- `CartScreen`: product details, options sheet, and product discovery sections
- `ReviewCartScreen`: cart review, coupons, address/login bottom sheets, and checkout footer states

## Requirements

- Node.js `>= 22.11.0`
- npm
- React Native environment set up for Android and/or iOS
- Xcode and CocoaPods for iOS
- Android Studio / Android SDK for Android

React Native environment setup reference:

- https://reactnative.dev/docs/environment-setup

## Setup

1. Install dependencies:

```sh
npm install
```

2. Install iOS pods:

```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

3. Start Metro:

```sh
npm start
```

4. Run the app:

Android:

```sh
npx react-native run-android
```

iOS:

```sh
npx react-native run-ios
```

## Useful Commands

Start Metro:

```sh
npm start
```

Run Android:

```sh
npx react-native run-android
```

Run iOS:

```sh
npx react-native run-ios
```

Run tests:

```sh
npm test
```

Type-check:

```sh
npx tsc --noEmit
```

Lint:

```sh
npm run lint
```

## Project Structure

```text
App.tsx
src/
  api/
    cartApi.ts
  assets/
    images/
  components/
    CartHeader.tsx
    ProductCard.tsx
    ProductOptionsSheet.tsx
    ProductRow.tsx
    ProductSectionWrapper.tsx
    QuantityStepper.tsx
    ReviewCartItemsWrapper.tsx
    ReviewCartSummarySection.tsx
    TopCouponsSection.tsx
  data/
    cartMockData.ts
    reviewCartMockData.ts
  hooks/
    useCartScreenData.ts
  screens/
    CartScreen.tsx
    ReviewCartScreen.tsx
  store/
    CartFlowProvider.tsx
  types/
    cartTypes.ts
  utils/
    formatters.ts
```

## Architecture

The app uses a simple local-state architecture centered on a single context provider.

### App Shell

- `App.tsx` sets up `SafeAreaProvider`, loads Feather icons, and mounts `CartFlowProvider`
- Navigation is local and screen-based, not React Navigation based
- `AppContent` switches between `cart` and `review-cart` using provider state

### State Management

- `src/store/CartFlowProvider.tsx` holds shared app state with `useReducer`
- It manages:
  - current screen
  - review cart items
  - option sheet visibility
  - option counts
  - image pager state
  - offer frame visibility
- Shared actions such as adding items, removing items, quantity updates, and opening sheets are exposed through `useCartFlow()`

This keeps screen components mostly focused on rendering and local UI state.

### Screens

- `src/screens/CartScreen.tsx`
  - shows the product details page
  - opens the shared product options bottom sheet
  - adds selected options into review-cart state
- `src/screens/ReviewCartScreen.tsx`
  - shows review cart items, savings banner, coupons, suggestions, and summary
  - handles address flow bottom sheets
  - handles login-to-continue footer state

### Data Layer

- `src/data/cartMockData.ts` contains the cart screen mock content and featured product options builder
- `src/data/reviewCartMockData.ts` contains review-cart mock content and review suggestion option builder
- `src/hooks/useCartScreenData.ts` reads cart screen data for the cart page
- `src/api/cartApi.ts` is the current API abstraction layer placeholder

Right now the app is mock-data driven. Replacing the mock layer with live API data should mostly happen in `api/`, `hooks/`, and the data builders.

### UI Composition

The component layer is intentionally split into small reusable primitives:

- `ProductCard`, `ProductRow`, `ProductSectionWrapper` for product listing sections
- `ProductOptionsSheet` for bottom-sheet style option selection
- `ReviewCartItemsWrapper` for cart line items
- `TopCouponsSection` and `ReviewCartSummarySection` for checkout-related blocks
- `QuantityStepper` for quantity controls

### Types

- `src/types/cartTypes.ts` contains the main shared domain types for products, coupons, review cart items, and screen data

### Utilities

- `src/utils/formatters.ts` contains price formatting helpers used across the UI

## Main UI Flows

### Cart to Review Cart

1. User opens product options from `CartScreen`
2. Selected options are added through `CartFlowProvider`
3. App switches to `review-cart`

### Review Cart Item Management

- Increase/decrease quantity from the review cart list
- Decreasing from `1` removes the item
- Suggested products can:
  - add directly with `Add`
  - open the bottom options sheet with `2 options`

### Coupon Flow

- Coupons are rendered in `TopCouponsSection`
- Applying one coupon marks it as the active coupon for the screen state

### Address and Login Footer Flow

`ReviewCartScreen` currently supports multiple footer states:

- initial `Add address` footer
- serviceability bottom sheet
- login bottom sheet
- `Login to continue` footer
- selected address footer

These are currently local UI states in `ReviewCartScreen.tsx`.

## Notes for Development

- The current app favors local UI state and provider state over heavier navigation/state libraries
- Several flows are visual prototypes and are currently driven by mock data
- Root-level reference images like `address.png`, `service.png`, `login.png`, and `continue.png` are being used as design references during implementation

## Suggested Next Steps

- Move footer flow state into a dedicated checkout/address state model
- Replace mock product and coupon data with API-backed data
- Add component tests for reducer-driven cart transitions
- Add screen-level tests for review cart footer and bottom-sheet states
