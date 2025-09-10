import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../components/global.css";

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [fontLoaded] = useFonts({
    Caviar: require("../assets/fonts/CaviarDreams.ttf"),
    Comfortaa: require("../assets/fonts/Comfortaa-Regular.ttf"),
    ComfortaaBold: require("../assets/fonts/Comfortaa-Bold.ttf"),
  });

  // TEMP: Clear hasLaunched on every app start for testing
  // useEffect(() => {
  //   AsyncStorage.removeItem("hasLaunched");
  // }, []);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      console.log("🚀 hasLaunched value:", hasLaunched);
      if (hasLaunched === null || hasLaunched === undefined) {
        setInitialRoute("welcome");
      } else {
        setInitialRoute("(tabs)");
      }
    };
    checkFirstLaunch();
  }, []);

  if (!fontLoaded) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack initialRouteName={initialRoute}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
