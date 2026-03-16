export type Workout = {
  id: string;
  date: string;
  type: 'Run' | 'Gym' | 'Tennis' | 'Cycle' | 'Mobility' | 'Walk' | 'Swim' | 'Dance';
  duration: number;
  effort: 'Easy' | 'Moderate' | 'Hard';
  note: string;
};

export type Mood = 'energized' | 'calm' | 'strong' | 'tired' | 'joyful';

export const moodMeta: Record<Mood, { emoji: string; label: string; color: string }> = {
  energized: { emoji: '⚡', label: 'Energized', color: '#FFB238' },
  calm: { emoji: '🌿', label: 'Calm', color: '#4FD1C5' },
  strong: { emoji: '💪', label: 'Strong', color: '#8A7DFF' },
  tired: { emoji: '😮‍💨', label: 'Tired', color: '#F58FB2' },
  joyful: { emoji: '🌈', label: 'Joyful', color: '#7AE582' },
};

export const workouts: Workout[] = [
  { id: 'w1', date: '2026-10-01', type: 'Run', duration: 42, effort: 'Moderate', note: 'Sunset tempo with fun playlist.' },
  { id: 'w2', date: '2026-10-02', type: 'Gym', duration: 55, effort: 'Hard', note: 'Lower body + core confetti energy.' },
  { id: 'w3', date: '2026-10-03', type: 'Walk', duration: 30, effort: 'Easy', note: 'Coffee walk and fresh air.' },
  { id: 'w4', date: '2026-10-04', type: 'Tennis', duration: 80, effort: 'Hard', note: 'Fast rallies, huge grin.' },
  { id: 'w5', date: '2026-10-06', type: 'Mobility', duration: 25, effort: 'Easy', note: 'Hips + shoulders reset.' },
  { id: 'w6', date: '2026-10-06', type: 'Cycle', duration: 35, effort: 'Moderate', note: 'Rainy spin and rhythm.' },
  { id: 'w7', date: '2026-10-08', type: 'Run', duration: 28, effort: 'Easy', note: 'Bouncy shakeout run.' },
  { id: 'w8', date: '2026-10-09', type: 'Swim', duration: 40, effort: 'Moderate', note: 'Steady laps, calm breathing.' },
  { id: 'w9', date: '2026-10-11', type: 'Dance', duration: 45, effort: 'Moderate', note: 'Living room dance party.' },
  { id: 'w10', date: '2026-10-12', type: 'Gym', duration: 50, effort: 'Hard', note: 'Push day with PR high-five.' },
  { id: 'w11', date: '2026-10-14', type: 'Cycle', duration: 48, effort: 'Moderate', note: 'River loop and sunshine.' },
  { id: 'w12', date: '2026-10-15', type: 'Run', duration: 60, effort: 'Hard', note: 'Long run with negative split.' },
  { id: 'w13', date: '2026-10-17', type: 'Mobility', duration: 20, effort: 'Easy', note: 'Recovery stretch and foam roll.' },
  { id: 'w14', date: '2026-10-18', type: 'Tennis', duration: 75, effort: 'Hard', note: 'Weekend doubles fun.' },
  { id: 'w15', date: '2026-10-20', type: 'Walk', duration: 35, effort: 'Easy', note: 'Evening neighborhood walk.' },
  { id: 'w16', date: '2026-10-21', type: 'Gym', duration: 52, effort: 'Hard', note: 'Deadlift day sparkle.' },
  { id: 'w17', date: '2026-10-22', type: 'Run', duration: 32, effort: 'Moderate', note: 'Short intervals, big mood.' },
  { id: 'w18', date: '2026-10-24', type: 'Swim', duration: 45, effort: 'Moderate', note: 'Technique-focused session.' },
  { id: 'w19', date: '2026-10-25', type: 'Dance', duration: 40, effort: 'Easy', note: 'Stretch + dance cooldown.' },
  { id: 'w20', date: '2026-10-27', type: 'Cycle', duration: 55, effort: 'Hard', note: 'Hill repeats done!' },
  { id: 'w21', date: '2026-10-28', type: 'Mobility', duration: 25, effort: 'Easy', note: 'Gentle reset.' },
  { id: 'w22', date: '2026-10-29', type: 'Run', duration: 36, effort: 'Moderate', note: 'Golden hour cruise.' },
  { id: 'w23', date: '2026-10-30', type: 'Gym', duration: 47, effort: 'Moderate', note: 'Circuit and core.' },
];

export const moodsByDate: Record<string, Mood> = {
  '2026-10-01': 'energized',
  '2026-10-02': 'strong',
  '2026-10-03': 'calm',
  '2026-10-04': 'joyful',
  '2026-10-06': 'calm',
  '2026-10-08': 'energized',
  '2026-10-09': 'calm',
  '2026-10-11': 'joyful',
  '2026-10-12': 'strong',
  '2026-10-14': 'energized',
  '2026-10-15': 'strong',
  '2026-10-17': 'tired',
  '2026-10-18': 'joyful',
  '2026-10-20': 'calm',
  '2026-10-21': 'strong',
  '2026-10-22': 'energized',
  '2026-10-24': 'calm',
  '2026-10-25': 'joyful',
  '2026-10-27': 'strong',
  '2026-10-28': 'tired',
  '2026-10-29': 'energized',
  '2026-10-30': 'joyful',
};
