import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AddWorkoutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Workout</Text>
      <Text style={styles.subtitle}>Quick actions to log your next session</Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>+ Run</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>+ Gym</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>+ Tennis</Text>
      </Pressable>
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
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 26,
    fontSize: 16,
    color: '#8e8e93',
  },
  button: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
