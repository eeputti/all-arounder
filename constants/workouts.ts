export type WorkoutType = 'run' | 'tennis' | 'gym' | 'mobility' | 'rest';

export type Workout = {
  id: string;
  date: string; // YYYY-MM-DD
  type: WorkoutType;
  duration: number;
  notes: string;
};

export const WORKOUT_META: Record<WorkoutType, { label: string; color: string; emoji: string }> = {
  run: { label: 'Run', color: '#35C759', emoji: '🏃' },
  tennis: { label: 'Tennis', color: '#FF9F0A', emoji: '🎾' },
  gym: { label: 'Gym', color: '#0A84FF', emoji: '🏋️' },
  mobility: { label: 'Mobility', color: '#BF5AF2', emoji: '🧘' },
  rest: { label: 'Rest', color: '#8E8E93', emoji: '😴' },
};

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const p = (n: number) => String(n).padStart(2, '0');
const d = (day: number) => `${year}-${p(month)}-${p(day)}`;

export const MOCK_WORKOUTS: Workout[] = [
  { id: 'w1', date: d(1), type: 'run', duration: 48, notes: 'Easy aerobic run by the river.' },
  { id: 'w2', date: d(2), type: 'gym', duration: 55, notes: 'Lower body strength + core finisher.' },
  { id: 'w3', date: d(3), type: 'mobility', duration: 25, notes: 'Hip and ankle mobility flow.' },
  { id: 'w4', date: d(4), type: 'tennis', duration: 90, notes: 'Singles practice, forehand focus.' },
  { id: 'w5', date: d(5), type: 'rest', duration: 0, notes: 'Recovery, hydration, and stretching.' },
  { id: 'w6', date: d(6), type: 'run', duration: 32, notes: 'Tempo intervals, felt sharp.' },
  { id: 'w7', date: d(7), type: 'gym', duration: 60, notes: 'Upper body push/pull.' },
  { id: 'w8', date: d(8), type: 'tennis', duration: 75, notes: 'Doubles session with friends.' },
  { id: 'w9', date: d(9), type: 'mobility', duration: 20, notes: 'Short recovery routine before bed.' },
  { id: 'w10', date: d(10), type: 'run', duration: 65, notes: 'Long run with negative split.' },
  { id: 'w11', date: d(11), type: 'gym', duration: 45, notes: 'Full body circuit, moderate load.' },
  { id: 'w12', date: d(12), type: 'tennis', duration: 80, notes: 'Serve mechanics and footwork.' },
  { id: 'w13', date: d(12), type: 'mobility', duration: 18, notes: 'Evening cooldown and stretching.' },
  { id: 'w14', date: d(13), type: 'rest', duration: 0, notes: 'Intentional full rest day.' },
  { id: 'w15', date: d(14), type: 'run', duration: 42, notes: 'Progression run + strides.' },
  { id: 'w16', date: d(15), type: 'gym', duration: 58, notes: 'Power work + unilateral accessories.' },
  { id: 'w17', date: d(16), type: 'tennis', duration: 95, notes: 'Match play, great intensity.' },
  { id: 'w18', date: d(17), type: 'mobility', duration: 30, notes: 'Shoulders and thoracic opener.' },
];
