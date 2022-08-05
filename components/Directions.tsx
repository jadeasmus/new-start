import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import { useRecoilValue, useRecoilState } from "recoil";
import { originState, destinationState } from "../state/Directions.state";
import { GOOGLE_MAPS_APIKEY } from "@env";

type Props = {};

const Directions = (props: Props) => {
  const origin = useRecoilValue(originState);
  const destination = useRecoilValue(destinationState);

  const [distance, setDistance] = useState<number>();
  const [duration, setDuration] = useState<number>();
  return (
    <MapViewDirections
      origin={origin}
      destination={destination}
      apikey={GOOGLE_MAPS_APIKEY}
      strokeWidth={3}
      strokeColor={"#3b83f6"}
      mode={"WALKING"}
      onReady={(result) => {
        setDistance(result.distance);
        setDuration(result.duration);
      }}
      onError={(error) => {
        console.log("err", error);
      }}
    ></MapViewDirections>
  );
};

export default Directions;
