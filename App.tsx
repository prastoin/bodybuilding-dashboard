import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { BottomTab } from "./navigation/RootStack";
import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";
import { AppContextProvider } from "./contexts/AppContext";
import { navigationRef } from "./navigation/RootNavigation";

function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <AppContextProvider>
        <NavigationContainer ref={navigationRef}>
          <BottomTab />
        </NavigationContainer>
      </AppContextProvider>
    </TailwindProvider>
  );
}

export default App;
