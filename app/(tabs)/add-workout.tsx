import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { MoodSelector } from '@/components/add-workout/MoodSelector';
import { WorkoutTypeCard } from '@/components/add-workout/WorkoutTypeCard';

type WorkoutType = 'run' | 'tennis' | 'gym' | 'mobility' | 'rest';

const workoutTypes: { id: WorkoutType; label: string; icon: string }[] = [
  { id: 'run', label: 'run', icon: '🏃‍♀️' },
  { id: 'tennis', label: 'tennis', icon: '🎾' },
  { id: 'gym', label: 'gym', icon: '🏋️' },
  { id: 'mobility', label: 'mobility', icon: '🧘' },
  { id: 'rest', label: 'rest', icon: '🛌' },
];

const moods = [
  { id: 'pumped', emoji: '🤩', label: 'Pumped' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'okay', emoji: '🙂', label: 'Okay' },
  { id: 'tired', emoji: '🥱', label: 'Tired' },
];

export default function AddWorkoutScreen() {
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [workoutType, setWorkoutType] = useState<WorkoutType>('run');
  const [duration, setDuration] = useState('45');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('good');

  const formattedDate = useMemo(
    () =>
      workoutDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    [workoutDate]
  );

  const shiftDate = (days: number) => {
    setWorkoutDate((prevDate) => {
      const updated = new Date(prevDate);
      updated.setDate(updated.getDate() + days);
      return updated;
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Workout</Text>
        <Text style={styles.subtitle}>Capture today’s movement in a few joyful taps.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Workout Date</Text>
          <View style={styles.dateRow}>
            <Pressable onPress={() => shiftDate(-1)} style={styles.dateArrow}>
              <Text style={styles.dateArrowText}>‹</Text>
            </Pressable>
            <View style={styles.dateValuePill}>
              <Text style={styles.dateValueText}>{formattedDate}</Text>
            </View>
            <Pressable onPress={() => shiftDate(1)} style={styles.dateArrow}>
              <Text style={styles.dateArrowText}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Workout Type</Text>
          <View style={styles.typeGrid}>
            {workoutTypes.map((type) => (
              <WorkoutTypeCard
                icon={type.icon}
                key={type.id}
                label={type.label}
                onPress={() => setWorkoutType(type.id)}
                selected={workoutType === type.id}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={setDuration}
            placeholder="e.g. 45"
            placeholderTextColor="#706E8C"
            style={styles.input}
            value={duration}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            multiline
            numberOfLines={4}
            onChangeText={setNotes}
            placeholder="How did it feel? Any highlights?"
            placeholderTextColor="#706E8C"
            style={[styles.input, styles.notesInput]}
            textAlignVertical="top"
            value={notes}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Mood</Text>
          <MoodSelector onSelectMood={setMood} options={moods} selectedMood={mood} />
        </View>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Workout ✨</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B0A14',
  },
  container: {
    paddingTop: 84,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.7,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    color: '#B7B4D9',
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#131221',
    borderWidth: 1,
    borderColor: '#25223B',
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E5E3F8',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222035',
  },
  dateArrowText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 24,
    marginTop: -1,
  },
  dateValuePill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#201F34',
  },
  dateValueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2B2942',
    backgroundColor: '#1A182C',
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  notesInput: {
    minHeight: 92,
  },
  saveButton: {
    marginTop: 4,
    borderRadius: 22,
    backgroundColor: '#8B7CFF',
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: '#8B7CFF',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
