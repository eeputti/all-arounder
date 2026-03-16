export type WorkoutMood = 'amazing' | 'good' | 'okay' | 'tired' | 'exhausted';

export const MOOD_META: Record<WorkoutMood, { label: string; emoji: string; color: string; glow: string }> = {
  amazing: { label: 'Amazing', emoji: '🤩', color: '#7B7AFF', glow: '#A6A4FF' },
  good: { label: 'Good', emoji: '😊', color: '#4CD964', glow: '#8BF199' },
  okay: { label: 'Okay', emoji: '🙂', color: '#64D2FF', glow: '#99E6FF' },
  tired: { label: 'Tired', emoji: '🥱', color: '#FFB340', glow: '#FFD180' },
  exhausted: { label: 'Exhausted', emoji: '😵‍💫', color: '#FF6B6B', glow: '#FFA4A4' },
};

export const MOOD_OPTIONS = Object.keys(MOOD_META) as WorkoutMood[];
