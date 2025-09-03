import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-bold">How did you find this page?!</Text>
        <Link href="/(tabs)/cards" className="mt-4 py-4">
          <Text className="text-sm text-blue-500 underline">
            Go to the home screen you rascal or contact an admin to help you find your way
          </Text>
        </Link>
      </View>
    </>
  );
}
