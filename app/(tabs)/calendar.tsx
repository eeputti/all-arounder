import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CalendarDay } from '@/components/CalendarDay';
import { DayDetailsModal } from '@/components/DayDetailsModal';
import { WORKOUT_META, MOCK_WORKOUTS, Workout } from '@/constants/workouts';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildMonthGrid = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const leadingDays = (firstDay.getDay() + 6) % 7;

  const cells: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(year, month, i + 1 - leadingDays);
    cells.push({ date, isCurrentMonth: date.getMonth() === month });
  }

  return cells;
};

export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  const monthGrid = useMemo(() => buildMonthGrid(selectedMonth), [selectedMonth]);

  const workoutsByDate = useMemo(() => {
    return MOCK_WORKOUTS.reduce<Record<string, Workout[]>>((acc, workout) => {
      if (!acc[workout.date]) {
        acc[workout.date] = [];
      }
      acc[workout.date].push(workout);
      return acc;
    }, {});
  }, []);

  const selectedWorkouts = selectedDate ? workoutsByDate[selectedDate] ?? [] : [];

    setEditingWorkoutId(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Movement Month</Text>
          <Text style={styles.subtitle}>Soft goals, strong glow ✨</Text>
        </View>
      </View>

      <View style={styles.monthHeader}>
        <Pressable
          onPress={() => setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          style={({ pressed }) => [styles.monthButton, pressed && styles.monthButtonPressed]}>
          <Text style={styles.monthButtonText}>‹</Text>
        </Pressable>

        <Text style={styles.monthTitle}>{monthTitle}</Text>

        <Pressable
          onPress={() => setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          style={({ pressed }) => [styles.monthButton, pressed && styles.monthButtonPressed]}>
          <Text style={styles.monthButtonText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.weekRow}>
          {WEEKDAYS.map((day) => (
            <Text key={day} style={styles.weekday}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {monthGrid.map((cell) => {
            const dateKey = formatDateKey(cell.date);
            return (
              <CalendarDay
                key={dateKey}
                dayNumber={cell.date.getDate()}
                isCurrentMonth={cell.isCurrentMonth}
                isToday={dateKey === todayKey}
                workouts={workoutsByDate[dateKey] ?? []}
                onPress={() => setSelectedDate(dateKey)}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.legendCard}>
        {Object.entries(WORKOUT_META).map(([type, meta]) => (
          <View key={type} style={styles.legendItem}>
            <Text style={styles.legendEmoji}>{meta.emoji}</Text>
            <Text style={styles.legendText}>{meta.label}</Text>
          </View>
        ))}
      </View>

                          <View style={styles.actionsRow}>
                            <Pressable
                              style={styles.primaryAction}
                              onPress={() => startEditing(workout)}
                            >
                              <Text style={styles.actionText}>Edit workout</Text>
                            </Pressable>
                            <Pressable
                              style={styles.dangerAction}
                              onPress={() => deleteWorkout(workout.id)}
                            >
                              <Text style={styles.actionText}>Delete</Text>
                            </Pressable>
                          </View>
                        </>
                      )}
                    </View>
                  );
                })
              )}

              <View style={styles.addCard}>
                <Text style={styles.addTitle}>Add new workout</Text>
                <TextInput
                  style={styles.input}
                  value={newWorkout.title}
                  onChangeText={(value) => setNewWorkout((current) => ({ ...current, title: value }))}
                  placeholder="Workout"
                  placeholderTextColor="#6e6e73"
                />
                <TextInput
                  style={styles.input}
                  value={newWorkout.duration}
                  onChangeText={(value) =>
                    setNewWorkout((current) => ({ ...current, duration: value }))
                  }
                  placeholder="Duration"
                  placeholderTextColor="#6e6e73"
                />
                <TextInput
                  style={styles.input}
                  value={newWorkout.notes}
                  onChangeText={(value) => setNewWorkout((current) => ({ ...current, notes: value }))}
                  placeholder="Notes"
                  placeholderTextColor="#6e6e73"
                />
                <TextInput
                  style={styles.input}
                  value={newWorkout.emoji}
                  onChangeText={(value) => setNewWorkout((current) => ({ ...current, emoji: value }))}
                  placeholder="Emoji"
                  placeholderTextColor="#6e6e73"
                />

                <Pressable style={styles.primaryAction} onPress={addWorkout}>
                  <Text style={styles.actionText}>Add workout</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0B14' },
  content: { paddingTop: 72, paddingHorizontal: 16, paddingBottom: 30 },
  headerRow: { marginBottom: 16 },
  title: { fontSize: 34, fontWeight: '800', color: '#F8F1FF', letterSpacing: 0.2 },
  subtitle: { marginTop: 4, fontSize: 15, color: '#BBAED9', fontWeight: '500' },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    backgroundColor: '#151726',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242743',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  monthButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242843',
  },
  monthButtonPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  monthButtonText: { color: '#F8F1FF', fontSize: 24, fontWeight: '700', lineHeight: 24 },
  monthTitle: { color: '#F8F1FF', fontSize: 20, fontWeight: '700' },
  calendarCard: {
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#252845',
    backgroundColor: '#141725',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weekday: { width: '13.7%', textAlign: 'center', color: '#9A90BC', fontSize: 12, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  legendCard: {
    marginTop: 14,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#242743',
    backgroundColor: '#151726',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#232641',
    gap: 6,
  },
  legendEmoji: { fontSize: 13 },
  legendText: { color: '#EADFFE', fontSize: 12, fontWeight: '700' },
});
