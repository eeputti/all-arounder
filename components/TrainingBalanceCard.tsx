import { StyleSheet, Text, View } from 'react-native';

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
  const dark = scheme === 'dark';

  const totalMinutes = WEEKLY_BALANCE_MOCK.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <View style={[styles.shell, { backgroundColor: dark ? '#12141C' : '#F8F9FF', borderColor: dark ? '#282C38' : '#E7EAF5' }]}>
      <Text style={[styles.title, { color: dark ? '#F5F7FF' : '#151729' }]}>Weekly training balance</Text>
      <Text style={[styles.subtitle, { color: dark ? '#A8B0C6' : '#67708A' }]}>How your movement was distributed this week</Text>

      <View style={[styles.segmentRail, { backgroundColor: dark ? '#1D2130' : '#EBEEF9' }]}>
        {WEEKLY_BALANCE_MOCK.map((item) => {
          const width = `${Math.max(6, (item.minutes / totalMinutes) * 100)}%`;
          return (
            <View
              key={item.type}
              style={[
                styles.segment,
                {
                  width,
                  backgroundColor: WORKOUT_META[item.type].color,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.rows}>
        {WEEKLY_BALANCE_MOCK.map((item) => {
          const meta = WORKOUT_META[item.type];
          const percent = Math.round((item.minutes / totalMinutes) * 100);

          return (
            <View key={item.type} style={styles.row}>
              <View style={styles.rowHeader}>
                <View style={styles.labelWrap}>
                  <View style={[styles.dot, { backgroundColor: meta.color }]} />
                  <Text style={[styles.label, { color: dark ? '#E8ECF9' : '#21263A' }]}>
                    {meta.emoji} {meta.label}
                  </Text>
                </View>
                <Text style={[styles.value, { color: dark ? '#B6BED5' : '#4A536D' }]}>
                  {item.minutes} min · {percent}%
                </Text>
              </View>
              <View style={[styles.track, { backgroundColor: dark ? '#262B3D' : '#E8ECF8' }]}>
                <View style={[styles.fill, { width: `${Math.max(percent, 6)}%`, backgroundColor: meta.color }]} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
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
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
