// admin.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, getDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Elements
const usersContainer = document.getElementById("usersContainer");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in
    window.location.href = "index.html";
    return;
  }

  // Fetch user role
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.data();

  if (userData.role !== "admin") {
    // Not admin, redirect to normal dashboard
    alert("You are not authorized!");
    window.location.href = "index.html";
    return;
  }

  // If admin, load all users
  loadAllUsers();
});

async function loadAllUsers() {
  usersContainer.innerHTML = "";
  const usersSnap = await getDocs(collection(db, "users"));

  usersSnap.forEach(docSnap => {
    const data = docSnap.data();
    const uid = docSnap.id;

    usersContainer.innerHTML += `
      <div class="card mb-2 p-2">
        <strong>${data.name}</strong> (${data.email}) - Role: ${data.role}
        <button class="btn btn-sm btn-danger float-end" onclick="deleteUser('${uid}')">Delete User</button>
      </div>
    `;
  });
}

window.deleteUser = async (uid) => {
  if (confirm("Are you sure to delete this user?")) {
    await deleteDoc(doc(db, "users", uid));
    alert("User deleted!");
    loadAllUsers();
  }
};