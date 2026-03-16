import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { Colors } from '@/constants/theme';
import { MOCK_WORKOUTS, WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthWorkouts = MOCK_WORKOUTS.filter((workout) => workout.date.slice(5, 7) === month);

  const streak = 6;

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: palette.text }]}>Profile</Text>
      <Text style={[styles.subtitle, { color: palette.mutedText }]}>Consistency and monthly momentum.</Text>

      <SectionCard title="This Month" subtitle="training snapshot">
        <View style={[styles.statRow, { borderColor: palette.cardBorder }]}> 
          <Text style={[styles.statLabel, { color: palette.text }]}>Total Workouts</Text>
          <Text style={[styles.statValue, { color: palette.text }]}>{monthWorkouts.length}</Text>
        </View>

        {TYPES.map((type, index) => (
          <View
            key={type}
            style={[styles.statRow, { borderColor: palette.cardBorder, borderBottomWidth: index === TYPES.length - 1 ? 0 : 1 }]}>
            <Text style={[styles.statLabel, { color: WORKOUT_META[type].color }]}>{WORKOUT_META[type].label}</Text>
            <Text style={[styles.statValue, { color: palette.text }]}>
              {monthWorkouts.filter((workout) => workout.type === type).length}
            </Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Streak" subtitle="showing up matters">
        <View style={[styles.streakCard, { backgroundColor: `${palette.tint}1F`, borderColor: `${palette.tint}45` }]}> 
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={[styles.streakValue, { color: palette.text }]}>{streak} day streak</Text>
            <Text style={[styles.streakText, { color: palette.mutedText }]}>You trained on 11 of the last 14 days.</Text>
          </View>
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 74, paddingHorizontal: 16, paddingBottom: 28 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { marginTop: 3, marginBottom: 16, fontSize: 15, fontWeight: '600' },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  statLabel: { fontSize: 15, fontWeight: '700' },
  statValue: { marginLeft: 'auto', fontSize: 18, fontWeight: '800' },
  streakCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  streakEmoji: { fontSize: 26 },
  streakValue: { fontSize: 22, fontWeight: '800' },
  streakText: { fontSize: 14, fontWeight: '500' },
});
