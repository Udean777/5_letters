import { View, Text, TextProps, useColorScheme } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

const ThemedText = ({ style, children, ...props }: TextProps) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"].text;

  return (
    <Text style={[style, { color }]} {...props}>
      {children}
    </Text>
  );
};

export default ThemedText;
