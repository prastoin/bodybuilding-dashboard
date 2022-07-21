import { render } from "@testing-library/react-native";
import App from "../App";

export * from "@testing-library/react-native";
export const renderApp = () => {
  return render(<App />);
};
