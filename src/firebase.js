// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgHx8GQXsMtr2AjiRVfZO-5BQMzfCQ23Y",
  authDomain: "mydashboard-7c0a0.firebaseapp.com",
  projectId: "mydashboard-7c0a0",
  storageBucket: "mydashboard-7c0a0.firebasestorage.app",
  messagingSenderId: "915218193942",
  appId: "1:915218193942:web:3a5fec1ee3b52394d09f37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
