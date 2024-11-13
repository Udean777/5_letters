import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { allWords } from "@/utils/allWords";

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
  const [currCol, _setCurrCol] = React.useState(0);

  // State untuk set 6 row dan 5 kolom, dengan warna hijau jika hurufnya benar
  // dan warna kuning jika hurufnya benar tapi posisinya salah
  // dan warna abu-abu jika hurufnya dan posisinya salah
  const [greenLetters, setGreenLetters] = React.useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = React.useState<string[]>([]);
  const [grayLetters, setGrayLetters] = React.useState<string[]>([]);
  const [word, setWord] = React.useState<string>("pohon");
  const wordLetters = word.split("");

  const colStateRef = React.useRef<any>(currCol);
  const setCurrCol = (col: number) => {
    colStateRef.current = col;
    _setCurrCol(col);
  };

  const addKey = (key: string) => {
    console.log("Addkey", key);
    const newRows = [...rows.map((row) => [...row])];

    if (key === "ENTER") {
      checkWord();
    } else if (key === "BACKSPACE") {
      if (colStateRef.current === 0) {
        newRows[currRow][0] = "";
        setRows(newRows);
        return;
      }

      newRows[currRow][colStateRef.current - 1] = "";
      setRows(newRows);
      setCurrCol(colStateRef.current - 1);
    } else if (colStateRef.current >= newRows[currRow].length) {
      return;
    } else {
      newRows[currRow][colStateRef.current] = key;
      setRows(newRows);
      setCurrCol(colStateRef.current + 1);
    }
  };

  const checkWord = () => {
    const currentWord = rows[currRow].join("");

    if (currentWord.length < word.length) {
      console.log("Need 5 letters tho");
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log("Not a word");
    }

    const newGreenLetters: string[] = [];
    const newYellowLetters: string[] = [];
    const newGrayLetters: string[] = [];

    currentWord.split("").forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreenLetters.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellowLetters.push(letter);
      } else {
        newGrayLetters.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreenLetters]);
    setYellowLetters([...yellowLetters, ...newYellowLetters]);
    setGrayLetters([...grayLetters, ...newGrayLetters]);

    setTimeout(() => {
      if (currentWord === word) {
        console.log("You win");
      } else if (currRow + 1 >= rows.length) {
        console.log("You lose");
      }
    }, 1500);

    setCurrRow(currRow + 1);
    setCurrCol(0);
  };

  const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (currRow > rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        return Colors.light.green;
      } else if (wordLetters.includes(cell)) {
        return Colors.light.yellow;
      } else {
        return Colors.light.gray;
      }
    }

    return "transparent";
  };

  const getBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (currRow > rowIndex && cell !== "") {
      return getCellColor(cell, rowIndex, cellIndex);
    }

    return Colors.light.gray;
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
                  {
                    borderColor: getBorderColor(cell, index, cellIndex),
                    backgroundColor: getCellColor(cell, index, cellIndex),
                  },
                ]}
                key={`cell-${cellIndex}`}
              >
                <Text
                  style={[
                    styles.cellText,
                    { color: currRow > index ? "#fff" : "#000" },
                  ]}
                >
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
