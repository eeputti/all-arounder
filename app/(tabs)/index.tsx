import { StyleSheet, Text, View, Pressable } from 'react-native';

const trainingBalance = [
  { sport: 'run', minutes: 150, color: '#5e9cff' },
  { sport: 'tennis', minutes: 120, color: '#30d158' },
  { sport: 'gym', minutes: 110, color: '#ff9f0a' },
  { sport: 'mobility', minutes: 80, color: '#bf5af2' },
];

const totalMinutes = trainingBalance.reduce((total, entry) => total + entry.minutes, 0);

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
