import React, { useState, useMemo, useRef, useEffect } from "react";
import { View } from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useRecoilState } from "recoil";
import {
  originStateSelector,
  destinationStateSelector,
} from "../state/Directions.state";
import Directions from "../components/Directions";

export default function Map() {
  const [region, setRegion] = useState({
    latitude: 37.76323196704869,
    longitude: -122.44242387859887,
  });
  const [origin, setOrigin] = useRecoilState(originStateSelector);
  const [destination, setDestination] = useRecoilState(
    destinationStateSelector
  );
  // if all origin and destination coords are filled, we are ready to route
  const ready = useMemo(() => {
    if (
      origin.latitude !== 0 &&
      origin.longitude !== 0 &&
      destination.latitude !== 0 &&
      destination.longitude !== 0
    ) {
      return true;
    } else {
      return false;
    }
  }, [origin, destination]);

  // zoom to fit to markers
  const mapRef = useRef<MapView>(null);
  useEffect(() => {
    console.log("zooming");
    mapRef.current?.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 60, bottom: 60, left: 60, right: 60 },
      animated: true,
    });
  }, [origin, destination]);

  return (
    <View>
      <MapView
        ref={mapRef}
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
        {ready && <Directions />}
      </MapView>
    </View>
  );
}
