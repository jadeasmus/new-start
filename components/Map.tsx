import React, { useState } from "react";
import { View } from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  originStateSelector,
  destinationStateSelector,
} from "../state/Directions.state";
import Directions from "../components/Directions";

type Props = {};

export default function Map({}: Props) {
  const [region, setRegion] = useState({
    latitude: 37.76323196704869,
    longitude: -122.44242387859887,
  });
  const [origin, setOrigin] = useRecoilState(originStateSelector);
  const [destination, setDestination] = useRecoilState(
    destinationStateSelector
  );

  return (
    <View>
      <MapView
        style={tw`h-full`}
        mapType="mutedStandard"
        // centered on SF
        initialRegion={{
          latitude: 37.7804,
          longitude: -122.44516,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {origin.latitude !== 0 && origin.latitude !== 0 ? (
          <Marker
            coordinate={origin}
            draggable
            pinColor={"#FF796D"}
            onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
            identifier={"origin"}
          />
        ) : null}
        {destination.latitude !== 0 && destination.longitude !== 0 ? (
          <Marker
            coordinate={destination}
            draggable
            pinColor={"#FF796D"}
            onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}
            identifier={"destination"}
          />
        ) : null}
        {/* directions */}
        <View style={tw``}>
          <Directions />
        </View>
      </MapView>
    </View>
  );
}
