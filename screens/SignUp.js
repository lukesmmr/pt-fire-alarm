import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { createAccount } from "./../auth/create";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = () => {
    createAccount(email, password)
      .then((user) => {
        console.log("User signed up:", user.email, user.uid);
        const token = user.stsTokenManager.accessToken;

        const userData = {
          token: token,
          email: user.email,
          uid: user.uid,
        };

        AsyncStorage.setItem("user_data", JSON.stringify(userData)).then(() => {
          navigation.navigate("Home");
        });

        setError(null);
      })
      .catch((error) => {
        console.log("Error creating user account:", error);
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign up" onPress={handleSignup} />
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

export default SignupScreen;
