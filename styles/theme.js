const colors = {
  primary: "#2962FF",          // updated blue for accept buttons
  secondary: "#FF5252",        // updated soft red for reject buttons
  background: "#F5F8FF",       // updated light background for cards
  cardBackground: "#F5F8FF",
  textPrimary: "#212121",      // updated dark text for important info
  textSecondary: "#757575",    // updated medium gray for labels
  success: "#10B981",          // green for accepted status (unchanged)
  danger: "#FF5252",           // updated to soft red for rejection
  warning: "#F59E0B",          // amber for important actions (unchanged)
  border: "#E5E7EB",           // thin border color (unchanged)
  shadow: "rgba(0, 0, 0, 0.05)", // subtle shadow (unchanged)
};

const fonts = {
  regular: "Roboto-Regular",   // updated to Roboto font family
  medium: "Roboto-Medium",
  bold: "Roboto-Bold",
  monospace: "Courier New",
  sizeSmall: 14,    // for booking IDs and labels
  sizeMedium: 16,   // for cab details
  sizeLarge: 18,    // updated larger font size for vehicle names and prices
  sizeXLarge: 20,
};

const spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

export { colors, fonts, spacing };
