import { useWindowDimensions } from 'react-native';
import {
  ActivityIndicator,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { CartHeader } from '../components/CartHeader';
import { OfferApplyPanel } from '../components/OfferApplyPanel';
import { DiscountBadge } from '../components/DiscountBadge';
import { ProductSectionWrapper } from '../components/ProductSectionWrapper';
import { ProductOptionsSheet } from '../components/ProductOptionsSheet';
import { ProductRow } from '../components/ProductRow';
import { buildFeaturedOptions, offerCardsMockData } from '../data/cartMockData';
import { useCartScreenData } from '../hooks/useCartScreenData';
import { useCartFlow } from '../store/CartFlowProvider';
import type { FeaturedProduct } from '../types/cartTypes';
import { formatPrice } from '../utils/formatters';

const shareIcon = require('../assets/images/share/share.png');

function ProductArt({
  product,
  activeIndex,
  onSwipeEnd,
  pageWidth,
}: {
  product: FeaturedProduct;
  activeIndex: number;
  onSwipeEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  pageWidth: number;
}) {
  return (
    <View>
      <View style={[styles.heroPagerViewport, { width: pageWidth }]}>
        <ScrollView
          horizontal
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={pageWidth}
          snapToAlignment="start"
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onSwipeEnd}
          style={styles.heroPager}>
          {product.gallery.map((item, index) => (
            <View
              key={`${item.label}-${index}`}
              style={[styles.heroArt, { width: pageWidth }]}>
              <DiscountBadge label={item.discountLabel} />
              <View style={styles.heroImageFrame}>
              <Image
                resizeMode="contain"
                source={item.imageSource}
                style={styles.heroImage}
              />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.pagination}>
        {product.gallery.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

type CartScreenProps = {
  onReviewCart?: () => void;
};

export function CartScreen({ onReviewCart }: CartScreenProps) {
  const { data: screenData, isLoading } = useCartScreenData();
  const {
    actions: {
      closeOptionsSheet,
      openOptionsSheet,
      setActiveImageIndex,
      updateOptionCount,
    },
    state: { activeImageIndex, optionCounts, showOffersFrame, showOptionsSheet },
  } = useCartFlow();
  const { width } = useWindowDimensions();
  const heroPageWidth = Math.max(width - 44, 0);

  if (isLoading || !screenData) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <CartHeader
          rightSlot={<Image source={shareIcon} style={styles.shareIcon} />}
          title="Loading product..."
        />

        <View style={styles.loaderContainer}>
          <ActivityIndicator color="#679A43" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const { featuredProduct, description, similarProducts, recommendedProducts } =
    screenData;
  const featuredOptions = buildFeaturedOptions(featuredProduct);

  function handleHeroSwipeEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const nextIndex = Math.round(contentOffset.x / layoutMeasurement.width);
    setActiveImageIndex(nextIndex);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <CartHeader
        rightSlot={<Image source={shareIcon} style={styles.shareIcon} />}
        title={featuredProduct.headerTitle}
      />

      <ScrollView
        bounces={false}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <ProductArt
            activeIndex={activeImageIndex}
            onSwipeEnd={handleHeroSwipeEnd}
            pageWidth={heroPageWidth}
            product={featuredProduct}
          />

          <Text style={styles.brandLabel}>{featuredProduct.brand}</Text>
          <Text style={styles.title}>{featuredProduct.name}</Text>
          <Text style={styles.subtitle}>{featuredProduct.shortTitle}</Text>
          <Text style={styles.weight}>{featuredProduct.weight}</Text>

          <View style={styles.heroFooter}>
            <View>
              <View style={styles.priceLine}>
                <Text style={styles.heroPrice}>
                  {formatPrice(featuredProduct.price)}
                </Text>
                <Text style={styles.heroOldPrice}>
                  {formatPrice(featuredProduct.oldPrice)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={openOptionsSheet}
              style={styles.optionsButton}>
              <View style={styles.optionsButtonContent}>
                <Text style={styles.optionsButtonText}>{featuredProduct.cta}</Text>
                <Feather
                  color="#FFFFFF"
                  name="chevron-down"
                  size={16}
                  style={styles.optionsButtonIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ProductSectionWrapper title="Similar product">
          <ProductRow products={similarProducts} />
        </ProductSectionWrapper>

        <ProductSectionWrapper title="Description">
          <Text style={styles.descriptionText}>{description}</Text>
        </ProductSectionWrapper>

        <ProductSectionWrapper title="Customers also bought">
          <ProductRow products={recommendedProducts} />
        </ProductSectionWrapper>
      </ScrollView>

      {showOffersFrame ? <OfferApplyPanel offers={offerCardsMockData} /> : null}

      <ProductOptionsSheet
        onAddOption={id => {
          updateOptionCount(id, 1);
          closeOptionsSheet();
        }}
        onClose={closeOptionsSheet}
        onConfirm={() => {
          closeOptionsSheet();
          onReviewCart?.();
        }}
        onUpdateOptionCount={updateOptionCount}
        optionCounts={optionCounts}
        options={featuredOptions}
        title="Gold Premium Assam Tea Rich Taste & Irresistible Gold Premium Assam Tea Rich Taste & Irresistible"
        visible={showOptionsSheet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  shareIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  content: {
    backgroundColor: '#F4F5F7',
    padding: 10,
    paddingBottom: 32,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F5F7',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  heroArt: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  heroPager: {
    width: '100%',
  },
  heroPagerViewport: {
    overflow: 'hidden',
    alignSelf: 'center',
  },
  discountBadge: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  discountBadgeWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  discountBadgeInner: {
    width: 38,
    height: 38,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#4D8D98',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
  },
  discountBadgeTeeth: {
    width: 38,
    marginTop: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  discountBadgeTooth: {
    width: 0,
    height: 0,
    borderLeftWidth: 4.75,
    borderRightWidth: 4.75,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4D8D98',
  },
  discountTextTop: {
    fontSize: 10,
    lineHeight: 11,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
  discountTextBottom: {
    marginTop: 0,
    fontSize: 8,
    lineHeight: 9,
    letterSpacing: 0.3,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
  heroImageFrame: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: '#F59C1A',
  },
  dotInactive: {
    backgroundColor: '#D4D7DC',
  },
  brandLabel: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  title: {
    marginTop: 2,
    fontSize: 24,
    lineHeight: 28,
    color: '#242424',
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 15,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  weight: {
    marginTop: 4,
    fontSize: 13,
    color: '#8B8F97',
  },
  heroFooter: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroPrice: {
    fontSize: 22,
    color: '#111111',
    fontWeight: '800',
  },
  heroOldPrice: {
    fontSize: 13,
    color: '#9A9A9A',
    textDecorationLine: 'line-through',
  },
  optionsButton: {
    backgroundColor: '#55913D',
    borderRadius: 8,
    width: 120,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  optionsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionsButtonIcon: {
    marginTop: 1,
  },
  productRail: {
    paddingHorizontal: 12,
  },
  similarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  productCard: {
    width: 120,
    marginRight: 12,
  },
  productCardCompact: {
    width: 120,
    marginRight: 12,
  },
  productImage: {
    height: 110,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  productImageCompact: {
    height: 96,
  },
  productGraphic: {
    width: 44,
    height: 70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productGraphicCompact: {
    width: 40,
    height: 62,
  },
  productImageAsset: {
    width: 78,
    height: 78,
  },
  productImageAssetCompact: {
    width: 70,
    height: 70,
  },
  productGraphicText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  productBrand: {
    marginTop: 8,
    fontSize: 10,
    color: '#999999',
  },
  productName: {
    marginTop: 2,
    fontSize: 16,
    lineHeight: 18,
    color: '#202020',
    fontWeight: '700',
  },
  productNameCompact: {
    fontSize: 12,
    lineHeight: 15,
    minHeight: 46,
    marginTop: 0,
    marginBottom: 0,
  },
  productWeight: {
    marginTop: 0,
    fontSize: 11,
    color: '#9A9A9A',
    lineHeight: 11,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  productPrice: {
    fontSize: 18,
    color: '#111111',
    fontWeight: '800',
  },
  productPriceCompact: {
    fontSize: 14,
  },
  productOldPrice: {
    fontSize: 11,
    color: '#9A9A9A',
    textDecorationLine: 'line-through',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#55913D',
    borderRadius: 8,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonCompact: {
    height: 30,
    borderRadius: 7,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    flexWrap: 'nowrap',
  },
  addButtonIcon: {
    marginTop: 0,
  },
  descriptionText: {
    paddingHorizontal: 12,
    fontSize: 14,
    lineHeight: 21,
    color: '#6B6F76',
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },
  optionsSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 12,
    paddingTop: 14,
    gap: 10,
  },
  optionsSheetTitle: {
    color: '#2E2E2E',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 2,
  },
  optionRow: {
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
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  optionThumbWrap: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F7F2FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    position: 'relative',
  },
  optionThumb: {
    width: 36,
    height: 36,
  },
  optionBadge: {
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
  optionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  optionCopy: {
    flex: 1,
  },
  optionSize: {
    color: '#B1B1B1',
    fontSize: 11,
  },
  optionDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  optionMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 92,
    marginLeft: 8,
  },
  optionPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionPrice: {
    color: '#1E1E1E',
    fontSize: 13,
    fontWeight: '800',
  },
  optionOldPrice: {
    color: '#A3A3A3',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  stepper: {
    width: 80,
    height: 30,
    borderWidth: 1,
    borderColor: '#A7C98E',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stepperButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperIcon: {
    color: '#6B9B49',
    fontSize: 18,
    fontWeight: '700',
  },
  stepperValue: {
    color: '#6B9B49',
    fontSize: 15,
    fontWeight: '700',
  },
  sheetAddButton: {
    width: 92,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#55913D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetAddButtonText: {
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
