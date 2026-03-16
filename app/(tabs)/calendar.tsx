import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Workout = {
  id: string;
  title: string;
  duration: string;
  notes: string;
  emoji: string;
};

type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const initialWorkoutsByDay: Record<number, Workout[]> = {
  2: [{ id: 'run-2', title: 'Morning Run', duration: '35 min', notes: 'Easy pace around the lake.', emoji: '🏃' }],
  4: [{ id: 'gym-4', title: 'Strength Training', duration: '50 min', notes: 'Leg day + mobility.', emoji: '🏋️' }],
  7: [{ id: 'tennis-7', title: 'Tennis Session', duration: '75 min', notes: 'Focused on serve and volley.', emoji: '🎾' }],
  10: [{ id: 'bike-10', title: 'City Ride', duration: '42 min', notes: 'Intervals on hills.', emoji: '🚴' }],
  12: [{ id: 'run-12', title: 'Tempo Run', duration: '28 min', notes: '3 x 5 min threshold.', emoji: '🏃' }],
  16: [{ id: 'swim-16', title: 'Pool Laps', duration: '40 min', notes: 'Breathing drills + 8 laps.', emoji: '🏊' }],
  19: [{ id: 'gym-19', title: 'Upper Body', duration: '48 min', notes: 'Bench, rows, and shoulders.', emoji: '🏋️' }],
  23: [{ id: 'soccer-23', title: 'Soccer Practice', duration: '60 min', notes: 'Passing drills and game simulation.', emoji: '⚽' }],
  26: [{ id: 'tennis-26', title: 'Doubles Match', duration: '90 min', notes: 'Fast pace and lots of net play.', emoji: '🎾' }],
  29: [{ id: 'run-29', title: 'Recovery Jog', duration: '20 min', notes: 'Kept heart rate low.', emoji: '🏃' }],
};

const emptyWorkout = { title: '', duration: '', notes: '', emoji: '🏃' };

function formatMonth(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function buildMonthGrid(viewMonth: Date): CalendarCell[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7;
  const cells: CalendarCell[] = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(year, month, i + 1 - mondayBasedOffset);
    cells.push({ date, inCurrentMonth: date.getMonth() === month });
  }

  return cells;
}

export default function CalendarScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  const [workoutsByDay, setWorkoutsByDay] = useState<Record<number, Workout[]>>(initialWorkoutsByDay);
  const [selectedMonth, setSelectedMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newWorkout, setNewWorkout] = useState(emptyWorkout);
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState(emptyWorkout);

  const monthTitle = useMemo(() => formatMonth(selectedMonth), [selectedMonth]);
  const monthCells = useMemo(() => buildMonthGrid(selectedMonth), [selectedMonth]);

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
      const filtered = (current[selectedDay] ?? []).filter((workout) => workout.id !== workoutId);
      if (filtered.length === 0) {
        const { [selectedDay]: _, ...rest } = current;
        return rest;
      }

      return { ...current, [selectedDay]: filtered };
    });

    if (editingWorkoutId === workoutId) {
      setEditingWorkoutId(null);
    }
  };

  const startEditing = (workout: Workout) => {
    setEditingWorkoutId(workout.id);
    setEditingWorkout({ title: workout.title, duration: workout.duration, notes: workout.notes, emoji: workout.emoji });
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
    <ScrollView style={[styles.container, { backgroundColor: palette.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: palette.text }]}>Training Calendar</Text>
      <Text style={[styles.subtitle, { color: palette.mutedText }]}>See your movement rhythm across the month.</Text>

      <View style={styles.monthHeader}>
        <Pressable
          onPress={() => setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          style={[styles.monthButton, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
        >
          <Text style={[styles.monthButtonText, { color: palette.text }]}>‹</Text>
        </Pressable>
        <Text style={[styles.monthTitle, { color: palette.text }]}>{monthTitle}</Text>
        <Pressable
          onPress={() => setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          style={[styles.monthButton, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
        >
          <Text style={[styles.monthButtonText, { color: palette.text }]}>›</Text>
        </Pressable>
      </View>

      <View style={[styles.calendarCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}> 
        <View style={styles.weekRow}>
          {WEEK_DAYS.map((day) => (
            <Text key={day} style={[styles.weekday, { color: palette.mutedText }]}>{day}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {monthCells.map((cell, index) => {
            const day = cell.date.getDate();
            const isSelected = selectedDay === day && cell.inCurrentMonth;
            const hasWorkout = Boolean(sportsByDay[day]) && cell.inCurrentMonth;
            const isToday = new Date().toDateString() === cell.date.toDateString();

            return (
              <Pressable
                key={`${cell.date.toISOString()}-${index}`}
                disabled={!cell.inCurrentMonth}
                onPress={() => setSelectedDay(day)}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell.inCurrentMonth ? palette.surfaceMuted : 'transparent',
                    borderColor: isSelected ? palette.tint : isToday ? `${palette.tint}60` : 'transparent',
                  },
                ]}
              >
                {cell.inCurrentMonth ? (
                  <>
                    <Text style={[styles.dayNumber, { color: palette.text }]}>{day}</Text>
                    <Text style={styles.event}>{hasWorkout ? sportsByDay[day] : ''}</Text>
                  </>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Modal visible={selectedDay !== null} transparent animationType="slide" onRequestClose={closeSheet}>
        <Pressable style={[styles.backdrop, { backgroundColor: palette.modalBackdrop }]} onPress={closeSheet}>
          <Pressable style={[styles.sheet, { backgroundColor: palette.card, borderColor: palette.cardBorder }]} onPress={() => null}>
            <Text style={[styles.sheetTitle, { color: palette.text }]}>Day {selectedDay} Workouts</Text>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              {selectedWorkouts.length === 0 ? (
                <Text style={[styles.emptyState, { color: palette.mutedText }]}>No workouts logged yet.</Text>
              ) : (
                selectedWorkouts.map((workout) => {
                  const isEditing = editingWorkoutId === workout.id;

                  return (
                    <View key={workout.id} style={[styles.workoutCard, { backgroundColor: palette.surfaceMuted, borderColor: palette.cardBorder }]}> 
                      {isEditing ? (
                        <>
                          {['title', 'duration', 'notes', 'emoji'].map((field) => (
                            <TextInput
                              key={field}
                              style={[styles.input, { backgroundColor: palette.inputBackground, borderColor: palette.cardBorder, color: palette.text }]}
                              value={editingWorkout[field as keyof typeof editingWorkout]}
                              onChangeText={(value) =>
                                setEditingWorkout((current) => ({ ...current, [field]: value }))
                              }
                              placeholder={field[0].toUpperCase() + field.slice(1)}
                              placeholderTextColor={palette.mutedText}
                            />
                          ))}

                          <View style={styles.actionsRow}>
                            <Pressable style={[styles.primaryAction, { backgroundColor: palette.tint }]} onPress={saveEditing}>
                              <Text style={styles.actionText}>Save</Text>
                            </Pressable>
                            <Pressable style={[styles.secondaryAction, { backgroundColor: palette.inputBackground }]} onPress={() => setEditingWorkoutId(null)}>
                              <Text style={[styles.actionText, { color: palette.text }]}>Cancel</Text>
                            </Pressable>
                          </View>
                        </>
                      ) : (
                        <>
                          <Text style={[styles.workoutTitle, { color: palette.text }]}>
                            {workout.emoji} {workout.title}
                          </Text>
                          <Text style={[styles.workoutMeta, { color: palette.mutedText }]}>Duration: {workout.duration}</Text>
                          <Text style={[styles.workoutMeta, { color: palette.mutedText }]}>Notes: {workout.notes || '—'}</Text>

                          <View style={styles.actionsRow}>
                            <Pressable style={[styles.primaryAction, { backgroundColor: palette.tint }]} onPress={() => startEditing(workout)}>
                              <Text style={styles.actionText}>Edit workout</Text>
                            </Pressable>
                            <Pressable style={[styles.dangerAction, { backgroundColor: palette.danger }]} onPress={() => deleteWorkout(workout.id)}>
                              <Text style={styles.actionText}>Delete</Text>
                            </Pressable>
                          </View>
                        </>
                      )}
                    </View>
                  );
                })
              )}

              <View style={[styles.addCard, { backgroundColor: palette.surfaceMuted, borderColor: palette.cardBorder }]}> 
                <Text style={[styles.addTitle, { color: palette.text }]}>Add new workout</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: palette.inputBackground, borderColor: palette.cardBorder, color: palette.text }]}
                  value={newWorkout.title}
                  onChangeText={(value) => setNewWorkout((current) => ({ ...current, title: value }))}
                  placeholder="Workout"
                  placeholderTextColor={palette.mutedText}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: palette.inputBackground, borderColor: palette.cardBorder, color: palette.text }]}
                  value={newWorkout.duration}
                  onChangeText={(value) => setNewWorkout((current) => ({ ...current, duration: value }))}
                  placeholder="Duration"
                  placeholderTextColor={palette.mutedText}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: palette.inputBackground, borderColor: palette.cardBorder, color: palette.text }]}
                  value={newWorkout.notes}
                  onChangeText={(value) => setNewWorkout((current) => ({ ...current, notes: value }))}
                  placeholder="Notes"
                  placeholderTextColor={palette.mutedText}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: palette.inputBackground, borderColor: palette.cardBorder, color: palette.text }]}
                  value={newWorkout.emoji}
                  onChangeText={(value) => setNewWorkout((current) => ({ ...current, emoji: value }))}
                  placeholder="Emoji"
                  placeholderTextColor={palette.mutedText}
                />

                <Pressable style={[styles.primaryAction, { backgroundColor: palette.tint }]} onPress={addWorkout}>
                  <Text style={styles.actionText}>Add workout</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 74, paddingHorizontal: 16, paddingBottom: 28 },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 4, letterSpacing: -0.6 },
  subtitle: { fontSize: 15, fontWeight: '600', marginBottom: 16 },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  monthButtonText: { fontSize: 24, fontWeight: '500' },
  monthTitle: { fontSize: 20, fontWeight: '800' },
  calendarCard: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 2,
  },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weekday: { width: '13.7%', textAlign: 'center', fontSize: 12, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
  },
  dayNumber: { fontSize: 13, fontWeight: '700' },
  event: { marginTop: 2, fontSize: 13 },
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '82%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  sheetTitle: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  sheetScroll: { flexGrow: 0 },
  emptyState: { marginBottom: 14, fontSize: 14, fontWeight: '500' },
  workoutCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  workoutTitle: { fontSize: 16, fontWeight: '700' },
  workoutMeta: { marginTop: 6, fontSize: 14, fontWeight: '500' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  primaryAction: { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 11 },
  secondaryAction: { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 11 },
  dangerAction: { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 11 },
  actionText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  addCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  addTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 11,
    marginBottom: 8,
    fontWeight: '600',
  },
});
