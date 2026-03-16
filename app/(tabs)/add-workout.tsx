import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const quickMoves = [
  { label: 'Joy Run', emoji: '🏃', hint: '25 min easy + smile' },
  { label: 'Power Lift', emoji: '🏋️', hint: '40 min strength circuit' },
  { label: 'Flow Mobility', emoji: '🧘', hint: '15 min reset stretch' },
  { label: 'Dance Burst', emoji: '💃', hint: '20 min feel-good playlist' },
];

export default function AddWorkoutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Quick log pad</Text>
      <Text style={styles.subtitle}>Tap a move and keep your streak sparkling ✨</Text>

      {quickMoves.map((move) => (
        <Pressable key={move.label} style={styles.button}>
          <Text style={styles.buttonTitle}>{move.emoji} {move.label}</Text>
          <Text style={styles.buttonHint}>{move.hint}</Text>
        </Pressable>
      ))}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mood after movement</Text>
        <Text style={styles.cardMood}>🌈 Joyful · 💪 Strong · 🌿 Calm · ⚡ Energized</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FFF4' },
  content: { paddingTop: 70, paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  title: { fontSize: 33, fontWeight: '800', color: '#2D5A34' },
  subtitle: { color: '#4D7C58' },
  button: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 2, borderColor: '#CDEFD0', padding: 14 },
  buttonTitle: { color: '#2D5A34', fontSize: 17, fontWeight: '700' },
  buttonHint: { color: '#4D7C58', marginTop: 3 },
  card: { backgroundColor: '#E9FDE8', borderRadius: 18, padding: 14 },
  cardTitle: { color: '#2D5A34', fontWeight: '700', marginBottom: 6 },
  cardMood: { color: '#4D7C58' },
});
