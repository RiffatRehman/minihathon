// js/all-blogs.js
import { db } from './firebase.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const container = document.getElementById("all-blogs-container");

async function fetchAllBlogs() {
    const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(blogsQuery);
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    container.innerHTML = "";

    blogs.forEach(blog => {
        const div = document.createElement("div");
        div.classList.add("recent-blog-item");
        div.innerHTML = `
            <img src="${blog.imageUrl}" alt="${blog.title}">
            <div class="blog-info">
                <p>${new Date(blog.createdAt?.seconds*1000).toLocaleDateString()} - ${blog.category}</p>
                <h4>${blog.title}</h4>
                <p>${blog.description.substring(0,150)}...</p>
                <button onclick="window.location.href='blog-detail.html?id=${blog.id}'" class="read-more-btn">Read More</button>
            </div>
        `;
        container.appendChild(div);
    });
}

fetchAllBlogs();
