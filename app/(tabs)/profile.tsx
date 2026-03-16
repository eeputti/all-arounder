import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { MOCK_WORKOUTS, WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthWorkouts = MOCK_WORKOUTS.filter((workout) => workout.date.slice(5, 7) === month);

  const streak = 6;

  return (
    <ScrollView style={[styles.container, { backgroundColor: dark ? '#0E0F13' : '#F4F6FD' }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: dark ? '#F7F8FC' : '#101424' }]}>Profile</Text>
      <Text style={[styles.subtitle, { color: dark ? '#A1A6B6' : '#646B7C' }]}>Consistency and monthly stats</Text>

      <SectionCard title="This Month" subtitle="training snapshot">
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: dark ? '#DFE3EF' : '#283049' }]}>Total Workouts</Text>
          <Text style={[styles.statValue, { color: dark ? '#F6F8FE' : '#151A2D' }]}>{monthWorkouts.length}</Text>
        </View>

        {TYPES.map((type) => (
          <View key={type} style={styles.statRow}>
            <Text style={[styles.statLabel, { color: WORKOUT_META[type].color }]}>{WORKOUT_META[type].label}</Text>
            <Text style={[styles.statValue, { color: dark ? '#F6F8FE' : '#151A2D' }]}>
              {monthWorkouts.filter((workout) => workout.type === type).length}
            </Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Streak" subtitle="showing up matters">
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={[styles.streakValue, { color: dark ? '#FAFBFF' : '#101628' }]}>{streak} day streak</Text>
            <Text style={[styles.streakText, { color: dark ? '#AAB0BF' : '#626B80' }]}>You trained on 11 of the last 14 days.</Text>
          </View>
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 74, paddingHorizontal: 16, paddingBottom: 28 },
  title: { fontSize: 32, fontWeight: '800' },
  subtitle: { marginTop: 3, marginBottom: 16, fontSize: 15, fontWeight: '500' },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E8EBF4',
  },
  statLabel: { fontSize: 15, fontWeight: '600' },
  statValue: { marginLeft: 'auto', fontSize: 17, fontWeight: '800' },
  streakCard: {
    borderRadius: 16,
    backgroundColor: '#FF9F0A1C',
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  streakEmoji: { fontSize: 26 },
  streakValue: { fontSize: 22, fontWeight: '800' },
  streakText: { fontSize: 14, fontWeight: '500' },
});
