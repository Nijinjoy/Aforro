import type { ReviewCartData } from '../types/cartTypes';

const dairyMilkImage = require('../assets/images/products/dairymilk.png');
const curdImage = require('../assets/images/products/curd.png');

export const reviewCartMockData: ReviewCartData = {
  cartItems: new Array(4).fill(null).map((_, index) => ({
    id: `cart-${index}`,
    name: 'Gold Premium Assam Tea Rich Taste & Irresistible',
    weight: '3 X 1kg',
    price: 199,
    oldPrice: 399,
    quantity: 1,
    imageSource: dairyMilkImage,
  })),
  suggestions: [
    {
      id: 's1',
      brand: 'Tata Tea',
      name: 'Gold Premium Assam Tea Rich...',
      weight: '1kg',
      price: 444,
      oldPrice: 4444,
      cta: '2 options',
      visual: {
        tone: '#EFF5FF',
        accent: '#3B6AB2',
        label: 'SKYR',
        discountLabel: '52% OFF',
        imageSource: curdImage,
      },
    },
    {
      id: 's2',
      brand: 'Tata Tea',
      name: 'Gold Premium Assam Tea Rich...',
      weight: '1kg',
      price: 444,
      oldPrice: 4444,
      cta: '2 options',
      visual: {
        tone: '#EFF5FF',
        accent: '#3B6AB2',
        label: 'SKYR',
        discountLabel: '52% OFF',
        imageSource: curdImage,
      },
    },
    {
      id: 's3',
      brand: 'Tata Tea',
      name: 'Organic apple',
      weight: '1kg',
      price: 444,
      oldPrice: 4444,
      cta: 'Add',
      visual: {
        tone: '#FFF2E6',
        accent: '#8A4B26',
        label: 'APPLE',
        discountLabel: '52% OFF',
        imageSource: curdImage,
      },
    },
  ],
  coupons: [
    { id: 'c1', badge: '₹250\nOFF', code: 'ABCDEFGHI', applied: false },
    { id: 'c2', badge: '6%\nOFF', code: 'ABCDEFGHI', applied: true },
    { id: 'c3', badge: '₹250\nOFF', code: 'ABCDEFGHI', applied: false },
  ],
};
