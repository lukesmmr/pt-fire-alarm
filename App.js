import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
} from "@ui-kitten/components";
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

const stackScreenStyles = {
  headerStyle: {
    backgroundColor: "#232E47",
    borderColor: "#232E47",
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#fff",
  },
};

const App = () => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Fire Alarm", ...stackScreenStyles }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Log in", ...stackScreenStyles }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: "Sign up", ...stackScreenStyles }}
          />
        </Stack.Navigator>
      </ApplicationProvider>
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
    <Layout style={styles.container}>
      <Text style={styles.appTitle}>GeoNotify 🔥</Text>
      <Text style={styles.appSubtitle}>
        Stay informed about fire emergencies with real-time notifications on
        Whatsapp or SMS, powered by the Fogos.pt API.
      </Text>

      {user?.token ? (
        <View style={styles.currentUser}>
          <Text>Token: {user?.token?.substring(0, 20) + "..."}</Text>
          <Text>You are logged in with {user.email}</Text>
          <Text>Uuid: {user.uid}</Text>
          <Button style={styles.logoutBtn} onPress={handleLogout}>
            Logout
          </Button>
        </View>
      ) : (
        <View>
          <Button
            title="Log in"
            onPress={() => navigation.navigate("Login")}
            style={styles.button}
          >
            Log in
          </Button>
          <Button
            onPress={() => navigation.navigate("Signup")}
            style={styles.button}
          >
            Sign up
          </Button>
        </View>
      )}
      <StatusBar style="auto" />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    paddingHorizontal: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    width: 200,
    marginVertical: 8,
    textAlign: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  logoutBtn: {
    marginTop: 30,
  },
});

export default App;
