import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  originStateSelector,
  destinationStateSelector,
} from "../state/Directions.state";
import { GOOGLE_MAPS_APIKEY } from "@env";
import axios from "axios";
import tw from "tailwind-react-native-classnames";

type Intersection = { intersection: string };

const Directions = ({ intersections }: { intersections: Intersection[] }) => {
  const [origin, setOrigin] = useRecoilState(originStateSelector);
  const [destination, setDestination] = useRecoilState(
    destinationStateSelector
  );
  const crime_cross_streets = intersections;
  const [googleDistance, setGoogleDistance] = useState<number>();
  const [googleDuration, setGoogleDuration] = useState<number>();
  const [waypointsDistance, setWaypointsDistance] = useState<number>(5);
  const [waypointsDuration, setWaypointsDuration] = useState<number>(40);

  // get more details directions response from google
  const [googleDirections, setGoogleDirections] = useState<any>();
  const getDirectionsData = (startLoc: LatLng, endLoc: LatLng) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${endLoc.latitude},${endLoc.longitude}&mode=walking&units=imperial&key=${GOOGLE_MAPS_APIKEY}`
      )
      .then((response) => {
        setGoogleDirections(response);
        console.log("google directions", response);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  useEffect(() => {
    if (origin.latitude !== 0 && destination.latitude !== 0) {
      //   console.log(origin, destination);
      getDirectionsData(origin, destination);
    }
  }, [origin, destination]);

  // solutionA: use helper function to translate google data 'steps' into addresses
  const [googleSteps, setGoogleSteps] = useState<any>();
  useEffect(() => {
    if (googleDirections) {
      // pull the latlng start locations from each step
      const steps = googleDirections.data.routes[0].legs[0].steps;
      let points: LatLng[] = [];
      steps.map((step: { start_location: LatLng }) =>
        points.push(step.start_location)
      );
      console.log("steps", points);

      // translates point into address
      // const latLngToAddress = async (latlng: LatLng) => {
      //   const { latitude, longitude } = latlng;
      //   let addresses: [] = [];
      //   const res = await axios
      //     .get(
      //       `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`
      //     )
      //     .then((res) => {
      //       addresses.push(res.data.results[0].formatted_address);
      //     });
      //   return addresses;
      // };

      // get all the addresses from steps
      // let temp: any = [];
      // points.map((point) => temp.push(latLngToAddress(point)));
    }
  }, [googleDirections]);
  // solutionB: get html instructions of google directions and parse out street names
  useEffect(() => {
    if (googleDirections) {
      const steps = googleDirections.data.routes[0].legs[0].steps;
      const addresses = steps
        .map((step: { html_instructions: string }) => {
          return step.html_instructions;
        })
        .join("\n");
      // console.log(addresses);

      // parse out the streets and put into array
      let streets = [
        ...addresses.matchAll("<b>\\w+\\s+\\w+\\s*\\w*\\s*\\w*\\s*\\w*<\\/b>"),
      ];
      // console.log(streets);
    }
  }, [googleDirections]);

  // demo hardcoded data
  // if origin=Alamo and destination=Lafayette
  const AtoLwaypoints: LatLng[] = [
    { latitude: 37.779785159349025, longitude: -122.43025532076263 }, // steiner//webster
    { latitude: 37.781676384168165, longitude: -122.43048213214408 }, // webster//eddy
    { latitude: 37.78208948747835, longitude: -122.42740041382972 }, // eddy//laguna
    { latitude: 37.78247409006583, longitude: -122.42414274997863 }, // eddy//gough
    { latitude: 37.790889810937266, longitude: -122.42585517701208 }, // gough//sacremento
  ];
  // patricia's green to city hall
  const PtoCwaypoints: LatLng[] = [
    { latitude: 37.77577750936979, longitude: -122.4242752026981 }, // pats green//fell
    { latitude: 37.77639567975192, longitude: -122.41940112137797 }, // fell//van ness
    { latitude: 37.778277755982174, longitude: -122.41982009685927 }, // van ness//grove
  ];
  // alamo square to jeferson park
  const AtoJwaypoints: LatLng[] = [
    { latitude: 37.77707308639091, longitude: -122.43653699205143 }, // scott//fulton
    { latitude: 37.77895091514949, longitude: -122.43690629127684 }, // scott/golden gate ave
    { latitude: 37.77970981690782, longitude: -122.43020966517578 }, // golden gate ave//webster
    { latitude: 37.781675141543126, longitude: -122.43055434445286 }, // webster//eddy
  ];
  // dolores park to target on folsom
  const DtoTwaypoints: LatLng[] = [
    { latitude: 37.75823130521337, longitude: -122.42579354672583 }, // dolores//20th
    { latitude: 37.75865963102936, longitude: -122.41907840592829 }, // 20th//mission
    { latitude: 37.758918879667036, longitude: -122.41475847448017 }, // 20th folsom
    { latitude: 37.76209741948808, longitude: -122.4150008468374 }, // folsom/18th
    { latitude: 37.76226108771772, longitude: -122.41284486967967 }, // 18th//harrison
    { latitude: 37.76869538887952, longitude: -122.41349341823845 }, // harrison//14th
  ];

  const reset = () => {
    setOrigin({ latitude: 0, longitude: 0 });
    setDestination({ latitude: 0, longitude: 0 });
    setGoogleDirections(null);
    setGoogleSteps(null);
  };

  useEffect(() => {
    console.log("something happened");
  }, [origin, destination]);

  // tw`flex items-center justify-center h-full w-1/2

  return (
    <>
      {origin.latitude !== 0 && (
        <SafeAreaView style={tw``}>
          {/* back button */}
          <TouchableOpacity onPress={reset} style={tw`bg-white`}>
            <Text style={tw`text-lg font-light absolute top-12 left-7`}>
              {"< Back"}
            </Text>
          </TouchableOpacity>
          {/* <View style={tw`flex flex-row`}> */}
          {/* fastest route */}
          {/* <Text
              style={tw`absolute left-20 top-20 text-blue-500 font-semibold pb-2`}
            >
              Fastest
            </Text>
            <Text style={tw`absolute left-20 top-24 text-xl`}>
              {googleDistance} mi
            </Text>
            <Text style={tw`absolute left-20 top-28 text-xl`}>
              {googleDuration} mins
            </Text>
            {/* safest route */}
          {/* <View style={tw`absolute top-20 right-20 border-2 border-blue-400`}>
              <Text style={tw`text-green-500 font-semibold pb-2`}>Safest</Text>
              <Text style={tw`text-xl`}>{waypointsDistance} mi</Text>
              <Text style={tw`text-xl`}>{waypointsDuration} mins</Text>
            </View>  */}
          {/* </View> */}
        </SafeAreaView>
      )}
      {/* fastest directions */}
      <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor={"#3b83f6"}
        mode={"WALKING"}
        onReady={(result) => {
          console.log("routing");
          setGoogleDistance(Math.round(result.distance * 0.62137 * 100) / 100); // turns km into miles and rounds to 2 decimal places
          setGoogleDuration(Math.round(result.duration));
        }}
        onError={(error) => {
          console.log("googleError", error);
        }}
      />
      {/* safety waypoints */}
      {/* <MapViewDirections
        waypoints={PtoCwaypoints}
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor={"#9DE267"}
        // mode={"WALKING"}
        onReady={(result) => {
          console.log("waypoints routing");
          // setGoogleDistance(result.distance);
          // setGoogleDuration(result.duration);
        }}
        onError={(error) => {
          console.log("waypoints googleError", error);
        }}
      /> */}
    </>
  );
};

export default Directions;
