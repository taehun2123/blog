import { initializeApp } from "firebase/app";
// firestore를 불러오는 모듈을 임포트
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_apiKey,
  // authDomain: process.env.REACT_APP_authDomain,
  // projectId: process.env.REACT_APP_projectId,
  // storageBucket: process.env.REACT_APP_storageBucket,
  // messagingSenderId: process.env.REACT_APP_messagingSenderId,
  // appId: process.env.REACT_APP_appId,
  // measurementId: process.env.measurementId
  apiKey: "AIzaSyAOfNZONv0BMnaI752R2BDqfyTpiRo_LGI",
  authDomain: "myblog-a5efe.firebaseapp.com",
  projectId: "myblog-a5efe",
  storageBucket: "myblog-a5efe.appspot.com",
  messagingSenderId: "709900039439",
  appId: "1:709900039439:web:9a3a04dcb99f0a770ffa7a",
  measurementId: "G-12NCXG6VMB"
};


const app = initializeApp(firebaseConfig);
// firestore 객체 생성
const db = getFirestore(app);
// firestore export
export {db}