import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../utils/supabase";
import "react-native-url-polyfill/auto"; // helps supabase work with react native

type crimeUpdated = [{ updated_at: string }];

export default function CrimeData(): crimeUpdated {
  const [mostRecentUpdate, setMostRecentUpdate] = useState<crimeUpdated>([
    { updated_at: "" },
  ]);
  useEffect(() => {
    getCrimeData().then((res) => {
      setMostRecentUpdate(res);
    });
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
    return data as crimeUpdated;
  };

  return mostRecentUpdate;
}
