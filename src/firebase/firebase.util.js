import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyD9nn0HHCYW4FcSc9tX39vDBb9v_dKgbdg",
    authDomain: "crown-db-f4da3.firebaseapp.com",
    databaseURL: "https://crown-db-f4da3.firebaseio.com",
    projectId: "crown-db-f4da3",
    storageBucket: "crown-db-f4da3.appspot.com",
    messagingSenderId: "466864239019",
    appId: "1:466864239019:web:67952b80544a49d33962ee",
    measurementId: "G-V0F48DVK6K"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) {
        return;
    }
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();
    if(!snapShot.exists){
        const {displayName, email} = userAuth;
        const createdAt = new Date();
        console.log("userAuth ",userAuth);
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        } catch (error) {
            console.log("error creating user ", error.message);
        }
    }
    return userRef;
}
firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ promp: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;