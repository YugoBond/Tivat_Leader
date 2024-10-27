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

document.addEventListener('DOMContentLoaded', function () {
  const postForm = document.getElementById('postForm');
  const categorySelect = document.getElementById('postCategory');
  const priceContainer = document.getElementById('priceContainer');
  const postPriceInput = document.getElementById('postPrice');
  const currencySelect = document.getElementById('currencySelect');
  const proceedButton = document.getElementById('proceedButton');
  const cancelButton = document.getElementById('cancelButton');

  // Handle category change
  categorySelect.addEventListener('change', function() {
      if (categorySelect.value === 'Private') {
          priceContainer.style.display = 'block';
          postPriceInput.setAttribute('required', 'required');
      } else {
          priceContainer.style.display = 'none';
          postPriceInput.removeAttribute('required');
          postPriceInput.value = ''; // Clear price when not required
      }
  });

  // Handle form submission
  postForm.addEventListener('submit', function(event) {
     event.preventDefault(); // Prevent the default form submission

      // Validate and gather form data
      const title = document.getElementById('postTitle').value;
      const description = document.getElementById('postDescription').value;
      const category = categorySelect.value;
      const location = document.getElementById('postLocation').value;
      const price = category === 'Private' ? postPriceInput.value : null;
      const currency = currencySelect.value;
      const imageFile = document.getElementById('postImage').files[0];

      if (category === 'Private' && !price) {
          alert('Please enter a price for Private category.');
          return;
      }

      if (imageFile) {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onloadend = function() {
              const imageDataUrl = reader.result;

              // Create post object
              const post = {
                  title,
                  description,
                  category,
                  location,
                  image: imageDataUrl,
                  price,
                  currency,
                  isPaid: false // Initially mark post as not paid
              };

              savePostToLocalStorage(post);
              window.location.href = '../Payment/Payment.html'; // Redirect to payment page
          };
      } else {
          alert('Please upload an image.');
      }
  });

  // Save post to localStorage
  function savePostToLocalStorage(post) {
      let posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.push(post);
      localStorage.setItem('posts', JSON.stringify(posts));
      console.log('Post saved:', posts);  // Add this for debugging
  }

  // Handle cancel button click
  cancelButton.addEventListener('click', function() {
      window.location.href = '../Main/main.html'; // Redirect to the main page
  });
});
document.querySelectorAll('.category-dropdown .dropdown a').forEach(link => {
  
  link.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    const category = link.dataset.category; // Use dataset to get the category
    window.location.href = `../Search/search.html?category=${encodeURIComponent(category)}`; // Redirect to search.html
  });
});
