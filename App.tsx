import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { RootStack } from "./navigation/RootStack";
import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";

function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </TailwindProvider>
  );
}

export default App;
