import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    title: "Welcome to the App",
    subtitle: "Discover features and get started quickly.",
    bg: "#4CAF50",
  },
  {
    title: "Track Your Progress",
    subtitle: "Monitor your learning journey with ease.",
    bg: "#2196F3",
  },
  {
    title: "Stay Motivated",
    subtitle: "Unlock achievements as you go!",
    bg: "#FF9800",
    showButton: true,
  },
];

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasLaunched", "true");
    router.replace("/(tabs)");
  };

  return (
    <Carousel
      width={width}
      height={height}
      data={slides}
      autoPlay={false}
      loop={false}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: item.bg }]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>

          {item.showButton && (
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#f0f0f0",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
