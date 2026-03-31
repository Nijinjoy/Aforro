import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';
import type {
  AppScreen,
  ProductListItem,
  ProductOptionItem,
  ReviewCartItem,
} from '../types/cartTypes';

type OptionsSheetSource = 'featured' | 'similar' | 'recommended';

const fallbackReviewCartImage = require('../assets/images/products/curd.png');

type CartFlowState = {
  activeImageIndex: number;
  optionsSheetSource: OptionsSheetSource;
  optionCounts: Record<string, number>;
  reviewCartItems: ReviewCartItem[];
  screen: AppScreen;
  showOffersFrame: boolean;
  showOptionsSheet: boolean;
};

type CartFlowContextValue = {
  actions: {
    addReviewCartProduct: (product: ProductListItem) => void;
    addReviewCartItems: (options: ProductOptionItem[], counts: Record<string, number>) => void;
    closeOffersFrame: () => void;
    closeOptionsSheet: () => void;
    navigate: (screen: AppScreen) => void;
    openOffersFrame: () => void;
    openOptionsSheet: (source?: OptionsSheetSource) => void;
    removeReviewCartItem: (id: string) => void;
    resetOptionCounts: () => void;
    setActiveImageIndex: (index: number) => void;
    updateReviewCartItemQuantity: (id: string, delta: number) => void;
    updateOptionCount: (id: string, value: number) => void;
  };
  state: CartFlowState;
};

type CartFlowAction =
  | {
      product: ProductListItem;
      type: 'add_review_cart_product';
    }
  | {
      counts: Record<string, number>;
      options: ProductOptionItem[];
      type: 'add_review_cart_items';
    }
  | { type: 'close_offers_frame' }
  | { type: 'close_options_sheet' }
  | { screen: AppScreen; type: 'navigate' }
  | { type: 'open_offers_frame' }
  | { source: OptionsSheetSource; type: 'open_options_sheet' }
  | { id: string; type: 'remove_review_cart_item' }
  | { type: 'reset_option_counts' }
  | { index: number; type: 'set_active_image_index' }
  | { delta: number; id: string; type: 'update_review_cart_item_quantity' }
  | { id: string; type: 'update_option_count'; value: number };

const initialState: CartFlowState = {
  activeImageIndex: 0,
  optionsSheetSource: 'featured',
  optionCounts: {
    'option-1': 1,
    'option-2': 0,
  },
  reviewCartItems: [],
  screen: 'cart',
  showOffersFrame: false,
  showOptionsSheet: false,
};

const CartFlowContext = createContext<CartFlowContextValue | null>(null);

function cartFlowReducer(state: CartFlowState, action: CartFlowAction): CartFlowState {
  switch (action.type) {
    case 'add_review_cart_product': {
      const sourceKey = action.product.id;
      const existingIndex = state.reviewCartItems.findIndex(item => item.sourceKey === sourceKey);

      if (existingIndex >= 0) {
        return {
          ...state,
          reviewCartItems: state.reviewCartItems.map((item, index) =>
            index === existingIndex
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        reviewCartItems: [
          ...state.reviewCartItems,
          {
            id: `review-${sourceKey}`,
            sourceKey,
            name: action.product.name,
            weight: action.product.weight,
            price: action.product.price,
            oldPrice: action.product.oldPrice,
            quantity: 1,
            imageSource: action.product.visual.imageSource ?? fallbackReviewCartImage,
          },
        ],
      };
    }
    case 'add_review_cart_items': {
      const nextItems = [...state.reviewCartItems];

      action.options.forEach(option => {
        const quantity = action.counts[option.id] ?? 0;

        if (quantity <= 0) {
          return;
        }

        const sourceKey = option.id;
        const existingIndex = nextItems.findIndex(item => item.sourceKey === sourceKey);

        if (existingIndex >= 0) {
          const existing = nextItems[existingIndex];
          nextItems[existingIndex] = {
            ...existing,
            quantity: existing.quantity + quantity,
          };
          return;
        }

        nextItems.push({
          id: `review-${sourceKey}`,
          isOutOfStock: state.optionsSheetSource === 'similar',
          sourceKey,
          name: option.name,
          weight: option.size,
          price: option.price,
          oldPrice: option.oldPrice,
          quantity,
          imageSource: option.imageSource,
        });
      });

      return {
        ...state,
        reviewCartItems: nextItems,
      };
    }
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
        optionsSheetSource: action.source,
        showOptionsSheet: true,
      };
    case 'remove_review_cart_item':
      return {
        ...state,
        reviewCartItems: state.reviewCartItems.filter(item => item.id !== action.id),
      };
    case 'reset_option_counts':
      return {
        ...state,
        optionCounts: {
          'option-1': 1,
          'option-2': 0,
        },
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
    case 'update_review_cart_item_quantity':
      return {
        ...state,
        reviewCartItems: state.reviewCartItems.flatMap(item => {
          if (item.id !== action.id) {
            return item;
          }

          const nextQuantity = item.quantity + action.delta;

          if (nextQuantity <= 0) {
            return [];
          }

          return {
            ...item,
            quantity: nextQuantity,
          };
        }),
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
        addReviewCartProduct: (product: ProductListItem) =>
          dispatch({ type: 'add_review_cart_product', product }),
        addReviewCartItems: (options: ProductOptionItem[], counts: Record<string, number>) =>
          dispatch({ type: 'add_review_cart_items', options, counts }),
        closeOffersFrame: () => dispatch({ type: 'close_offers_frame' }),
        closeOptionsSheet: () => dispatch({ type: 'close_options_sheet' }),
        navigate: (screen: AppScreen) => dispatch({ type: 'navigate', screen }),
        openOffersFrame: () => dispatch({ type: 'open_offers_frame' }),
        openOptionsSheet: (source: OptionsSheetSource = 'featured') =>
          dispatch({ type: 'open_options_sheet', source }),
        removeReviewCartItem: (id: string) => dispatch({ type: 'remove_review_cart_item', id }),
        resetOptionCounts: () => dispatch({ type: 'reset_option_counts' }),
        setActiveImageIndex: (index: number) =>
          dispatch({ type: 'set_active_image_index', index }),
        updateReviewCartItemQuantity: (id: string, delta: number) =>
          dispatch({ type: 'update_review_cart_item_quantity', id, delta }),
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
