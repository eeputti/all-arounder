import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { WORKOUT_META, Workout, WorkoutType } from '@/constants/workouts';
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
      {counts.map(({ type, count }) => {
        const meta = WORKOUT_META[type];
        const widthPct = (count / total) * 100;
        return (
          <View key={type} style={styles.row}>
            <View style={styles.left}>
              <View style={[styles.dot, { backgroundColor: meta.color }]} />
              <Text style={[styles.label, { color: palette.text }]}>{meta.label}</Text>
              <Text style={[styles.count, { color: palette.mutedText }]}>{count}</Text>
            </View>
            <View style={[styles.track, { backgroundColor: palette.surfaceMuted }]}>
              <View style={[styles.fill, { backgroundColor: meta.color, width: `${Math.max(widthPct, 8)}%` }]} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 13,
    fontWeight: '500',
  },
  segmentRail: {
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 16,
  },
  segment: {
    height: '100%',
  },
  rows: {
    gap: 11,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  score: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTrack: {
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  segment: {
    height: '100%',
  },
  rows: {
    gap: 8,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
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
