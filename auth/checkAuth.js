import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "./../config/firebase";

const auth = getAuth(app);
const debug = true;

// Check if there is a stored token when the app is launched
async function checkAuthState() {
  const token = await AsyncStorage.getItem("auth_token");
  debug &&
    console.log("::checkAuthState::Token:", token?.substring(0, 20) + "...");
  if (token) {
    // Listen for changes to the user's authentication state
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          // User is signed in
          console.log("::checkAuthState::User signed in:", user.email);
        } else {
          // User is signed out
          console.log("::checkAuthState::User signed out");
        }
      },
      (error) => {
        console.error("::checkAuthState::onAuthStateChanged", error);
      }
    );
  }
}

// Log the user out and remove the stored token
async function logout() {
  await auth.signOut();
  await AsyncStorage.multiRemove(["auth_token", "user_email"]);
}

export { checkAuthState, logout };
