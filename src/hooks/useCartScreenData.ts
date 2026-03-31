import { useEffect, useState } from 'react';
import { cartApi } from '../api/cartApi';
import type { CartScreenData } from '../types/cartTypes';

type UseCartScreenDataResult = {
  data: CartScreenData | null;
  isLoading: boolean;
};

export function useCartScreenData(): UseCartScreenDataResult {
  const [data, setData] = useState<CartScreenData | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCartScreen() {
      const response = await cartApi.getCartScreenData();

      if (mounted) {
        setData(response);
      }
    }

    loadCartScreen();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    data,
    isLoading: data === null,
  };
}
