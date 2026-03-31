import { memo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { formatPrice } from '../utils/formatters';

type ReviewCartSummarySectionProps = {
  cashbackRemaining: number;
  deliveryFee: number;
  deliveryFeeOriginal: number;
  deliveryFeeShortfall: number;
  discount: number;
  itemTotal: number;
  platformFee: number;
  totalSavings: number;
  totalPayable: number;
};

function SummaryRow({
  icon,
  label,
  right,
  hint,
  saved,
  strikeRight,
  valueColor,
}: {
  hint?: string;
  icon: string;
  label: string;
  right: string;
  saved?: string;
  strikeRight?: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.summaryBlock}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryLabelWrap}>
          <Feather color="#6D6D6D" name={icon} size={14} />
          <Text style={styles.summaryLabel}>{label}</Text>
          {saved ? (
            <View style={styles.savedBadge}>
              <Text style={styles.savedBadgeText}>{saved}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.summaryValueWrap}>
          {strikeRight ? <Text style={styles.summaryStrike}>{strikeRight}</Text> : null}
          <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : null]}>
            {right}
          </Text>
        </View>
      </View>

      {hint ? <Text style={styles.summaryHint}>{hint}</Text> : null}
    </View>
  );
}

export const ReviewCartSummarySection = memo(function ReviewCartSummarySection({
  cashbackRemaining,
  deliveryFee,
  deliveryFeeOriginal,
  deliveryFeeShortfall,
  discount,
  itemTotal,
  platformFee,
  totalSavings,
  totalPayable,
}: ReviewCartSummarySectionProps) {
  const [customInstruction, setCustomInstruction] = useState('');
  const [instructions, setInstructions] = useState([
    { id: 'bell', icon: 'bell-off', label: 'Don’t ring the bell', accent: false },
    { id: 'call', icon: 'phone-off', label: 'Don’t call', accent: false },
    { id: 'guard', icon: 'shopping-bag', label: 'Leave order with guard', accent: true },
  ]);

  function addInstruction() {
    const value = customInstruction.trim();

    if (!value) {
      return;
    }

    setInstructions(current => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        icon: 'edit-3',
        label: value,
        accent: false,
      },
    ]);
    setCustomInstruction('');
  }

  return (
    <View>
      <View style={styles.cashbackCard}>
        <View style={styles.cashbackIcon}>
          <Text style={styles.cashbackIconText}>CASH</Text>
        </View>
        <View style={styles.cashbackCopy}>
          <Text style={styles.cashbackTitle}>
            {cashbackRemaining > 0
              ? `Add items worth ${formatPrice(cashbackRemaining)} more to get 1% cashback`
              : 'You unlocked 1% cashback on this order'}
          </Text>
          <Text style={styles.cashbackSubtitle}>No coupon needed</Text>
        </View>
      </View>

      <View style={styles.deliveryCard}>
        <Text style={styles.cardTitle}>Delivery instructions</Text>

        <View style={styles.chipRow}>
          {instructions.map(instruction => (
            <View
              key={instruction.id}
              style={[styles.chip, instruction.accent && styles.chipAccent]}>
              <Feather color="#4E4E4E" name={instruction.icon} size={13} />
              <Text style={styles.chipText}>{instruction.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noteInput}>
          <TextInput
            blurOnSubmit={false}
            onChangeText={setCustomInstruction}
            onSubmitEditing={addInstruction}
            placeholder="Type in any other instructions..."
            placeholderTextColor="#B3B3B3"
            returnKeyType="done"
            style={styles.noteInputText}
            value={customInstruction}
          />
        </View>
      </View>

      <View style={styles.billCard}>
        <SummaryRow
          icon="help-circle"
          label="Item total"
          right={formatPrice(itemTotal)}
          saved={totalSavings > 0 ? `Saved ${formatPrice(totalSavings)}` : undefined}
        />
        <SummaryRow
          hint={
            deliveryFeeShortfall > 0
              ? `Add items worth ${formatPrice(deliveryFeeShortfall)} to get free delivery`
              : undefined
          }
          icon="truck"
          label="Delivery fee"
          right={deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
          strikeRight={deliveryFee === 0 && deliveryFeeOriginal > 0 ? formatPrice(deliveryFeeOriginal) : undefined}
          valueColor="#FF964A"
        />
        <View style={styles.billDivider} />
        <SummaryRow icon="percent" label="Discount" right={`-${formatPrice(discount)}`} />
        <View style={styles.billDivider} />
        <SummaryRow icon="tag" label="Platform fee" right={formatPrice(platformFee)} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total payable amount</Text>
          <Text style={styles.totalValue}>{formatPrice(totalPayable)}</Text>
        </View>

      </View>

      <View style={styles.policyCard}>
        <Text style={styles.policyTitle}>Cancellation policy</Text>
        <Text style={styles.policyText}>
          You can cancel your order for free within the first 90 seconds. After that, a
          cancellation fee will apply.
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cashbackCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cashbackIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#4E92B0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cashbackIconText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4E92B0',
  },
  cashbackCopy: {
    flex: 1,
    marginLeft: 12,
  },
  cashbackTitle: {
    color: '#3A3A3A',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  cashbackSubtitle: {
    marginTop: 4,
    color: '#B7B7B7',
    fontSize: 12,
  },
  deliveryCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    color: '#222222',
    fontSize: 14,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipAccent: {
    borderColor: '#F4C9A8',
    backgroundColor: '#FFF4EA',
  },
  chipText: {
    color: '#575757',
    fontSize: 11,
  },
  noteInput: {
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingBottom: 4,
  },
  noteInputText: {
    color: '#575757',
    fontSize: 12,
    paddingVertical: 0,
  },
  billCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    overflow: 'hidden',
  },
  summaryBlock: {
    paddingVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryLabel: {
    color: '#5A5A5A',
    fontSize: 13,
    fontWeight: '500',
  },
  savedBadge: {
    backgroundColor: '#FFE6D1',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  savedBadgeText: {
    color: '#FF964A',
    fontSize: 10,
    fontWeight: '700',
  },
  summaryValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryStrike: {
    color: '#C8C8C8',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  summaryValue: {
    color: '#4B4B4B',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryHint: {
    color: '#FF964A',
    fontSize: 11,
    marginLeft: 20,
    marginTop: 4,
  },
  billDivider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E7E7E7',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 18,
  },
  totalLabel: {
    color: '#3D3D4E',
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: '#3D3D4E',
    fontSize: 18,
    fontWeight: '800',
  },
  policyCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  policyTitle: {
    color: '#363636',
    fontSize: 14,
    fontWeight: '700',
  },
  policyText: {
    marginTop: 6,
    color: '#B4B4B4',
    fontSize: 12,
    lineHeight: 18,
  },
});
