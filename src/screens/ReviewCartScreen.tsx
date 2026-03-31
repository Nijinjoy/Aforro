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
import Feather from 'react-native-vector-icons/Feather';
import { BottomSheetModal } from '../components/BottomSheetModal';
import { CartHeader } from '../components/CartHeader';
import { ProductSectionWrapper } from '../components/ProductSectionWrapper';
import { ProductOptionsSheet } from '../components/ProductOptionsSheet';
import { ProductRow } from '../components/ProductRow';
import { ReviewCartItemsWrapper } from '../components/ReviewCartItemsWrapper';
import { ReviewCartSummarySection } from '../components/ReviewCartSummarySection';
import { TopCouponsSection } from '../components/TopCouponsSection';
import { buildReviewSuggestionOptions, reviewCartMockData } from '../data/reviewCartMockData';
import { useCartFlow } from '../store/CartFlowProvider';
import type { ProductListItem } from '../types/cartTypes';
import { formatPrice } from '../utils/formatters';
import { buildReviewCartPricing } from '../utils/reviewCartPricing';

type ReviewCartScreenProps = {
  onBack: () => void;
};

type FooterStage = 'address-required' | 'login-required' | 'ready';
type ActiveSheet = 'none' | 'serviceability' | 'login';

const mapIcon = require('../assets/images/map/map.png');

export function ReviewCartScreen({ onBack }: ReviewCartScreenProps) {
  const {
    actions: {
      addReviewCartProduct,
      addReviewCartItems,
      closeOptionsSheet,
      navigate,
      openOptionsSheet,
      removeReviewCartItem,
      resetOptionCounts,
      updateReviewCartItemQuantity,
      updateOptionCount,
    },
    state: { optionCounts, reviewCartItems, showOptionsSheet },
  } = useCartFlow();
  const { suggestions } = reviewCartMockData;
  const [coupons, setCoupons] = useState(() => reviewCartMockData.coupons);
  const [footerStage, setFooterStage] = useState<FooterStage>('address-required');
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>('none');
  const [selectedSuggestion, setSelectedSuggestion] = useState<ProductListItem | null>(null);
  const outOfStockItem = reviewCartItems.find(item => item.isOutOfStock) ?? null;
  const availableItems = reviewCartItems.filter(item => !item.isOutOfStock);
  const hasAnyItems = reviewCartItems.length > 0;
  const pricing = buildReviewCartPricing(availableItems, coupons);
  const selectedSuggestionOptions = selectedSuggestion
    ? buildReviewSuggestionOptions(selectedSuggestion)
    : [];

  function handleDeleteOutOfStockItem(id: string) {
    const nextItems = reviewCartItems.filter(item => item.id !== id);
    removeReviewCartItem(id);

    if (nextItems.length === 0) {
      navigate('cart');
    }
  }

  function handleApplyCoupon(couponId: string) {
    setCoupons(currentCoupons =>
      currentCoupons.map(coupon => ({
        ...coupon,
        applied: coupon.id === couponId,
      })),
    );
  }

  function handleAddSuggestedProduct(product: (typeof suggestions)[number]) {
    addReviewCartProduct(product);
  }

  function handleOpenSuggestedOptions(product: ProductListItem) {
    setSelectedSuggestion(product);
    resetOptionCounts();
    openOptionsSheet('recommended');
  }

  function handleCloseSuggestedOptions() {
    closeOptionsSheet();
    setSelectedSuggestion(null);
  }

  function handleConfirmSuggestedOptions() {
    if (!selectedSuggestion) {
      return;
    }

    addReviewCartItems(selectedSuggestionOptions, optionCounts);
    resetOptionCounts();
    closeOptionsSheet();
    setSelectedSuggestion(null);
  }

  function openServiceabilitySheet() {
    setActiveSheet('serviceability');
  }

  function openLoginSheet() {
    setActiveSheet('login');
  }

  function closeActiveSheet() {
    setActiveSheet('none');
  }

  function handleLoginContinue() {
    setFooterStage('ready');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <CartHeader onBack={onBack} title="Review Cart" />

      {!hasAnyItems ? (
        <View style={styles.emptyStateWrap}>
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyArt}>
              <View style={styles.emptyArtBack} />
              <View style={styles.emptyIconWrap}>
                <Feather color="#FF964A" name="shopping-bag" size={26} />
              </View>
              <View style={styles.emptyDotLeft} />
              <View style={styles.emptyDotRight} />
            </View>
            <Text style={styles.emptyEyebrow}>Review Cart</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Add products from the cart screen to see them here. Once you confirm,
              they will appear in this review step.
            </Text>
            <View style={styles.emptyHint}>
              <Feather color="#5B8F40" name="arrow-left" size={14} />
              <Text style={styles.emptyHintText}>Go back and add items</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.screenWrap}>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            {outOfStockItem ? (
              <View style={styles.outOfStockCard}>
                <View style={styles.outOfStockBanner}>
                  <Text style={styles.outOfStockBannerText}>This item is out of stock</Text>
                </View>

                <View style={styles.outOfStockRow}>
                  <View style={styles.outOfStockImageFrame}>
                    <Image
                      resizeMode="contain"
                      source={outOfStockItem.imageSource}
                      style={styles.outOfStockImage}
                    />
                  </View>

                  <View style={styles.outOfStockCopy}>
                    <Text numberOfLines={2} style={styles.outOfStockName}>
                      {outOfStockItem.name}
                    </Text>
                    <Text style={styles.outOfStockWeight}>{outOfStockItem.weight}</Text>
                    <View style={styles.outOfStockTag}>
                      <Text style={styles.outOfStockTagText}>Out of stock</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleDeleteOutOfStockItem(outOfStockItem.id)}
                    style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.outOfStockDivider} />

                <Text style={styles.similarItemsTitle}>Similar items</Text>
                <ProductRow products={suggestions} variant="review" />
              </View>
            ) : null}

            {availableItems.length > 0 ? (
              <>
                <View style={styles.savingsPill}>
                  <Text style={styles.savingsPillText}>
                    You are saving {formatPrice(pricing.totalSavings)} with this order!
                  </Text>
                </View>
                <View style={styles.warningBanner}>
                  <View style={styles.warningIconWrap}>
                    <Text style={styles.warningIcon}>!</Text>
                  </View>
                  <View style={styles.warningCopy}>
                    <Text style={styles.warningText}>
                      Your order might be delayed due to high demand
                    </Text>
                    <Text style={styles.warningText}>
                      Your order might be delayed due to high demand
                    </Text>
                  </View>
                </View>

                <ReviewCartItemsWrapper
                  items={availableItems}
                  onDecreaseItem={id => updateReviewCartItemQuantity(id, -1)}
                  onIncreaseItem={id => updateReviewCartItemQuantity(id, 1)}
                />

                <ProductSectionWrapper title="Did you forget?" variant="review">
                  <ProductRow
                    onPressOptions={handleOpenSuggestedOptions}
                    onPressProduct={handleAddSuggestedProduct}
                    products={suggestions}
                    variant="review"
                  />
                </ProductSectionWrapper>
              </>
            ) : null}

            <TopCouponsSection coupons={coupons} onApplyCoupon={handleApplyCoupon} />

            <ReviewCartSummarySection
              cashbackRemaining={pricing.cashbackRemaining}
              deliveryFee={pricing.deliveryFee}
              deliveryFeeOriginal={pricing.deliveryFeeOriginal}
              deliveryFeeShortfall={pricing.deliveryFeeShortfall}
              discount={pricing.discount}
              itemTotal={pricing.itemTotal}
              platformFee={pricing.platformFee}
              totalSavings={pricing.totalSavings}
              totalPayable={pricing.totalPayable}
            />
          </ScrollView>

          <View style={styles.deliveryFooterWrap}>
            {footerStage === 'login-required' ? (
              <View style={styles.loginContinueFooter}>
                <View style={styles.loginContinueTopRow}>
                  <View style={styles.loginContinueIconWrap}>
                    <Feather color="#FFFFFF" name="map-pin" size={16} />
                  </View>
                  <View style={styles.loginContinueCopy}>
                    <Text style={styles.loginContinueTitle}>Deliver to</Text>
                    <Text numberOfLines={1} style={styles.loginContinueAddress}>
                      Plot no.10, Khasra no.873, Rawli Mehd...
                    </Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.85} onPress={openLoginSheet}>
                    <Text style={styles.changeText}>Change</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.loginContinueDivider} />

                <View style={styles.loginContinueBottomRow}>
                  <View style={styles.loginContinuePayWrap}>
                    <Text style={styles.toPayLabel}>To Pay</Text>
                    <Text style={styles.loginContinuePayValue}>
                      {formatPrice(pricing.totalPayable)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleLoginContinue}
                    style={styles.loginContinueButton}>
                    <Text style={styles.loginContinueButtonText}>Login to continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : footerStage === 'ready' ? (
              <View style={styles.deliveryFooter}>
                <View style={styles.deliveryTopRow}>
                  <View style={styles.deliveryIconWrap}>
                    <Feather color="#2C7893" name="map-pin" size={16} />
                  </View>
                  <View style={styles.deliveryCopy}>
                    <Text style={styles.deliveryTitle}>
                      Deliver to <Text style={styles.deliveryTitleStrong}>Home</Text>
                    </Text>
                    <Text numberOfLines={1} style={styles.deliveryAddress}>
                      Plot no.10, Khasra no.873, Rawli Mehd...
                    </Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.85} onPress={openLoginSheet}>
                    <Text style={styles.changeText}>Change</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.deliveryBottomRow}>
                  <View style={styles.toPayWrap}>
                    <Text style={styles.toPayLabel}>To Pay</Text>
                    <Text style={styles.toPayValue}>{formatPrice(pricing.totalPayable)}</Text>
                  </View>

                  <TouchableOpacity activeOpacity={0.85} style={styles.proceedButton}>
                    <Text style={styles.proceedButtonText}>Proceed</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.addAddressFooter}>
                <View style={styles.addAddressRow}>
                  <Image resizeMode="contain" source={mapIcon} style={styles.addressPinIcon} />
                  <Text style={styles.addAddressTitle}>Where would you like us to deliver?</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={openServiceabilitySheet}
                  style={styles.addressButton}>
                  <Text style={styles.addressButtonText}>Add address</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      <ProductOptionsSheet
        onAddOption={id => updateOptionCount(id, 1)}
        onClose={handleCloseSuggestedOptions}
        onConfirm={handleConfirmSuggestedOptions}
        onUpdateOptionCount={updateOptionCount}
        optionCounts={optionCounts}
        options={selectedSuggestionOptions}
        title={selectedSuggestion?.name ?? ''}
        visible={showOptionsSheet && !!selectedSuggestion}
      />

      <BottomSheetModal onClose={closeActiveSheet} visible={activeSheet === 'serviceability'}>
          <View style={styles.addressSheet}>
            <View style={styles.addressHandle} />
            <View style={styles.serviceSheetCard}>
              <View style={styles.serviceHeaderRow}>
                <Image resizeMode="contain" source={mapIcon} style={styles.addressPinIcon} />
                <Text style={styles.serviceWarningText}>Location is not serviceable</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    closeActiveSheet();
                    openLoginSheet();
                  }}>
                  <Text style={styles.serviceChangeText}>Change</Text>
                </TouchableOpacity>
              </View>

              <Text numberOfLines={1} style={styles.serviceAddressText}>
                Plot no.10, Khasra no.873, Rawli Mehd...
              </Text>

              <View style={styles.serviceDivider} />

              <View style={styles.serviceBottomRow}>
                <View>
                  <Text style={styles.servicePayLabel}>To Pay</Text>
                  <Text style={styles.servicePayValue}>{formatPrice(pricing.totalPayable)}</Text>
                </View>

                <View style={styles.serviceProceedDisabled}>
                  <Text style={styles.serviceProceedDisabledText}>Proceed</Text>
                </View>
              </View>
            </View>
          </View>
      </BottomSheetModal>

      <BottomSheetModal onClose={closeActiveSheet} visible={activeSheet === 'login'}>
          <View style={styles.addressSheet}>
            <View style={styles.addressHandle} />
            <View style={styles.loginSheetCard}>
              <Text style={styles.loginTitle}>Login to proceed</Text>
              <Text style={styles.loginSubtitle}>
                Log in or sign up to proceed with your order
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  closeActiveSheet();
                  setFooterStage('login-required');
                }}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
      </BottomSheetModal>
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
    paddingBottom: 132,
  },
  screenWrap: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  addressSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  addressHandle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D8D3CA',
    marginBottom: 8,
  },
  addressPinIcon: {
    width: 18,
    height: 18,
    marginRight: 12,
  },
  serviceSheetCard: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceWarningText: {
    flex: 1,
    color: '#EB7A7A',
    fontSize: 16,
    fontWeight: '600',
  },
  serviceChangeText: {
    color: '#7EA65F',
    fontSize: 16,
    fontWeight: '600',
  },
  serviceAddressText: {
    marginTop: 6,
    marginLeft: 30,
    color: '#999999',
    fontSize: 14,
    lineHeight: 18,
  },
  serviceDivider: {
    marginTop: 14,
    marginBottom: 14,
    marginHorizontal: -16,
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
  },
  serviceBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servicePayLabel: {
    color: '#B3B3B3',
    fontSize: 12,
    fontWeight: '500',
  },
  servicePayValue: {
    marginTop: 2,
    color: '#1F1F1F',
    fontSize: 28,
    fontWeight: '700',
  },
  serviceProceedDisabled: {
    width: 158,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#DCE7D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceProceedDisabledText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
  loginSheetCard: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  loginTitle: {
    color: '#1F1F1F',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  loginSubtitle: {
    marginTop: 4,
    color: '#9B9B9B',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  loginButton: {
    marginTop: 18,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#6C9746',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
  loginContinueFooter: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  loginContinueTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  loginContinueIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0C748C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  loginContinueCopy: {
    flex: 1,
  },
  loginContinueTitle: {
    color: '#2D2D2D',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  loginContinueAddress: {
    marginTop: 4,
    color: '#8E8E8E',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  loginContinueDivider: {
    borderTopWidth: 1,
    borderColor: '#E9E9E9',
  },
  loginContinueBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  loginContinuePayWrap: {
    marginLeft: 8,
  },
  loginContinuePayValue: {
    marginTop: 2,
    color: '#1F1F1F',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContinueButton: {
    width: 160,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#5E9739',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContinueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addressButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#6C9746',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
  addAddressFooter: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  addAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addAddressTitle: {
    color: '#2B2B2B',
    width: 267,
    height: 20,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  emptyStateWrap: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    padding: 16,
    justifyContent: 'center',
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 34,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  emptyArt: {
    width: 112,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  emptyArtBack: {
    position: 'absolute',
    width: 88,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#FFF3E8',
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFD9BC',
  },
  emptyDotLeft: {
    position: 'absolute',
    left: 10,
    bottom: 18,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFE0C8',
  },
  emptyDotRight: {
    position: 'absolute',
    right: 12,
    top: 18,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EAF6E1',
  },
  emptyEyebrow: {
    color: '#C58A57',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  emptyTitle: {
    marginTop: 8,
    color: '#2E2E2E',
    fontSize: 22,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 10,
    color: '#9A9A9A',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  emptyHint: {
    marginTop: 18,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6E8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyHintText: {
    color: '#5B8F40',
    fontSize: 13,
    fontWeight: '700',
  },
  savingsPill: {
    backgroundColor: '#E4F6FF',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  savingsPillText: {
    color: '#4D9CC3',
    fontSize: 14,
    fontWeight: '700',
  },
  warningBanner: {
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#F4C64E',
  },
  warningIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFD25B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  warningIcon: {
    color: '#FFFFFF',
    lineHeight: 16,
    fontSize: 11,
    fontWeight: '800',
  },
  warningCopy: {
    flex: 1,
  },
  warningText: {
    color: '#8D8D8D',
    fontSize: 12,
    lineHeight: 16,
  },
  outOfStockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 12,
    paddingBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  outOfStockBanner: {
    backgroundColor: '#FFF1F1',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 10,
    alignItems: 'center',
  },
  outOfStockBannerText: {
    color: '#E57676',
    fontSize: 14,
    fontWeight: '700',
  },
  outOfStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  outOfStockImageFrame: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  outOfStockImage: {
    width: 42,
    height: 42,
  },
  outOfStockCopy: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  outOfStockName: {
    color: '#8B8B8B',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
  },
  outOfStockWeight: {
    marginTop: 6,
    color: '#C1C1C1',
    fontSize: 12,
  },
  outOfStockTag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#FFF1E8',
  },
  outOfStockTagText: {
    color: '#D7651A',
    fontSize: 10,
    fontWeight: '700',
  },
  deleteButton: {
    width: 82,
    height: 32,
    borderWidth: 1,
    borderColor: '#D7E2CF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  deleteButtonText: {
    color: '#76A05B',
    fontSize: 14,
    fontWeight: '500',
  },
  outOfStockDivider: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  similarItemsTitle: {
    color: '#1F1F1F',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginHorizontal: 12,
  },
  deliveryFooterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
  deliveryFooter: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  deliveryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF6FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryCopy: {
    flex: 1,
    marginLeft: 10,
    marginRight: 12,
  },
  deliveryTitle: {
    color: '#5E5E5E',
    fontSize: 12,
  },
  deliveryTitleStrong: {
    color: '#2E2E2E',
    fontWeight: '700',
  },
  deliveryAddress: {
    marginTop: 2,
    color: '#9A9A9A',
    fontSize: 12,
  },
  changeText: {
    color: '#77A55D',
    fontSize: 14,
    fontWeight: '700',
  },
  deliveryBottomRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toPayWrap: {
    paddingLeft: 8,
  },
  toPayLabel: {
    color: '#C0C0C0',
    fontSize: 12,
    fontWeight: '600',
  },
  toPayValue: {
    marginTop: 4,
    color: '#3D3D3D',
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButton: {
    width: 160,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#5E9739',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
