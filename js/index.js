// Dark/Light toggle
const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if(document.body.classList.contains('dark-theme')){
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// Firebase imports
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Buttons from navbar
const addBtn = document.getElementById('addBlogBtn');
const logoutBtn = document.getElementById('logout-btn'); // navbar me add karo <li><button id="logout-btn">Logout</button></li>
const loginLi = document.getElementById('login-link');
const signupLi = document.getElementById('signup-link');

// Show/hide buttons based on login
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Show Add Blog & Logout
        addBtn.style.display = "inline-block";
        logoutBtn.style.display = "inline-block";

        // Hide login/signup links
        if(loginLi) loginLi.style.display = "none";
        if(signupLi) signupLi.style.display = "none";

        addBtn.addEventListener('click', () => {
            window.location.href = 'add-blog.html';
        });

    } else {
        // Hide Add Blog & Logout
        addBtn.style.display = "none";
        logoutBtn.style.display = "none";

        // Show login/signup links
        if(loginLi) loginLi.style.display = "inline-block";
        if(signupLi) signupLi.style.display = "inline-block";
    }
});

// Logout functionality
logoutBtn?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.reload(); // reload page but home content stays visible
    } catch(err){
        console.error("Logout failed:", err);
    }
});

// Containers for blogs
const recentContainer = document.getElementById('featured-blog'); 
const editorsContainer = document.getElementById('editors-pick');

async function fetchBlogs(){
    const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(blogsQuery);
    const blogs = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

    // Recent blogs
    recentContainer.innerHTML = "";
    blogs.slice(0,8).forEach(blog => {
        const date = blog.createdAt?.seconds ? new Date(blog.createdAt.seconds*1000).toLocaleDateString() : "Unknown Date";
        const div = document.createElement('div');
        div.classList.add('recent-blog-item');
        div.innerHTML = `
            <img src="${blog.imageUrl}" alt="${blog.title}">
            <div class="blog-info">
                <p>${date} - ${blog.category}</p>
                <h4>${blog.title}</h4>
                <p>${blog.description.substring(0,150)}...</p>
                <button class="read-more-btn">Read More</button>
            </div>
        `;
        div.querySelector(".read-more-btn").addEventListener("click", () => {
            window.location.href = `blog-detail.html?id=${blog.id}`;
        });
        recentContainer.appendChild(div);
    });

    // Editors Pick
    const categories = ["Coding","Style","Travel","Culture","Food","Fashion"];
    editorsContainer.innerHTML = "";
    categories.forEach(cat => {
        const categoryBlogs = blogs.filter(b => b.category.toLowerCase() === cat.toLowerCase());
        categoryBlogs.forEach(blog => {
            const date = blog.createdAt?.seconds ? new Date(blog.createdAt.seconds*1000).toLocaleDateString() : "Unknown Date";
            const div = document.createElement('div');
            div.classList.add('editor-blog-item');
            div.innerHTML = `
                <img src="${blog.imageUrl}" alt="${blog.title}" class="editor-blog-img">
                <div class="editor-blog-info">
                    <h4>${cat}</h4>
                    <p>${blog.title}</p>
                    <p>${blog.author} - ${date}</p>
                    <button class="editor-read-more-btn">Read More</button>
                </div>
            `;
            div.querySelector(".editor-read-more-btn").addEventListener("click", () => {
                window.location.href = `blog-detail.html?id=${blog.id}`;
            });
            editorsContainer.appendChild(div);
        });
    });
}

fetchBlogs();

// Category buttons
document.querySelectorAll('.category-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        window.location.href = `catagory.html?cat=${cat}`; // note: file name typo fix
    });
});

// Navbar toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});
