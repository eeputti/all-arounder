import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

type StatsMetricCardProps = {
  label: string;
  value: string | number;
  accent: string;
  emoji: string;
};

export function StatsMetricCard({ label, value, accent, emoji }: StatsMetricCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: dark ? '#161821' : '#FFFFFF',
          borderColor: dark ? '#252938' : '#E8ECF8',
          shadowColor: dark ? '#000000' : '#97A8D8',
        },
      ]}>
      <View style={[styles.emojiBubble, { backgroundColor: `${accent}26` }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.value, { color: dark ? '#F9FBFF' : '#171C2D' }]}>{value}</Text>
      <Text style={[styles.label, { color: dark ? '#AAB4CE' : '#65708E' }]}>{label}</Text>
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    borderWidth: 1,
    borderRadius: 24,
    padding: 14,
    gap: 8,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
  },
  emojiBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 18 },
  value: { fontSize: 28, fontWeight: '800' },
  label: { fontSize: 13, fontWeight: '600' },
  accentBar: {
    marginTop: 2,
    width: 44,
    height: 4,
    borderRadius: 999,
  },
});
