import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WORKOUT_META, WorkoutType } from '@/constants/workouts';

type WorkoutPillProps = {
  type: WorkoutType;
  active?: boolean;
  onPress?: () => void;
};

export function WorkoutPill({ type, active = false, onPress }: WorkoutPillProps) {
  const meta = WORKOUT_META[type];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          borderColor: meta.color,
          backgroundColor: active ? `${meta.color}22` : 'transparent',
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  label: {
    fontWeight: '700',
    fontSize: 13,
  },
});
