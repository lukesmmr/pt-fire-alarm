import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import { Layout, Button, Input, Text } from "@ui-kitten/components";

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
    <Layout style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button style={styles.button} onPress={handleSignup}>Submit</Button>
      {error && <Text style={styles.error}>{error}</Text>}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    margin: 8,
    width: "80%",
  },
  button: {
    margin: 8,
  },
  error: {
    marginTop: 20,
    color: "red",
  },
});

export default SignupScreen;
