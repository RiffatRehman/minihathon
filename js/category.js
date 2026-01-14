import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Get category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("cat");

// Set category title
document.getElementById("category-title").textContent = 
    (!category || category.toLowerCase() === "all") 
        ? "All Blogs" 
        : category.charAt(0).toUpperCase() + category.slice(1);

// Container for blogs
const container = document.getElementById("filtered-blogs");

async function fetchCategoryBlogs() {
    try {
        const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(blogsQuery);
        const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        container.innerHTML = "";

        // Filter blogs
        const filteredBlogs = (!category || category.toLowerCase() === "all")
            ? blogs
            : blogs.filter(blog => blog.category?.toLowerCase() === category.toLowerCase());

        if(filteredBlogs.length === 0){
            container.innerHTML = "<p>No blogs found in this category.</p>";
            return;
        }

        filteredBlogs.forEach(blog => {
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
                    <p>${blog.description?.substring(0, 150) || ""}...</p>
                    <button onclick="window.location.href='blog-detail.html?id=${blog.id}'" class="read-more-btn">Read More</button>
                </div>
            `;
            container.appendChild(div);
        });

    } catch(err){
        console.error("Error fetching category blogs:", err);
        container.innerHTML = "<p>Unable to load blogs. Try again later.</p>";
    }
}

fetchCategoryBlogs();
