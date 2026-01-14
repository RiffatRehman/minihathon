// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzxqZLqDZrJS9V9bo9db5faQse9eS4wW0",
    authDomain: "product-cart-2943c.firebaseapp.com",
    projectId: "product-cart-2943c",
    storageBucket: "product-cart-2943c.appspot.com",
    messagingSenderId: "872505928292",
    appId: "1:872505928292:web:d056cf866709b02c704d71"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
