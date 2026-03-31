import type { ImageSourcePropType } from 'react-native';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type AppScreen = 'cart' | 'review-cart';

export type ProductVisual = {
  tone: string;
  accent: string;
  label: string;
  discountLabel: string;
  imageSource?: ImageSourcePropType;
};

export type ProductListItem = {
  id: string;
  brand: string;
  name: string;
  weight: string;
  price: number;
  oldPrice: number;
  cta: string;
  visual: ProductVisual;
};

export type FeaturedProduct = ProductListItem & {
  shortTitle: string;
  headerTitle: string;
  gallery: ProductVisual[];
};

export type CartScreenData = {
  featuredProduct: FeaturedProduct;
  description: string;
  similarProducts: ProductListItem[];
  recommendedProducts: ProductListItem[];
};

export type OfferCard = {
  id: string;
  badge: string;
  title: string;
  code: string;
  cta: string;
  applied: boolean;
};

export type ProductOptionAction = 'stepper' | 'add';

export type ProductOptionItem = {
  id: string;
  imageSource: ImageSourcePropType;
  name: string;
  size: string;
  price: number;
  oldPrice: number;
  badge: string;
  action: ProductOptionAction;
};

export type ReviewCartItem = {
  id: string;
  isOutOfStock?: boolean;
  sourceKey: string;
  name: string;
  weight: string;
  price: number;
  oldPrice: number;
  quantity: number;
  imageSource: ImageSourcePropType;
};

export type CouponItem = {
  id: string;
  badge: string;
  code: string;
  applied: boolean;
};

export type ReviewCartData = {
  cartItems: ReviewCartItem[];
  suggestions: ProductListItem[];
  coupons: CouponItem[];
};

export type ReviewCartPricing = {
  appliedCoupon: CouponItem | null;
  cashbackRemaining: number;
  couponDiscount: number;
  deliveryFee: number;
  deliveryFeeOriginal: number;
  deliveryFeeShortfall: number;
  discount: number;
  itemDiscount: number;
  itemTotal: number;
  platformFee: number;
  totalPayable: number;
  totalQuantity: number;
  totalSavings: number;
};
