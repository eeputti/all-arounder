import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Workout = {
  id: string;
  title: string;
  duration: string;
  notes: string;
  emoji: string;
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const monthDays: (number | '')[] = [
  '',
  '',
  '',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  '',
];

const initialWorkoutsByDay: Record<number, Workout[]> = {
  2: [
    {
      id: 'run-2',
      title: 'Morning Run',
      duration: '35 min',
      notes: 'Easy pace around the lake.',
      emoji: '🏃',
    },
  ],
  4: [
    {
      id: 'gym-4',
      title: 'Strength Training',
      duration: '50 min',
      notes: 'Leg day + mobility.',
      emoji: '🏋️',
    },
  ],
  7: [
    {
      id: 'tennis-7',
      title: 'Tennis Session',
      duration: '75 min',
      notes: 'Focused on serve and volley.',
      emoji: '🎾',
    },
  ],
  10: [
    {
      id: 'bike-10',
      title: 'City Ride',
      duration: '42 min',
      notes: 'Intervals on hills.',
      emoji: '🚴',
    },
  ],
  12: [
    {
      id: 'run-12',
      title: 'Tempo Run',
      duration: '28 min',
      notes: '3 x 5 min threshold.',
      emoji: '🏃',
    },
  ],
  16: [
    {
      id: 'swim-16',
      title: 'Pool Laps',
      duration: '40 min',
      notes: 'Breathing drills + 8 laps.',
      emoji: '🏊',
    },
  ],
  19: [
    {
      id: 'gym-19',
      title: 'Upper Body',
      duration: '48 min',
      notes: 'Bench, rows, and shoulders.',
      emoji: '🏋️',
    },
  ],
  23: [
    {
      id: 'soccer-23',
      title: 'Soccer Practice',
      duration: '60 min',
      notes: 'Passing drills and game simulation.',
      emoji: '⚽',
    },
  ],
  26: [
    {
      id: 'tennis-26',
      title: 'Doubles Match',
      duration: '90 min',
      notes: 'Fast pace and lots of net play.',
      emoji: '🎾',
    },
  ],
  29: [
    {
      id: 'run-29',
      title: 'Recovery Jog',
      duration: '20 min',
      notes: 'Kept heart rate low.',
      emoji: '🏃',
    },
  ],
};

const emptyWorkout = {
  title: '',
  duration: '',
  notes: '',
  emoji: '🏃',
};

export default function CalendarScreen() {
  const [workoutsByDay, setWorkoutsByDay] =
    useState<Record<number, Workout[]>>(initialWorkoutsByDay);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newWorkout, setNewWorkout] = useState(emptyWorkout);
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState(emptyWorkout);

  const selectedWorkouts = useMemo(() => {
    if (!selectedDay) {
      return [];
    }

    return workoutsByDay[selectedDay] ?? [];
  }, [selectedDay, workoutsByDay]);

  const sportsByDay = useMemo(() => {
    const summary: Record<number, string> = {};

    Object.entries(workoutsByDay).forEach(([day, workouts]) => {
      if (workouts.length > 0) {
        summary[Number(day)] = workouts[0].emoji;
      }
    });

    return summary;
  }, [workoutsByDay]);

  const closeSheet = () => {
    setSelectedDay(null);
    setEditingWorkoutId(null);
    setNewWorkout(emptyWorkout);
  };

  const addWorkout = () => {
    if (!selectedDay || !newWorkout.title.trim() || !newWorkout.duration.trim()) {
      return;
    }

    const nextWorkout: Workout = {
      id: `${Date.now()}`,
      title: newWorkout.title.trim(),
      duration: newWorkout.duration.trim(),
      notes: newWorkout.notes.trim(),
      emoji: newWorkout.emoji || '🏃',
    };

    setWorkoutsByDay((current) => ({
      ...current,
      [selectedDay]: [...(current[selectedDay] ?? []), nextWorkout],
    }));

    setNewWorkout(emptyWorkout);
  };

  const deleteWorkout = (workoutId: string) => {
    if (!selectedDay) {
      return;
    }

    setWorkoutsByDay((current) => {
      const filtered = (current[selectedDay] ?? []).filter(
        (workout) => workout.id !== workoutId,
      );

      if (filtered.length === 0) {
        const { [selectedDay]: _, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [selectedDay]: filtered,
      };
    });

    if (editingWorkoutId === workoutId) {
      setEditingWorkoutId(null);
    }
  };

  const startEditing = (workout: Workout) => {
    setEditingWorkoutId(workout.id);
    setEditingWorkout({
      title: workout.title,
      duration: workout.duration,
      notes: workout.notes,
      emoji: workout.emoji,
    });
  };

  const saveEditing = () => {
    if (!selectedDay || !editingWorkoutId || !editingWorkout.title.trim() || !editingWorkout.duration.trim()) {
      return;
    }

    setWorkoutsByDay((current) => ({
      ...current,
      [selectedDay]: (current[selectedDay] ?? []).map((workout) =>
        workout.id === editingWorkoutId
          ? {
              ...workout,
              title: editingWorkout.title.trim(),
              duration: editingWorkout.duration.trim(),
              notes: editingWorkout.notes.trim(),
              emoji: editingWorkout.emoji || '🏃',
            }
          : workout,
      ),
    }));

    setEditingWorkoutId(null);
  };

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
            <Pressable
              key={`${day}-${index}`}
              disabled={!day}
              onPress={() => {
                if (day) {
                  setSelectedDay(day);
                }
              }}
              style={[styles.cell, day ? null : styles.emptyCell]}
            >
              {day ? (
                <>
                  <Text style={styles.dayNumber}>{day}</Text>
                  <Text style={styles.event}>{sportsByDay[day] ?? ''}</Text>
                </>
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>

      <Modal
        visible={selectedDay !== null}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
      >
        <Pressable style={styles.backdrop} onPress={closeSheet}>
          <Pressable style={styles.sheet} onPress={() => null}>
            <Text style={styles.sheetTitle}>Day {selectedDay} Workouts</Text>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              {selectedWorkouts.length === 0 ? (
                <Text style={styles.emptyState}>No workouts logged yet.</Text>
              ) : (
                selectedWorkouts.map((workout) => {
                  const isEditing = editingWorkoutId === workout.id;

                  return (
                    <View key={workout.id} style={styles.workoutCard}>
                      {isEditing ? (
                        <>
                          <TextInput
                            style={styles.input}
                            value={editingWorkout.title}
                            onChangeText={(value) =>
                              setEditingWorkout((current) => ({ ...current, title: value }))
                            }
                            placeholder="Workout"
                            placeholderTextColor="#6e6e73"
                          />
                          <TextInput
                            style={styles.input}
                            value={editingWorkout.duration}
                            onChangeText={(value) =>
                              setEditingWorkout((current) => ({ ...current, duration: value }))
                            }
                            placeholder="Duration"
                            placeholderTextColor="#6e6e73"
                          />
                          <TextInput
                            style={styles.input}
                            value={editingWorkout.notes}
                            onChangeText={(value) =>
                              setEditingWorkout((current) => ({ ...current, notes: value }))
                            }
                            placeholder="Notes"
                            placeholderTextColor="#6e6e73"
                          />
                          <TextInput
                            style={styles.input}
                            value={editingWorkout.emoji}
                            onChangeText={(value) =>
                              setEditingWorkout((current) => ({ ...current, emoji: value }))
                            }
                            placeholder="Emoji"
                            placeholderTextColor="#6e6e73"
                          />

                          <View style={styles.actionsRow}>
                            <Pressable style={styles.primaryAction} onPress={saveEditing}>
                              <Text style={styles.actionText}>Save</Text>
                            </Pressable>
                            <Pressable
                              style={styles.secondaryAction}
                              onPress={() => setEditingWorkoutId(null)}
                            >
                              <Text style={styles.actionText}>Cancel</Text>
                            </Pressable>
                          </View>
                        </>
                      ) : (
                        <>
                          <Text style={styles.workoutTitle}>
                            {workout.emoji} {workout.title}
                          </Text>
                          <Text style={styles.workoutMeta}>Duration: {workout.duration}</Text>
                          <Text style={styles.workoutMeta}>Notes: {workout.notes || '—'}</Text>

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
  emptyCell: {
    backgroundColor: 'transparent',
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
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  sheetTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  sheetScroll: {
    flexGrow: 0,
  },
  emptyState: {
    color: '#8e8e93',
    marginBottom: 14,
  },
  workoutCard: {
    backgroundColor: '#2c2c2e',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  workoutTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  workoutMeta: {
    color: '#c7c7cc',
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  primaryAction: {
    backgroundColor: '#0a84ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  secondaryAction: {
    backgroundColor: '#48484a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  dangerAction: {
    backgroundColor: '#ff453a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  addCard: {
    backgroundColor: '#2c2c2e',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  addTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    color: '#ffffff',
    marginBottom: 8,
  },
});
