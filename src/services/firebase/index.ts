import firebase, { RNFirebase } from "react-native-firebase";
import store from "../../redux/configureStore";
import { requestLoginStatus } from "../../redux/modules/auth";
import { successHealth } from "../../redux/modules/health";

let authUser = firebase.auth().currentUser;

export const observeAuthState = () => {
	firebase.auth().onAuthStateChanged(user => {
		authUser = firebase.auth().currentUser;
		store.dispatch(requestLoginStatus(!!user));
	});
};

type Health = {
	weight: number;
	date?: RNFirebase.firestore.Timestamp;
};

export const getHealth = () => {
	if (!authUser) return;
	firebase
		.firestore()
		.collection("users")
		.doc(authUser.uid)
		.collection("health")
		.get()
		.then(querySnapshot => {
			const arr: Array<Health> = [];
			querySnapshot.forEach(doc => {
				let v = doc.data() as Health;
				if (v.date) {
					arr.unshift(v);
				}
			});
			store.dispatch(successHealth(arr));
		});
};
