import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddWorkoutModal } from '@/components/AddWorkoutModal';
import { WorkoutDay, WorkoutEntry, WorkoutType } from '@/components/WorkoutDay';

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WORKOUT_META: Record<WorkoutType, { icon: string; color: string; label: string }> = {
  run: { icon: '🏃', color: '#34C759', label: 'Run' },
  tennis: { icon: '🎾', color: '#FF9F0A', label: 'Tennis' },
  gym: { icon: '🏋️', color: '#0A84FF', label: 'Gym' },
  mobility: { icon: '🧘', color: '#BF5AF2', label: 'Mobility' },
  rest: { icon: '🌙', color: '#8E8E93', label: 'Rest' },
};

const padDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const monthTitle = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

const buildMonthGrid = (viewMonth: Date): CalendarDay[] => {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekDay = firstDay.getDay();

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i += 1) {
    const offset = i - startWeekDay;
    const date = new Date(year, month, 1 + offset);
    days.push({ date, inCurrentMonth: date.getMonth() === month });
  }

  return days;
};

const initialData: Record<string, WorkoutEntry[]> = {
  '2026-03-02': [{ id: 'w1', type: 'run', duration: '45 min', notes: 'Steady zone 2 run.', date: '2026-03-02' }],
  '2026-03-04': [
    { id: 'w2', type: 'gym', duration: '60 min', notes: 'Leg day + pull-ups.', date: '2026-03-04' },
    { id: 'w3', type: 'mobility', duration: '20 min', notes: 'Hips and ankles.', date: '2026-03-04' },
  ],
  '2026-03-06': [{ id: 'w4', type: 'tennis', duration: '90 min', notes: 'Serve and volley drills.', date: '2026-03-06' }],
  '2026-03-07': [{ id: 'w5', type: 'rest', duration: 'All day', notes: 'Recharge + walk.', date: '2026-03-07' }],
};

export default function CalendarScreen() {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [workoutsByDate, setWorkoutsByDate] = useState<Record<string, WorkoutEntry[]>>(initialData);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutEntry | null>(null);

  const todayKey = useMemo(() => padDate(new Date()), []);
  const days = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);

  const goToPreviousMonth = () => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const openDay = (dateKey: string) => {
    setSelectedDate(dateKey);
    setDayModalVisible(true);
  };

  const closeDayModal = () => {
    setDayModalVisible(false);
    setEditingWorkout(null);
  };

  const openAddWorkout = (workout?: WorkoutEntry) => {
    if (workout) {
      setEditingWorkout(workout);
    }
    setAddModalVisible(true);
  };

  const saveWorkout = (workoutData: Omit<WorkoutEntry, 'id'>, idToReplace?: string) => {
    setWorkoutsByDate((current) => {
      const existing = [...(current[workoutData.date] ?? [])];

      if (idToReplace) {
        const idx = existing.findIndex((workout) => workout.id === idToReplace);
        if (idx >= 0) {
          existing[idx] = { ...workoutData, id: idToReplace };
        }
      } else {
        existing.push({ ...workoutData, id: `${Date.now()}` });
      }

      return { ...current, [workoutData.date]: existing };
    });

    setAddModalVisible(false);
    setEditingWorkout(null);
  };

  const deleteWorkout = (date: string, id: string) => {
    setWorkoutsByDate((current) => {
      const nextList = (current[date] ?? []).filter((workout) => workout.id !== id);
      const next = { ...current };
      if (nextList.length > 0) {
        next[date] = nextList;
      } else {
        delete next[date];
      }
      return next;
    });
  };

  const selectedWorkouts = selectedDate ? workoutsByDate[selectedDate] ?? [] : [];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Training Calendar</Text>
      <Text style={styles.headerSubtitle}>Track every run, rally, lift, and recovery day ✨</Text>

      <View style={styles.monthHeaderCard}>
        <Pressable style={styles.monthNavButton} onPress={goToPreviousMonth}>
          <Text style={styles.monthNavText}>←</Text>
        </Pressable>

        <Text style={styles.monthTitle}>{monthTitle(visibleMonth)}</Text>

        <Pressable style={styles.monthNavButton} onPress={goToNextMonth}>
          <Text style={styles.monthNavText}>→</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map(({ date, inCurrentMonth }) => {
          const dateKey = padDate(date);
          return (
            <View style={styles.dayWrapper} key={dateKey}>
              <WorkoutDay
                day={date.getDate()}
                workouts={workoutsByDate[dateKey] ?? []}
                isCurrentMonth={inCurrentMonth}
                isToday={dateKey === todayKey}
                onPress={() => openDay(dateKey)}
              />
            </View>
          );
        })}
      </View>

      <Modal visible={dayModalVisible} transparent animationType="slide" onRequestClose={closeDayModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.dayModalCard}>
            <Text style={styles.dayModalTitle}>{selectedDate}</Text>
            <Text style={styles.dayModalSubtitle}>Your training sessions</Text>

            <ScrollView style={styles.workoutList} contentContainerStyle={styles.workoutListContent}>
              {selectedWorkouts.length === 0 && (
                <Text style={styles.emptyText}>No workouts yet. Add something playful! 🥳</Text>
              )}

              {selectedWorkouts.map((workout) => {
                const meta = WORKOUT_META[workout.type];
                return (
                  <View key={workout.id} style={styles.workoutCard}>
                    <View style={styles.workoutHeader}>
                      <View style={[styles.typeBadge, { backgroundColor: meta.color }]}>
                        <Text style={styles.typeBadgeText}>
                          {meta.icon} {meta.label}
                        </Text>
                      </View>
                      <Text style={styles.workoutDuration}>{workout.duration || 'No duration'}</Text>
                    </View>

                    {workout.notes ? <Text style={styles.workoutNotes}>{workout.notes}</Text> : null}

                    <View style={styles.workoutActions}>
                      <Pressable style={styles.secondaryAction} onPress={() => openAddWorkout(workout)}>
                        <Text style={styles.secondaryActionText}>Edit</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.secondaryAction, styles.deleteAction]}
                        onPress={() => deleteWorkout(workout.date, workout.id)}
                      >
                        <Text style={[styles.secondaryActionText, styles.deleteText]}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.bottomActions}>
              <Pressable style={[styles.bottomButton, styles.closeButton]} onPress={closeDayModal}>
                <Text style={styles.bottomButtonText}>Close</Text>
              </Pressable>
              <Pressable
                style={[styles.bottomButton, styles.addButton]}
                onPress={() => {
                  setEditingWorkout(null);
                  setAddModalVisible(true);
                }}
              >
                <Text style={[styles.bottomButtonText, styles.addButtonText]}>+ Add workout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <AddWorkoutModal
        visible={addModalVisible}
        date={selectedDate ?? todayKey}
        initialWorkout={editingWorkout}
        onClose={() => {
          setAddModalVisible(false);
          setEditingWorkout(null);
        }}
        onSave={saveWorkout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0D',
    paddingTop: 64,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: '#A6A6AB',
    fontSize: 15,
    marginTop: 4,
    marginBottom: 16,
  },
  monthHeaderCard: {
    backgroundColor: '#151517',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthTitle: {
    color: '#F2F2F7',
    fontSize: 22,
    fontWeight: '700',
  },
  monthNavButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#8E8E93',
    fontWeight: '600',
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
  },
  dayWrapper: {
    width: '14.2857%',
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  dayModalCard: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '84%',
  },
  dayModalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  dayModalSubtitle: {
    color: '#8E8E93',
    marginTop: 4,
    marginBottom: 12,
  },
  workoutList: {
    maxHeight: 420,
  },
  workoutListContent: {
    gap: 12,
    paddingBottom: 12,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 30,
  },
  workoutCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  typeBadge: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  typeBadgeText: {
    color: '#0F1012',
    fontWeight: '700',
  },
  workoutDuration: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  workoutNotes: {
    color: '#D1D1D6',
    lineHeight: 20,
  },
  workoutActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryAction: {
    backgroundColor: '#3A3A3C',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  secondaryActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteAction: {
    backgroundColor: '#522326',
  },
  deleteText: {
    color: '#FF9FA5',
  },
  bottomActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 13,
  },
  closeButton: {
    backgroundColor: '#2C2C2E',
  },
  addButton: {
    backgroundColor: '#7D7AFF',
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addButtonText: {
    color: '#F7F5FF',
  },
});
