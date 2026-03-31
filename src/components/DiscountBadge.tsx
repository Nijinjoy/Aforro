import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type DiscountBadgeProps = {
  label: string;
};

export const DiscountBadge = memo(function DiscountBadge({ label }: DiscountBadgeProps) {
  const [top = '', bottom = ''] = label.split(/\s+/);

  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <View style={styles.inner}>
          <Text style={styles.top}>{top}</Text>
          <Text style={styles.bottom}>{bottom}</Text>
        </View>
        <View style={styles.teeth}>
          <View style={styles.tooth} />
          <View style={styles.tooth} />
          <View style={styles.tooth} />
          <View style={styles.tooth} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  badge: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inner: {
    width: 38,
    height: 38,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#4D8D98',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
  },
  teeth: {
    width: 38,
    marginTop: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tooth: {
    width: 0,
    height: 0,
    borderLeftWidth: 4.75,
    borderRightWidth: 4.75,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4D8D98',
  },
  top: {
    fontSize: 10,
    lineHeight: 11,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
  bottom: {
    marginTop: 0,
    fontSize: 8,
    lineHeight: 9,
    letterSpacing: 0.3,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
});
