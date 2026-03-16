import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { WorkoutEntry, WorkoutType } from './WorkoutDay';

type AddWorkoutModalProps = {
  visible: boolean;
  date: string;
  initialWorkout?: WorkoutEntry | null;
  onClose: () => void;
  onSave: (workout: Omit<WorkoutEntry, 'id'>, idToReplace?: string) => void;
};

const typeOptions: { value: WorkoutType; label: string; icon: string; color: string }[] = [
  { value: 'run', label: 'Run', icon: '🏃', color: '#34C759' },
  { value: 'tennis', label: 'Tennis', icon: '🎾', color: '#FF9F0A' },
  { value: 'gym', label: 'Gym', icon: '🏋️', color: '#0A84FF' },
  { value: 'mobility', label: 'Mobility', icon: '🧘', color: '#BF5AF2' },
  { value: 'rest', label: 'Rest', icon: '🌙', color: '#8E8E93' },
];

export function AddWorkoutModal({ visible, date, initialWorkout, onClose, onSave }: AddWorkoutModalProps) {
  const [selectedType, setSelectedType] = useState<WorkoutType>('run');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialWorkout) {
      setSelectedType(initialWorkout.type);
      setDuration(initialWorkout.duration);
      setNotes(initialWorkout.notes);
      return;
    }

    setSelectedType('run');
    setDuration('');
    setNotes('');
  }, [initialWorkout, visible]);

  const title = useMemo(() => (initialWorkout ? 'Edit Workout' : 'Add Workout'), [initialWorkout]);

  const saveWorkout = () => {
    onSave(
      {
        type: selectedType,
        duration: duration.trim(),
        notes: notes.trim(),
        date,
      },
      initialWorkout?.id,
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.dateText}>Date: {date}</Text>

          <Text style={styles.label}>Workout type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
            {typeOptions.map((option) => {
              const selected = selectedType === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.typeChip, selected && { backgroundColor: option.color }]}
                  onPress={() => setSelectedType(option.value)}
                >
                  <Text style={styles.chipIcon}>{option.icon}</Text>
                  <Text style={[styles.chipLabel, selected && styles.selectedChipLabel]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>Duration</Text>
          <TextInput
            placeholder="e.g. 45 min"
            placeholderTextColor="#8E8E93"
            value={duration}
            onChangeText={setDuration}
            style={styles.input}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            placeholder="How did it feel?"
            placeholderTextColor="#8E8E93"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, styles.notesInput]}
            multiline
          />

          <View style={styles.actions}>
            <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.actionText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.saveButton]} onPress={saveWorkout}>
              <Text style={[styles.actionText, styles.saveText]}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalCard: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: 32,
    gap: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  dateText: {
    color: '#8E8E93',
    marginBottom: 6,
  },
  label: {
    color: '#D1D1D6',
    fontWeight: '600',
    marginTop: 8,
  },
  typeRow: {
    gap: 8,
    paddingVertical: 4,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedChipLabel: {
    color: '#101012',
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2C2C2E',
  },
  saveButton: {
    backgroundColor: '#64D2FF',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveText: {
    color: '#04131A',
  },
});
