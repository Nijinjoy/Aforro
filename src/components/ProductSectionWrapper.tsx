import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProductSectionWrapperProps = PropsWithChildren<{
  title: string;
  rightSlot?: ReactNode;
  variant?: 'default' | 'review';
}>;

export function ProductSectionWrapper({
  children,
  title,
  rightSlot,
  variant = 'default',
}: ProductSectionWrapperProps) {
  return (
    <View style={[styles.sectionCard, variant === 'review' && styles.sectionCardReview]}>
      <View style={[styles.header, variant === 'review' && styles.headerReview]}>
        <Text style={[styles.title, variant === 'review' && styles.titleReview]}>{title}</Text>
        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 12,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionCardReview: {
    borderRadius: 18,
    marginTop: 14,
    paddingTop: 12,
    paddingBottom: 12,
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  header: {
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerReview: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: '#232323',
    fontWeight: '700',
  },
  titleReview: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: '#1D1D1D',
  },
  rightSlot: {
    marginLeft: 12,
  },
});
