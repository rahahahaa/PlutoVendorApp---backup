import React, { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import { lightColors, darkColors, fonts, spacing } from "../styles/theme";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme === "dark" ? "dark" : "light");

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, fonts, spacing, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
