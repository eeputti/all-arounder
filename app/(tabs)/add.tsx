import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { WorkoutPill } from '@/components/WorkoutPill';
import { Colors } from '@/constants/theme';
import { WORKOUT_META, WorkoutType } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TYPES: WorkoutType[] = ['run', 'tennis', 'gym', 'mobility', 'rest'];

export default function AddWorkoutScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  const [selectedType, setSelectedType] = useState<WorkoutType>('run');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState('45');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: palette.text }]}>Add Workout</Text>
      <Text style={[styles.subtitle, { color: palette.mutedText }]}>Capture how you moved today.</Text>

      <SectionCard title="Session Details" subtitle="quick, clear, and consistent">
        <Text style={[styles.fieldLabel, { color: palette.text }]}>Date</Text>
        <TextInput
          style={[styles.input, { backgroundColor: palette.inputBackground, color: palette.text, borderColor: palette.cardBorder }]}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={palette.mutedText}
        />

        <Text style={[styles.fieldLabel, { color: palette.text }]}>Workout Type</Text>
        <View style={styles.pillsWrap}>
          {TYPES.map((type) => (
            <WorkoutPill key={type} type={type} active={selectedType === type} onPress={() => setSelectedType(type)} />
          ))}
        </View>

        <Text style={[styles.fieldLabel, { color: palette.text }]}>Duration (min)</Text>
        <TextInput
          keyboardType="number-pad"
          value={duration}
          onChangeText={setDuration}
          style={[styles.input, { backgroundColor: palette.inputBackground, color: palette.text, borderColor: palette.cardBorder }]}
          placeholder="45"
          placeholderTextColor={palette.mutedText}
        />

        <Text style={[styles.fieldLabel, { color: palette.text }]}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.notesInput, { backgroundColor: palette.inputBackground, color: palette.text, borderColor: palette.cardBorder }]}
          placeholder="How did the session feel?"
          placeholderTextColor={palette.mutedText}
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
  title: { fontSize: 34, fontWeight: '800', marginBottom: 4, letterSpacing: -0.6 },
  subtitle: { fontSize: 15, fontWeight: '600', marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '700', marginBottom: 7, marginTop: 4 },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
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
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 3,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
