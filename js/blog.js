import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const filteredContainer = document.getElementById('filteredBlogs');
const categoryBtns = document.querySelectorAll('.category-buttons button');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const category = btn.dataset.cat;
        filteredContainer.innerHTML = `<p>Loading ${category} blogs...</p>`;

        const q = query(collection(db, 'blogs'), where('category', '==', category));
        const querySnapshot = await getDocs(q);

        filteredContainer.innerHTML = ''; // Clear previous

        if(querySnapshot.empty){
            filteredContainer.innerHTML = `<p>No blogs found in ${category}</p>`;
            return;
        }

        querySnapshot.forEach(docSnap => {
            const blog = docSnap.data();
            const blogDiv = document.createElement('div');
            blogDiv.classList.add('blog-card');
            blogDiv.innerHTML = `
                <img src="${blog.imageUrl}" alt="${blog.title}" style="width:200px; border-radius:10px;">
                <h3>${blog.title}</h3>
                <p>${blog.description.substring(0,100)}...</p>
                <button onclick="window.location.href='blog-detail.html?id=${docSnap.id}'">Read More</button>
            `;
            filteredContainer.appendChild(blogDiv);
        });
    });
});