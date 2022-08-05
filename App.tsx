import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { RecoilRoot } from "recoil";

import HomeScreen from "./screens/HomeScreen";

export default function App() {
  return (
    <RecoilRoot>
      <HomeScreen />
    </RecoilRoot>
  );
}
