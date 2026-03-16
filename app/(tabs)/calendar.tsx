import { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type WorkoutType = 'run' | 'gym' | 'tennis' | 'cycle' | 'swim' | 'football';

type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const workoutStyles: Record<WorkoutType, { label: string; color: string }> = {
  run: { label: 'Run', color: '#FF6B9D' },
  gym: { label: 'Gym', color: '#7A77FF' },
  tennis: { label: 'Tennis', color: '#3FD1FF' },
  cycle: { label: 'Cycle', color: '#FFB84C' },
  swim: { label: 'Swim', color: '#5DE8A5' },
  football: { label: 'Football', color: '#FF7C5C' },
};

const demoWorkouts: Record<string, WorkoutType[]> = {
  '2026-10-02': ['run'],
  '2026-10-04': ['gym'],
  '2026-10-07': ['tennis'],
  '2026-10-10': ['cycle'],
  '2026-10-12': ['run', 'swim'],
  '2026-10-16': ['swim'],
  '2026-10-19': ['gym', 'run'],
  '2026-10-23': ['football'],
  '2026-10-26': ['tennis'],
  '2026-10-29': ['run'],
};

function toKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
  const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 9, 1));
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const transition = useRef(new Animated.Value(1)).current;
  const todayKey = useMemo(() => toKey(new Date()), []);

  const calendarDays = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);

  const transitionMonth = (direction: 1 | -1) => {
    setTransitionDirection(direction);

    Animated.timing(transition, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
      transition.setValue(0);

      Animated.spring(transition, {
        toValue: 1,
        speed: 15,
        bounciness: 6,
        useNativeDriver: true,
      }).start();
    });
  };

  const animatedStyle = {
    opacity: transition,
    transform: [
      {
        translateX: transition.interpolate({
          inputRange: [0, 1],
          outputRange: [18 * transitionDirection, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Monthly Training Calendar</Text>
        <Text style={styles.subtitle}>Bright plans for a happy, active month</Text>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.monthHeader}>
          <Pressable style={styles.navButton} onPress={() => transitionMonth(-1)}>
            <Text style={styles.navButtonLabel}>‹</Text>
          </Pressable>
          <Text style={styles.monthLabel}>{formatMonth(visibleMonth)}</Text>
          <Pressable style={styles.navButton} onPress={() => transitionMonth(1)}>
            <Text style={styles.navButtonLabel}>›</Text>
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <Animated.View style={[styles.grid, animatedStyle]}>
          {calendarDays.map(({ date, inCurrentMonth }) => {
            const dateKey = toKey(date);
            const workouts = demoWorkouts[dateKey] ?? [];
            const isToday = dateKey === todayKey;

            return (
              <View
                key={dateKey}
                style={[
                  styles.cell,
                  !inCurrentMonth && styles.fadedCell,
                  isToday && styles.todayCell,
                ]}>
                <Text style={[styles.dayNumber, !inCurrentMonth && styles.fadedText, isToday && styles.todayText]}>
                  {date.getDate()}
                </Text>

                <View style={styles.pillsRow}>
                  {workouts.slice(0, 2).map((workout) => (
                    <View
                      key={`${dateKey}-${workout}`}
                      style={[styles.workoutPill, { backgroundColor: workoutStyles[workout].color }]}
                    >
                      <Text style={styles.workoutPillText}>{workoutStyles[workout].label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    paddingTop: 78,
    paddingHorizontal: 18,
  },
  headerWrap: {
    marginBottom: 16,
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    color: '#2D1E66',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 7,
    fontSize: 15,
    color: '#5D64A6',
    fontWeight: '600',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    shadowColor: '#5836BA',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
    elevation: 7,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthLabel: {
    fontSize: 21,
    fontWeight: '800',
    color: '#34206B',
  },
  navButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDE7FF',
  },
  navButtonLabel: {
    fontSize: 24,
    lineHeight: 24,
    color: '#6A4AD5',
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#7D7CAE',
    fontWeight: '700',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 9,
  },
  cell: {
    width: '13.3%',
    minHeight: 66,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 3,
    backgroundColor: '#F6F4FF',
    alignItems: 'center',
  },
  fadedCell: {
    backgroundColor: '#F5F2FA',
    opacity: 0.55,
  },
  todayCell: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#74D6FF',
    shadowColor: '#44CBFF',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 6,
  },
  dayNumber: {
    color: '#332B67',
    fontSize: 14,
    fontWeight: '800',
  },
  fadedText: {
    color: '#9A96B8',
  },
  todayText: {
    color: '#246AA8',
  },
  pillsRow: {
    width: '100%',
    marginTop: 4,
    alignItems: 'center',
    gap: 3,
  },
  workoutPill: {
    minWidth: '85%',
    borderRadius: 999,
    paddingVertical: 1,
    paddingHorizontal: 6,
  },
  workoutPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
});
