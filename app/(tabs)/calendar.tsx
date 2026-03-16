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

import { useColorScheme } from '@/hooks/use-color-scheme';

type WorkoutType = 'Run' | 'Gym' | 'Tennis' | 'Mobility' | 'Recovery';

type Workout = {
  id: string;
  date: string; // YYYY-MM-DD
  type: WorkoutType;
  duration: string;
  notes: string;
  mood?: string;
};

type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const makeDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatMonthTitle = (date: Date) =>
  date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

const formatSelectedDate = (dateKey: string) =>
  parseDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const buildMonthGrid = (monthDate: Date): CalendarCell[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, index + 1 - mondayOffset);
    return {
      date,
      inCurrentMonth: date.getMonth() === month,
    };
  });
};

const buildMockWorkouts = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const key = (day: number) => makeDateKey(new Date(year, month, day));

  return [
    {
      id: 'w-1',
      date: key(2),
      type: 'Run',
      duration: '42 min',
      notes: 'Sunset run by the water. Felt smooth and strong.',
      mood: 'Energized ✨',
    },
    {
      id: 'w-2',
      date: key(2),
      type: 'Mobility',
      duration: '20 min',
      notes: 'Hip openers + light stretch before bed.',
      mood: 'Calm 🌙',
    },
    {
      id: 'w-3',
      date: key(6),
      type: 'Gym',
      duration: '55 min',
      notes: 'Leg day with squat + split squat ladder.',
      mood: 'Focused 💪',
    },
    {
      id: 'w-4',
      date: key(9),
      type: 'Tennis',
      duration: '75 min',
      notes: 'Serves + volley drills with partner.',
    },
    {
      id: 'w-5',
      date: key(14),
      type: 'Recovery',
      duration: '30 min',
      notes: 'Easy walk and breathwork.',
      mood: 'Reset 🫶',
    },
  ] satisfies Workout[];
};

const TYPE_EMOJI: Record<WorkoutType, string> = {
  Run: '🏃',
  Gym: '🏋️',
  Tennis: '🎾',
  Mobility: '🧘',
  Recovery: '🌿',
};

const TYPE_COLOR: Record<WorkoutType, string> = {
  Run: '#37C86B',
  Gym: '#4E8BFF',
  Tennis: '#FFB443',
  Mobility: '#C983FF',
  Recovery: '#6ED2B0',
};

export default function CalendarScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const dark = colorScheme === 'dark';

  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>(() => buildMockWorkouts());
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  const monthGrid = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const monthTitle = useMemo(() => formatMonthTitle(visibleMonth), [visibleMonth]);

  const workoutsByDate = useMemo(() => {
    return workouts.reduce<Record<string, Workout[]>>((acc, workout) => {
      if (!acc[workout.date]) {
        acc[workout.date] = [];
      }
      acc[workout.date].push(workout);
      return acc;
    }, {});
  }, [workouts]);

  const selectedWorkouts = selectedDate ? workoutsByDate[selectedDate] ?? [] : [];

  const openDay = (date: Date) => {
    setEditingWorkoutId(null);
    setSelectedDate(makeDateKey(date));
  };

  const closeSheet = () => {
    setSelectedDate(null);
    setEditingWorkoutId(null);
    setEditingNotes('');
  };

  const addWorkout = () => {
    if (!selectedDate) {
      return;
    }

    const newWorkout: Workout = {
      id: `w-${Date.now()}`,
      date: selectedDate,
      type: 'Run',
      duration: '30 min',
      notes: 'New workout added from the day sheet.',
      mood: 'Motivated ⚡️',
    };

    setWorkouts((current) => [newWorkout, ...current]);
  };

  const removeWorkout = (workoutId: string) => {
    setWorkouts((current) => current.filter((workout) => workout.id !== workoutId));

    if (editingWorkoutId === workoutId) {
      setEditingWorkoutId(null);
      setEditingNotes('');
    }
  };

  const startEdit = (workout: Workout) => {
    setEditingWorkoutId(workout.id);
    setEditingNotes(workout.notes);
  };

  const saveEdit = () => {
    if (!editingWorkoutId) {
      return;
    }

    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === editingWorkoutId
          ? {
              ...workout,
              notes: editingNotes.trim() || workout.notes,
            }
          : workout,
      ),
    );

    setEditingWorkoutId(null);
    setEditingNotes('');
  };

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#0E1016' : '#F4F6FF' }]}>
      <Text style={[styles.title, { color: dark ? '#F7F8FD' : '#12152A' }]}>Training Calendar</Text>
      <Text style={[styles.subtitle, { color: dark ? '#B4BACD' : '#66708A' }]}>Tap any day to open details</Text>

      <View style={[styles.monthHeader, { backgroundColor: dark ? '#171A24' : '#FFFFFF' }]}>
        <Pressable
          style={[styles.navButton, { backgroundColor: dark ? '#242838' : '#EFF3FF' }]}
          onPress={() =>
            setVisibleMonth((current) =>
              new Date(current.getFullYear(), current.getMonth() - 1, 1),
            )
          }>
          <Text style={[styles.navText, { color: dark ? '#E5E9F9' : '#3D4A6B' }]}>‹</Text>
        </Pressable>
        <Text style={[styles.monthLabel, { color: dark ? '#F7F8FD' : '#12152A' }]}>{monthTitle}</Text>
        <Pressable
          style={[styles.navButton, { backgroundColor: dark ? '#242838' : '#EFF3FF' }]}
          onPress={() =>
            setVisibleMonth((current) =>
              new Date(current.getFullYear(), current.getMonth() + 1, 1),
            )
          }>
          <Text style={[styles.navText, { color: dark ? '#E5E9F9' : '#3D4A6B' }]}>›</Text>
        </Pressable>
      </View>

      <View style={[styles.calendarCard, { backgroundColor: dark ? '#171A24' : '#FFFFFF' }]}>
        <View style={styles.weekRow}>
          {WEEK_DAYS.map((day) => (
            <Text key={day} style={[styles.weekLabel, { color: dark ? '#8B93AA' : '#8C94AB' }]}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {monthGrid.map(({ date, inCurrentMonth }) => {
            const dateKey = makeDateKey(date);
            const dayWorkouts = workoutsByDate[dateKey] ?? [];
            const previewWorkout = dayWorkouts[0];

            return (
              <Pressable
                key={dateKey}
                onPress={() => openDay(date)}
                style={[
                  styles.dayCell,
                  {
                    backgroundColor: inCurrentMonth
                      ? dark
                        ? '#222635'
                        : '#F3F6FF'
                      : dark
                        ? '#161923'
                        : '#FAFBFF',
                    opacity: inCurrentMonth ? 1 : 0.55,
                  },
                ]}>
                <Text style={[styles.dayNumber, { color: dark ? '#F3F6FF' : '#1F2740' }]}>
                  {date.getDate()}
                </Text>
                <Text style={styles.dayPreview}>{previewWorkout ? TYPE_EMOJI[previewWorkout.type] : ''}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Modal visible={selectedDate !== null} transparent animationType="slide" onRequestClose={closeSheet}>
        <Pressable style={styles.backdrop} onPress={closeSheet}>
          <Pressable
            onPress={() => null}
            style={[styles.sheet, { backgroundColor: dark ? '#151923' : '#FFFFFF' }]}>
            <View style={[styles.grabber, { backgroundColor: dark ? '#343B50' : '#DDE3F4' }]} />
            <Text style={[styles.sheetTitle, { color: dark ? '#F7F8FD' : '#101428' }]}>
              {selectedDate ? formatSelectedDate(selectedDate) : ''}
            </Text>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              {selectedWorkouts.length === 0 ? (
                <Text style={[styles.emptyState, { color: dark ? '#A1A9C0' : '#6B748D' }]}>
                  No workouts logged. Add one and keep the streak alive 🌟
                </Text>
              ) : (
                selectedWorkouts.map((workout) => {
                  const isEditing = editingWorkoutId === workout.id;

                  return (
                    <View
                      key={workout.id}
                      style={[
                        styles.workoutCard,
                        {
                          backgroundColor: dark ? '#202637' : '#F5F8FF',
                          borderColor: `${TYPE_COLOR[workout.type]}44`,
                        },
                      ]}>
                      <View style={styles.workoutHeader}>
                        <Text style={[styles.workoutType, { color: TYPE_COLOR[workout.type] }]}>
                          {TYPE_EMOJI[workout.type]} {workout.type}
                        </Text>
                        <Text style={[styles.workoutDuration, { color: dark ? '#E0E6FA' : '#2B3658' }]}>
                          {workout.duration}
                        </Text>
                      </View>

                      {isEditing ? (
                        <TextInput
                          value={editingNotes}
                          onChangeText={setEditingNotes}
                          placeholder="Update notes"
                          multiline
                          style={[
                            styles.editInput,
                            {
                              color: dark ? '#F2F5FF' : '#141A2D',
                              backgroundColor: dark ? '#151A28' : '#FFFFFF',
                            },
                          ]}
                          placeholderTextColor={dark ? '#8F97B0' : '#949CB4'}
                        />
                      ) : (
                        <Text style={[styles.workoutText, { color: dark ? '#D4DAEF' : '#3D486A' }]}>
                          Notes: {workout.notes}
                        </Text>
                      )}

                      <Text style={[styles.workoutText, { color: dark ? '#D4DAEF' : '#3D486A' }]}>
                        Mood: {workout.mood ?? '—'}
                      </Text>

                      <View style={styles.workoutActions}>
                        {isEditing ? (
                          <Pressable
                            style={[styles.actionButton, { backgroundColor: dark ? '#5A73FF' : '#4167FF' }]}
                            onPress={saveEdit}>
                            <Text style={styles.actionButtonText}>Save</Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            style={[styles.actionButton, { backgroundColor: dark ? '#2D3550' : '#E8EEFF' }]}
                            onPress={() => startEdit(workout)}>
                            <Text
                              style={[
                                styles.actionButtonText,
                                { color: dark ? '#E8EDFF' : '#3C4F89' },
                              ]}>
                              Edit
                            </Text>
                          </Pressable>
                        )}

                        <Pressable
                          style={[styles.actionButton, { backgroundColor: dark ? '#4A232B' : '#FFE7EB' }]}
                          onPress={() => removeWorkout(workout.id)}>
                          <Text style={[styles.actionButtonText, { color: '#E5536D' }]}>Delete</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <Pressable
              style={[styles.addButton, { backgroundColor: dark ? '#6D7CFF' : '#4A67FF' }]}
              onPress={addWorkout}>
              <Text style={styles.addButtonText}>+ Add workout</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 15,
  },
  monthHeader: {
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 22,
    fontWeight: '600',
  },
  monthLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  calendarCard: {
    borderRadius: 26,
    padding: 12,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
  },
  dayCell: {
    width: '14.2857%',
    aspectRatio: 0.95,
    borderRadius: 16,
    marginVertical: 3,
    marginHorizontal: '0.5%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  dayPreview: {
    fontSize: 14,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(9, 12, 20, 0.52)',
  },
  sheet: {
    maxHeight: '84%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
  },
  grabber: {
    width: 44,
    height: 5,
    borderRadius: 99,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  sheetContent: {
    gap: 10,
    paddingBottom: 12,
  },
  emptyState: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  workoutCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  workoutType: {
    fontSize: 15,
    fontWeight: '800',
  },
  workoutDuration: {
    fontSize: 13,
    fontWeight: '700',
  },
  workoutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  editInput: {
    borderRadius: 12,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 9,
    minHeight: 62,
    textAlignVertical: 'top',
  },
  workoutActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  actionButton: {
    borderRadius: 11,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  addButton: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
