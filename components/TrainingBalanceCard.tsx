import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { WORKOUT_META, Workout, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  workouts: Workout[];
};

const TRACKED_TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

export function TrainingBalanceCard({ workouts }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  const counts = TRACKED_TYPES.map((type) => ({
    type,
    count: workouts.filter((workout) => workout.type === type).length,
  }));

  const total = counts.reduce((sum, item) => sum + item.count, 0) || 1;

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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 'auto',
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
