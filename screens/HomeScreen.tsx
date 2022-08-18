import tw from "tailwind-react-native-classnames";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import Map from "../components/Map";
import PlacesCard from "../components/PlacesCard";
import { useDismissKeyboard } from "../hooks/useDismissKeyboard.hook";
import { useRecoilState } from "recoil";
import {
  originStateSelector,
  destinationStateSelector,
} from "../state/Directions.state";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { onRelease, shouldSetResponse } = useDismissKeyboard();
  const [origin, setOrigin] = useRecoilState(originStateSelector);
  const [destination, setDestination] = useRecoilState(
    destinationStateSelector
  );
  const [showCard, setShowCard] = useState(true);

  useEffect(() => {
    if (
      origin.latitude !== 0 &&
      origin.longitude !== 0 &&
      destination.latitude !== 0 &&
      destination.longitude !== 0
    ) {
      setShowCard(false);
    } else {
      setShowCard(true);
    }
  }, [origin, destination]);

  return (
    <KeyboardAvoidingView behavior={"padding"} style={tw`h-full relative`}>
      {/* map */}
      <View
        style={tw`h-full`}
        onResponderRelease={onRelease}
        onStartShouldSetResponder={shouldSetResponse}
      >
        <Map />
      </View>
      {/* search */}
      <SafeAreaView style={tw`w-4/5 absolute left-6 top-16`}>
        {showCard && <PlacesCard />}
      </SafeAreaView>
      {/* {!showCard && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Results")} //TODO: declare type for this
          style={tw`absolute bottom-16 right-6 bg-blue-500 px-4 py-3 rounded-sm shadow-xl`}
        >
          <Text style={tw`text-white text-lg`}>Get Safe Directions</Text>
        </TouchableOpacity>
      )} */}
      {/* TODO: footer */}
    </KeyboardAvoidingView>
  );
}
