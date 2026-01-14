import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Elements
const logoutBtn = document.getElementById("logoutBtn");
const addBlogBtn = document.getElementById("addBlogBtn");
const blogsContainer = document.getElementById("blogsContainer");

const blogModal = new bootstrap.Modal(document.getElementById('blogModal'));
const blogForm = document.getElementById('blogForm');
const blogTitle = document.getElementById('blogTitle');
const blogDescription = document.getElementById('blogDescription');
const blogImage = document.getElementById('blogImage');
const blogIdInput = document.getElementById('blogId');
const modalTitle = document.getElementById('modalTitle');

// ✅ Check if user is logged in
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
  else loadBlogs();
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    const userData = docSnap.data();
    if (userData.role === "admin") {
      // Redirect admin to admin page
      window.location.href = "admin.html";
    } else {
      // Normal user stays on index/dashboard
      console.log("Normal user");
    }
  }
});

// ✅ Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// ✅ Open Add Blog Modal
addBlogBtn.addEventListener("click", () => {
  blogForm.reset();
  blogIdInput.value = "";
  blogImage.dataset.url = "";
  modalTitle.textContent = "Add Blog";
  blogModal.show();
});

// ✅ Submit Blog (Add/Edit)
blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = blogTitle.value.trim();
  const description = blogDescription.value.trim();
  let imageURL = blogImage.dataset.url ?? ""; // fallback empty string

  // ✅ Upload image if user selects new file
  if (blogImage.files[0]) {
    const formData = new FormData();
    formData.append("file", blogImage.files[0]);
    formData.append("upload_preset", "run_task"); // ✅ correct preset
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dkpcdgnxq/image/upload", { // ✅ correct cloud name
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if(!data.secure_url) throw new Error("Cloudinary did not return a URL");
      imageURL = data.secure_url;
    } catch (err) {
      alert("Image upload failed: " + err.message);
      return;
    }
  }

  const blogId = blogIdInput.value;

  try {
    if (blogId) {
      // ✅ Edit blog, keep old image if no new file
      await updateDoc(doc(db, "blogs", blogId), { title, description, imageURL });
      alert("Blog updated!");
    } else {
      // ✅ Add new blog
      await addDoc(collection(db, "blogs"), {
        title,
        description,
        imageURL,
        createdAt: new Date(),
        userId: auth.currentUser.uid
      });
      alert("Blog added!");
    }

    // Reset modal & reload blogs
    blogModal.hide();
    blogForm.reset();
    blogImage.dataset.url = "";
    loadBlogs();
  } catch (err) {
    alert("Error saving blog: " + err.message);
  }
});

// ✅ Load Blogs (show all users' blogs)
async function loadBlogs() {
  blogsContainer.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "blogs"));
  console.log("Total blogs fetched:", querySnapshot.size);

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    // ✅ Only show Edit/Delete buttons if current user is the author
    const isAuthor = data.userId === auth.currentUser.uid;

    blogsContainer.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card">
          <img src="${data.imageURL || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${data.title}">
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.description}</p>
            ${isAuthor ? `
              <button class="btn btn-sm btn-primary editBtn" data-id="${id}">Edit</button>
              <button class="btn btn-sm btn-danger deleteBtn" data-id="${id}">Delete</button>
            ` : ``}
          </div>
        </div>
      </div>
    `;
  });

  // ✅ Edit blog buttons
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const docSnap = await getDoc(doc(db, "blogs", id));
      const blogData = docSnap.data();

      blogTitle.value = blogData.title;
      blogDescription.value = blogData.description;
      blogIdInput.value = id;
      blogImage.dataset.url = blogData.imageURL ?? "";
      modalTitle.textContent = "Edit Blog";
      blogModal.show();
    });
  });

  // ✅ Delete blog buttons
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm("Are you sure you want to delete this blog?")) {
        await deleteDoc(doc(db, "blogs", id));
        alert("Blog deleted!");
        loadBlogs();
      }
    });
  });
}