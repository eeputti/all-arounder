import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WORKOUT_META, Workout } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  workouts: Workout[];
  onPress: () => void;
};

export function CalendarDay({ dayNumber, isCurrentMonth, isToday, workouts, onPress }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const backgroundColor = isToday
    ? dark
      ? '#28398D'
      : '#DEE6FF'
    : dark
      ? '#17181C'
      : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell,
        {
          backgroundColor,
          borderColor: dark ? '#23262D' : '#E8E8EF',
          opacity: pressed ? 0.8 : isCurrentMonth ? 1 : 0.45,
        },
      ]}>
      <Text style={[styles.dayLabel, { color: dark ? '#FAFAFC' : '#13151F' }]}>{dayNumber}</Text>
      <View style={styles.dotRow}>
        {workouts.slice(0, 4).map((workout) => (
          <View key={workout.id} style={[styles.dot, { backgroundColor: WORKOUT_META[workout.type].color }]} />
        ))}
        {workouts.length > 4 ? <Text style={[styles.more, { color: dark ? '#B8BDCA' : '#666A78' }]}>+{workouts.length - 4}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: '13.7%',
    minHeight: 78,
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  dotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
  },
  more: {
    fontSize: 10,
    fontWeight: '700',
  },
});
