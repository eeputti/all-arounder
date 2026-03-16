import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { WORKOUT_META, MOCK_WORKOUTS, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TRACKED: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

const trainingBalance = [
  { sport: 'run', minutes: 150, color: '#5e9cff' },
  { sport: 'tennis', minutes: 120, color: '#30d158' },
  { sport: 'gym', minutes: 110, color: '#ff9f0a' },
  { sport: 'mobility', minutes: 80, color: '#bf5af2' },
];

const totalMinutes = trainingBalance.reduce((total, entry) => total + entry.minutes, 0);

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

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

  const upcomingWorkouts = MOCK_WORKOUTS.filter((workout) => workout.date >= today).slice(0, 3);

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
      style={[styles.container, { backgroundColor: dark ? '#0C0F1A' : '#F4F7FF' }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.heroTopRow}>
        <Text style={[styles.title, { color: dark ? '#F8F9FF' : '#12172A' }]}>All-Arounder</Text>
        <View style={[styles.streakPill, { backgroundColor: dark ? '#212843' : '#E8EEFF' }]}>
          <Text style={styles.streakEmoji}>✨</Text>
          <Text style={[styles.streakText, { color: dark ? '#D9E4FF' : '#3158CC' }]}>7-day streak</Text>
        </View>
      </View>
      <Text style={[styles.subtitle, { color: dark ? '#AEB6D2' : '#59617B' }]}>Move joyfully. Recover intentionally.</Text>

      <SectionCard title="Today" subtitle={formatDate(today)}>
        {todayWorkouts.length === 0 ? (
          <Text style={[styles.placeholder, { color: dark ? '#AAB2CC' : '#646F89' }]}>No workout logged yet. Tap Add to plan your next feel-good session.</Text>
        ) : (
          <View style={styles.todayList}>
            {todayWorkouts.map((workout) => (
              <View key={workout.id} style={[styles.todayRow, { backgroundColor: dark ? '#1E243A' : '#F1F5FF' }]}>
                <Text style={styles.todayEmoji}>{WORKOUT_META[workout.type].emoji}</Text>
                <View>
                  <Text style={[styles.rowType, { color: dark ? '#F3F5FF' : '#1B2240' }]}>{WORKOUT_META[workout.type].label}</Text>
                  <Text style={[styles.rowMeta, { color: dark ? '#AEB7D4' : '#5D6885' }]}>{workout.duration} minutes</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </SectionCard>

      <View style={[styles.balanceCard, { backgroundColor: dark ? '#141A2D' : '#11172B' }]}>
        <Text style={styles.cardTitle}>training balance</Text>
        <Text style={styles.balanceSubtitle}>Minutes by sport this week</Text>

        <View style={styles.balanceRows}>
          {trainingBalance.map((entry) => {
            const percent = Math.round((entry.minutes / totalMinutes) * 100);

            return (
              <View key={entry.sport} style={styles.balanceRow}>
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceLabel}>{entry.sport}</Text>
                  <Text style={styles.balanceValue}>
                    {entry.minutes} min · {percent}%
                  </Text>
                </View>

                <View style={styles.balanceTrack}>
                  <View
                    style={[
                      styles.balanceFill,
                      {
                        width: `${percent}%`,
                        backgroundColor: entry.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <SectionCard title="Coming up" subtitle="Your next sessions">
        {upcomingWorkouts.length === 0 ? (
          <Text style={[styles.placeholder, { color: dark ? '#AAB2CC' : '#646F89' }]}>Nothing on the schedule yet — add something that sounds fun.</Text>
        ) : (
          upcomingWorkouts.map((workout) => (
            <View key={workout.id} style={[styles.upcomingRow, { borderColor: dark ? '#292F49' : '#E2E8FA' }]}>
              <Text style={[styles.upcomingDate, { color: dark ? '#B0B8D6' : '#64708E' }]}>{formatDate(workout.date)}</Text>
              <Text style={styles.upcomingEmoji}>{WORKOUT_META[workout.type].emoji}</Text>
              <Text style={[styles.upcomingType, { color: dark ? '#EEF1FF' : '#1D2442' }]}>{WORKOUT_META[workout.type].label}</Text>
              <Text style={[styles.upcomingDuration, { color: dark ? '#CAD2EF' : '#3A4669' }]}>{workout.duration}m</Text>
            </View>
          ))
        )}
      </SectionCard>

      <SectionCard title="Weekly volume" subtitle="Tiny wins add up">
        <View style={styles.chipWrap}>
          {weekCounts.map((item) => (
            <Pressable
              key={item.type}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: dark ? '#1A2034' : `${WORKOUT_META[item.type].color}17`,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}>
              <Text style={[styles.chipValue, { color: WORKOUT_META[item.type].color }]}>{item.count}</Text>
              <Text style={[styles.chipLabel, { color: dark ? '#DEE3F7' : '#303A57' }]}>{WORKOUT_META[item.type].label}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>
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
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 15,
    fontWeight: '500',
  },
  streakPill: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakEmoji: {
    fontSize: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
  },
  placeholder: { fontSize: 14, lineHeight: 21 },
  todayList: {
    gap: 10,
  },
  todayRow: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  todayEmoji: {
    fontSize: 22,
  },
  rowType: { fontSize: 15, fontWeight: '700' },
  rowMeta: { marginTop: 2, fontSize: 13, fontWeight: '500' },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  upcomingDate: {
    width: 80,
    fontSize: 12,
    fontWeight: '700',
  },
  upcomingEmoji: {
    fontSize: 17,
  },
  upcomingType: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  upcomingDuration: {
    fontSize: 13,
    fontWeight: '600',
  },
  balanceCard: {
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#f4f7ff',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'capitalize',
    letterSpacing: -0.3,
  },
  balanceSubtitle: {
    color: '#AEB8D4',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 15,
    fontWeight: '500',
  },
  balanceRows: {
    gap: 12,
  },
  balanceRow: {
    gap: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 15,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  balanceValue: {
    color: '#d1d7ec',
    fontSize: 13,
    fontWeight: '500',
  },
  balanceTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#2d3553',
    borderRadius: 999,
    overflow: 'hidden',
  },
  balanceFill: {
    height: '100%',
    borderRadius: 999,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: '47%',
  },
  chipValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
