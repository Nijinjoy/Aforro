import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartHeader } from '../components/CartHeader';
import { ProductSectionWrapper } from '../components/ProductSectionWrapper';
import { ProductRow } from '../components/ProductRow';
import { ReviewCartItemsWrapper } from '../components/ReviewCartItemsWrapper';
import { TopCouponsSection } from '../components/TopCouponsSection';
import { reviewCartMockData } from '../data/reviewCartMockData';
import { formatPrice } from '../utils/formatters';

type ReviewCartScreenProps = {
  onBack: () => void;
};

export function ReviewCartScreen({ onBack }: ReviewCartScreenProps) {
  const [cartItems, setCartItems] = useState(reviewCartMockData.cartItems);
  const { coupons, suggestions } = reviewCartMockData;

  function updateItemQuantity(id: string, delta: number) {
    setCartItems(current =>
      current.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item,
      ),
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <CartHeader onBack={onBack} title="Review Cart" />

      <ScrollView
        bounces={false}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.savingsPill}>
          <Text style={styles.savingsPillText}>You are saving ₹99 with this order!</Text>
        </View>

        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>!</Text>
          <Text style={styles.warningText}>
            Your order might be delayed due to high demand. Your order might be
            delayed due to high demand
          </Text>
        </View>

        <ReviewCartItemsWrapper
          items={cartItems}
          onDecreaseItem={id => updateItemQuantity(id, -1)}
          onIncreaseItem={id => updateItemQuantity(id, 1)}
        />

        <ProductSectionWrapper title="Did you forget?" variant="review">
          <ProductRow products={suggestions} variant="review" />
        </ProductSectionWrapper>

        <TopCouponsSection coupons={coupons} />

        <View style={styles.cashbackCard}>
          <Text style={styles.cashbackText}>Add items worth ₹45 more to get 1% cashback</Text>
          <Text style={styles.cashbackSubtext}>No coupon required</Text>
        </View>

        <ProductSectionWrapper title="Delivery instructions">
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Don't ring the bell</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Don't call</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Leave order with guard</Text>
            </View>
          </View>
          <View style={styles.noteInput}>
            <Text style={styles.notePlaceholder}>Type in any other instructions</Text>
          </View>
        </ProductSectionWrapper>

        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item total</Text>
            <Text style={styles.billValue}>{formatPrice(444)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery fee</Text>
            <Text style={styles.billFree}>FREE</Text>
          </View>
          <View style={styles.billHintRow}>
            <Text style={styles.billHint}>Add items worth ₹10 to get free delivery</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount</Text>
            <Text style={styles.billValue}>-₹444</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform fee</Text>
            <Text style={styles.billValue}>-₹444</Text>
          </View>
          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Total payable amount</Text>
            <Text style={styles.totalValue}>{formatPrice(444)}</Text>
          </View>
        </View>

        <View style={styles.bottomSavingsPill}>
          <Text style={styles.savingsPillText}>You are saving 99 with this order!</Text>
        </View>

        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>Cancellation policy</Text>
          <Text style={styles.policyText}>
            You can cancel your order for free within the first 90 seconds. After that,
            a cancellation fee will apply.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 28,
  },
  savingsPill: {
    backgroundColor: '#E4F6FF',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  bottomSavingsPill: {
    marginTop: 12,
    backgroundColor: '#E4F6FF',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  savingsPillText: {
    color: '#4D9CC3',
    fontSize: 14,
    fontWeight: '700',
  },
  warningBanner: {
    marginTop: 14,
    backgroundColor: '#FFFDF8',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1C452',
  },
  warningIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFC94C',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 17,
    fontSize: 11,
    fontWeight: '800',
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    color: '#B08A2F',
    fontSize: 11,
    lineHeight: 16,
  },
  suggestionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  suggestionCard: {
    width: '31.5%',
  },
  suggestionImageBox: {
    height: 88,
    borderRadius: 10,
    backgroundColor: '#EFF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionImage: {
    width: 60,
    height: 60,
  },
  suggestionBrand: {
    marginTop: 8,
    color: '#999999',
    fontSize: 9,
  },
  suggestionName: {
    marginTop: 2,
    color: '#202020',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    minHeight: 42,
  },
  suggestionWeight: {
    color: '#A0A0A0',
    fontSize: 10,
    lineHeight: 10,
  },
  suggestionPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  suggestionPrice: {
    color: '#202020',
    fontSize: 14,
    fontWeight: '800',
  },
  suggestionOldPrice: {
    color: '#ACACAC',
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  suggestionButton: {
    marginTop: 8,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#55913D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cashbackCard: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cashbackText: {
    color: '#404040',
    fontSize: 12,
    fontWeight: '700',
  },
  cashbackSubtext: {
    color: '#B0B0B0',
    fontSize: 11,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  chipText: {
    color: '#6B6B6B',
    fontSize: 11,
  },
  noteInput: {
    marginTop: 12,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  notePlaceholder: {
    color: '#B0B0B0',
    fontSize: 11,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  billHintRow: {
    marginTop: 4,
  },
  billLabel: {
    color: '#6B6B6B',
    fontSize: 12,
  },
  billValue: {
    color: '#4A4A4A',
    fontSize: 12,
    fontWeight: '600',
  },
  billFree: {
    color: '#55913D',
    fontSize: 12,
    fontWeight: '700',
  },
  billHint: {
    color: '#FF8E39',
    fontSize: 10,
  },
  billDivider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginTop: 12,
  },
  totalLabel: {
    color: '#363636',
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    color: '#363636',
    fontSize: 18,
    fontWeight: '800',
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  policyTitle: {
    color: '#414141',
    fontSize: 13,
    fontWeight: '700',
  },
  policyText: {
    marginTop: 8,
    color: '#9A9A9A',
    fontSize: 11,
    lineHeight: 16,
  },
});
