import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import type { CouponItem } from '../types/cartTypes';

type TopCouponsSectionProps = {
  coupons: CouponItem[];
  onApplyCoupon?: (couponId: string) => void;
};

function CouponTicket({
  coupon,
  index,
  onApplyCoupon,
}: {
  coupon: CouponItem;
  index: number;
  onApplyCoupon?: (couponId: string) => void;
}) {
  const subtitle =
    index === 0 ? 'Add items worth ₹20\nto avail this offer' : 'Upto ₹120 on orders\nabove ₹1200';

  return (
    <View style={styles.ticketWrap}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{coupon.badge}</Text>
      </View>

      <View style={styles.ticket}>
        <View style={styles.notchLeft} />
        <View style={styles.notchRight} />

        <Text style={[styles.subtitle, index === 0 && styles.subtitleAlert]}>{subtitle}</Text>
        <Text style={styles.code}>{coupon.code}</Text>

        <View
          style={[
            styles.lowerSection,
            coupon.applied && styles.lowerSectionApplied,
          ]}>
          <View style={styles.ticketDivider} />

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={coupon.applied}
            onPress={() => onApplyCoupon?.(coupon.id)}
            style={[styles.ctaBar, coupon.applied && styles.ctaBarApplied]}>
            {coupon.applied ? <Feather color="#FFFFFF" name="check" size={18} /> : null}
            <Text style={[styles.ctaText, coupon.applied && styles.ctaTextApplied]}>
              {coupon.applied ? 'APPLIED' : 'APPLY'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export const TopCouponsSection = memo(function TopCouponsSection({
  coupons,
  onApplyCoupon,
}: TopCouponsSectionProps) {
  const appliedCoupon = coupons.find(coupon => coupon.applied) ?? null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerMark}>
          <Feather color="#FFFFFF" name="percent" size={12} />
        </View>
        <Text style={styles.title}>Top coupons for you</Text>
        <View style={styles.headerMark}>
          <Feather color="#FFFFFF" name="percent" size={12} />
        </View>
      </View>

      <View style={styles.outerDivider} />

      <View style={styles.row}>
        {coupons.map((coupon, index) => (
          <CouponTicket
            coupon={coupon}
            index={index}
            key={coupon.id}
            onApplyCoupon={onApplyCoupon}
          />
        ))}
      </View>

      <View style={styles.outerDivider} />

      <View style={styles.savingRow}>
        <Text style={styles.party}>🎉</Text>
        <Text style={styles.savingText}>
          {appliedCoupon ? (
            <>
              Coupon <Text style={styles.savingStrong}>{appliedCoupon.code}</Text> applied
            </>
          ) : (
            <>
              Tap <Text style={styles.savingStrong}>APPLY</Text> to use a coupon
            </>
          )}
        </Text>
        <Text style={styles.party}>🎉</Text>
      </View>

      <View style={styles.outerDivider} />

      <View style={styles.moreRow}>
        <Text style={styles.moreText}>View more coupons and offers</Text>
        <Feather color="#A8A8A8" name="chevron-right" size={28} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#327B95',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    color: '#327B95',
    fontWeight: '700',
  },
  outerDivider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D2D2D2',
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  ticketWrap: {
    width: '31.5%',
    alignItems: 'center',
  },
  badge: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#3E819B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  ticket: {
    marginTop: 52,
    width: '100%',
    height: 186,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 44,
    overflow: 'visible',
  },
  notchLeft: {
    position: 'absolute',
    left: -1,
    top: 125,
    width: 12,
    height: 24,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    zIndex: 3,
  },
  notchRight: {
    position: 'absolute',
    right: -1,
    top: 125,
    width: 12,
    height: 24,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    zIndex: 3,
  },
  subtitle: {
    fontSize: 10,
    lineHeight: 14,
    color: '#A5A5A5',
    textAlign: 'center',
    height: 48,
    paddingHorizontal: 10,
  },
  subtitleAlert: {
    color: '#E37A7A',
  },
  code: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: '#111111',
    fontWeight: '700',
  },
  ticketDivider: {
    width: '100%',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D2D2D2',
  },
  lowerSection: {
    width: '100%',
    marginTop: 'auto',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    overflow: 'hidden',
  },
  lowerSectionApplied: {
    backgroundColor: '#FF964A',
  },
  ctaBar: {
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  ctaBarApplied: {
    backgroundColor: '#FF964A',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderColor: '#FF964A',
  },
  ctaText: {
    fontSize: 14,
    color: '#F1A15E',
    fontWeight: '700',
  },
  ctaTextApplied: {
    color: '#FFFFFF',
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  party: {
    fontSize: 20,
  },
  savingText: {
    fontSize: 14,
    color: '#53869C',
    fontWeight: '500',
  },
  savingStrong: {
    fontWeight: '800',
    color: '#327B95',
  },
  moreRow: {
    paddingTop: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moreText: {
    fontSize: 14,
    color: '#8F8F8F',
    fontWeight: '500',
  },
});
