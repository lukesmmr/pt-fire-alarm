import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { StatusBar } from "expo-status-bar";
import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/SignUp";
import { checkAuthState } from "./auth/checkAuth";
import { logOut } from "./auth/logout";

const debug = true;
const Stack = createStackNavigator();

const App = () => {

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Fire Alarm" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Log in" }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: "Sign up" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [user, setUserData] = useState(null);

  useEffect(() => {
    const getAuthData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem("user_data");
        const userData = JSON.parse(userDataStr);
        debug && console.log("::getAuthData::AsyncStorage.getItem");
        setUserData(userData);
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    getAuthData();

    const unsubscribe = navigation.addListener("focus", getAuthData);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await logOut();
    await AsyncStorage.removeItem("user_data");
    setUserData(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Forest Fire Notifier</Text>
      <Text style={styles.appSubtitle}>
        Real-time notifications about fires in your specified area through your
        favourite channel
      </Text>

      {user?.token ? (
        <View style={styles.currentUser}>
          <Text>Token: {user?.token?.substring(0, 20) + "..."}</Text>
          <Text>You are logged in with {user.email}</Text>
          <Text>Uuid: {user.uid}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View>
          <Button
            title="Log in"
            onPress={() => navigation.navigate("Login")}
            style={styles.button}
          />
          <Button
            title="Sign up"
            onPress={() => navigation.navigate("Signup")}
            style={styles.button}
          />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  currentUser: {
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    //fontFamily: "oswald-regular",
    fontSize: 36,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 24,
    textAlign: "center",
  },
  appSubtitle: {
    //fontFamily: "oswald-regular",
    fontSize: 18,
    marginBottom: 24,
    paddingHorizontal: 24,
    textAlign: "center",
    lineHeight: 28,
  },
  button: {
    fontFamily: "oswald-regular",
    backgroundColor: "linear-gradient(to bottom, #FFBABA, #FF7F7F)",
    borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  buttonText: {
    fontFamily: "oswald-regular",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default App;
