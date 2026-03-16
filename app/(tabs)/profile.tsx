import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { StatsBreakdownBar } from '@/components/StatsBreakdownBar';
import { StatsMetricCard } from '@/components/StatsMetricCard';
import { MOCK_WORKOUTS } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ACTIVITY_COLORS = {
  run: '#4CD964',
  tennis: '#FFB340',
  gym: '#4C9DFF',
  mobility: '#C07DFF',
};

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

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
    <ScrollView
      style={[styles.container, { backgroundColor: dark ? '#0B0C12' : '#EEF2FF' }]}
      contentContainerStyle={styles.content}>
      <View
        style={[
          styles.hero,
          {
            backgroundColor: dark ? '#141726' : '#FFFFFF',
            borderColor: dark ? '#262B41' : '#DFE7FF',
          },
        ]}>
        <Text style={styles.heroEmoji}>✨</Text>
        <Text style={[styles.title, { color: dark ? '#F8FAFF' : '#101935' }]}>Stats</Text>
        <Text style={[styles.subtitle, { color: dark ? '#AAB6D6' : '#5D6A90' }]}>Cute, clean, and very consistent this month.</Text>
      </View>

      <View style={styles.grid}>
        <StatsMetricCard label="Total workouts this month" value={totalMovementSessions} accent="#7F89FF" emoji="🗓️" />
        <StatsMetricCard label="Runs this month" value={runCount} accent={ACTIVITY_COLORS.run} emoji="🏃" />
        <StatsMetricCard label="Tennis sessions" value={tennisCount} accent={ACTIVITY_COLORS.tennis} emoji="🎾" />
        <StatsMetricCard label="Gym sessions" value={gymCount} accent={ACTIVITY_COLORS.gym} emoji="🏋️" />
        <StatsMetricCard label="Mobility sessions" value={mobilityCount} accent={ACTIVITY_COLORS.mobility} emoji="🧘" />
        <StatsMetricCard label="Rest days" value={restDays} accent="#8E9BBB" emoji="😴" />
      </View>

      <SectionCard title="Momentum" subtitle="streak + consistency">
        <View style={styles.momentumRow}>
          <View style={[styles.momentumPill, { backgroundColor: dark ? '#FF8A3D1F' : '#FF8A3D20' }]}>
            <Text style={styles.pillEmoji}>🔥</Text>
            <Text style={[styles.pillValue, { color: dark ? '#FFD3B1' : '#AA4D00' }]}>{longestStreak} days</Text>
            <Text style={[styles.pillLabel, { color: dark ? '#F2B688' : '#C4650A' }]}>Movement streak</Text>
          </View>

          <View style={[styles.momentumPill, { backgroundColor: dark ? '#5D7BFF1F' : '#5D7BFF1A' }]}>
            <Text style={styles.pillEmoji}>📈</Text>
            <Text style={[styles.pillValue, { color: dark ? '#C9D5FF' : '#2241AB' }]}>{weeklyConsistency}%</Text>
            <Text style={[styles.pillLabel, { color: dark ? '#9DB2FF' : '#3459D4' }]}>Weekly consistency</Text>
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
  content: { paddingTop: 72, paddingHorizontal: 16, paddingBottom: 30, gap: 14 },
  hero: {
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 6,
  },
  heroEmoji: { fontSize: 26 },
  title: { fontSize: 34, fontWeight: '800' },
  subtitle: { fontSize: 15, fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  momentumRow: {
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
