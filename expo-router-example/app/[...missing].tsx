import { Link, router, Stack } from 'expo-router';
import { useRootNavigationState } from 'expo-router/src/hooks';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (rootNavigationState.key !== undefined) {
      // Would like to have a replace here but not working ?
      // Overall I don't like this solution
      // Keep an eye on following github issue https://github.com/expo/router/issues/740
      router.push('/(tabs)/home');
    }
  }, [rootNavigationState])


  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View>
        <Text >This screen doesn't exist.</Text>
        <Link href="/(tabs)/home">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}