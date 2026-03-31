import type { CouponItem, ReviewCartItem, ReviewCartPricing } from '../types/cartTypes';

const CASHBACK_THRESHOLD = 500;
const DELIVERY_FREE_THRESHOLD = 500;
const DELIVERY_FEE_AMOUNT = 40;
const PLATFORM_FEE_PER_ITEM = 2;
const PLATFORM_FEE_CAP = 10;

function getCouponDiscountValue(coupon: CouponItem | null, itemTotal: number) {
  if (!coupon) {
    return 0;
  }

  const normalizedBadge = coupon.badge.replace(/\s+/g, '').toUpperCase();

  if (normalizedBadge.includes('₹')) {
    const flatDiscount = Number(normalizedBadge.replace(/[^\d]/g, ''));
    return Number.isFinite(flatDiscount) ? Math.min(flatDiscount, itemTotal) : 0;
  }

  if (normalizedBadge.includes('%')) {
    const percentDiscount = Number(normalizedBadge.replace(/[^\d]/g, ''));
    return Number.isFinite(percentDiscount) ? Math.floor((itemTotal * percentDiscount) / 100) : 0;
  }

  return 0;
}

export function buildReviewCartPricing(
  items: ReviewCartItem[],
  coupons: CouponItem[],
): ReviewCartPricing {
  const itemTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const itemDiscount = items.reduce(
    (total, item) => total + Math.max(0, (item.oldPrice - item.price) * item.quantity),
    0,
  );
  const appliedCoupon = coupons.find(coupon => coupon.applied) ?? null;
  const couponDiscount = getCouponDiscountValue(appliedCoupon, itemTotal);
  const discount = itemDiscount + couponDiscount;
  const cashbackRemaining = Math.max(0, CASHBACK_THRESHOLD - itemTotal);
  const deliveryFeeOriginal = itemTotal > 0 ? DELIVERY_FEE_AMOUNT : 0;
  const deliveryFee = itemTotal >= DELIVERY_FREE_THRESHOLD ? 0 : deliveryFeeOriginal;
  const deliveryFeeShortfall = Math.max(0, DELIVERY_FREE_THRESHOLD - itemTotal);
  const platformFee =
    totalQuantity > 0 ? Math.min(PLATFORM_FEE_CAP, totalQuantity * PLATFORM_FEE_PER_ITEM) : 0;
  const totalSavings = itemDiscount + couponDiscount + (deliveryFeeOriginal - deliveryFee);
  const totalPayable = Math.max(0, itemTotal - couponDiscount + platformFee + deliveryFee);

  return {
    appliedCoupon,
    cashbackRemaining,
    couponDiscount,
    deliveryFee,
    deliveryFeeOriginal,
    deliveryFeeShortfall,
    discount,
    itemDiscount,
    itemTotal,
    platformFee,
    totalPayable,
    totalQuantity,
    totalSavings,
  };
}
