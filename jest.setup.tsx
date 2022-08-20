// import 'react-native-gesture-handler/jestSetup';

// jest.mock('react-native-reanimated', () => {
//   const Reanimated = require('react-native-reanimated/mock');

//   // The mock for `call` immediately calls the callback which is incorrect
//   // So we override it with a no-op
//   Reanimated.default.call = () => {};

//   return Reanimated;
// });

// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch";

import XMLHttpRequest from "xhr2";

global.XMLHttpRequest = XMLHttpRequest;

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

import { server } from "./tests/mocks/server";
// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
// Clean up after the tests are finished.
afterAll(() => server.close());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

jest.spyOn(console, "warn").mockImplementation();
jest.spyOn(console, "error").mockImplementation();
