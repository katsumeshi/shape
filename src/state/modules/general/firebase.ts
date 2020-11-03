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

export const update = () => {
  // generalRef.doc(moment(date).format("YYYY-MM-DD")).set({ date, weight });
};

const generalChanged = (callback: (general: any) => void) => {
  let general = {};
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
