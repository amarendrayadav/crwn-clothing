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

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  const collectionRef = firestore.collection('users');
  const collectionSnapshot = await collectionRef.get();
  const collection = collectionSnapshot.docs.map(doc => doc.data());
  console.log(collection);

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export const addCollectionAndDocuments = async (colleectionKey, objectsToAdd) => {
  const collectionRef = firestore.collection(colleectionKey);
  const batch = firestore.batch();

  objectsToAdd.forEach(obj => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};


export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();
    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    }
  })

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
