// import 'react-native-gesture-handler/jestSetup';

// jest.mock('react-native-reanimated', () => {
//   const Reanimated = require('react-native-reanimated/mock');

//   // The mock for `call` immediately calls the callback which is incorrect
//   // So we override it with a no-op
//   Reanimated.default.call = () => {};

//   return Reanimated;
// });

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("tailwind-rn", () => {
  const { View } = require("react-native");
  const originalModule = jest.requireActual("tailwind-rn");

  return {
    ...originalModule,
    TailwindProvider: View,
  };
});

jest.useFakeTimers();

// jest.spyOn(console, "warn").mockImplementation();
// jest.spyOn(console, "error").mockImplementation();

export {};
