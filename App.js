import React, { useState, useEffect } from "react";
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
  const [authToken, setAuthToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    async function getAuthData() {
      const token = await AsyncStorage.getItem("auth_token");
      const userEmail = await AsyncStorage.getItem("user_email");

      debug && console.log("::App::token", token?.substring(0, 20) + "...");
      debug && console.log("::App::userEmail", userEmail);

      setAuthToken(token);
      setUserEmail(userEmail);
    }
    getAuthData();
  }, []);

  const handleLogout = async () => {
    await logOut();
    await AsyncStorage.removeItem("auth_token");
    setAuthToken(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Fire Alarm</Text>

      {authToken ? (
        <View style={styles.currentUser}>
          <Text>Token: {authToken.substring(0, 20) + "..."}</Text>
          <Text>You are logged in with {userEmail}</Text>
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
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "linear-gradient(to bottom, #FFBABA, #FF7F7F)",
    borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default App;
