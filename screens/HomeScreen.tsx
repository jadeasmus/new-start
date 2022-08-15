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

export default function HomeScreen() {
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
      {/* TODO: footer */}
    </KeyboardAvoidingView>
  );
}
