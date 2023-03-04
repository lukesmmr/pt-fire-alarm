import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./../config/firebase";

const auth = getAuth(app);

export const createAccount = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User account created:", user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error creating user account:", errorCode, errorMessage);
      throw error;
    });
};
