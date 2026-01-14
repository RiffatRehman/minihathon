 import { db } from './firebase.js';
        import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

        async function fetchBlogDetail() {
            const params = new URLSearchParams(window.location.search);
            const blogId = params.get('id'); // URL se id get kar rahe hain

            if(!blogId) return;

            const docRef = doc(db, "blogs", blogId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                const blog = docSnap.data();
                const container = document.getElementById('blog-detail');
                container.innerHTML = `
                    <h1>${blog.title}</h1>
                    <p><strong>${blog.author}</strong> - ${new Date(blog.createdAt?.seconds*1000).toLocaleDateString()}</p>
                    <p><em>Category: ${blog.category}</em></p>
                    <img src="${blog.imageUrl}" alt="${blog.title}" class="blog-detail-img">
                    <p>${blog.description}</p>
                `;
            } else {
                document.getElementById('blog-detail').innerHTML = "<p>Blog not found.</p>";
            }
        }

        fetchBlogDetail();

        