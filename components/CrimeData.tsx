import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../utils/supabase";
import "react-native-url-polyfill/auto"; // helps supabase work with react native

export default function CrimeData() {
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
  return <div>CrimeData</div>;
}
