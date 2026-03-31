import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { offer as offerImage } from '../assets/images';
import type { OfferCard } from '../types/cartTypes';

type OfferApplyPanelProps = {
  offers: OfferCard[];
};

export function OfferApplyPanel({ offers }: OfferApplyPanelProps) {
  return (
    <View pointerEvents="box-none" style={styles.floatingLayer}>
      <View style={styles.frame}>
        <View style={styles.handle} />
        <ScrollView
          horizontal
          contentContainerStyle={styles.rail}
          showsHorizontalScrollIndicator={false}>
          {offers.map(offer => (
            <View key={offer.id} style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{offer.badge}</Text>
              </View>

              <Text style={styles.title}>{offer.title}</Text>
              <Image resizeMode="contain" source={offerImage} style={styles.offerImage} />
              <Text style={styles.code}>{offer.code}</Text>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.button, offer.applied && styles.buttonApplied]}>
                <View style={styles.buttonContent}>
                  {offer.applied ? (
                    <Feather
                      color="#55913D"
                      name="check"
                      size={14}
                      style={styles.buttonIcon}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.buttonText,
                      offer.applied && styles.buttonTextApplied,
                    ]}>
                    {offer.applied ? 'Applied' : offer.cta}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 14,
    paddingHorizontal: 10,
  },
  frame: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 3 },
    elevation: 10,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    marginBottom: 16,
  },
  rail: {
    paddingHorizontal: 12,
    paddingTop: 18,
  },
  card: {
    width: 108,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4F8C99',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    marginBottom: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
    fontWeight: '800',
  },
  title: {
    fontSize: 10,
    lineHeight: 13,
    color: '#A0A0A0',
    textAlign: 'center',
    minHeight: 38,
  },
  offerImage: {
    width: 72,
    height: 28,
    marginTop: 8,
  },
  code: {
    marginTop: 8,
    fontSize: 14,
    color: '#3A3A3A',
    fontWeight: '700',
  },
  button: {
    marginTop: 10,
    width: '100%',
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F4F7F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonApplied: {
    backgroundColor: '#F4F7F1',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonIcon: {
    marginTop: 1,
  },
  buttonText: {
    color: '#55913D',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonTextApplied: {
    color: '#55913D',
  },
});
