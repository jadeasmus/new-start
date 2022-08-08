import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useRecoilValue, useRecoilState } from "recoil";
import { originState, destinationState } from "../state/Directions.state";
import { GOOGLE_MAPS_APIKEY } from "@env";
import axios from "axios";

const Directions = () => {
  const origin = useRecoilValue(originState);
  const destination = useRecoilValue(destinationState);
  const [googleDistance, setGoogleDistance] = useState<number>();
  const [googleDuration, setGoogleDuration] = useState<number>();

  // call supabase to get crime data
  // if supabase col updated_at is not at least yesterday,
  // then call api to tell it to update supabase data and return outdated data for now
  useEffect(() => {
    // call to supabase to get crime data
    // if statement that checks updated_at
    // if: return data
    // else: call api to update data and return data
  }, [origin, destination]);

  // const [crimeData, setCrimeData] = useState<any>();
  // const getCrimeData = () => {
  //   axios
  //     .get("http://localhost:3000/api/sfpd/getData") // dev version TODO: make prod version
  //     // .get("http://10.0.0.74:19000/api/sfpd/getData") // emulator ip address
  //     .then((response) => {
  //       setCrimeData(response);
  //       console.log("crime data", response);
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         console.log("response error", error.response);
  //         console.log(error.response.data);
  //         //   console.log(error.response.status);
  //         //   console.log(error.response.headers);
  //       } else if (error.request) {
  //         console.log("request error");
  //         console.log(error.request);
  //       } else {
  //         console.log("err", error.message);
  //       }
  //     });
  // };
  // TODO: currently returning a response error
  // if origin and destination are set: get crime data
  //   useEffect(() => {
  //     if (crimeData) return;
  //     if (origin.latitude !== 0 && destination.latitude !== 0) {
  //       getCrimeData();
  //     }
  //   }, [origin, destination]);

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

  // helper function to translate latlng to addresses
  const latlngToAddress = (latlng: LatLng) => {};

  // use helper function to translate google data 'steps' into addresses
  useEffect(() => {
    if (googleDirections) {
      const steps = googleDirections.data.routes[0].legs[0].steps;
      const addresses = steps
        .map((step: { html_instructions: string }) => {
          return step.html_instructions;
        })
        .join("\n");
      console.log(addresses);
    }
  }, [googleDirections]);

  return (
    // Google default fastest route
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
  );
};

export default Directions;
