import { Pressable, StyleSheet, Text, View } from 'react-native';

type WorkoutTypeCardProps = {
  icon: string;
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function WorkoutTypeCard({ icon, label, selected = false, onPress }: WorkoutTypeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}>
      <View style={[styles.iconBubble, selected && styles.iconBubbleSelected]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '31%',
    minHeight: 94,
    borderRadius: 24,
    backgroundColor: '#1B1B2A',
    borderWidth: 1,
    borderColor: '#2A2A3D',
    paddingVertical: 14,
  },
  cardSelected: {
    backgroundColor: '#2B2A4A',
    borderColor: '#8B7CFF',
    shadowColor: '#8B7CFF',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A3D',
  },
  iconBubbleSelected: {
    backgroundColor: '#8B7CFF33',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    color: '#D2D1E8',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});
