import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { WORKOUT_META, Workout } from '@/constants/workouts';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  visible: boolean;
  selectedDate: string;
  workouts: Workout[];
  onClose: () => void;
};

export function DayDetailsModal({ visible, selectedDate, workouts, onClose }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: dark ? '#15161B' : '#FFFFFF', borderColor: dark ? '#2A2D37' : '#E6E8F0' },
          ]}>
          <View style={[styles.handle, { backgroundColor: dark ? '#343847' : '#D8DBE6' }]} />
          <Text style={[styles.title, { color: dark ? '#F9FAFF' : '#151726' }]}>{selectedDate}</Text>
          <ScrollView contentContainerStyle={styles.content}>
            {workouts.length === 0 ? (
              <Text style={[styles.empty, { color: dark ? '#9EA3B3' : '#6A7080' }]}>No workouts yet. Add one for this day.</Text>
            ) : (
              workouts.map((workout) => {
                const meta = WORKOUT_META[workout.type];
                return (
                  <View key={workout.id} style={[styles.item, { backgroundColor: `${meta.color}20` }]}>
                    <View style={styles.row}>
                      <Text style={[styles.badge, { color: meta.color }]}>{meta.label}</Text>
                      <Text style={[styles.duration, { color: dark ? '#D4D8E6' : '#313549' }]}>
                        {workout.duration ? `${workout.duration} min` : 'Recovery'}
                      </Text>
                    </View>
                    <Text style={[styles.notes, { color: dark ? '#DCE0ED' : '#2F3448' }]}>{workout.notes}</Text>
                  </View>
                );
              })
            )}
          </ScrollView>
          <View style={styles.footer}>
            <Pressable style={[styles.action, { backgroundColor: dark ? '#272B39' : '#EEF1FA' }]}>
              <Text style={[styles.actionText, { color: dark ? '#F0F2FA' : '#1A1F2F' }]}>Edit</Text>
            </Pressable>
            <Pressable style={[styles.action, { backgroundColor: '#FF3B301A' }]}>
              <Text style={[styles.actionText, { color: '#FF453A' }]}>Delete</Text>
            </Pressable>
            <Pressable style={[styles.action, { backgroundColor: dark ? '#285BFF' : '#2F6BFF' }]}>
              <Text style={[styles.actionText, { color: '#FFFFFF' }]}>Add Workout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 16,
    maxHeight: '72%',
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 99,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  content: {
    gap: 8,
    paddingBottom: 14,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
  },
  item: {
    borderRadius: 16,
    padding: 12,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    fontSize: 14,
    fontWeight: '700',
  },
  duration: {
    marginLeft: 'auto',
    fontSize: 13,
    fontWeight: '700',
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
