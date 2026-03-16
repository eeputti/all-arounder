import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MOCK_WORKOUTS, WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ProfileMock = {
  name: string;
  favoriteWorkoutType: WorkoutType;
  streakDays: number;
};

const PROFILE_MOCK: ProfileMock = {
  name: 'Your Name',
  favoriteWorkoutType: 'tennis',
  streakDays: 6,
};

const TRACKED_TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const movementWorkouts = MOCK_WORKOUTS.filter((workout) => workout.type !== 'rest');
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

  const monthlyMovement = movementWorkouts.filter((workout) => workout.date.slice(5, 7) === currentMonth);
  const monthlyMinutes = monthlyMovement.reduce((sum, workout) => sum + workout.duration, 0);

  const movementDays = new Set(movementWorkouts.map((workout) => workout.date));
  const monthlyTypeCounts = TRACKED_TYPES.map((type) => ({
    type,
    count: monthlyMovement.filter((workout) => workout.type === type).length,
  }));

  const mostFrequentMonthType =
    [...monthlyTypeCounts].sort((a, b) => b.count - a.count)[0]?.type ?? PROFILE_MOCK.favoriteWorkoutType;

  const summary =
    PROFILE_MOCK.streakDays >= 5
      ? `You're glowing with momentum — ${PROFILE_MOCK.streakDays} days in a row and counting ✨`
      : `You're building a strong rhythm. Every session is a little gift to future you 💖`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: dark ? '#0F1016' : '#FFF8FC' }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: dark ? '#FAF5FF' : '#2C1E35' }]}>Your Movement Profile</Text>
      <Text style={[styles.subtitle, { color: dark ? '#CCB8DA' : '#715A84' }]}>soft progress, strong habits</Text>

      <View style={[styles.heroCard, { backgroundColor: dark ? '#20152A' : '#FFFFFF' }]}>
        <Text style={[styles.heroEyebrow, { color: dark ? '#D4A9FF' : '#A556E3' }]}>Profile</Text>
        <Text style={[styles.heroName, { color: dark ? '#F8EEFF' : '#342043' }]}>{PROFILE_MOCK.name}</Text>
        <Text style={[styles.heroSummary, { color: dark ? '#DCCBE8' : '#7A618D' }]}>{summary}</Text>
      </View>

      <View style={styles.grid}>
        <View style={[styles.smallCard, { backgroundColor: dark ? '#1C1E2B' : '#FFFFFF' }]}>
          <Text style={[styles.cardLabel, { color: dark ? '#AAB0C8' : '#7D8198' }]}>Total movement days</Text>
          <Text style={[styles.cardValue, { color: dark ? '#F4F6FF' : '#1B1E2E' }]}>{movementDays.size}</Text>
        </View>

        <View style={[styles.smallCard, { backgroundColor: dark ? '#1C1E2B' : '#FFFFFF' }]}>
          <Text style={[styles.cardLabel, { color: dark ? '#AAB0C8' : '#7D8198' }]}>Current streak</Text>
          <Text style={[styles.cardValue, { color: dark ? '#F4F6FF' : '#1B1E2E' }]}>{PROFILE_MOCK.streakDays} days</Text>
        </View>
      </View>

      <View style={[styles.largeCard, { backgroundColor: dark ? '#1A1B25' : '#FFFFFF' }]}>
        <Text style={[styles.sectionTitle, { color: dark ? '#F7F2FF' : '#2A2032' }]}>Favorite workout type</Text>
        <View style={styles.favoriteRow}>
          <Text style={styles.favoriteEmoji}>{WORKOUT_META[PROFILE_MOCK.favoriteWorkoutType].emoji}</Text>
          <View>
            <Text style={[styles.favoriteLabel, { color: dark ? '#F6F7FF' : '#1D2130' }]}>
              {WORKOUT_META[PROFILE_MOCK.favoriteWorkoutType].label}
            </Text>
            <Text style={[styles.favoriteNote, { color: dark ? '#AAB0C8' : '#6C718A' }]}>Your most-loved movement style.</Text>
          </View>
        </View>
      </View>

      <View style={[styles.largeCard, { backgroundColor: dark ? '#1A1B25' : '#FFFFFF' }]}>
        <Text style={[styles.sectionTitle, { color: dark ? '#F7F2FF' : '#2A2032' }]}>Monthly totals</Text>
        <View style={styles.monthlyTopRow}>
          <View>
            <Text style={[styles.monthlyBigNumber, { color: dark ? '#FDF7FF' : '#25172F' }]}>{monthlyMovement.length}</Text>
            <Text style={[styles.monthlyCaption, { color: dark ? '#ADB3C8' : '#6F758B' }]}>movement sessions</Text>
          </View>
          <View>
            <Text style={[styles.monthlyBigNumber, { color: dark ? '#FDF7FF' : '#25172F' }]}>{monthlyMinutes}</Text>
            <Text style={[styles.monthlyCaption, { color: dark ? '#ADB3C8' : '#6F758B' }]}>total minutes</Text>
          </View>
        </View>

        {monthlyTypeCounts.map(({ type, count }) => (
          <View key={type} style={[styles.monthlyRow, { borderColor: dark ? '#2A2D3E' : '#ECEAF4' }]}>
            <Text style={[styles.monthlyType, { color: WORKOUT_META[type].color }]}>
              {WORKOUT_META[type].emoji} {WORKOUT_META[type].label}
            </Text>
            <Text style={[styles.monthlyCount, { color: dark ? '#EEF1FF' : '#20253A' }]}>{count}</Text>
          </View>
        ))}

        <Text style={[styles.monthlyHighlight, { color: dark ? '#DAB6FA' : '#9242D3' }]}>Top vibe this month: {WORKOUT_META[mostFrequentMonthType].label}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 72,
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: -2,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  heroCard: {
    borderRadius: 24,
    padding: 18,
    gap: 8,
    shadowColor: '#2C133A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroName: {
    fontSize: 28,
    fontWeight: '800',
  },
  heroSummary: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    gap: 6,
    shadowColor: '#291436',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  largeCard: {
    borderRadius: 22,
    padding: 16,
    gap: 10,
    shadowColor: '#20132B',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
  },
  favoriteEmoji: {
    fontSize: 28,
  },
  favoriteLabel: {
    fontSize: 22,
    fontWeight: '800',
  },
  favoriteNote: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
  },
  monthlyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  monthlyBigNumber: {
    fontSize: 30,
    fontWeight: '800',
  },
  monthlyCaption: {
    marginTop: -2,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  monthlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  monthlyType: {
    fontSize: 15,
    fontWeight: '700',
  },
  monthlyCount: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '800',
  },
  monthlyHighlight: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
  },
});
