import { auth, db } from './firebase.js';
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

async function fetchBlogDetail() {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('id');

    const container = document.getElementById('blog-detail');
    const ownerControls = document.getElementById('owner-controls');
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');

    if (!blogId) {
        container.innerHTML = "<p>No blog ID provided.</p>";
        return;
    }

    try {
        const docRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            container.innerHTML = "<p>Blog not found.</p>";
            return;
        }

        const blog = docSnap.data();

        // Display blog content
        const date = blog.createdAt?.seconds 
            ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString() 
            : "Unknown Date";

        container.innerHTML = `
            <h1>${blog.title}</h1>
            <p><strong>${blog.author || "Unknown Author"}</strong> - ${date}</p>
            <p><em>Category: ${blog.category || "Uncategorized"}</em></p>
            <img src="${blog.imageUrl}" alt="${blog.title}" class="blog-detail-img">
            <p>${blog.description}</p>
        `;

        // Hide owner buttons by default
        ownerControls.style.display = "none";

        // Check if current user is owner
        onAuthStateChanged(auth, (user) => {
            if (user && blog.authorId && user.uid === blog.authorId) {
                ownerControls.style.display = "block";

                // Prevent multiple event listeners
                editBtn.onclick = () => window.location.href = `edit-blog.html?id=${blogId}`;
                
                deleteBtn.onclick = async () => {
                    const confirmDelete = confirm("Are you sure you want to delete this blog?");
                    if (!confirmDelete) return;

                    try {
                        await deleteDoc(doc(db, "blogs", blogId));
                        alert("Blog deleted successfully!");
                        window.location.href = "index.html";
                    } catch (err) {
                        console.error("Error deleting blog:", err);
                        alert("Failed to delete blog. Try again.");
                    }
                };
            }
        });

    } catch (err) {
        console.error("Error fetching blog detail:", err);
        container.innerHTML = "<p>Unable to load blog. Try again later.</p>";
    }
}

fetchBlogDetail();
