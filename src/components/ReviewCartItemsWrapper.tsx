import { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { ReviewCartItem } from '../types/cartTypes';
import { formatPrice } from '../utils/formatters';
import { QuantityStepper } from './QuantityStepper';

type ReviewCartItemsWrapperProps = {
  items: ReviewCartItem[];
  onDecreaseItem: (id: string) => void;
  onIncreaseItem: (id: string) => void;
};

export const ReviewCartItemsWrapper = memo(function ReviewCartItemsWrapper({
  items,
  onDecreaseItem,
  onIncreaseItem,
}: ReviewCartItemsWrapperProps) {
  return (
    <View style={styles.card}>
      {items.map(item => (
        <View key={item.id} style={styles.row}>
          {(() => {
            const totalPrice = item.price * item.quantity;
            const totalOldPrice = item.oldPrice * item.quantity;

            return (
              <>
          <View style={styles.imageFrame}>
            <Image resizeMode="contain" source={item.imageSource} style={styles.image} />
          </View>

          <View style={styles.copy}>
            <Text numberOfLines={2} style={styles.name}>
              {item.name}
            </Text>
            <Text style={styles.weight}>{item.weight}</Text>
          </View>

          <View style={styles.meta}>
            <QuantityStepper
              onDecrease={() => onDecreaseItem(item.id)}
              onIncrease={() => onIncreaseItem(item.id)}
              value={item.quantity}
            />
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(totalPrice)}</Text>
              <Text style={styles.oldPrice}>{formatPrice(totalOldPrice)}</Text>
            </View>
          </View>
              </>
            );
          })()}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  imageFrame: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 42,
    height: 42,
  },
  copy: {
    flex: 0,
    width: 150,
    marginLeft: 8,
    marginRight: 10,
  },
  name: {
    color: '#444444',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    flexShrink: 0,
  },
  weight: {
    marginTop: 6,
    color: '#A2A2A2',
    fontSize: 12,
  },
  meta: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  price: {
    color: '#202020',
    fontSize: 14,
    fontWeight: '800',
  },
  oldPrice: {
    color: '#ACACAC',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
});
