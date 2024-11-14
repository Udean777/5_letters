import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Icon from "@/assets/images/wordle-icon.svg";
import ThemedText from "@/components/ThemedText";
import Fonts from "@/constants/Fonts";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as MailComposer from "expo-mail-composer";

const Page = () => {
  const { win, word, gameField } = useLocalSearchParams<{
    win: string;
    word: string;
    gameField?: string;
  }>();
  const [userScore, setUserScore] = React.useState<{
    played: number;
    wins: number;
    currentStreak: number;
  }>({
    played: 42,
    wins: 2,
    currentStreak: 2,
  });
  const colorScheme = useColorScheme();
  const bgColor = Colors[colorScheme ?? "light"].gameBg;

  const shareGame = () => {
    const game = JSON.parse(gameField!);
    const imageText: string[][] = [];
    const wordLetters = word.split("");

    game.forEach((row: string[], rowIndex: number) => {
      imageText.push([]);
      row.forEach((letter: string, colIndex: number) => {
        if (wordLetters[colIndex] === letter) {
          imageText[rowIndex].push("🟩");
        } else if (wordLetters.includes(letter)) {
          imageText[rowIndex].push("🟨");
        } else {
          imageText[rowIndex].push("⬜");
        }
      });
    });

    console.log(imageText);

    const html = `
      <html>
        <head>
          <style>

            .game {
              display: flex;
              flex-direction: column;
            }
              .row {
              display: flex;
              flex-direction: row;

              }
            .cell {
              display: flex;
              justify-content: center;
              align-items: center;
            }

          </style>
        </head>
        <body>
          <h1>Wordle</h1>
          <div class="game">
           ${imageText
             .map(
               (row) =>
                 `<div class="row">${row
                   .map((cell) => `<div class="cell">${cell}</div>`)
                   .join("")}</div>`
             )
             .join("")}
          </div>
        </body>
      </html>
    `;

    MailComposer.composeAsync({
      subject: "Aku baru saja bermain 5 Letters dari HIMTI!",
      body: html,
      isHtml: true,
    });
  };

  const navigateRoot = () => {
    router.dismissAll();
    router.replace("/");
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <TouchableOpacity
        onPress={navigateRoot}
        style={{
          alignSelf: "flex-end",
        }}
      >
        <Ionicons name="close" size={26} color={Colors.light.gray} />
      </TouchableOpacity>

      <View style={styles.header}>
        {win === "true" ? (
          <View
            style={{
              backgroundColor: Colors.light.gameBg,
              width: 100,
              height: 100,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="star" size={70} color={Colors.light.green} />
          </View>
        ) : (
          <Icon width={100} height={70} />
        )}

        <ThemedText style={styles.title}>
          {win === "true"
            ? "Selamat, kamu berhasil menang"
            : "Maaf, kamu belum berhasil menang"}
        </ThemedText>

        <SignedOut>
          <ThemedText style={styles.text}>
            Mau melihat statistik permainan kamu?
          </ThemedText>

          <Link
            href={"/login"}
            style={[styles.btn, { backgroundColor: bgColor }]}
            asChild
          >
            <TouchableOpacity>
              <ThemedText style={styles.btnText}>Buat akun gratis.</ThemedText>
            </TouchableOpacity>
          </Link>

          <Link href={"/login"} style={styles.btn} asChild>
            <TouchableOpacity>
              <ThemedText style={styles.textLink}>
                Udah punya akun sebelumnya? Login aja.
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <ThemedText style={styles.text}>Statistics</ThemedText>
          <View style={styles.stats}>
            <View>
              <ThemedText style={styles.score}>{userScore.played}</ThemedText>
              <ThemedText>Played</ThemedText>
            </View>
            <View>
              <ThemedText style={styles.score}>{userScore.wins}</ThemedText>
              <ThemedText>Wins</ThemedText>
            </View>
            <View>
              <ThemedText style={styles.score}>
                {userScore.currentStreak}
              </ThemedText>
              <ThemedText>Current Streak</ThemedText>
            </View>
          </View>
        </SignedIn>

        <View style={styles.separator} />

        <TouchableOpacity onPress={shareGame} style={styles.iconBtn}>
          <ThemedText style={styles.btnText}>Share</ThemedText>
          <Ionicons name="share-social" size={24} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 38,
    fontFamily: Fonts.FrankRuhlLibre_700Bold,
    textAlign: "center",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: Fonts.FrankRuhlLibre_500Medium,
  },
  btn: {
    justifyContent: "center",
    borderRadius: 30,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
    width: "100%",
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  textLink: {
    textDecorationLine: "underline",
    fontSize: 16,
    paddingVertical: 15,
  },
  iconBtn: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.green,
    borderRadius: 30,
    width: "70%",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    gap: 10,
  },
  score: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: Colors.light.gray,
  },
});
