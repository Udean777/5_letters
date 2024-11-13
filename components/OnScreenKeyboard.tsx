import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onKeyPress: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

export const ENTER = "ENTER";
export const BACKSPACE = "BACKSPACE";

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  [ENTER, "z", "x", "c", "v", "b", "n", "m", BACKSPACE],
];

const OnScreenKeyboard = ({
  onKeyPress,
  greenLetters,
  yellowLetters,
  grayLetters,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const keyWidth = (width - 60) / keys[0].length;
  const keyHeight = 60;

  const isSpecialKey = (key: string) => [ENTER, BACKSPACE].includes(key);

  const isInLetters = (key: string) =>
    [...yellowLetters, ...greenLetters, ...grayLetters].includes(key);

  return (
    <View style={styles.container}>
      {keys.map((row, index) => (
        <View key={`row-${index}`} style={styles.row}>
          {row.map((key, keyIndx) => (
            <Pressable
              key={`key-${keyIndx}`}
              onPress={() => onKeyPress(key)}
              style={({ pressed }) => [
                styles.key,
                { width: keyWidth, height: keyHeight, backgroundColor: "#ddd" },
                isSpecialKey(key) && { width: keyWidth * 1.5 },
                {
                  backgroundColor: greenLetters.includes(key)
                    ? Colors.light.green
                    : yellowLetters.includes(key)
                    ? Colors.light.yellow
                    : grayLetters.includes(key)
                    ? Colors.light.gray
                    : "#ddd",
                },
                pressed && { backgroundColor: "#999" },
              ]}
            >
              <Text
                style={[
                  styles.keyText,
                  key === "ENTER" && { fontSize: 12 },
                  isInLetters(key) && { color: "#fff" },
                ]}
              >
                {isSpecialKey(key) ? (
                  key === "ENTER" ? (
                    "ENTER"
                  ) : (
                    <Ionicons
                      name="backspace-outline"
                      size={24}
                      color="black"
                    />
                  )
                ) : (
                  key
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default OnScreenKeyboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 6,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  keyText: {
    fontWeight: "900",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
