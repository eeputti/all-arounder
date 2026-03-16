import { StyleSheet, Text, View } from 'react-native';

import { WORKOUT_META, Workout, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  workouts: Workout[];
};

const MOVEMENT_TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

export function TrainingBalanceCard({ workouts }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const totals = MOVEMENT_TYPES.map((type) => ({
    type,
    minutes: workouts
      .filter((workout) => workout.type === type)
      .reduce((sum, workout) => sum + workout.duration, 0),
  }));

  const totalMinutes = totals.reduce((sum, item) => sum + item.minutes, 0);

  const score =
    totalMinutes === 0
      ? 0
      : Math.max(
          0,
          Math.round(
            100 -
              (totals.reduce((sum, item) => {
                const share = item.minutes / totalMinutes;
                return sum + Math.abs(share - 0.25);
              }, 0) /
                1.5) *
                100
          )
        );

  const status = score >= 82 ? 'Super balanced ✨' : score >= 62 ? 'Solid rhythm 💪' : 'Mix it up 🌈';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: dark ? '#1C1D26' : '#F8F5FF',
          borderColor: dark ? '#313447' : '#E7DEFF',
        },
      ]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: dark ? '#F6F7FB' : '#201A34' }]}>Training balance score</Text>
        <Text style={[styles.score, { color: dark ? '#F4B8FF' : '#7A32C5' }]}>{score}%</Text>
      </View>
      <Text style={[styles.subtitle, { color: dark ? '#BCBFD0' : '#655A86' }]}>{status}</Text>

      <View style={[styles.segmentTrack, { backgroundColor: dark ? '#2A2D3A' : '#EBE5FA' }]}>
        {totals.map((item) => {
          const width = totalMinutes > 0 ? `${Math.max((item.minutes / totalMinutes) * 100, item.minutes > 0 ? 8 : 0)}%` : '0%';
          return <View key={item.type} style={[styles.segment, { width, backgroundColor: WORKOUT_META[item.type].color }]} />;
        })}
      </View>

      <View style={styles.rows}>
        {totals.map((item) => {
          const percent = totalMinutes > 0 ? Math.round((item.minutes / totalMinutes) * 100) : 0;
          const meta = WORKOUT_META[item.type];

          return (
            <View key={item.type} style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.emoji}>{meta.emoji}</Text>
                <Text style={[styles.label, { color: dark ? '#ECEEFA' : '#28223A' }]}>{meta.label}</Text>
              </View>
              <Text style={[styles.value, { color: dark ? '#D4D8EA' : '#4F466B' }]}>
                {item.minutes} min · {percent}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
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
  row: {
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
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    marginLeft: 'auto',
    fontSize: 13,
    fontWeight: '600',
  },
});
