import { Stack } from 'expo-router';

export default function TrackerLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true }} />
    </Stack>
  );
}
