import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./../config/firebase";

const auth = getAuth(app);

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("::signIn::User signed in:", user.email);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(":signIn::Error signing in user:", errorCode, errorMessage);
      throw error;
    });
};
