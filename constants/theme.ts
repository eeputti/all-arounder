import { Platform } from 'react-native';

const tintColorLight = '#4D63FF';
const tintColorDark = '#8FA3FF';

export const Colors = {
  light: {
    text: '#141B33',
    background: '#F3F5FF',
    tint: tintColorLight,
    icon: '#7A8098',
    tabIconDefault: '#8B90A6',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: '#E5EAF8',
    cardShadow: 'rgba(36, 44, 88, 0.08)',
    mutedText: '#6A7392',
    inputBackground: '#F5F7FF',
    surfaceMuted: '#EEF2FF',
    modalBackdrop: 'rgba(12, 16, 34, 0.55)',
    success: '#37C977',
    danger: '#F05A67',
  },
  dark: {
    text: '#F5F7FF',
    background: '#090D1A',
    tint: tintColorDark,
    icon: '#9BA3C6',
    tabIconDefault: '#838CB0',
    tabIconSelected: tintColorDark,
    card: '#141A2C',
    cardBorder: '#252E49',
    cardShadow: 'rgba(2, 6, 23, 0.55)',
    mutedText: '#98A2C8',
    inputBackground: '#1B233B',
    surfaceMuted: '#1A2138',
    modalBackdrop: 'rgba(3, 6, 13, 0.72)',
    success: '#4EDB88',
    danger: '#FF6E7C',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
