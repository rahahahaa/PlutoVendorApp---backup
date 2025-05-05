import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, fonts, spacing } from "../styles/themeColors";

export default function Button({ title, onPress, disabled, style, icon, ...props }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        disabled ? styles.disabled : styles.enabled,
        style,
      ]}
      {...props}
    >
      {icon && <>{icon}</>}
      <Text style={[styles.text, disabled ? styles.textDisabled : styles.textEnabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.large,
    borderRadius: 8,
    justifyContent: "center",
  },
  enabled: {
    backgroundColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.border,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: fonts.sizeMedium,
    marginLeft: 8,
  },
  textEnabled: {
    color: colors.cardBackground,
  },
  textDisabled: {
    color: colors.textSecondary,
  },
});
