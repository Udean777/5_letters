import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  FrankRuhlLibre_400Regular,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_700Bold,
  FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";
import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Platform, TouchableOpacity, useColorScheme } from "react-native";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Logo from "@/assets/images/nyt-logo.svg";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { tokenCache } from "@/utils/cache";
import Fonts from "@/constants/Fonts";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_400Regular,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_700Bold,
    FrankRuhlLibre_900Black,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="login"
                options={{
                  presentation: "modal",
                  headerShadowVisible: false,
                  headerTitle: () => <Logo width={150} height={40} />,
                  headerTitleAlign: "center",
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                      {Platform.OS === "android" ? (
                        <Ionicons
                          name="arrow-back"
                          size={26}
                          color={Colors.light.gray}
                        />
                      ) : (
                        <Ionicons
                          name="close"
                          size={26}
                          color={Colors.light.gray}
                        />
                      )}
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen
                name="game"
                options={{
                  headerBackTitle: "5 Letters",
                  headerTintColor: colorScheme === "dark" ? "#fff" : "#333",
                  headerTitleAlign: "center",
                  title: "",
                  headerBackTitleStyle: {
                    fontSize: 26,
                    fontFamily: Fonts.FrankRuhlLibre_700Bold,
                  },
                }}
              />
              <Stack.Screen
                name="end"
                options={{
                  presentation: "fullScreenModal",
                  title: "",
                  headerShadowVisible: false,
                  headerBackVisible: false,
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
