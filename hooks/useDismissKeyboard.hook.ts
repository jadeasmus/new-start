import React from "react";
import { Keyboard, Platform } from "react-native";

type Returns = {
  shouldSetResponse: () => boolean;
  onRelease: () => void;
};

export function useDismissKeyboard(): Returns {
  const shouldSetResponse = () => (Platform.OS === "web" ? false : true);
  const onRelease = () => Keyboard.dismiss();

  return { shouldSetResponse, onRelease };
}
