import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import type { ProductListItem } from '../types/cartTypes';
import { formatPrice } from '../utils/formatters';
import { DiscountBadge } from './DiscountBadge';

type ProductCardProps = {
  compact?: boolean;
  onPressAction?: (product: ProductListItem) => void;
  onPressOptions?: (product: ProductListItem) => void;
  product: ProductListItem;
  variant?: 'default' | 'review';
};

export const ProductCard = memo(function ProductCard({
  product,
  compact = false,
  onPressAction,
  onPressOptions,
  variant = 'default',
}: ProductCardProps) {
  const isReview = variant === 'review';
  const hasOptions = product.cta.toLowerCase().includes('option');
  const handlePress = () => {
    if (hasOptions) {
      onPressOptions?.(product);
      return;
    }

    onPressAction?.(product);
  };

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        isReview && compact && styles.cardCompactReview,
      ]}>
      <View
        style={[
          styles.imageWrap,
          compact && styles.imageWrapCompact,
          isReview && compact && styles.imageWrapCompactReview,
          { backgroundColor: product.visual.tone },
        ]}>
        <DiscountBadge label={product.visual.discountLabel} />
        {product.visual.imageSource ? (
          <Image
            resizeMode="contain"
            source={product.visual.imageSource}
            style={[
              styles.image,
              compact && styles.imageCompact,
              isReview && compact && styles.imageCompactReview,
            ]}
          />
        ) : (
          <View
            style={[
              styles.graphic,
              compact && styles.graphicCompact,
              { backgroundColor: product.visual.accent },
            ]}>
            <Text style={styles.graphicText}>{product.visual.label}</Text>
          </View>
        )}
      </View>

      <Text style={styles.brand}>{product.brand}</Text>
      <Text
        numberOfLines={compact ? 3 : 2}
        style={[
          styles.name,
          compact && styles.nameCompact,
          isReview && compact && styles.nameCompactReview,
        ]}>
        {product.name}
      </Text>
      <Text style={styles.weight}>{product.weight}</Text>

      <View style={styles.priceRow}>
        <Text style={[styles.price, compact && styles.priceCompact]}>{formatPrice(product.price)}</Text>
        <Text style={styles.oldPrice}>{formatPrice(product.oldPrice)}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={[styles.button, compact && styles.buttonCompact]}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{product.cta}</Text>
          {hasOptions ? (
            <Feather color="#FFFFFF" name="chevron-down" size={14} style={styles.buttonIcon} />
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 12,
  },
  cardCompact: {
    width: 120,
    marginRight: 12,
  },
  cardCompactReview: {
    width: 112,
    marginRight: 10,
  },
  imageWrap: {
    height: 110,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  imageWrapCompact: {
    height: 96,
  },
  imageWrapCompactReview: {
    height: 84,
    borderRadius: 8,
  },
  image: {
    width: 72,
    height: 90,
  },
  imageCompact: {
    width: 60,
    height: 76,
  },
  imageCompactReview: {
    width: 58,
    height: 72,
  },
  graphic: {
    width: 44,
    height: 70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicCompact: {
    width: 38,
    height: 62,
  },
  graphicText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  brand: {
    marginTop: 8,
    color: '#999999',
    fontSize: 9,
  },
  name: {
    marginTop: 2,
    color: '#202020',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    minHeight: 42,
  },
  nameCompact: {
    minHeight: 42,
  },
  nameCompactReview: {
    minHeight: 38,
  },
  weight: {
    color: '#A0A0A0',
    fontSize: 10,
    lineHeight: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  price: {
    color: '#202020',
    fontSize: 14,
    fontWeight: '800',
  },
  priceCompact: {
    fontSize: 14,
  },
  oldPrice: {
    color: '#ACACAC',
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#55913D',
    borderRadius: 8,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCompact: {
    height: 30,
    borderRadius: 7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    flexWrap: 'nowrap',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonIcon: {
    marginTop: 0,
  },
});
