import { QuerySnapshot } from "react-native-firebase/firestore";
import { plainToClass } from "class-transformer";
import { General } from "./types";
import { usersRef } from "../../../services/firebase";

// const authChanged = (callback: (user: any) => void) => {
//   return firebase.auth().onAuthStateChanged(user => {
//     callback(generalChangeAction(user as RNFirebase.User));
//   });
// };

const generalRef = () => usersRef().collection("general");

const generalChanged = (callback: (general: General) => void) => {
  let general = new General();
  const subscription = generalRef().onSnapshot((snapshot: QuerySnapshot) => {
    if (!snapshot.metadata.hasPendingWrites) {
      snapshot.docChanges.forEach(change => {
        switch (change.type) {
          case "added":
          case "modified": {
            general = plainToClass(General, change.doc.data());
            break;
          }
          default:
        }
      });
      callback(general);
    }
  });
  return subscription;
};

export default generalChanged;
