import type { CartScreenData } from '../types/cartTypes';
import { cartScreenMockData } from '../data/cartMockData';

function delay(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export const cartApi = {
  async getCartScreenData(): Promise<CartScreenData> {
    await delay(150);
    return cartScreenMockData;
  },
};
