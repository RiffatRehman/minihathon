// js/signup.js
import { signupWithEmail, googleSignIn } from './auth.js';
import { updateProfile } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const signupForm = document.getElementById('signupForm');
const googleBtn = document.getElementById('googleSignUp');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    try {
        const userCredential = await signupWithEmail(email, password);
        const user = userCredential.user;

        if (name) {
            await updateProfile(user, { displayName: name });
        }

        alert('Signup successful!');
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
});

googleBtn.addEventListener('click', async () => {
    try {
        await googleSignIn();
        alert('Google Sign-In successful!');
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
});
