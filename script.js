// online JSON link for Task 4 (from jsonbin)
const ONLINE_JSON_URL = "https://api.jsonbin.io/v3/b/690a2d2a43b1c97be9989767"; 

// show all posts on the page
function renderPosts(posts) {
  const container = document.querySelector(".posts");
  if (!container) return;

  // clear previous posts
  container.innerHTML = "";

  posts.forEach((post, idx) => {
    const div = document.createElement("div");
    div.className = "post";
    div.id = `post-${post.id ?? idx + 1}`;

    const date = document.createElement("span");
    date.className = "date";
    date.textContent = post.date;

    const text = document.createElement("p");
    text.textContent = post.text;

    // small like button animation
    const likeBtn = document.createElement("button");
    likeBtn.className = "like-button";
    likeBtn.type = "button";
    likeBtn.textContent = "👍";
    likeBtn.addEventListener("click", () => {
      likeBtn.disabled = true;
      likeBtn.textContent = "👍 +1";
      setTimeout(() => { 
        likeBtn.disabled = false; 
        likeBtn.textContent = "👍"; 
      }, 800);
    });

    div.appendChild(date);
    div.appendChild(text);

    // add image if it exists
    if (post.image && String(post.image).trim() !== "") {
      const img = document.createElement("img");
      img.src = post.image;
      img.alt = "post image";
      img.style.maxWidth = "150px";
      img.style.borderRadius = "6px";
      div.appendChild(img);
    }

    div.appendChild(likeBtn);
    container.appendChild(div);
  });
}

// load posts from online json (for Task 4)
/*
async function loadPostsOnline() {
  const res = await fetch(ONLINE_JSON_URL, { cache: "no-store" });
  const data = await res.json();
  const posts = Array.isArray(data) ? data : (data.record || data.records || []);
  renderPosts(posts);
}
*/

// load posts from local file (for Task 5)
async function loadPostsLocal() {
  const res = await fetch("posts.json", { cache: "no-store" });
  const data = await res.json();
  renderPosts(data);
}

// dropdown menu when clicking avatar
function initDropdown() {
  const avatar = document.querySelector(".user-icon");
  const dropdown = document.getElementById("user-dropdown");
  if (!avatar || !dropdown) return;

  const toggle = () => {
    const visible = dropdown.style.display === "block";
    dropdown.style.display = visible ? "none" : "block";
  };

  avatar.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  // close dropdown if click outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) dropdown.style.display = "none";
  });

  // close with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") dropdown.style.display = "none";
  });
}

// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // use this for Task 4 (online)
  // loadPostsOnline();

  // use this for Task 5 (local)
  loadPostsLocal();

  // start dropdown
  initDropdown();
});
