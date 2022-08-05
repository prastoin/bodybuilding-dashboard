import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { RootStack } from "./navigation/RootStack";
import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";
import { AppContextProvider } from "./contexts/AppContext";

function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <AppContextProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AppContextProvider>
    </TailwindProvider>
  );
}

export default App;
