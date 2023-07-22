import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View className='w-80 bg-white shadow rounded'>
      <Text className="text-red-600 font-bold">Tab Two</Text>
      <Link href="/(tabs)/two/whatever">Navigate to tab two stack sub screen</Link>
    </View>
  );
}