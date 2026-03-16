import { ScrollView, StyleSheet, Text, View } from 'react-native';

const heat = [
  [0, 1, 2, 1, 3, 0, 2, 2, 1, 0, 3, 2],
  [1, 2, 2, 3, 1, 0, 1, 3, 2, 2, 1, 0],
  [0, 1, 3, 2, 1, 2, 2, 1, 3, 1, 0, 2],
  [1, 3, 2, 1, 0, 1, 3, 2, 2, 1, 2, 1],
  [2, 1, 0, 2, 3, 2, 1, 0, 1, 3, 2, 2],
  [3, 2, 1, 0, 2, 1, 3, 2, 1, 0, 2, 3],
];

const intensity = ['#F2F4F8', '#D0F4DE', '#A9DEF9', '#E4C1F9'];

const stats = [
  { label: 'Minutes moved', value: '1,287', emoji: '⏱️' },
  { label: 'Workouts logged', value: '46', emoji: '📝' },
  { label: 'Favorite vibe', value: 'Joyful', emoji: '🌈' },
  { label: 'Longest streak', value: '21 days', emoji: '🔥' },
];

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthWorkouts = MOCK_WORKOUTS.filter((workout) => workout.date.slice(5, 7) === month);

  const streak = 6;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cute stats corner</Text>
      <Text style={styles.subtitle}>Your movement story in sparkles and squares.</Text>

      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.emoji}>{stat.emoji}</Text>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.heatmapCard}>
        <Text style={styles.heatmapTitle}>Yearly activity heatmap</Text>
        <Text style={styles.heatmapSub}>Darker blocks = more movement magic</Text>
        <View style={styles.heatGrid}>
          {heat.map((column, colIndex) => (
            <View key={`col-${colIndex}`} style={styles.column}>
              {column.map((cell, rowIndex) => (
                <View key={`cell-${colIndex}-${rowIndex}`} style={[styles.cell, { backgroundColor: intensity[cell] }]} />
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9EF' },
  content: { paddingTop: 70, paddingHorizontal: 16, paddingBottom: 30, gap: 16 },
  title: { fontSize: 33, fontWeight: '800', color: '#6E4A32' },
  subtitle: { color: '#9A6B4A' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 2, borderColor: '#FFE4BF', padding: 12, gap: 3 },
  emoji: { fontSize: 24 },
  value: { fontSize: 24, fontWeight: '800', color: '#6E4A32' },
  label: { color: '#9A6B4A', fontWeight: '600' },
  heatmapCard: { backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 2, borderColor: '#FFE4BF', padding: 14 },
  heatmapTitle: { fontSize: 19, fontWeight: '700', color: '#6E4A32' },
  heatmapSub: { color: '#9A6B4A', marginBottom: 10 },
  heatGrid: { flexDirection: 'row', gap: 5 },
  column: { gap: 5 },
  cell: { width: 18, height: 18, borderRadius: 5 },
});
