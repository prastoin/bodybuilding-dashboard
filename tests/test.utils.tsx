import { render } from "@testing-library/react-native";
import App from "../App";

export * from "@testing-library/react-native";
export const renderApp = () => {
  return render(<App />);
};

export const SERVER_ENDPOINT = `http://${process.env.SERVER_HOST!}:${process.env
  .SERVER_PORT!}`;
