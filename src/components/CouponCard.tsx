import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { offer as offerImage } from '../assets/images';
import type { CouponItem } from '../types/cartTypes';

type CouponCardProps = {
  coupon: CouponItem;
};

export const CouponCard = memo(function CouponCard({ coupon }: CouponCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{coupon.badge}</Text>
      </View>
      <Text style={styles.subtext}>Additional offer above ₹1200</Text>
      <Image resizeMode="contain" source={offerImage} style={styles.offerImage} />
      <Text style={styles.code}>{coupon.code}</Text>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.button, coupon.applied && styles.buttonApplied]}>
        <Text style={[styles.buttonText, coupon.applied && styles.buttonTextApplied]}>
          {coupon.applied ? '✓ APPLIED' : 'APPLY'}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 12,
    marginLeft: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F8C99',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    fontWeight: '800',
  },
  subtext: {
    fontSize: 9,
    lineHeight: 12,
    color: '#B2B2B2',
    textAlign: 'center',
  },
  offerImage: {
    width: 68,
    height: 24,
    marginTop: 8,
  },
  code: {
    marginTop: 8,
    color: '#3A3A3A',
    fontSize: 13,
    fontWeight: '700',
  },
  button: {
    marginTop: 10,
    width: '100%',
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7F1',
  },
  buttonApplied: {
    backgroundColor: '#F6E5BF',
  },
  buttonText: {
    color: '#55913D',
    fontSize: 12,
    fontWeight: '700',
  },
  buttonTextApplied: {
    color: '#E39A16',
  },
});
