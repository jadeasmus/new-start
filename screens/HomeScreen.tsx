import tw from "tailwind-react-native-classnames";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import Map from "../components/Map";
import PlacesCard from "../components/PlacesCard";

type Props = {};

export default function HomeScreen({}: Props) {
  return (
    <KeyboardAvoidingView behavior={"padding"} style={tw`h-full relative`}>
      {/* map */}
      <View style={tw`h-full`}>
        <Map />
      </View>
      {/* search */}
      <SafeAreaView style={tw`w-4/5 absolute left-6 top-16`}>
        <PlacesCard />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
