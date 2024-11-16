import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useRef } from "react";
import { Colors } from "@/constants/Colors";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { allWords } from "@/utils/allWords";
import ThemedText from "@/components/ThemedText";
import {
  BottomSheetMethods,
  BottomSheetModalMethods,
} from "@gorhom/bottom-sheet/lib/typescript/types";
import SettingsModal from "@/components/SettingsModal";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const ROWS = 6; // Baris maksimsal untuk game

const Page = () => {
  // Setup tema warna berdasarkan preferensi sistem (light/dark mode)
  const colorScheme = useColorScheme();
  const bgColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;

  const snapPoints = React.useMemo(() => ["50%"], []);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const handlePresentModalPress = () => {
    bottomSheetRef.current?.expand();
    console.log("Clicked");
  };

  // Inisialisasi state untuk grid permainan
  // Membuat array 2D dengan ROWS baris dan 5 kolom, diisi string kosong
  const [rows, setRows] = React.useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(""))
  );

  // State untuk tracking posisi input saat ini
  const [currRow, setCurrRow] = React.useState(0); // Baris aktif saat ini
  const [currCol, _setCurrCol] = React.useState(0); // Kolom aktif saat ini

  // State untuk tracking huruf-huruf yang sudah ditebak
  const [greenLetters, setGreenLetters] = React.useState<string[]>([]); // Huruf yang benar dan posisi benar
  const [yellowLetters, setYellowLetters] = React.useState<string[]>([]); // Huruf benar tapi posisi salah
  const [grayLetters, setGrayLetters] = React.useState<string[]>([]); // Huruf yang tidak ada dalam kata
  const [word, setWord] = React.useState<string>("pohon"); // Kata yang harus ditebak
  const wordLetters = word.split(""); // Array huruf dari kata yang harus ditebak

  // Menggunakan ref untuk menghindari closure issues dengan currCol dalam callbacks
  const colStateRef = React.useRef<any>(currCol);
  const setCurrCol = (col: number) => {
    colStateRef.current = col;
    _setCurrCol(col);
  };

  // Handler untuk input keyboard
  const addKey = (key: string) => {
    console.log("Addkey", key);
    const newRows = [...rows.map((row) => [...row])]; // Deep copy state rows

    if (key === "ENTER") {
      // Validasi kata yang diinput
      checkWord();
    } else if (key === "BACKSPACE") {
      // Logic untuk menghapus huruf
      if (colStateRef.current === 0) {
        // Jika di kolom pertama, hanya reset nilai
        newRows[currRow][0] = "";
        setRows(newRows);
        return;
      }

      // Hapus huruf dan mundur satu kolom
      newRows[currRow][colStateRef.current - 1] = "";
      setRows(newRows);
      setCurrCol(colStateRef.current - 1);
    } else if (colStateRef.current >= newRows[currRow].length) {
      // Jika sudah mencapai batas kolom, ignore input
      return;
    } else {
      // Tambahkan huruf ke grid dan maju satu kolom
      newRows[currRow][colStateRef.current] = key;
      setRows(newRows);
      setCurrCol(colStateRef.current + 1);
    }
  };

  // Logic untuk memeriksa kata yang diinput
  const checkWord = () => {
    const currentWord = rows[currRow].join(""); // Gabungkan huruf-huruf menjadi kata

    // Validasi panjang kata
    if (currentWord.length < word.length) {
      console.log("Need 5 letters tho");
      return;
    }

    // Validasi kata ada dalam daftar
    if (!allWords.includes(currentWord)) {
      console.log("Not a word");
    }

    // Arrays untuk menyimpan hasil pengecekan huruf
    const newGreenLetters: string[] = [];
    const newYellowLetters: string[] = [];
    const newGrayLetters: string[] = [];

    // Periksa setiap huruf
    currentWord.split("").forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        // Huruf benar di posisi yang benar
        newGreenLetters.push(letter);
      } else if (wordLetters.includes(letter)) {
        // Huruf benar tapi posisi salah
        newYellowLetters.push(letter);
      } else {
        // Huruf tidak ada dalam kata
        newGrayLetters.push(letter);
      }
    });

    // Update state dengan hasil pengecekan
    setGreenLetters([...greenLetters, ...newGreenLetters]);
    setYellowLetters([...yellowLetters, ...newYellowLetters]);
    setGrayLetters([...grayLetters, ...newGrayLetters]);

    // Cek kondisi menang/kalah
    setTimeout(() => {
      if (currentWord === word) {
        console.log("You win");
        router.push(
          `/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      } else if (currRow + 1 >= rows.length) {
        console.log("You lose");
        router.push(
          `/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      }
    }, 1500);

    // Pindah ke baris berikutnya
    setCurrRow(currRow + 1);
    setCurrCol(0);
  };

  // Fungsi untuk menentukan warna background cell
  const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (currRow > rowIndex) {
      // Hanya beri warna untuk baris yang sudah selesai
      if (wordLetters[cellIndex] === cell) {
        return Colors.light.green; // Huruf dan posisi benar
      } else if (wordLetters.includes(cell)) {
        return Colors.light.yellow; // Huruf benar, posisi salah
      } else {
        return Colors.light.gray; // Huruf salah
      }
    }

    return "transparent"; // Cell yang belum diisi
  };

  // Fungsi untuk menentukan warna border cell
  const getBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (currRow > rowIndex && cell !== "") {
      // Gunakan warna sama dengan background untuk baris yang sudah selesai
      return getCellColor(cell, rowIndex, cellIndex);
    }

    return Colors.light.gray; // Default border color
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

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
              <Ionicons name="moon" size={28} color={textColor} />
              <TouchableOpacity onPress={() => handlePresentModalPress()}>
                <Ionicons name="settings-sharp" size={28} color={textColor} />
              </TouchableOpacity>
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
                <ThemedText
                  style={[
                    styles.cellText,
                    { color: currRow > index ? "#fff" : "#000" },
                  ]}
                >
                  {cell}
                </ThemedText>
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
