import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <LinearGradient
      colors={["#a7c7e7", "#b3e0ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBorder}
    >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const icon = options.tabBarIcon({ color: isFocused ? "#ffffffff" : "#888888ff" });
          const label = options.title !== undefined ? options.title : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButton}>
              {icon}
              {/* <Text style={{ color: isFocused ? '#ffffffff' : '#888888ff' }}>
              {label}
            </Text> */}
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBorder: {
    position: "absolute",
    bottom: "5%",
    left: "10%",
    right: "10%",
    height: 70,
    borderRadius: 26,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    height: 65,
    borderRadius: 26,
    backgroundColor: "#1E1E1E",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});

export default CustomTabBar;
