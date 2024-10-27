const body = document.querySelector("body"),
      nav = document.querySelector("nav"),
      modeToggle = document.querySelector(".dark-light"),
      searchToggle = document.querySelector(".searchToggle"),
      sidebarOpen = document.querySelector(".sidebarOpen"),
      sidebarClose = document.querySelector(".sidebarClose"),
      categoryBtn = document.querySelector('.category-btn'),
      dropdown = document.querySelector('.category-dropdown .dropdown');

categoryBtn.addEventListener('click', (e) => {
  e.preventDefault();  // Prevent default behavior
  e.stopPropagation(); // Stop event bubbling
  dropdown.classList.toggle('active'); // Toggle the active class
});

// Dark/Light Mode Toggle
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
  body.classList.add("dark");
}

modeToggle.addEventListener("click", () => {
  modeToggle.classList.toggle("active");
  body.classList.toggle("dark");

  // Save mode preference in localStorage
  if (!body.classList.contains("dark")) {
    localStorage.setItem("mode", "light-mode");
  } else {
    localStorage.setItem("mode", "dark-mode");
  }

  setModalColors(); // Update modal colors on mode change
});

// Set modal colors based on dark/light mode
function setModalColors() {
  const modalContent = document.getElementById('modal-content');
  if (body.classList.contains('dark')) {
    modalContent.style.backgroundColor = 'var(--nav-color)';
    modalContent.style.color = 'var(--text-color)';
  } else {
    modalContent.style.backgroundColor = 'var(--body-color)';
    modalContent.style.color = 'var(--nav-color)';
  }
}
setModalColors(); // Call once when page loads

// Sidebar open event
sidebarOpen.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation(); // Stop event bubbling
  nav.classList.add("active");
  console.log("Sidebar opened");
});

// Sidebar close event (when clicking outside the sidebar or dropdown)
body.addEventListener("click", (e) => {
  const clickedElm = e.target;
  
  // Close the sidebar if clicked outside the sidebar and dropdown area
  if (!clickedElm.closest(".menu") && !clickedElm.closest(".category-btn") && !clickedElm.closest(".category-dropdown")) {
    nav.classList.remove("active");
    dropdown.classList.remove('active'); // Also close the category dropdown
    console.log("Sidebar closed");
  }
});

// Toggle search box
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

// Function to show the modal
function showModal() {
  const authModal = document.getElementById('auth-modal');
  authModal.style.display = 'flex'; // Ensure modal displays as flex to center it
}

// Hide modal when clicking outside modal content
window.onclick = function(event) {
  const authModal = document.getElementById('auth-modal');
  if (event.target === authModal) {
    authModal.style.display = 'none';
  }
}

// Authentication check for cart, saved, and posting buttons
const cartBtn = document.getElementById('cart-btn');
const savedBtn = document.getElementById('saved-btn');
const postingBtn = document.getElementById('posting-btn');
const userLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Check if user is logged in

function handleAuthCheck(event) {
  if (!userLoggedIn) {
    event.preventDefault();
    showModal(); // Show modal if the user is not logged in
  }
}

cartBtn.addEventListener('click', handleAuthCheck);
savedBtn.addEventListener('click', handleAuthCheck);
postingBtn.addEventListener('click', handleAuthCheck);

// Redirect to login/sign-up pages
document.getElementById('signup-btn').addEventListener('click', function() {
  window.location.href = '../Login/Login.html'; // Redirect to sign-up page
});

document.getElementById('login-btn').addEventListener('click', function() {
  window.location.href = '../Login/Login.html'; // Redirect to login page
});

// User dropdown and authentication check
document.addEventListener("DOMContentLoaded", function() {
  const loggedIn = localStorage.getItem('loggedIn');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const signUpButton = document.getElementById('sign-up-btn');
  const userPopup = document.getElementById('user-popup');
  const accountButton = document.getElementById('account-btn');
  const logoutButton = document.getElementById('logout-btn');
  const userDropdown = document.getElementById('user-dropdown');
  const userMenu = document.getElementById('user-menu');

  // Toggle user dropdown visibility on click
  userPopup.addEventListener('click', function(e) {
    e.preventDefault();
    userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Close user dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#user-menu')) {
      userDropdown.style.display = 'none';
    }
  });

  // Check login state and update UI
  if (loggedIn === 'true' && currentUser) {
    signUpButton.style.display = 'none';
    userMenu.style.display = 'block';
    accountButton.textContent = `${currentUser.firstName}'s Profile`;
  } else {
    signUpButton.style.display = 'block';
    userMenu.style.display = 'none';
  }

  // Log out functionality
  logoutButton.addEventListener('click', function() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    window.location.reload();
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const savedPostsContainer = document.getElementById('savedPostsContainer'); // Ensure this matches your HTML

  const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];

  if (savedPosts.length === 0) {
      savedPostsContainer.innerHTML = '<p>No saved posts.</p>';
      return;
  }

  savedPosts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('saved-post');

      postElement.innerHTML = `
          <div class="post-image">
            <img src="${post.image}" alt="${post.title}">
          </div>
          <div class="post-details">
            <h3>${post.title}</h3>
            <p><strong>Description:</strong> ${post.description}</p>
            <p><strong>Category:</strong> ${post.category}</p>
            <p><strong>Location:</strong><a href="${googleMapsLink}" target="_blank">${post.location}</a></p>
            ${post.category === 'Private' ? `<p><strong>Price:</strong> ${post.price} ${post.currency}</p>` : ''}
          </div>
          <div class="buttonsPost">
            <button class="contactButton">Contact</button>
            <button class="saveButton">Save</button>
            ${post.category === 'Private' ? `<button class="buyButton">Buy</button>` : ''}
          </div>
      `;

      savedPostsContainer.appendChild(postElement);

      postElement.querySelector('.unsaveButton').addEventListener('click', function() {
          handleUnsave(post);
          savedPostsContainer.removeChild(postElement); // Remove from display
      });
  });
});
function handleSave(post) {
  let savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
  
  // Check if the post is already saved
  const index = savedPosts.findIndex(savedPost => savedPost.title === post.title);

  if (index === -1) { // If not already saved
      savedPosts.push(post); // Add the current post to the array
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts)); // Save the updated array back to localStorage
      alert('Post saved!');

      // Replace Save button with Unsave
      updateSaveButton(post, true);
  } else {
      alert('Post is already saved!');
  }
}

// Function to update save/unsave button
function updateSaveButton(post, isSaved) {
  const postElements = document.querySelectorAll('.post'); // Get all post elements
  postElements.forEach(postElement => {
      const titleElement = postElement.querySelector('h3');
      if (titleElement && titleElement.textContent === post.title) {
          const saveButton = postElement.querySelector('.saveButton');
          if (isSaved) {
              saveButton.textContent = 'Unsave';
              saveButton.removeEventListener('click', handleSave);
              saveButton.addEventListener('click', function () {
                  handleUnsave(post);
              });
          } else {
              saveButton.textContent = 'Save';
              saveButton.removeEventListener('click', handleUnsave);
              saveButton.addEventListener('click', function () {
                  handleAuthCheck(() => handleSave(post));
              });
          }
      }
  });
}

// Handle the unsave functionality
function handleUnsave(post) {
  let savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
  savedPosts = savedPosts.filter(savedPost => savedPost.title !== post.title); // Remove post from saved posts
  localStorage.setItem('savedPosts', JSON.stringify(savedPosts)); // Save the updated array back to localStorage
  alert('Post unsaved!');

  // Replace Unsave button with Save
  updateSaveButton(post, false);
}
document.querySelectorAll('.category-dropdown .dropdown a').forEach(link => {
  
  link.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    const category = link.dataset.category; // Use dataset to get the category
    window.location.href = `../Search/search.html?category=${encodeURIComponent(category)}`; // Redirect to search.html
  });
});