import { Pressable, StyleSheet, Text, View } from 'react-native';

type MoodOption = {
  id: string;
  emoji: string;
  label: string;
};

type MoodSelectorProps = {
  options: MoodOption[];
  selectedMood: string;
  onSelectMood: (moodId: string) => void;
};

export function MoodSelector({ options, selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = selectedMood === option.id;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={option.id}
            onPress={() => onSelectMood(option.id)}
            style={[styles.moodButton, selected && styles.moodButtonSelected]}>
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text style={[styles.moodLabel, selected && styles.moodLabelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#1B1B2A',
    borderWidth: 1,
    borderColor: '#2A2A3D',
    gap: 6,
  },
  moodButtonSelected: {
    borderColor: '#FF9EC8',
    backgroundColor: '#FF9EC822',
  },
  emoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B8B6D4',
  },
  moodLabelSelected: {
    color: '#FFFFFF',
  },
});
