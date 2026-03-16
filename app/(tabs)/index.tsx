import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { TrainingBalanceCard } from '@/components/TrainingBalanceCard';
import { Colors } from '@/constants/theme';
import { WORKOUT_META, MOCK_WORKOUTS, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TRACKED: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

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
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: palette.text }]}>All-Arounder</Text>
      <Text style={[styles.subtitle, { color: palette.mutedText }]}>Your movement diary, at a glance.</Text>

      <SectionCard title="Today" subtitle={today}>
        {todayWorkouts.length === 0 ? (
          <Text style={[styles.placeholder, { color: palette.mutedText }]}>No workout logged yet. Tap Add to plan your session.</Text>
        ) : (
          todayWorkouts.map((workout, index) => (
            <View
              key={workout.id}
              style={[
                styles.row,
                {
                  borderColor: palette.cardBorder,
                  borderBottomWidth: index === todayWorkouts.length - 1 ? 0 : 1,
                },
              ]}>
              <Text style={[styles.rowType, { color: WORKOUT_META[workout.type].color }]}>{WORKOUT_META[workout.type].label}</Text>
              <Text style={[styles.rowMeta, { color: palette.text }]}>{workout.duration} min</Text>
            </View>
          ))
        )}
      </SectionCard>

      <SectionCard title="Upcoming" subtitle="next sessions on your radar">
        {upcomingWorkouts.length === 0 ? (
          <Text style={[styles.placeholder, { color: palette.mutedText }]}>No upcoming workouts yet.</Text>
        ) : (
          upcomingWorkouts.map((workout) => (
            <View key={workout.id} style={styles.upcomingRow}>
              <Text style={[styles.upcomingDate, { color: palette.mutedText }]}>{workout.date.slice(5)}</Text>
              <Text style={[styles.upcomingType, { color: WORKOUT_META[workout.type].color }]}>{WORKOUT_META[workout.type].label}</Text>
              <Text style={[styles.upcomingDuration, { color: palette.text }]}>{workout.duration}m</Text>
            </View>
          ))
        )}
      </SectionCard>

      <SectionCard title="Weekly Training Balance" subtitle="distribution by sport">
        <TrainingBalanceCard workouts={MOCK_WORKOUTS.slice(-7)} />
      </SectionCard>

      <SectionCard title="Weekly volume" subtitle="sessions done this week">
        <View style={styles.chipWrap}>
          {weekCounts.map((item) => (
            <View
              key={item.type}
              style={[styles.chip, { backgroundColor: `${WORKOUT_META[item.type].color}1C`, borderColor: `${WORKOUT_META[item.type].color}33` }]}>
              <Text style={[styles.chipValue, { color: WORKOUT_META[item.type].color }]}>{item.count}</Text>
              <Text style={[styles.chipLabel, { color: palette.text }]}>{WORKOUT_META[item.type].label}</Text>
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
    gap: 2,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: { fontSize: 14, lineHeight: 20 },
  row: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  rowType: { fontSize: 15, fontWeight: '700' },
  rowMeta: { marginLeft: 'auto', fontSize: 14, fontWeight: '700' },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  upcomingDate: {
    width: 52,
    fontSize: 13,
    fontWeight: '700',
  },
  upcomingType: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  upcomingDuration: {
    fontSize: 14,
    fontWeight: '700',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 16,
    borderWidth: 1,
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
