import { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { ProductListItem } from '../types/cartTypes';
import { ProductCard } from './ProductCard';

type ProductRowProps = {
  onPressProduct?: (product: ProductListItem) => void;
  onPressOptions?: (product: ProductListItem) => void;
  products: ProductListItem[];
  variant?: 'default' | 'review';
};

export const ProductRow = memo(function ProductRow({
  onPressProduct,
  onPressOptions,
  products,
  variant = 'default',
}: ProductRowProps) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={[styles.row, variant === 'review' && styles.rowReview]}
      showsHorizontalScrollIndicator={false}>
      {products.map(product => (
        <ProductCard
          compact
          key={product.id}
          onPressAction={onPressProduct}
          onPressOptions={onPressOptions}
          product={product}
          variant={variant}
        />
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  rowReview: {
    paddingHorizontal: 16,
    paddingRight: 8,
  },
});
