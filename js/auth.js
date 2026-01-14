// auth.js
import { auth } from './firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Email/Password Signup
export async function signupWithEmail(email, password){
    return await createUserWithEmailAndPassword(auth, email, password);
}

// Email/Password Login
export async function loginWithEmail(email, password){
    return await signInWithEmailAndPassword(auth, email, password);
}

// Logout
export async function logoutUser(){
    return await signOut(auth);
}

// Google Sign-In
export async function googleSignIn(){
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
}
