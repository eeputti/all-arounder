import { WorkoutType } from '@/constants/workouts';

export type YearlyActivityEntry = {
  date: string;
  intensity: 0 | 1 | 2 | 3 | 4;
  dominantType: WorkoutType;
  sessions: number;
};

const ACTIVE_TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility'];

const pad = (value: number) => String(value).padStart(2, '0');

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function seededNoise(dayIndex: number) {
  const seed = Math.sin(dayIndex * 12.9898 + 78.233) * 43758.5453;
  return seed - Math.floor(seed);
}

export function generateYearlyActivityMockData(year = new Date().getFullYear()): YearlyActivityEntry[] {
  const first = new Date(year, 0, 1);
  const last = new Date(year, 11, 31);
  const entries: YearlyActivityEntry[] = [];

  for (
    let date = new Date(first), index = 0;
    date <= last;
    date.setDate(date.getDate() + 1), index += 1
  ) {
    const weekday = date.getDay();
    const weekendBoost = weekday === 0 || weekday === 6 ? 0.18 : 0;
    const wave = (Math.sin((index / 365) * Math.PI * 6) + 1) / 2;
    const chance = Math.min(0.86, 0.3 + wave * 0.48 + weekendBoost);
    const noise = seededNoise(index + year);
    const active = noise < chance;

    let sessions = 0;

    if (active) {
      const extraSession = seededNoise(index * 3 + year) > 0.82 ? 1 : 0;
      sessions = 1 + extraSession;
    }

    const intensity = Math.min(4, sessions * 2 + (seededNoise(index * 5 + year) > 0.68 ? 1 : 0)) as
      | 0
      | 1
      | 2
      | 3
      | 4;

    const dominantType = ACTIVE_TYPES[(index + Math.floor(seededNoise(index + 17) * 10)) % ACTIVE_TYPES.length];

    entries.push({
      date: toDateKey(new Date(date)),
      intensity: active ? intensity : 0,
      dominantType,
      sessions,
    });
  }

  return entries;
}

export const YEARLY_ACTIVITY_MOCK = generateYearlyActivityMockData();
