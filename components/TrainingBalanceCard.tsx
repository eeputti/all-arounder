import { StyleSheet, Text, View } from 'react-native';

import { WORKOUT_META, Workout, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  workouts: Workout[];
};

const TRACKED_TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

export function TrainingBalanceCard({ workouts }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

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
              <Text style={[styles.label, { color: dark ? '#E8E9EF' : '#181925' }]}>{meta.label}</Text>
              <Text style={[styles.count, { color: dark ? '#9EA2AE' : '#646A78' }]}>{count}</Text>
            </View>
            <View style={[styles.track, { backgroundColor: dark ? '#252730' : '#ECEEF5' }]}>
              <View style={[styles.fill, { backgroundColor: meta.color, width: `${Math.max(widthPct, 6)}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
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
    fontWeight: '600',
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
