import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { workouts } from '@/constants/movement-data';

const weeklyMix = [
  { label: 'Cardio', value: 4, emoji: '💨', color: '#FFD6A5' },
  { label: 'Strength', value: 3, emoji: '💪', color: '#FDFFB6' },
  { label: 'Skill', value: 2, emoji: '🎾', color: '#CAFFBF' },
  { label: 'Recovery', value: 2, emoji: '🧘', color: '#BDE0FE' },
];

const activeDays = new Set(workouts.map((workout) => workout.date));

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hey mover 🌸</Text>
      <Text style={styles.subtitle}>Your diary is blooming. Keep the rhythm playful.</Text>

      <View style={[styles.card, styles.hero]}>
        <Text style={styles.heroNumber}>18 day streak 🔥</Text>
        <Text style={styles.heroText}>You have moved on {activeDays.size} days this month.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly training balance</Text>
        {weeklyMix.map((item) => (
          <View key={item.label} style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>{item.emoji} {item.label}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${item.value * 20}%`, backgroundColor: item.color }]} />
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
  container: { flex: 1, backgroundColor: '#F2FAFF' },
  content: { paddingTop: 70, paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  title: { fontSize: 34, fontWeight: '800', color: '#264653' },
  subtitle: { color: '#4E7988', fontSize: 15 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 16, borderWidth: 2, borderColor: '#D8F0FF', gap: 10 },
  hero: { backgroundColor: '#E8F8FF' },
  heroNumber: { fontSize: 30, fontWeight: '800', color: '#264653' },
  heroText: { fontSize: 15, color: '#3C6D7A' },
  cardTitle: { fontSize: 19, fontWeight: '700', color: '#264653' },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balanceLabel: { width: 90, color: '#355C68', fontWeight: '600' },
  barTrack: { flex: 1, height: 12, borderRadius: 20, backgroundColor: '#EFF8FF', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 20 },
  balanceValue: { color: '#355C68', fontWeight: '700', width: 18, textAlign: 'right' },
  nudge: { color: '#3C6D7A', fontSize: 15, lineHeight: 22 },
});
