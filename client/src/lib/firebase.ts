import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLKOS0KlxFulvAVQNze-ZE7PeQem7aw54",
  authDomain: "meditation-app-beta.firebaseapp.com",
  projectId: "meditation-app-beta",
  storageBucket: "meditation-app-beta.firebasestorage.app",
  messagingSenderId: "548336042002",
  appId: "1:548336042002:web:c7fad89040ae85424718cb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();