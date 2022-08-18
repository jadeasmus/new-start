import React, { useEffect, useRef } from "react";
import { View, Text, SafeAreaView } from "react-native";
import tw from "tailwind-react-native-classnames";
import Directions from "../components/Directions";
import MapView, { Marker, LatLng } from "react-native-maps";
import { useRecoilState } from "recoil";
import {
  originStateSelector,
  destinationStateSelector,
} from "../state/Directions.state";

type Intersection = { intersection: string };

const ResultsScreen = ({ crimeData }: { crimeData: Intersection[] }) => {
  const [origin, setOrigin] = useRecoilState(originStateSelector);
  const [destination, setDestination] = useRecoilState(
    destinationStateSelector
  );

  // zoom map to fit to markers
  const mapRef = useRef<MapView>(null);
  useEffect(() => {
    console.log(origin, destination);
    mapRef.current?.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 190, bottom: 90, left: 90, right: 90 },
      animated: true,
    });
  }, [origin, destination]);

  return (
    <View>
      {/* left */}
      <SafeAreaView style={tw`h-full w-1/5 bg-white`}></SafeAreaView>
      {/* right */}
      <MapView
        ref={mapRef}
        style={tw`h-full w-4/5`}
        mapType="mutedStandard"
        // centered on SF
        initialRegion={{
          latitude: 37.7804,
          longitude: -122.44516,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {origin.latitude !== 0 && (
          <Marker
            coordinate={origin}
            draggable
            pinColor={"#FF796D"}
            onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
            identifier={"origin"}
          />
        )}
        {destination.latitude !== 0 && (
          <Marker
            coordinate={destination}
            draggable
            pinColor={"#FF796D"}
            onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}
            identifier={"destination"}
          />
        )}
        {origin.latitude !== 0 && destination.latitude !== 0 && (
          <Directions intersections={crimeData} />
        )}
      </MapView>
    </View>
  );
};

export default ResultsScreen;
