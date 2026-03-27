import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Manrope_500Medium, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';

import { ClipboardProvider } from '../src/context/ClipboardContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';
  const [loaded] = useFonts({
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <ClipboardProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: dark ? '#0b1220' : '#f8fafc' },
            headerTintColor: dark ? '#e2e8f0' : '#0f172a',
            headerTitleStyle: {
              fontFamily: 'Manrope_800ExtraBold',
              fontSize: 20,
            },
            contentStyle: { backgroundColor: dark ? '#020617' : '#f8fafc' },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Copy Board' }} />
          <Stack.Screen name="edit/[id]" options={{ title: 'Kaydi Duzenle' }} />
        </Stack>
      </ClipboardProvider>
    </GestureHandlerRootView>
  );
}
