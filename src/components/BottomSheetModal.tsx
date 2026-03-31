import type { PropsWithChildren } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

type BottomSheetModalProps = PropsWithChildren<{
  onClose: () => void;
  visible: boolean;
}>;

export function BottomSheetModal({
  children,
  onClose,
  visible,
}: BottomSheetModalProps) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
});
