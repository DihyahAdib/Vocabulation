import { Tabs } from "expo-router";
import { IconSymbol } from "../../components/ui/IconSymbol";
import CustomTabBar from "../../components/ui/customTabBar";
export default function TabLayout() {
  return (
    <Tabs tabBar={(prop) => <CustomTabBar {...prop} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol name="plus.app.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="words"
        options={{
          title: "Words",
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol name="doc.text.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol name="line.horizontal.3" color={color} />,
        }}
      />
    </Tabs>
  );
}
