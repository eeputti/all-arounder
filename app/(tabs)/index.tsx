import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>all-arounder</Text>
      <Text style={styles.subtitle}>your sport calendar</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>today</Text>
        <Text style={styles.item}>🏃 run 8 km</Text>
        <Text style={styles.item}>🎾 tennis 18:00</Text>
        <Text style={styles.item}>🏋️ gym 45 min</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>this week</Text>
        <Text style={styles.item}>mon — run 8 km</Text>
        <Text style={styles.item}>tue — gym</Text>
        <Text style={styles.item}>wed — tennis</Text>
        <Text style={styles.item}>thu — mobility</Text>
        <Text style={styles.item}>fri — run 5 km</Text>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>add run</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>add tennis</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>add gym</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f10',
    paddingTop: 90,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    color: '#8e8e93',
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 14,
  },
  item: {
    color: '#d1d1d6',
    fontSize: 16,
    marginBottom: 8,
  },
  actionsRow: {
    gap: 10,
  },
  button: {
    backgroundColor: '#2c2c2e',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});