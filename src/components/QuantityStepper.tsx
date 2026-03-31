import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type QuantityStepperProps = {
  onDecrease?: () => void;
  onIncrease?: () => void;
  value: number;
};

export const QuantityStepper = memo(function QuantityStepper({
  onDecrease,
  onIncrease,
  value,
}: QuantityStepperProps) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity activeOpacity={0.8} onPress={onDecrease} style={styles.button}>
        <Text style={styles.icon}>−</Text>
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={onIncrease} style={styles.button}>
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
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
  button: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#6B9B49',
    fontSize: 18,
    fontWeight: '700',
  },
  value: {
    color: '#6B9B49',
    fontSize: 15,
    fontWeight: '700',
  },
});
