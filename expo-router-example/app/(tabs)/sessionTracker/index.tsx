import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function TabTwoScreen() {

  return (
    <View className='w-80 bg-white shadow rounded'>
      <Text className="text-red-600 font-bold">Session Tracker</Text>
      <Link href="/(tabs)/programBuilder">
        <Text>Go to home screen!</Text>
      </Link>
    </View>
  );
}