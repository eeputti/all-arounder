import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

type SectionCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const dark = scheme === 'dark';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: dark ? '#17181C' : '#FFFFFF', borderColor: dark ? '#23262D' : '#E8E8EF' },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: dark ? '#FAFAFC' : '#12131A' }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: dark ? '#A6A8B3' : '#6A6D79' }]}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  header: {
    marginBottom: 14,
    gap: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
});
