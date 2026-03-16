import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type WorkoutPillProps = {
  type: WorkoutType;
  active?: boolean;
  onPress?: () => void;
};

export function WorkoutPill({ type, active = false, onPress }: WorkoutPillProps) {
  const meta = WORKOUT_META[type];
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          borderColor: active ? meta.color : palette.cardBorder,
          backgroundColor: active ? `${meta.color}22` : palette.surfaceMuted,
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.label, { color: active ? meta.color : palette.text }]}>{meta.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
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
