import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { signIn } from "./../auth/login";
import { useNavigation } from "@react-navigation/native";
import { app } from "./../config/firebase";

const debug = true;

const auth = getAuth(app);

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const handleLogin = () => {
    signIn(email, password)
      .then((user) => {
        debug &&
          console.log(
            "::HandleLogin::User signed in:",
            user.stsTokenManager.accessToken?.substring(0, 20) + "..."
          );
        debug && console.log("::HandleLogin::User uid:", user.uid);
        const token = user.stsTokenManager.accessToken;

        const userData = {
          token: token,
          email: user.email,
          uid: user.uid,
        };

        AsyncStorage.setItem("user_data", JSON.stringify(userData)).then(() => {
          navigation.navigate("Home");
        });
      })
      .catch((error) => {
        console.error("::Login::HandleLogin", error);
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <Button style={styles.button} title="Login" onPress={handleLogin} />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    margin: 8,
    width: "80%",
  },
  button: {
    margin: 8,
  },
});

export default LoginScreen;
