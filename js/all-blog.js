import { db } from './firebase.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const container = document.getElementById("all-blogs-container");

async function fetchAllBlogs() {
    try {
        const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(blogsQuery);

        const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        container.innerHTML = "";

        blogs.forEach(blog => {
            const date = blog.createdAt?.seconds 
                ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString() 
                : "Unknown Date";

            const div = document.createElement("div");
            div.classList.add("recent-blog-item");
            div.innerHTML = `
                <img src="${blog.imageUrl}" alt="${blog.title}">
                <div class="blog-info">
                    <p>${date} - ${blog.category || "Uncategorized"}</p>
                    <h4>${blog.title}</h4>
                    <p>${blog.description.substring(0, 150)}...</p>
                    <button onclick="window.location.href='blog-detail.html?id=${blog.id}'" class="read-more-btn">Read More</button>
                </div>
            `;
            container.appendChild(div);
        });

        if (blogs.length === 0) {
            container.innerHTML = "<p>No blogs found.</p>";
        }

    } catch (err) {
        console.error("Error fetching blogs:", err);
        container.innerHTML = "<p>Unable to load blogs. Try again later.</p>";
    }
}

fetchAllBlogs();
