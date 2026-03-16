import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { moodMeta, moodsByDate, workouts } from '@/constants/movement-data';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const workoutIcons: Record<string, string> = {
  Run: '🏃',
  Gym: '🏋️',
  Tennis: '🎾',
  Cycle: '🚴',
  Mobility: '🧘',
  Walk: '🚶',
  Swim: '🏊',
  Dance: '💃',
};

const currentMonth = new Date('2026-10-01');
const toKey = (date: Date) => date.toISOString().slice(0, 10);

const calendarCells = (() => {
  const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const firstWeekday = start.getDay();
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - firstWeekday + 1);
    return { date, inMonth: date.getMonth() === currentMonth.getMonth() };
  });
})();

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('2026-10-22');
  const [showDetail, setShowDetail] = useState(false);

  const workoutsByDate = useMemo(() => {
    return workouts.reduce<Record<string, typeof workouts>>((acc, workout) => {
      if (!acc[workout.date]) acc[workout.date] = [];
      acc[workout.date].push(workout);
      return acc;
    }, {});
  }, []);

  const selectedWorkouts = workoutsByDate[selectedDate] ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Movement Diary</Text>
      <Text style={styles.subtitle}>October 2026 · every dot is a tiny win ✨</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly calendar</Text>
        <View style={styles.weekRow}>
          {weekDays.map((day) => <Text key={day} style={styles.weekDay}>{day}</Text>)}
        </View>

        <View style={styles.grid}>
          {calendarCells.map(({ date, inMonth }) => {
            const key = toKey(date);
            const dayWorkouts = workoutsByDate[key] ?? [];
            const mood = moodsByDate[key];
            return (
              <Pressable
                key={key}
                onPress={() => {
                  setSelectedDate(key);
                  setShowDetail(true);
                }}
                style={[styles.cell, !inMonth && styles.outsideCell, key === selectedDate && styles.selectedCell]}
              >
                <Text style={[styles.dayNumber, !inMonth && styles.outsideText]}>{date.getDate()}</Text>
                <View style={styles.indicatorRow}>
                  {dayWorkouts.slice(0, 2).map((workout) => <Text key={workout.id} style={styles.indicatorEmoji}>{workoutIcons[workout.type]}</Text>)}
                  {dayWorkouts.length > 2 ? <Text style={styles.more}>+{dayWorkouts.length - 2}</Text> : null}
                  {mood ? <Text style={styles.mood}>{moodMeta[mood].emoji}</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mood tracking</Text>
        <Text style={styles.moodHeadline}>{moodsByDate[selectedDate] ? `${moodMeta[moodsByDate[selectedDate]].emoji} ${moodMeta[moodsByDate[selectedDate]].label}` : 'No mood logged yet'}</Text>
        <Text style={styles.moodSub}>Tap a day for workout details and emotional vibe.</Text>
      </View>

      <Modal visible={showDetail} transparent animationType="slide" onRequestClose={() => setShowDetail(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.cardTitle}>Day detail · {selectedDate}</Text>
            {selectedWorkouts.length === 0 ? <Text style={styles.empty}>Rest day. Gentle walk maybe? 🌙</Text> : null}
            <ScrollView style={{ maxHeight: 300 }} contentContainerStyle={{ gap: 8 }}>
              {selectedWorkouts.map((workout) => (
                <View key={workout.id} style={styles.workoutRow}>
                  <Text style={styles.workoutEmoji}>{workoutIcons[workout.type]}</Text>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutType}>{workout.type}</Text>
                    <Text style={styles.workoutMeta}>{workout.duration} min · {workout.effort}</Text>
                    <Text style={styles.workoutNote}>{workout.note}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <Pressable style={styles.closeBtn} onPress={() => setShowDetail(false)}>
              <Text style={styles.closeText}>Done ✨</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5FB' },
  content: { paddingTop: 70, paddingHorizontal: 16, paddingBottom: 36, gap: 14 },
  title: { fontSize: 34, fontWeight: '800', color: '#4B2C62' },
  subtitle: { color: '#8A5E9E', fontSize: 15, marginBottom: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 14, borderWidth: 2, borderColor: '#F2D4FF', gap: 10 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#5B3E75' },
  weekRow: { flexDirection: 'row' },
  weekDay: { flex: 1, textAlign: 'center', color: '#A37FB3', fontWeight: '600', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: { width: '13.5%', minHeight: 58, borderRadius: 14, backgroundColor: '#FDF1FF', padding: 4, justifyContent: 'space-between' },
  outsideCell: { opacity: 0.5 },
  selectedCell: { backgroundColor: '#F9D8FF', borderWidth: 1, borderColor: '#CD88E6' },
  dayNumber: { fontSize: 13, fontWeight: '700', color: '#5B3E75' },
  outsideText: { color: '#AA99B2' },
  indicatorRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 1 },
  indicatorEmoji: { fontSize: 11 },
  more: { fontSize: 10, color: '#8A5E9E', fontWeight: '700' },
  mood: { fontSize: 10 },
  moodHeadline: { fontSize: 22, fontWeight: '700', color: '#5B3E75' },
  moodSub: { color: '#8A5E9E' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, gap: 10 },
  empty: { color: '#8A5E9E' },
  workoutRow: { flexDirection: 'row', gap: 10, backgroundColor: '#FFF7E9', borderRadius: 16, padding: 10 },
  workoutEmoji: { fontSize: 20 },
  workoutInfo: { flex: 1, gap: 2 },
  workoutType: { color: '#5B3E75', fontSize: 16, fontWeight: '700' },
  workoutMeta: { color: '#7D5B8F', fontWeight: '600' },
  workoutNote: { color: '#946EA7' },
  closeBtn: { backgroundColor: '#F6D0FF', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  closeText: { color: '#5B3E75', fontWeight: '700' },
});
