import { StyleSheet, Text, View } from 'react-native';

import { YearlyActivityEntry } from '@/constants/yearlyActivity';
import { WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type YearlyActivityHeatmapProps = {
  data: YearlyActivityEntry[];
};

type Cell = {
  date: Date;
  entry?: YearlyActivityEntry;
};

const WEEK_LABELS = ['Mon', 'Wed', 'Fri'];

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

function buildHeatmapGrid(data: YearlyActivityEntry[]) {
  const lookup = new Map(data.map((entry) => [entry.date, entry]));
  const firstDate = new Date(data[0].date);
  const lastDate = new Date(data[data.length - 1].date);

  const cursor = startOfWeek(firstDate);
  const weeks: Cell[][] = [];

  while (cursor <= lastDate || cursor.getDay() !== 1) {
    const week: Cell[] = [];

    for (let i = 0; i < 7; i += 1) {
      const date = new Date(cursor);
      const key = date.toISOString().slice(0, 10);
      week.push({ date, entry: lookup.get(key) });
      cursor.setDate(cursor.getDate() + 1);
    }

    weeks.push(week);

    if (cursor > lastDate && cursor.getDay() === 1) {
      break;
    }
  }

  return weeks;
}

function cellColor(intensity: number, type: WorkoutType, dark: boolean) {
  if (intensity === 0) {
    return dark ? '#242734' : '#ECF0FA';
  }

  const alphas = [0, 0.3, 0.45, 0.7, 0.95];
  return hexToRgba(WORKOUT_META[type].color, alphas[intensity]);
}

export function YearlyActivityHeatmap({ data }: YearlyActivityHeatmapProps) {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const weeks = buildHeatmapGrid(data);
  const totalActiveDays = data.filter((entry) => entry.intensity > 0).length;

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={[styles.hero, { color: dark ? '#F8FAFF' : '#101629' }]}>{totalActiveDays} active days</Text>
        <Text style={[styles.caption, { color: dark ? '#9BA2B6' : '#687089' }]}>A whole year of sparkle ✨</Text>
      </View>

      <View style={styles.gridShell}>
        <View style={styles.weekdayLabels}>
          <Text style={[styles.weekday, { color: dark ? '#717A92' : '#98A0B7' }]}>{WEEK_LABELS[0]}</Text>
          <Text style={[styles.weekday, { color: dark ? '#717A92' : '#98A0B7' }]}>{WEEK_LABELS[1]}</Text>
          <Text style={[styles.weekday, { color: dark ? '#717A92' : '#98A0B7' }]}>{WEEK_LABELS[2]}</Text>
        </View>

        <View style={styles.weeks}>
          {weeks.map((week, index) => (
            <View key={`week-${index}`} style={styles.weekColumn}>
              {week.map((cell) => (
                <View
                  key={cell.date.toISOString()}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: cell.entry
                        ? cellColor(cell.entry.intensity, cell.entry.dominantType, dark)
                        : dark
                          ? '#1A1D27'
                          : '#F6F7FC',
                      borderColor: dark ? '#2D3140' : '#E3E8F4',
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.legendWrap}>
        <Text style={[styles.legendText, { color: dark ? '#98A0B7' : '#6B738A' }]}>Less</Text>
        {[0, 1, 2, 3, 4].map((level) => (
          <View
            key={`legend-${level}`}
            style={[
              styles.legendCell,
              {
                backgroundColor: level === 0 ? (dark ? '#242734' : '#ECF0FA') : cellColor(level, 'run', dark),
                borderColor: dark ? '#2D3140' : '#E3E8F4',
              },
            ]}
          />
        ))}
        <Text style={[styles.legendText, { color: dark ? '#98A0B7' : '#6B738A' }]}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hero: {
    fontSize: 22,
    fontWeight: '800',
  },
  caption: {
    fontSize: 13,
    fontWeight: '600',
  },
  gridShell: {
    flexDirection: 'row',
    gap: 8,
  },
  weekdayLabels: {
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  weekday: {
    fontSize: 11,
    fontWeight: '600',
  },
  weeks: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  weekColumn: {
    gap: 4,
  },
  cell: {
    width: 10,
    height: 10,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  legendWrap: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
