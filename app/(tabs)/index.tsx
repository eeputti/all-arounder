import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { TrainingBalanceCard } from '@/components/TrainingBalanceCard';
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

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const today = new Date().toISOString().slice(0, 10);
  const todayWorkouts = MOCK_WORKOUTS.filter((workout) => workout.date === today);

  const upcomingWorkouts = MOCK_WORKOUTS.filter((workout) => workout.date >= today).slice(0, 4);

  const weekCounts = TRACKED.map((type) => ({
    type,
    count: MOCK_WORKOUTS.slice(-7).filter((workout) => workout.type === type).length,
  }));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: dark ? '#0E0F13' : '#F4F6FD' }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: dark ? '#F7F8FC' : '#0F1322' }]}>All-Arounder</Text>
      <Text style={[styles.subtitle, { color: dark ? '#A2A7B6' : '#62697A' }]}>your sport calendar</Text>

      <SectionCard title="Today" subtitle={today}>
        {todayWorkouts.length === 0 ? (
          <Text style={[styles.placeholder, { color: dark ? '#A5A9B7' : '#646B7D' }]}>No workout logged yet. Tap Add to plan your session.</Text>
        ) : (
          todayWorkouts.map((workout) => (
            <View key={workout.id} style={[styles.row, { borderColor: dark ? '#2C3040' : '#EAEDF6' }]}>
              <Text style={[styles.rowType, { color: WORKOUT_META[workout.type].color }]}>{WORKOUT_META[workout.type].label}</Text>
              <Text style={[styles.rowMeta, { color: dark ? '#CED3E2' : '#32384C' }]}>{workout.duration} min</Text>
            </View>
          ))
        )}
      </SectionCard>

      <View style={styles.card}>
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

      <View style={styles.actionsRow}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>add run</Text>
        </Pressable>

      <SectionCard title="Weekly Training Balance" subtitle="distribution by sport">
        <TrainingBalanceCard workouts={MOCK_WORKOUTS.slice(-7)} />
      </SectionCard>

      <SectionCard title="Weekly Volume" subtitle="sessions done this week">
        <View style={styles.chipWrap}>
          {weekCounts.map((item) => (
            <View key={item.type} style={[styles.chip, { backgroundColor: `${WORKOUT_META[item.type].color}1F` }]}>
              <Text style={[styles.chipValue, { color: WORKOUT_META[item.type].color }]}>{item.count}</Text>
              <Text style={[styles.chipLabel, { color: dark ? '#DCE0EC' : '#30374B' }]}>{WORKOUT_META[item.type].label}</Text>
            </View>
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
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  upcomingDate: {
    width: 50,
    fontSize: 13,
    fontWeight: '700',
  },
  upcomingType: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  balanceSubtitle: {
    color: '#8e8e93',
    fontSize: 14,
    marginBottom: 16,
  },
  balanceRows: {
    gap: 12,
  },
  balanceRow: {
    gap: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  balanceValue: {
    color: '#d1d1d6',
    fontSize: 14,
  },
  balanceTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#2c2c2e',
    borderRadius: 999,
    overflow: 'hidden',
  },
  balanceFill: {
    height: '100%',
    borderRadius: 999,
  },
  actionsRow: {
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
