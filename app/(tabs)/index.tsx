import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { TrainingBalanceCard } from '@/components/TrainingBalanceCard';
import { MOCK_WORKOUTS, WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TRACKED: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility', 'rest'];

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayKey = getDateKey(today);
  const weekStart = getWeekStart(today);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const workoutsSorted = [...MOCK_WORKOUTS].sort((a, b) => a.date.localeCompare(b.date));

  const todayWorkouts = workoutsSorted.filter((workout) => workout.date === todayKey);

  const weekCounts = TRACKED.map((type) => ({
    type,
    count: weeklyWorkouts.filter((workout) => workout.type === type).length,
  }));

  const totalSessions = weeklyWorkouts.length;
  const movementSessions = weeklyWorkouts.filter((workout) => workout.type !== 'rest').length;
  const movementMinutes = weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const activeDays = new Set(weeklyWorkouts.filter((workout) => workout.type !== 'rest').map((workout) => workout.date)).size;

  const movementStreak = getMovementStreak(workoutsSorted, todayKey);

  const topType = MOVEMENT_TYPES.map((type) => ({
    type,
    minutes: weeklyWorkouts
      .filter((workout) => workout.type === type)
      .reduce((sum, workout) => sum + workout.duration, 0),
  })).sort((a, b) => b.minutes - a.minutes)[0];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: dark ? '#0E1017' : '#F4F6FD' }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: dark ? '#F7F8FC' : '#0F1322' }]}>All-Arounder</Text>
      <Text style={[styles.subtitle, { color: dark ? '#A2A7B6' : '#62697A' }]}>your sport calendar</Text>

      <SectionCard title="Today" subtitle={today}>
        {todayWorkouts.length === 0 ? (
          <Text style={[styles.placeholder, { color: dark ? '#A5A9B7' : '#646B7D' }]}>
            No workout logged yet. Tap Add to plan your session.
          </Text>
        ) : (
          todayWorkouts.map((workout) => (
            <View key={workout.id} style={[styles.row, { borderColor: dark ? '#2C3040' : '#EAEDF6' }]}>
              <Text style={[styles.rowType, { color: WORKOUT_META[workout.type].color }]}>
                {WORKOUT_META[workout.type].emoji} {WORKOUT_META[workout.type].label}
              </Text>
              <Text style={[styles.rowMeta, { color: dark ? '#CED3E2' : '#32384C' }]}>{workout.duration} min</Text>
            </View>
          ))
        )}
      </SectionCard>

      <TrainingBalanceCard />

      <SectionCard title="Weekly volume" subtitle="sessions done this week">
        <View style={styles.chipWrap}>
          {weekCounts.map((item) => (
            <View key={item.type} style={[styles.chip, { backgroundColor: `${WORKOUT_META[item.type].color}1F` }]}>
              <Text style={[styles.chipValue, { color: WORKOUT_META[item.type].color }]}>{item.count}</Text>
              <Text style={[styles.chipLabel, { color: dark ? '#DCE0EC' : '#30374B' }]}>{WORKOUT_META[item.type].label}</Text>
            </View>
            <Text style={styles.balanceValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today&apos;s delightful nudge</Text>
        <Text style={styles.nudge}>✨ 20-minute easy move + 5-minute stretch = gold star energy.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 74,
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  placeholder: { fontSize: 14, lineHeight: 20 },
  row: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  rowType: { fontSize: 15, fontWeight: '700' },
  rowMeta: { marginLeft: 'auto', fontSize: 14, fontWeight: '600' },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: '47%',
  },
  chipValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
