import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';
import type { AppScreen } from '../types/cartTypes';

type CartFlowState = {
  activeImageIndex: number;
  optionCounts: Record<string, number>;
  screen: AppScreen;
  showOffersFrame: boolean;
  showOptionsSheet: boolean;
};

type CartFlowContextValue = {
  actions: {
    closeOffersFrame: () => void;
    closeOptionsSheet: () => void;
    navigate: (screen: AppScreen) => void;
    openOffersFrame: () => void;
    openOptionsSheet: () => void;
    setActiveImageIndex: (index: number) => void;
    updateOptionCount: (id: string, value: number) => void;
  };
  state: CartFlowState;
};

type CartFlowAction =
  | { type: 'close_offers_frame' }
  | { type: 'close_options_sheet' }
  | { screen: AppScreen; type: 'navigate' }
  | { type: 'open_offers_frame' }
  | { type: 'open_options_sheet' }
  | { index: number; type: 'set_active_image_index' }
  | { id: string; type: 'update_option_count'; value: number };

const initialState: CartFlowState = {
  activeImageIndex: 0,
  optionCounts: {
    'option-1': 1,
    'option-2': 0,
  },
  screen: 'cart',
  showOffersFrame: false,
  showOptionsSheet: false,
};

const CartFlowContext = createContext<CartFlowContextValue | null>(null);

function cartFlowReducer(state: CartFlowState, action: CartFlowAction): CartFlowState {
  switch (action.type) {
    case 'navigate':
      return {
        ...state,
        screen: action.screen,
      };
    case 'set_active_image_index':
      return {
        ...state,
        activeImageIndex: action.index,
      };
    case 'open_options_sheet':
      return {
        ...state,
        showOptionsSheet: true,
      };
    case 'close_options_sheet':
      return {
        ...state,
        showOptionsSheet: false,
      };
    case 'open_offers_frame':
      return {
        ...state,
        showOffersFrame: true,
      };
    case 'close_offers_frame':
      return {
        ...state,
        showOffersFrame: false,
      };
    case 'update_option_count':
      return {
        ...state,
        optionCounts: {
          ...state.optionCounts,
          [action.id]:
            action.id === 'option-1' ? Math.max(1, action.value) : Math.max(0, action.value),
        },
      };
    default:
      return state;
  }
}

export function CartFlowProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(cartFlowReducer, initialState);

  const value = useMemo<CartFlowContextValue>(
    () => ({
      state,
      actions: {
        closeOffersFrame: () => dispatch({ type: 'close_offers_frame' }),
        closeOptionsSheet: () => dispatch({ type: 'close_options_sheet' }),
        navigate: (screen: AppScreen) => dispatch({ type: 'navigate', screen }),
        openOffersFrame: () => dispatch({ type: 'open_offers_frame' }),
        openOptionsSheet: () => dispatch({ type: 'open_options_sheet' }),
        setActiveImageIndex: (index: number) =>
          dispatch({ type: 'set_active_image_index', index }),
        updateOptionCount: (id: string, value: number) =>
          dispatch({ type: 'update_option_count', id, value }),
      },
    }),
    [state],
  );

  return <CartFlowContext.Provider value={value}>{children}</CartFlowContext.Provider>;
}

export function useCartFlow() {
  const context = useContext(CartFlowContext);

  if (!context) {
    throw new Error('useCartFlow must be used within CartFlowProvider');
  }

  return context;
}
