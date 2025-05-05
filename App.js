// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import { SidebarProvider } from "./context/SidebarContext";
// import PendingBookings from "./screens/PendingBookings";
// import Sidebar from "./screens/Sidebar";

export default function App() {
  return (
    <SidebarProvider>
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    </SidebarProvider>
  );
}
