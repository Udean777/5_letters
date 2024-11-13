import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Icon from "@/assets/images/wordle-icon.svg";
import { Link } from "expo-router";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import ThemedText from "@/components/ThemedText";

export default function Index() {
  const colorScheme = useColorScheme();
  const bgColor = Colors[colorScheme ?? "light"].background;
  const textColor = Colors[colorScheme ?? "light"].text;
  const { signOut } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Icon width={100} height={70} />
        <ThemedText style={styles.title}>5 Letters</ThemedText>
        <ThemedText style={styles.subTitle}>
          Get 6 chances to guess a 5 Letters word.
        </ThemedText>
      </View>

      <View style={styles.menu}>
        <Link
          href="/game"
          style={[
            styles.btn,
            { backgroundColor: colorScheme === "light" ? "#000" : "#4a4a4a" },
          ]}
          asChild
        >
          <TouchableOpacity>
            <Text style={[styles.btnText, styles.primaryText]}>Play</Text>
          </TouchableOpacity>
        </Link>

        <SignedOut>
          <Link
            href="/login"
            asChild
            style={[styles.btn, { borderColor: textColor }]}
          >
            <TouchableOpacity>
              <ThemedText style={styles.btnText}>Login</ThemedText>
            </TouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <TouchableOpacity
            onPress={() => signOut()}
            style={[styles.btn, { borderColor: textColor }]}
          >
            <ThemedText style={styles.btnText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </SignedIn>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerDate}>
          {format(new Date(), "MMM d, yyy")}
        </ThemedText>
        <ThemedText style={styles.footerText}>V 1.0.0</ThemedText>
        <ThemedText style={styles.footerText}>Made by @mah.code_</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 40,
    paddingHorizontal: 50,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: Fonts.FrankRuhlLibre_700Bold,
  },
  subTitle: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: Fonts.FrankRuhlLibre_500Medium,
  },
  menu: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    justifyContent: "center",
    borderRadius: 30,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
    width: "60%",
    maxWidth: 200,
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: "semibold",
    color: "#333",
    fontFamily: Fonts.FrankRuhlLibre_500Medium,
  },
  primaryText: {
    color: "#fff",
    fontFamily: Fonts.FrankRuhlLibre_500Medium,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerDate: {
    fontSize: 14,
    fontFamily: Fonts.FrankRuhlLibre_700Bold,
  },
  footerText: {
    fontSize: 14,
    fontFamily: Fonts.FrankRuhlLibre_500Medium,
  },
});
