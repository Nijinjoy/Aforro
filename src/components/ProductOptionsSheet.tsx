import { memo } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ProductOptionItem } from '../types/cartTypes';
import { formatPrice } from '../utils/formatters';
import { QuantityStepper } from './QuantityStepper';

type ProductOptionsSheetProps = {
  onAddOption: (id: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  onUpdateOptionCount: (id: string, value: number) => void;
  optionCounts: Record<string, number>;
  options: ProductOptionItem[];
  title: string;
  visible: boolean;
};

export const ProductOptionsSheet = memo(function ProductOptionsSheet({
  onAddOption,
  onClose,
  onConfirm,
  onUpdateOptionCount,
  optionCounts,
  options,
  title,
  visible,
}: ProductOptionsSheetProps) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop} />

        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>

          {options.map(option => {
            const count = optionCounts[option.id] ?? 0;
            const primaryCount = optionCounts['option-1'] ?? 1;
            const displayPrice = option.id === 'option-2' ? option.price * primaryCount : option.price;
            const displayOldPrice =
              option.id === 'option-2' ? option.oldPrice * primaryCount : option.oldPrice;

            return (
              <View key={option.id} style={styles.row}>
                <View style={styles.info}>
                  <View style={styles.thumbWrap}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{option.badge}</Text>
                    </View>
                    <Image resizeMode="contain" source={option.imageSource} style={styles.thumb} />
                  </View>

                  <View style={styles.copy}>
                    <View style={styles.detailsRow}>
                      <Text style={styles.size}>{option.size}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.price}>{formatPrice(displayPrice)}</Text>
                        <Text style={styles.oldPrice}>{formatPrice(displayOldPrice)}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.meta}>
                  {option.action === 'stepper' ? (
                    <QuantityStepper
                      onDecrease={() => onUpdateOptionCount(option.id, count - 1)}
                      onIncrease={() => onUpdateOptionCount(option.id, count + 1)}
                      value={count}
                    />
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => onAddOption(option.id)}
                      style={styles.addButton}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          <TouchableOpacity activeOpacity={0.85} onPress={onConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 12,
    paddingTop: 14,
    gap: 10,
  },
  title: {
    color: '#2E2E2E',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 2,
  },
  row: {
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  thumbWrap: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F7F2FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    position: 'relative',
  },
  thumb: {
    width: 36,
    height: 36,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F59C1A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  size: {
    color: '#B1B1B1',
    fontSize: 11,
  },
  meta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 92,
    marginLeft: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    color: '#1E1E1E',
    fontSize: 13,
    fontWeight: '800',
  },
  oldPrice: {
    color: '#A3A3A3',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 92,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#55913D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  confirmButton: {
    marginTop: 4,
    height: 48,
    borderRadius: 9,
    backgroundColor: '#55913D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
