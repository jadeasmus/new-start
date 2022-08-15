import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useRecoilValue, useRecoilState } from "recoil";
import { originState, destinationState } from "../state/Directions.state";
import { GOOGLE_MAPS_APIKEY } from "@env";
import axios from "axios";

type Intersection = { intersection: string };

const Directions = ({ intersections }: { intersections: Intersection[] }) => {
  const origin = useRecoilValue(originState);
  const destination = useRecoilValue(destinationState);
  const crime_cross_streets = intersections;
  const [googleDistance, setGoogleDistance] = useState<number>();
  const [googleDuration, setGoogleDuration] = useState<number>();

  // get more details directions response from google
  const [googleDirections, setGoogleDirections] = useState<any>();
  const getDirectionsData = (startLoc: LatLng, endLoc: LatLng) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${endLoc.latitude},${endLoc.longitude}&mode=walking&units=imperial&key=${GOOGLE_MAPS_APIKEY}`
      )
      .then((response) => {
        setGoogleDirections(response);
        // console.log("google directions", response);
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
  const waypoints: LatLng[] = [
    { latitude: 37.779785159349025, longitude: -122.43025532076263 }, // steiner//webster
    { latitude: 37.781676384168165, longitude: -122.43048213214408 }, // webster//eddy
    { latitude: 37.78247409006583, longitude: -122.42414274997863 }, // eddy//gough
    { latitude: 37.790889810937266, longitude: -122.42585517701208 }, // gough//sacremento
  ];

  return (
    <>
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
          setGoogleDistance(result.distance);
          setGoogleDuration(result.duration);
        }}
        onError={(error) => {
          console.log("googleError", error);
        }}
      />
      {/* safety waypoints */}
      <MapViewDirections
        waypoints={waypoints}
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor={"#9DE267"}
        onReady={(result) => {
          console.log("waypoints routing");
          // setGoogleDistance(result.distance);
          // setGoogleDuration(result.duration);
        }}
        onError={(error) => {
          console.log("waypoints googleError", error);
        }}
      />
    </>
  );
};

export default Directions;
