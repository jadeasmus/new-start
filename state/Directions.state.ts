import { atom, selector } from "recoil";
import { LatLng } from "react-native-maps";

export const originState = atom<LatLng>({
  key: "originState",
  default: {
    latitude: 0,
    longitude: 0,
  } as LatLng,
});

export const originStateSelector = selector<LatLng>({
  key: "originStateSelector",
  get: ({ get }) => get(originState),
  set: ({ set }, newVal) => set(originState, newVal),
});

export const destinationState = atom<LatLng>({
  key: "destinationState",
  default: {
    latitude: 0,
    longitude: 0,
  } as LatLng,
});

export const destinationStateSelector = selector<LatLng>({
  key: "destinationStateSelector",
  get: ({ get }) => get(destinationState),
  set: ({ set }, newVal) => set(destinationState, newVal),
});
