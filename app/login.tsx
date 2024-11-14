import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Strategy untuk menggunakan OAuth
enum Strategy {
  Google = "oauth_google",
  Facebook = "oauth_facebook",
}

const Page = () => {
  // Oauth strategies google
  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: Strategy.Google,
  });
  // Oauth strategies facebook
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: Strategy.Facebook,
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      console.log("Signed in", createdSessionId);

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (error) {
      console.error("Error starting OAuth flow", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Login or create an account.</Text>
      <Text style={styles.subText}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus,
        laudantium!
      </Text>

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput style={styles.input} placeholder="Email" />

      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.separatorView}>
        <View style={styles.separatorLine} />
        <Text style={styles.separator}>or</Text>
        <View style={styles.separatorLine} />
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Ionicons
            name="logo-google"
            size={24}
            color={"#000"}
            style={styles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Facebook)}
        >
          <Ionicons
            name="logo-facebook"
            size={24}
            color={"#000"}
            style={styles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 15,
    color: "#4f4f4f",
    textAlign: "center",
    marginBottom: 30,
  },
  inputLabel: {
    padding: 5,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  separatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  separator: {
    fontSize: 15,
    color: Colors.light.gray,
  },
  separatorLine: {
    flex: 1,
    borderBottomColor: "#333",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  btnIcon: {
    paddingRight: 10,
  },
});
