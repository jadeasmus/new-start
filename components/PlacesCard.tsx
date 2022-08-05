import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useRecoilState } from "recoil";
import {
  originStateSelector,
  destinationStateSelector,
} from "../state/Directions.state";
import { GOOGLE_MAPS_APIKEY } from "@env";

type Props = {};

export default function PlacesCard({}: Props) {
  const [orign, setOrigin] = useRecoilState(originStateSelector);
  const [destination, setDestination] = useRecoilState(
    destinationStateSelector
  );

  return (
    <View style={tw`h-full`}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
        <View style={tw`bg-white h-full rounded-sm`}>
          <Text style={tw`px-6 pt-8 pb-3 text-lg text-gray-600 font-light`}>
            Search San Francisco
          </Text>
          {/* google place autocomplete => origin */}
          <GooglePlacesAutocomplete
            nearbyPlacesAPI="GooglePlacesSearch"
            placeholder="Where from?"
            debounce={300}
            minLength={2}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
            fetchDetails={true}
            onPress={(data, details) => {
              if (details) {
                setOrigin({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }
            }}
            styles={{
              textInputContainer: {
                backgroundColor: "white",
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: 10,
                borderRadius: 6,
              },
              textInput: {
                color: "black",
                backgroundColor: "#F5F5F5",
                fontSize: 16,
                flexDirection: "row",
                alignItems: "center",
              },
              poweredContainer: {
                paddingHorizontal: 20,
                borderColor: "#F5F5F5",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              },
            }}
          ></GooglePlacesAutocomplete>
          {/* google place autocomplete => destination */}
          <GooglePlacesAutocomplete
            nearbyPlacesAPI="GooglePlacesSearch"
            placeholder="Where to?"
            minLength={2}
            enablePoweredByContainer={false}
            debounce={300}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
            fetchDetails={true}
            onPress={(data, details) => {
              if (details) {
                setDestination({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }
            }}
            styles={{
              textInputContainer: {
                backgroundColor: "white",
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: 20,
                borderRadius: 6,
              },
              textInput: {
                color: "black",
                backgroundColor: "#F5F5F5",
                fontSize: 16,
                flexDirection: "row",
                alignItems: "center",
              },
              poweredContainer: {
                paddingHorizontal: 20,
                borderColor: "#F5F5F5",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              },
            }}
          ></GooglePlacesAutocomplete>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
