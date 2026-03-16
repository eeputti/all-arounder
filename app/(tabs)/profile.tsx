import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { YearlyActivityHeatmap } from '@/components/YearlyActivityHeatmap';
import { YEARLY_ACTIVITY_MOCK } from '@/constants/yearlyActivity';
import { MOCK_WORKOUTS, WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ACTIVITY_COLORS = {
  run: '#4CD964',
  tennis: '#FFB340',
  gym: '#4C9DFF',
  mobility: '#C07DFF',
};

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const daysInMonth = monthEnd.getDate();

  const workoutsThisMonth = MOCK_WORKOUTS.filter((workout) => {
    const date = new Date(`${workout.date}T00:00:00`);
    return date >= monthStart && date <= monthEnd;
  });

  const runCount = workoutsThisMonth.filter((w) => w.type === 'run').length;
  const tennisCount = workoutsThisMonth.filter((w) => w.type === 'tennis').length;
  const gymCount = workoutsThisMonth.filter((w) => w.type === 'gym').length;
  const mobilityCount = workoutsThisMonth.filter((w) => w.type === 'mobility').length;

  const movementDaysSet = new Set(
    workoutsThisMonth.filter((w) => w.type !== 'rest').map((w) => w.date),
  );
  const restDays = Math.max(daysInMonth - movementDaysSet.size, 0);
  const totalMovementSessions = runCount + tennisCount + gymCount + mobilityCount;

  const longestStreak = (() => {
    let streak = 0;
    let longest = 0;
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (movementDaysSet.has(dateKey)) {
        streak += 1;
        longest = Math.max(longest, streak);
      } else {
        streak = 0;
      }
    }
    return longest;
  })();

  const weeksInMonth = Math.ceil(daysInMonth / 7);
  const activeWeeks = new Set(
    Array.from(movementDaysSet).map((dateKey) => {
      const dayOfMonth = Number(dateKey.slice(-2));
      return Math.ceil(dayOfMonth / 7);
    }),
  ).size;
  const weeklyConsistency = Math.round((activeWeeks / weeksInMonth) * 100);

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


      <SectionCard title="Year in Motion" subtitle="zoomed-out activity map">
        <YearlyActivityHeatmap data={YEARLY_ACTIVITY_MOCK} />
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

      <SectionCard title="Monthly movement breakdown" subtitle="session distribution">
        <View style={styles.breakdownList}>
          <StatsBreakdownBar label="Running" value={runCount} total={totalMovementSessions} color={ACTIVITY_COLORS.run} />
          <StatsBreakdownBar label="Tennis" value={tennisCount} total={totalMovementSessions} color={ACTIVITY_COLORS.tennis} />
          <StatsBreakdownBar label="Gym" value={gymCount} total={totalMovementSessions} color={ACTIVITY_COLORS.gym} />
          <StatsBreakdownBar
            label="Mobility"
            value={mobilityCount}
            total={totalMovementSessions}
            color={ACTIVITY_COLORS.mobility}
          />
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
  },
  momentumPill: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    gap: 6,
  },
  pillEmoji: { fontSize: 20 },
  pillValue: { fontSize: 24, fontWeight: '800' },
  pillLabel: { fontSize: 13, fontWeight: '700' },
  breakdownList: {
    gap: 12,
  },
});
