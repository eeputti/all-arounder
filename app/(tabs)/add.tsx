import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { WorkoutPill } from '@/components/WorkoutPill';
import { WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility', 'rest'];

export default function AddWorkoutScreen() {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  const [selectedType, setSelectedType] = useState<WorkoutType>('run');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState('45');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView style={[styles.container, { backgroundColor: dark ? '#0E0F13' : '#F4F6FD' }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: dark ? '#F8F9FD' : '#101424' }]}>Add Workout</Text>

      <SectionCard title="Session Details" subtitle="log your training">
        <Text style={[styles.fieldLabel, { color: dark ? '#DDE1EE' : '#2D3349' }]}>Date</Text>
        <TextInput
          style={[styles.input, { backgroundColor: dark ? '#1B1E28' : '#F5F7FC', color: dark ? '#F4F6FD' : '#171D2F' }]}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={dark ? '#878DA1' : '#8A90A4'}
        />

        <Text style={[styles.fieldLabel, { color: dark ? '#DDE1EE' : '#2D3349' }]}>Workout Type</Text>
        <View style={styles.pillsWrap}>
          {TYPES.map((type) => (
            <WorkoutPill key={type} type={type} active={selectedType === type} onPress={() => setSelectedType(type)} />
          ))}
        </View>

        <Text style={[styles.fieldLabel, { color: dark ? '#DDE1EE' : '#2D3349' }]}>Duration (min)</Text>
        <TextInput
          keyboardType="number-pad"
          value={duration}
          onChangeText={setDuration}
          style={[styles.input, { backgroundColor: dark ? '#1B1E28' : '#F5F7FC', color: dark ? '#F4F6FD' : '#171D2F' }]}
          placeholder="45"
          placeholderTextColor={dark ? '#878DA1' : '#8A90A4'}
        />

        <Text style={[styles.fieldLabel, { color: dark ? '#DDE1EE' : '#2D3349' }]}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.notesInput, { backgroundColor: dark ? '#1B1E28' : '#F5F7FC', color: dark ? '#F4F6FD' : '#171D2F' }]}
          placeholder="How did the session feel?"
          placeholderTextColor={dark ? '#878DA1' : '#8A90A4'}
        />
      </SectionCard>

      <Pressable style={[styles.saveButton, { backgroundColor: WORKOUT_META[selectedType].color }]}>
        <Text style={styles.saveText}>Save Workout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 74, paddingHorizontal: 16, paddingBottom: 28 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '700', marginBottom: 6, marginTop: 4 },
  input: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  saveButton: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
