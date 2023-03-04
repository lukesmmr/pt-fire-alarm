import { getAuth, signOut } from "firebase/auth";
import { app } from "../config/firebase";

const auth = getAuth(app);

export const logOut = () => {
  return signOut(auth)
    .then(() => {
      console.log("::Logout::User signed out");
    })
    .catch((error) => {
      console.error(error);
      console.error("::Logout::logout", error);
    });
};