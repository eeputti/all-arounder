import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WORKOUT_META, Workout } from '@/constants/workouts';

type Props = {
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  workouts: Workout[];
  onPress: () => void;
};

export function CalendarDay({ dayNumber, isCurrentMonth, isToday, workouts, onPress }: Props) {
  const dayTextColor = !isCurrentMonth ? '#6E6784' : isToday ? '#1A1131' : '#F7F1FF';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell,
        isCurrentMonth ? styles.currentMonthCell : styles.otherMonthCell,
        isToday && styles.todayCell,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.dayLabel, { color: dayTextColor }]}>{dayNumber}</Text>

      <View style={styles.indicatorRow}>
        {workouts.slice(0, 3).map((workout) => {
          const meta = WORKOUT_META[workout.type];
          return (
            <View key={workout.id} style={[styles.indicatorBubble, { backgroundColor: meta.color }]}>
              <Text style={styles.indicatorEmoji}>{meta.emoji}</Text>
            </View>
          );
        })}

        {workouts.length > 3 ? (
          <View style={styles.moreBubble}>
            <Text style={styles.moreText}>+{workouts.length - 3}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: '13.5%',
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 6,
    paddingBottom: 7,
    justifyContent: 'space-between',
  },
  currentMonthCell: {
    backgroundColor: '#21243B',
    borderColor: '#2F3250',
    opacity: 1,
  },
  otherMonthCell: {
    backgroundColor: '#131624',
    borderColor: '#222540',
    opacity: 0.46,
  },
  todayCell: {
    backgroundColor: '#F4C9FF',
    borderColor: '#F7DCFF',
    shadowColor: '#F4C9FF',
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  pressed: { opacity: 0.78 },
  dayLabel: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 3,
    minHeight: 18,
    alignItems: 'flex-end',
  },
  indicatorBubble: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorEmoji: {
    fontSize: 8,
    lineHeight: 10,
  },
  moreBubble: {
    minWidth: 14,
    height: 14,
    paddingHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#8F7AB8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    color: '#F9F5FF',
    fontSize: 8,
    fontWeight: '800',
  },
});
