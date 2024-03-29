import { Stack } from 'expo-router';

export default function TabTwoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="session" options={{ headerShown: false }} />
    </Stack>
  );
}
