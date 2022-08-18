import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { RecoilRoot } from "recoil";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import ResultsScreen from "./screens/ResultsScreen";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
        {/* <HomeScreen /> */}
      </NavigationContainer>
    </RecoilRoot>
  );
}
