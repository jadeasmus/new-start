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
// import useGetCrimeInfo from "../hooks/useGetCrimeInfo";
import { supabase } from "../utils/supabase";
import "react-native-url-polyfill/auto"; // helps supabase work with react native
import { subDays } from "date-fns";
import ResultsScreen from "../screens/ResultsScreen";

export default function Map() {
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

  // if updated_at is not yesterday, we need to update the crime data
  const [updated_at, set_updated_at] = useState<string>("");
  const getUpdateInfo = async () => {
    const { data, error } = await supabase
      .from("crime_data_intersections")
      .select("updated_at")
      .limit(1); // only need one row

    if (data) {
      console.log("supabase", data);
      set_updated_at(data[0].updated_at);
    }
  };
  // TODO: calls the api and returns nothing
  const updateInfo = () => {
    console.log("pretend to update");
  };
  // get when last updated upon init load in
  useEffect(() => {
    getUpdateInfo();
  }, []);

  // get all the cross streets with crime counts greater than or equal to 7
  type Intersection = {
    intersection: string;
  };
  const [crimeData, setCrimeData] = useState<Intersection[]>([]);
  const getCrimeData = async () => {
    const { data, error } = await supabase
      .from("crime_data_intersections")
      .select("intersection")
      .gte("crime_count", 7);

    if (error) {
      console.log("supabase", error);
    } else if (data) {
      console.log("supabase", data);
      setCrimeData(data);
    }
  };

  // get the data, and update the data if older than yesterday
  useEffect(() => {
    let today = new Date();
    let yesterday = subDays(today, 1);
    if (updated_at !== yesterday.toISOString()) {
      // return outdated data for now, and then update the data
      getCrimeData();
      updateInfo();
    } else {
      // return up to date data
      getCrimeData();
    }
  }, [updated_at]);

  // zoom map to fit to markers
  const mapRef = useRef<MapView>(null);
  useEffect(() => {
    mapRef.current?.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 150, bottom: 90, left: 90, right: 90 },
      animated: true,
    });
  }, [origin, destination]);

  // zoom back out if origin and destination are reset
  useEffect(() => {
    if (!ready) {
      mapRef.current?.animateToRegion({
        latitude: 37.7804,
        longitude: -122.44516,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      });
    }
  }, [ready]);

  useEffect(() => {
    console.log(destination);
  }, [destination]);

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
        {/* directions */}
        {ready && <Directions intersections={crimeData} />}
      </MapView>
    </View>
  );
}
