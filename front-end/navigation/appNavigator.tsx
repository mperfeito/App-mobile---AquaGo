import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../screens/splash";
import OnBoarding1 from "../screens/onBoarding1";
import OnBoarding2 from "../screens/onBoarding2";
import OnBoarding3 from "../screens/onBoarding3";
import OnBoarding4 from "../screens/onBoarding4";
import Login from "../screens/login";
import SignUp from "../screens/signUp";
import Account from "../screens/account";
import Comments from "../screens/comments";
import BottomSheet from "../screens/bottomSheet";
import Locations from "../screens/locations";
import Map from "../screens/map";
import Profile from "../screens/profile";
import Tracker from "../screens/tracker";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Splash" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="OnBoarding1" component={OnBoarding1} />
      <Stack.Screen name="OnBoarding2" component={OnBoarding2} />
      <Stack.Screen name="OnBoarding3" component={OnBoarding3} />
      <Stack.Screen name="OnBoarding4" component={OnBoarding4} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="BottomSheet" component={BottomSheet} />
      <Stack.Screen name="Locations" component={Locations} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Tracker" component={Tracker} />
    </Stack.Navigator>
  );
}