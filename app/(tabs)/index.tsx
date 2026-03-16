import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { TrainingBalanceCard } from '@/components/TrainingBalanceCard';
import { WORKOUT_META, MOCK_WORKOUTS, Workout, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ALL_TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility', 'rest'];
const MOVEMENT_TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDateKey = (date: Date) => date.toISOString().slice(0, 10);

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const formatUpcomingDate = (dateText: string) => {
  const date = new Date(`${dateText}T00:00:00`);
  return `${WEEKDAY_LABELS[date.getDay()]} ${date.getMonth() + 1}/${date.getDate()}`;
};

const getMovementStreak = (workouts: Workout[], todayKey: string) => {
  const hasMovement = new Set(
    workouts.filter((workout) => workout.type !== 'rest').map((workout) => workout.date)
  );

  let streak = 0;
  const cursor = new Date(`${todayKey}T00:00:00`);

  while (hasMovement.has(getDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

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

  const upcomingWorkouts = workoutsSorted.filter((workout) => workout.date > todayKey).slice(0, 5);

  const weeklyWorkouts = workoutsSorted.filter((workout) => {
    const date = new Date(`${workout.date}T00:00:00`);
    return date >= weekStart && date <= weekEnd;
  });

  const workoutTypeCounts = ALL_TYPES.map((type) => ({
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
    <View style={[styles.container, { backgroundColor: dark ? '#0E0F13' : '#F4F2FF' }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: dark ? '#F7F8FC' : '#1B1232' }]}>All-Arounder</Text>
        <Text style={[styles.subtitle, { color: dark ? '#AFB3C6' : '#695D89' }]}>Your weekly movement glow-up ✨</Text>

        <SectionCard title="Today's workouts" subtitle={todayKey}>
          {todayWorkouts.length === 0 ? (
            <Text style={[styles.placeholder, { color: dark ? '#A5A9B7' : '#6A617E' }]}>No workout planned yet. Add one to keep your streak alive 💫</Text>
          ) : (
            todayWorkouts.map((workout) => (
              <View key={workout.id} style={[styles.workoutRow, { borderColor: dark ? '#2D3042' : '#EAE3FF' }]}>
                <Text style={styles.rowEmoji}>{WORKOUT_META[workout.type].emoji}</Text>
                <Text style={[styles.rowType, { color: WORKOUT_META[workout.type].color }]}>{WORKOUT_META[workout.type].label}</Text>
                <Text style={[styles.rowMeta, { color: dark ? '#D8DBE8' : '#3A3550' }]}>{workout.duration} min</Text>
              </View>
            ))
          )}
        </SectionCard>

        <SectionCard title="Upcoming workouts" subtitle="next up">
          {upcomingWorkouts.length === 0 ? (
            <Text style={[styles.placeholder, { color: dark ? '#A5A9B7' : '#6A617E' }]}>You are all caught up this week 🎉</Text>
          ) : (
            upcomingWorkouts.map((workout) => (
              <View key={workout.id} style={styles.upcomingRow}>
                <Text style={[styles.upcomingDate, { color: dark ? '#AAB0C4' : '#6C6484' }]}>{formatUpcomingDate(workout.date)}</Text>
                <Text style={styles.rowEmoji}>{WORKOUT_META[workout.type].emoji}</Text>
                <Text style={[styles.upcomingType, { color: dark ? '#E9EBF4' : '#2D2741' }]}>{WORKOUT_META[workout.type].label}</Text>
                <Text style={[styles.upcomingDuration, { color: dark ? '#C8CDDF' : '#4D4564' }]}>{workout.duration}m</Text>
              </View>
            ))
          )}
        </SectionCard>

        <SectionCard title="Weekly movement summary" subtitle="this week at a glance">
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryTile, { backgroundColor: dark ? '#232635' : '#EFE9FF' }]}>
              <Text style={[styles.tileValue, { color: dark ? '#F4EEFF' : '#5E2CB4' }]}>{movementMinutes}</Text>
              <Text style={[styles.tileLabel, { color: dark ? '#BFC4D8' : '#5F577A' }]}>minutes moved</Text>
            </View>
            <View style={[styles.summaryTile, { backgroundColor: dark ? '#232635' : '#EFE9FF' }]}>
              <Text style={[styles.tileValue, { color: dark ? '#F4EEFF' : '#5E2CB4' }]}>{movementSessions}/{totalSessions}</Text>
              <Text style={[styles.tileLabel, { color: dark ? '#BFC4D8' : '#5F577A' }]}>movement sessions</Text>
            </View>
            <View style={[styles.summaryTile, { backgroundColor: dark ? '#232635' : '#EFE9FF' }]}>
              <Text style={[styles.tileValue, { color: dark ? '#F4EEFF' : '#5E2CB4' }]}>{activeDays}</Text>
              <Text style={[styles.tileLabel, { color: dark ? '#BFC4D8' : '#5F577A' }]}>active days</Text>
            </View>
            <View style={[styles.summaryTile, { backgroundColor: dark ? '#232635' : '#EFE9FF' }]}>
              <Text style={[styles.tileValue, { color: dark ? '#F4EEFF' : '#5E2CB4' }]}>{WORKOUT_META[topType.type].emoji}</Text>
              <Text style={[styles.tileLabel, { color: dark ? '#BFC4D8' : '#5F577A' }]}>top focus: {WORKOUT_META[topType.type].label}</Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard title="Workout type counts for this week" subtitle="run · tennis · gym · mobility · rest">
          <View style={styles.countGrid}>
            {workoutTypeCounts.map((item) => (
              <View key={item.type} style={[styles.countChip, { backgroundColor: `${WORKOUT_META[item.type].color}22` }]}>
                <Text style={styles.rowEmoji}>{WORKOUT_META[item.type].emoji}</Text>
                <Text style={[styles.countValue, { color: WORKOUT_META[item.type].color }]}>{item.count}</Text>
                <Text style={[styles.countLabel, { color: dark ? '#DCE0EC' : '#35304B' }]}>{WORKOUT_META[item.type].label}</Text>
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard title="Movement streak" subtitle="consecutive active days">
          <View style={[styles.streakCard, { backgroundColor: dark ? '#272A3A' : '#F1EBFF' }]}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={[styles.streakValue, { color: dark ? '#FFD9A0' : '#B35B00' }]}>{movementStreak} days</Text>
            <Text style={[styles.streakText, { color: dark ? '#D1D5E4' : '#5E5678' }]}>Keep the spark: one small session today counts.</Text>
          </View>
        </SectionCard>

        <SectionCard title="Visual training balance" subtitle="how balanced your week has been">
          <TrainingBalanceCard workouts={weeklyWorkouts} />
        </SectionCard>
      </View>
    </View>
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
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 18,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: { fontSize: 14, lineHeight: 20 },
  workoutRow: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowEmoji: {
    fontSize: 15,
  },
  rowType: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowMeta: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '600',
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  upcomingDate: {
    width: 76,
    fontSize: 12,
    fontWeight: '700',
  },
  upcomingType: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  upcomingDuration: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryTile: {
    width: '48%',
    borderRadius: 14,
    padding: 12,
    minHeight: 78,
    justifyContent: 'center',
  },
  tileValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  countGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  countChip: {
    width: '31%',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 1,
  },
  countValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  countLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  streakCard: {
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 2,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
