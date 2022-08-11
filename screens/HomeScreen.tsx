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

type Props = {};

export default function HomeScreen({}: Props) {
  const { onRelease, shouldSetResponse } = useDismissKeyboard();
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
        <PlacesCard />
      </SafeAreaView>
      {/* footer */}
      {/* <SafeAreaView style={tw`h-20 w-full z-10`}>
        <Text style={tw`text-black`}>Footer</Text>
      </SafeAreaView> */}
    </KeyboardAvoidingView>
  );
}
