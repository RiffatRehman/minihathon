// js/addBlog.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkpcdgnxq/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "blog_app";

const addBlogForm = document.getElementById('addBlogForm');

onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("You must be logged in to add a blog!");
        window.location.href = 'login.html';
    }
});

addBlogForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const imageFile = document.getElementById('image').files[0];

    if (!imageFile) {
        alert("Please select an image");
        return;
    }

    try {
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const data = await res.json();
        const imageUrl = data.secure_url;

        // Add blog
        await addDoc(collection(db, "blogs"), {
            title,
            description,
            category,
            imageUrl,
            author: auth.currentUser.displayName || "Unknown Author",
            createdAt: serverTimestamp()
        });

        alert("Blog added successfully!");
        addBlogForm.reset();
        window.location.href = "index.html";
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
});
