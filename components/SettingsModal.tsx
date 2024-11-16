import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import React, { forwardRef } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { useMMKVBoolean } from "react-native-mmkv";
import { storage } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const SettingsModal = ({ ref }: { ref: any }) => {
  const snapPoints = React.useMemo(() => ["1%", "50%"], []);
  const [dark, setDark] = useMMKVBoolean("dark-mode", storage);
  const [hard, setHard] = useMMKVBoolean("hard-mode", storage);
  const [contrast, setContrast] = useMMKVBoolean("contrast-mode", storage);

  const toggleDark = () => setDark((prev) => !!!prev);
  const toggleHard = () => setHard((prev) => !!!prev);
  const toggleContrast = () => setContrast((prev) => !!!prev);

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      ref={ref}
      snapPoints={snapPoints}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.modalBtns}>
          <Text style={styles.containerHeadline}>Settings</Text>
          <TouchableOpacity
            onPress={() => {
              if (typeof ref === "object" && ref?.current) {
                ref.current.close();
              }
            }}
          >
            <Ionicons name="close" size={24} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTextBig}>Hard Mode</Text>
              <Text style={styles.rowTextSmall}>
                Words are longer and harder
              </Text>
            </View>
            <Switch
              onValueChange={toggleHard}
              value={hard}
              trackColor={{ true: "#333" }}
              ios_backgroundColor={"#9a9a9a"}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTextBig}>Dark Mode</Text>
              <Text style={styles.rowTextSmall}>
                Change the app to dark mode
              </Text>
            </View>
            <Switch
              onValueChange={toggleDark}
              value={dark}
              trackColor={{ true: "#333" }}
              ios_backgroundColor={"#9a9a9a"}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTextBig}>High Contrast Mode</Text>
              <Text style={styles.rowTextSmall}>
                Increase contrast for better visibility
              </Text>
            </View>
            <Switch
              onValueChange={toggleContrast}
              value={contrast}
              trackColor={{ true: "#333" }}
              ios_backgroundColor={"#9a9a9a"}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerHeadline: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    flex: 1,
  },
  modalBtns: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#888",
  },
  rowText: {
    flex: 1,
  },
  rowTextBig: {
    fontSize: 18,
  },
  rowTextSmall: {
    fontSize: 14,
    color: "#5e5e5e",
  },
});
