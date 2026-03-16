import { StyleSheet, Text, View } from 'react-native';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const monthDays = [
  '', '', '', 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, '',
];

const sportsByDay: Record<number, string> = {
  2: '🏃',
  4: '🏋️',
  7: '🎾',
  10: '🚴',
  12: '🏃',
  16: '🏊',
  19: '🏋️',
  23: '⚽',
  26: '🎾',
  29: '🏃',
};

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Sports Calendar</Text>
      <Text style={styles.subtitle}>October 2026</Text>

      <View style={styles.calendarCard}>
        <View style={styles.weekRow}>
          {weekDays.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {monthDays.map((day, index) => (
            <View key={`${day}-${index}`} style={styles.cell}>
              {day ? (
                <>
                  <Text style={styles.dayNumber}>{day}</Text>
                  <Text style={styles.event}>{sportsByDay[day] ?? ''}</Text>
                </>
              ) : null}
            </View>
          ))}
        </View>
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
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 18,
    color: '#8e8e93',
  },
  calendarCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 14,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#8e8e93',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  event: {
    marginTop: 2,
    fontSize: 13,
  },
});
