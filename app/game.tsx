import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ROWS = 6;

const Page = () => {
  const colorScheme = useColorScheme();
  const bgColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;

  // State untuk set 6 row dan 5 kolom
  const [rows, setRows] = React.useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(""))
  );
  const [currRow, setCurrRow] = React.useState(0);
  const [currCol, setCurrCol] = React.useState(0);

  // State untuk set 6 row dan 5 kolom, dengan warna hijau jika hurufnya benar
  // dan warna kuning jika hurufnya benar tapi posisinya salah
  // dan warna abu-abu jika hurufnya dan posisinya salah
  const [greenLetters, setGreenLetters] = React.useState<string[]>(["a", "b"]);
  const [yellowLetters, setYellowLetters] = React.useState<string[]>([
    "c",
    "d",
  ]);
  const [grayLetters, setGrayLetters] = React.useState<string[]>(["e", "f"]);

  const addKey = (key: string) => {
    console.log("Addkey", key);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcons}>
              <Ionicons
                name="help-circle-outline"
                size={28}
                color={textColor}
              />
              <Ionicons name="podium-outline" size={28} color={textColor} />
              <Ionicons name="settings-sharp" size={28} color={textColor} />
            </View>
          ),
        }}
      />

      {/* Game Field */}
      <View style={styles.gameField}>
        {rows.map((row, index) => (
          <View style={styles.gameFieldRow} key={`row-${index}`}>
            {row.map((cell, cellIndex) => (
              <View
                style={[
                  styles.cell,
                  { borderColor: grayColor },
                  greenLetters.includes(cell) && { backgroundColor: "green" },
                  yellowLetters.includes(cell) && { backgroundColor: "yellow" },
                  grayLetters.includes(cell) && { backgroundColor: "gray" },
                ]}
                key={`cell-${cellIndex}`}
              >
                <Text style={[styles.cellText, { color: textColor }]}>
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Keyboard */}
      <OnScreenKeyboard
        grayLetters={grayLetters}
        yellowLetters={yellowLetters}
        greenLetters={greenLetters}
        onKeyPress={addKey}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  gameField: {
    alignItems: "center",
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: "row",
    gap: 8,
  },
  cell: {
    backgroundColor: "#fff",
    width: 62,
    height: 62,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  cellText: {
    fontSize: 30,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
});
