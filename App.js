
// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import Profile from "./screens/Profile";
import NewBookings from "./screens/NewBookings";
import PendingBookings from "./screens/PendingBookings";
import CompletedBookings from "./screens/CompletedBookings";
import BalanceSheet from "./screens/BalanceSheet";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="NewBookings" component={NewBookings} />
            <Stack.Screen name="PendingBookings" component={PendingBookings} />
            <Stack.Screen name="CompletedBookings" component={CompletedBookings} />
            <Stack.Screen name="BalanceSheet" component={BalanceSheet} />
          </Stack.Navigator>
        </NavigationContainer>
      </SidebarProvider>
    </AuthProvider>
  );
}
