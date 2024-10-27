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
document.querySelectorAll('.category-dropdown .dropdown a').forEach(link => {
  
  link.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    const category = link.dataset.category; // Use dataset to get the category
    window.location.href = `../Search/search.html?category=${encodeURIComponent(category)}`; // Redirect to search.html
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const postContainer = document.getElementById('postContainer'); // Ensure this matches your HTML
  const userLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Check if user is logged in

  loadPosts();

  // Function to load and display posts
  function loadPosts() {
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      if (posts.length === 0) {
        setModalColors(postContainer.innerHTML);
          postContainer.innerHTML = '<p>No posts available.</p>'; // Display message if no posts are found
          return;
      }

      // Clear existing content
      postContainer.innerHTML = '';

      posts.forEach(post => {
          // Create HTML structure for each post
          const postElement = document.createElement('div');
          postElement.classList.add('post'); // Add any styling classes as needed
          const googleMapsLink = `https://www.google.com/maps/search/${encodeURIComponent(post.location)}`;

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

          postContainer.appendChild(postElement);

          // Add event listeners for the buttons
        postElement.querySelector('.contactButton').addEventListener('click', function () {
          handleAuthCheck(() => handleContact(post)); // Use auth check
      });

      postElement.querySelector('.saveButton').addEventListener('click', function () {
          handleAuthCheck(() => handleSave(post)); // Use auth check
      });

      if (post.category === 'Private') {
          postElement.querySelector('.buyButton').addEventListener('click', function () {
              handleAuthCheck(() => handleBuy(post)); // Use auth check
          });
      }
      });
  }

  // Function to handle the Contact button
  function handleContact(post) {
      const postDetails = `Title: ${post.title}\nCategory: ${post.category}\nDescription: ${post.description}\nLocation: ${post.location}\nPrice: ${post.price}`;
      
      html2canvas(postContainer).then(function(canvas) {
          const dataURL = canvas.toDataURL(); // Get the screenshot
          const mailToLink = `https://mail.google.com/mail/?view=cm&fs=1&to=danilo.milasevic.business@gmail.com&su=Post Details&body=${encodeURIComponent(postDetails)}`;
          
          window.open(mailToLink, '_blank'); // Open Gmail with prefilled details
      });
  }

  // Function to handle the Save button
  function handleSave(post) {
      let savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || []; // Get existing saved posts or create an empty array
      savedPosts.push(post); // Add the current post to the array
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts)); // Save the updated array back to localStorage
      alert('Post saved!');
  }

  // Function to handle the Buy button
  function handleBuy(post) {
      alert(`You have selected to buy: ${post.title} for ${post.price} ${post.currency}`);
      // Additional code to handle buying process
  }

  // Function to check login status and show modal if user is not logged in
  function handleAuthCheck(callback) {
      if (!userLoggedIn) {
          showModal(); // Show modal if user is not logged in
      } else {
          callback(); // Execute the callback if user is logged in
      }
  }
  // Search functionality
  searchButton.addEventListener('click', function () {
    const query = searchInput.value.toLowerCase(); // Get the search query
    const allPosts = JSON.parse(localStorage.getItem('posts')) || []; // Fetch all posts

    // Filter posts by title
    const filteredPosts = allPosts.filter(post => post.title.toLowerCase().includes(query));

    loadPosts(filteredPosts); // Load filtered posts
});
});
document.querySelectorAll('.category-dropdown .dropdown a').forEach(link => {
  
  link.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    const category = link.dataset.category; // Use dataset to get the category
    window.location.href = `../Search/search.html?category=${encodeURIComponent(category)}`; // Redirect to search.html
  });
});