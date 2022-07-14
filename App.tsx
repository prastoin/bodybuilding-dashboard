import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Root } from "./navigation/RootStack";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Root />
    </NavigationContainer>
  );
}

export default App;
