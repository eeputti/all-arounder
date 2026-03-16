import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.name}>Alex Runner</Text>
        <Text style={styles.stat}>Weekly goal: 5 workouts</Text>
        <Text style={styles.stat}>Completed: 3 workouts</Text>
        <Text style={styles.stat}>Favorite sport: Running</Text>
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
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  stat: {
    color: '#d1d1d6',
    fontSize: 16,
  },
});
