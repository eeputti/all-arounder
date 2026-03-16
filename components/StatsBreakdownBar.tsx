import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

type StatsBreakdownBarProps = {
  label: string;
  value: number;
  total: number;
  color: string;
};

export function StatsBreakdownBar({ label, value, total, color }: StatsBreakdownBarProps) {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: dark ? '#E9ECF8' : '#1C243C' }]}>{label}</Text>
        <Text style={[styles.value, { color: dark ? '#B3BCD1' : '#66708A' }]}>{value} sessions</Text>
      </View>
      <View style={[styles.track, { backgroundColor: dark ? '#24293A' : '#ECF0FC' }]}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.percent, { color: dark ? '#9EA8C5' : '#6A7490' }]}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 14, fontWeight: '700' },
  value: { fontSize: 13, fontWeight: '600' },
  track: {
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    minWidth: 8,
  },
  percent: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontWeight: '700',
  },
});
