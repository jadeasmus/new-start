declare module "../hooks/useDismissKeyboard" {
  export const shouldSetResponse: () => boolean;
  export const onRelease: () => void;
}
