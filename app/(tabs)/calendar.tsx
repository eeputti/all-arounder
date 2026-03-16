import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CalendarDay } from '@/components/CalendarDay';
import { DayDetailsModal } from '@/components/DayDetailsModal';
import { WORKOUT_META, MOCK_WORKOUTS, Workout } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const iso = (date: Date) => date.toISOString().slice(0, 10);

const demoWorkouts: Record<string, WorkoutType[]> = {
  '2026-10-02': ['run'],
  '2026-10-04': ['gym'],
  '2026-10-07': ['tennis'],
  '2026-10-10': ['cycle'],
  '2026-10-12': ['run', 'swim'],
  '2026-10-16': ['swim'],
  '2026-10-19': ['gym', 'run'],
  '2026-10-23': ['football'],
  '2026-10-26': ['tennis'],
  '2026-10-29': ['run'],
};

function toKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonth(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function buildMonthGrid(viewMonth: Date): CalendarCell[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7;

  const cells: CalendarCell[] = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(year, month, i + 1 - mondayBasedOffset);
    cells.push({ date, inCurrentMonth: date.getMonth() === month });
  }

  return cells;
}

export default function CalendarScreen() {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const grid = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leading = (firstDay.getDay() + 6) % 7;

    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = leading; i > 0; i -= 1) {
      cells.push({ date: new Date(year, month, 1 - i), isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    const trailing = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= trailing; i += 1) {
      cells.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return cells;
  }, [selectedMonth]);

  const selectedWorkouts: Workout[] = selectedDate
    ? MOCK_WORKOUTS.filter((workout) => workout.date === selectedDate)
    : [];

  const monthTitle = selectedMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <ScrollView style={[styles.container, { backgroundColor: dark ? '#0E0F13' : '#F4F6FD' }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: dark ? '#F8F9FD' : '#111423' }]}>Training Calendar</Text>

      <View style={styles.monthHeader}>
        <Pressable
          onPress={() => setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          style={[styles.monthButton, { backgroundColor: dark ? '#191B23' : '#FFFFFF' }]}>
          <Text style={[styles.monthButtonText, { color: dark ? '#D7DBE9' : '#27304A' }]}>‹</Text>
        </Pressable>
        <Text style={[styles.monthTitle, { color: dark ? '#F8F9FD' : '#121628' }]}>{monthTitle}</Text>
        <Pressable
          onPress={() => setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          style={[styles.monthButton, { backgroundColor: dark ? '#191B23' : '#FFFFFF' }]}>
          <Text style={[styles.monthButtonText, { color: dark ? '#D7DBE9' : '#27304A' }]}>›</Text>
        </Pressable>
      </View>

      <View style={[styles.calendarCard, { backgroundColor: dark ? '#12141A' : '#FFFFFF', borderColor: dark ? '#242838' : '#E7E9F2' }]}>
        <View style={styles.weekRow}>
          {WEEKDAYS.map((day) => (
            <Text key={day} style={[styles.weekday, { color: dark ? '#9CA2B5' : '#697189' }]}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {grid.map((cell) => {
            const dateString = iso(cell.date);
            const workouts = MOCK_WORKOUTS.filter((workout) => workout.date === dateString);
            return (
              <CalendarDay
                key={dateString}
                dayNumber={cell.date.getDate()}
                isCurrentMonth={cell.isCurrentMonth}
                isToday={dateString === iso(today)}
                workouts={workouts}
                onPress={() => setSelectedDate(dateString)}
              />
            );
          })}
        </View>
      </View>

      <View style={[styles.legendCard, { backgroundColor: dark ? '#12141A' : '#FFFFFF', borderColor: dark ? '#242838' : '#E7E9F2' }]}>
        {Object.entries(WORKOUT_META).map(([type, meta]) => (
          <View key={type} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: meta.color }]} />
            <Text style={[styles.legendText, { color: dark ? '#E1E5F3' : '#2A2F43' }]}>{meta.label}</Text>
          </View>
        ))}
      </View>

      <DayDetailsModal
        visible={Boolean(selectedDate)}
        selectedDate={selectedDate ?? ''}
        workouts={selectedWorkouts}
        onClose={() => setSelectedDate(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 74, paddingHorizontal: 16, paddingBottom: 28 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 16 },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  monthButton: { width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  monthButtonText: { fontSize: 24, fontWeight: '500' },
  monthTitle: { fontSize: 20, fontWeight: '700' },
  calendarCard: { borderRadius: 24, padding: 12, borderWidth: 1 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weekday: { width: '13.7%', textAlign: 'center', fontSize: 12, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  legendCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 99 },
  legendText: { fontSize: 13, fontWeight: '600' },
});
