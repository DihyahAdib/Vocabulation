import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Cards() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Flash Cards</Text>
      <Text style={styles.title}>Create Flash Cards</Text>
      <Button title="Create" />
      <Button title="Word Bank" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c1c1c1ff",
  },
  card: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
