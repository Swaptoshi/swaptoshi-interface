import React from "react";
import "./Loader.css";
import { getSystemTheme } from "../../utils/Theme/getSystemTheme";
import { useTheme } from "../../context/ThemeProvider";

const colorMap = {
  dark: "#000000",
  light: "#f3f3f3",
};

const backgroundColorMap = {
  dark: "#f3f3f3",
  light: "#000000",
};

export default function Loader({ size, backgroundColor, color }) {
  const [theme] = useTheme();
  const currentTheme =
    theme !== undefined
      ? theme === "system"
        ? getSystemTheme()
        : theme
      : undefined;
  return (
    <div
      className="loader"
      style={{
        border: `${Math.floor(size / 6)}px solid ${
          currentTheme !== undefined ? colorMap[currentTheme] : color
        }`,
        borderTop: `${Math.floor(size / 6)}px solid ${
          currentTheme !== undefined
            ? backgroundColorMap[currentTheme]
            : backgroundColor
        } `,
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
