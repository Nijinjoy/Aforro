import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const backIcon = require('../assets/images/icons/back.png');

type CartHeaderProps = {
  title: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
};

export function CartHeader({ title, onBack, rightSlot }: CartHeaderProps) {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={styles.rightSlot}>
          {rightSlot ?? <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    overflow: 'hidden',
  },
  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 8,
    height: 14,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#222222',
    fontWeight: '600',
    textAlign: 'center',
  },
  rightSlot: {
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 28,
    height: 28,
  },
});
