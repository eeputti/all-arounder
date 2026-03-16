import { Pressable, StyleSheet, Text, View } from 'react-native';

export type WorkoutType = 'run' | 'tennis' | 'gym' | 'mobility' | 'rest';

export type WorkoutEntry = {
  id: string;
  type: WorkoutType;
  duration: string;
  notes: string;
  date: string;
};

type WorkoutDayProps = {
  day: number;
  workouts: WorkoutEntry[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onPress: () => void;
};

const WORKOUT_STYLE: Record<WorkoutType, { color: string; icon: string }> = {
  run: { color: '#34C759', icon: '🏃' },
  tennis: { color: '#FF9F0A', icon: '🎾' },
  gym: { color: '#0A84FF', icon: '🏋️' },
  mobility: { color: '#BF5AF2', icon: '🧘' },
  rest: { color: '#8E8E93', icon: '🌙' },
};

export function WorkoutDay({ day, workouts, isCurrentMonth, isToday, onPress }: WorkoutDayProps) {
  const visibleWorkouts = workouts.slice(0, 3);
  const hiddenCount = workouts.length - visibleWorkouts.length;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cell,
        !isCurrentMonth && styles.fadedCell,
        isToday && styles.todayCell,
        pressed && styles.pressedCell,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.dayLabel, !isCurrentMonth && styles.fadedText, isToday && styles.todayText]}>
        {day}
      </Text>

      <View style={styles.indicatorRow}>
        {visibleWorkouts.map((workout) => (
          <View
            key={workout.id}
            style={[styles.dot, { backgroundColor: WORKOUT_STYLE[workout.type].color }]}
            accessibilityLabel={workout.type}
          >
            <Text style={styles.dotIcon}>{WORKOUT_STYLE[workout.type].icon}</Text>
          </View>
        ))}
        {hiddenCount > 0 && <Text style={styles.moreLabel}>+{hiddenCount}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    minHeight: 84,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fadedCell: {
    backgroundColor: '#141416',
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#64D2FF',
  },
  pressedCell: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  dayLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fadedText: {
    color: '#636366',
  },
  todayText: {
    color: '#64D2FF',
  },
  indicatorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotIcon: {
    fontSize: 10,
  },
  moreLabel: {
    color: '#D1D1D6',
    fontSize: 11,
    fontWeight: '600',
  },
});
