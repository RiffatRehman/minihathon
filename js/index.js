// Dark/Light toggle
  const themeBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');

        // Icon switch: Light → Moon, Dark → Sun
        if(document.body.classList.contains('dark-theme')){
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // Optional: initial check in case page loads in dark mode
    window.addEventListener('DOMContentLoaded', () => {
        if(document.body.classList.contains('dark-theme')){
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

// Show Add Blog button if user logged in
import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const addBtn = document.getElementById('addBlogBtn');
onAuthStateChanged(auth, (user) => {
    if(user){
        addBtn.style.display = "inline-block";
        addBtn.addEventListener('click', () => {
            window.location.href = 'add-blog.html';
        });
    }
});

import { db } from './firebase.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const recentContainer = document.getElementById('featured-blog'); // Recent blogs
const editorsContainer = document.getElementById('editors-pick');  // Editors pick

async function fetchBlogs(){
    const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(blogsQuery);
    const blogs = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

    // -------------------------------
    // Recent Blogs - Latest 3
    // -------------------------------
    recentContainer.innerHTML = "";
    blogs.slice(0,8).forEach(blog => {
        const div = document.createElement('div');
        div.classList.add('recent-blog-item');
        div.innerHTML = `
            <img src="${blog.imageUrl}" alt="${blog.title}">
            <div class="blog-info">
                <p>${new Date(blog.createdAt?.seconds*1000).toLocaleDateString()} - ${blog.category}</p>
                <h4>${blog.title}</h4>
                <p>${blog.description.substring(0,150)}...</p>
                <button class="read-more-btn">Read More</button>
            </div>
        `;
        // Add click event for Read More
        div.querySelector(".read-more-btn").addEventListener("click", () => {
            window.location.href = `blog-detail.html?id=${blog.id}`;
        });
        recentContainer.appendChild(div);
    });

    // -------------------------------
    // Editors Pick - 1 blog per category
    // -------------------------------
    const categories = ["Coding","Style","Travel","Culture","Food","Fashion"];
    editorsContainer.innerHTML = "";

    categories.forEach(cat => {
        const categoryBlogs = blogs.filter(b => b.category === cat);
        categoryBlogs.forEach(blog => {
            const div = document.createElement('div');
            div.classList.add('editor-blog-item');
            div.innerHTML = `
                <img src="${blog.imageUrl}" alt="${blog.title}" class="editor-blog-img">
                <div class="editor-blog-info">
                    <h4>${cat}</h4>
                    <p>${blog.title}</p>
                    <p>${blog.author} - ${new Date(blog.createdAt?.seconds*1000).toLocaleDateString()}</p>
                    <button class="editor-read-more-btn">Read More</button>
                </div>
            `;
            // Add click event for editor Read More
            div.querySelector(".editor-read-more-btn").addEventListener("click", () => {
                window.location.href = `blog-detail.html?id=${blog.id}`;
            });
            editorsContainer.appendChild(div);
        });
    });
}
fetchBlogs();
document.querySelectorAll('.category-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        window.location.href = `category-page.html?cat=${cat}`;
    });
});
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


 