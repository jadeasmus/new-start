import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useRecoilValue, useRecoilState } from "recoil";
import { originState, destinationState } from "../state/Directions.state";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { supabase } from "../utils/supabase";
import "react-native-url-polyfill/auto"; // helps supabase work with react native
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
    console.log("calling supabase");
    getCrimeData();
    // if statement that checks updated_at
    // if: return data
    // else: call api to update data and return data
  }, []);

  const getCrimeData = async () => {
    const { data, error } = await supabase
      .from("crime_data_intersections")
      .select("updated_at")
      .limit(1); // only need one row

    if (error) {
      console.log("supabase", error);
    } else if (data) {
      console.log("supabase", data);
    } else {
      console.log("we fycked");
    }

    return data;
  };

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
      // console.log(addresses);
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
