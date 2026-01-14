import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkpcdgnxq/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "blog_app";

const addBlogForm = document.getElementById('addBlogForm');
const submitButton = addBlogForm.querySelector('button[type="submit"]');

let currentUser = null;

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("You must be logged in to add a blog!");
        window.location.href = 'login.html';
    } else {
        currentUser = user;
    }
});

addBlogForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert("User not logged in.");
        return;
    }

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const imageFile = document.getElementById('image').files[0];

    if (!title || !description || !category || !imageFile) {
        alert("Please fill all fields and select an image");
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Uploading...";

        // Upload image to Cloudinary
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const data = await res.json();
        const imageUrl = data.secure_url;

        // Add blog to Firestore
        await addDoc(collection(db, "blogs"), {
            title,
            description,
            category,
            imageUrl,
            authorId: currentUser.uid, 
            author: currentUser.displayName || "Unknown Author",
            createdAt: serverTimestamp()
        });

        alert("Blog added successfully!");
        addBlogForm.reset();

        // Redirect to All Blogs page
        window.location.href = "all-blog.html";

    } catch (err) {
        console.error(err);
        alert("Error adding blog: " + err.message);
        submitButton.disabled = false;
        submitButton.textContent = "Submit Blog";
    }
});
