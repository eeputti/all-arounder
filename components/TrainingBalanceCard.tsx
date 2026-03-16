import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type BalanceEntry = {
  type: WorkoutType;
  minutes: number;
};

const WEEKLY_BALANCE_MOCK: BalanceEntry[] = [
  { type: 'run', minutes: 138 },
  { type: 'tennis', minutes: 92 },
  { type: 'gym', minutes: 116 },
  { type: 'mobility', minutes: 74 },
  { type: 'rest', minutes: 60 },
];

export function TrainingBalanceCard() {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  const totalMinutes = WEEKLY_BALANCE_MOCK.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <View style={styles.container}>
      {WEEKLY_BALANCE_MOCK.map(({ type, minutes }) => {
        const meta = WORKOUT_META[type];
        const widthPct = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;

        return (
          <View key={type} style={styles.row}>
            <View style={styles.rowHeader}>
              <View style={styles.rowLeft}>
                <View style={[styles.dot, { backgroundColor: meta.color }]} />
                <Text style={[styles.label, { color: palette.text }]}>{meta.label}</Text>
              </View>
              <Text style={[styles.value, { color: palette.mutedText }]}>{minutes} min</Text>
            </View>
            <View style={[styles.track, { backgroundColor: palette.surfaceMuted }]}>
              <View style={[styles.fill, { backgroundColor: meta.color, width: `${Math.max(widthPct, 8)}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    gap: 8,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 9,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
