document.addEventListener('DOMContentLoaded', function () {
  const overviewBtn = document.getElementById('dashboard-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const postsBtn = document.getElementById('posts-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const deleteAccountBtn = document.getElementById('delete-account-btn');
  const backHomeBtn = document.getElementById('back-home-btn');
  const overviewSection = document.getElementById('overview-section');
  const settingsSection = document.getElementById('settings-section');
  const postsSection = document.getElementById('posts-section');
  const profilePicInput = document.getElementById('profile-pic-input');
  const cropperContainer = document.getElementById('cropper-container');
  const cropperImage = document.getElementById('cropper-image');
  const cropBtn = document.getElementById('crop-btn');
  let cropper;

  // Set username and status
  function setUsername() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
      };

      const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
      document.getElementById('username').innerText = fullName;

      // Set user status
      document.getElementById('user-status').innerText = currentUser.role === 'admin' ? 'Admin' : 'User';
  }
  setUsername();

  // Toggle sections visibility
  overviewBtn.addEventListener('click', () => {
      showSection(overviewSection);
  });

  settingsBtn.addEventListener('click', () => {
    console.log("Settings button clicked");
      showSection(settingsSection);
  });
  postsBtn.addEventListener('click', () => {
    showSection(postsSection);
  })

  function showSection(section) {
      const sections = document.querySelectorAll('.section');
      sections.forEach(s => s.classList.remove('active'));
      section.classList.add('active');
  }

  // Log out and delete account functionality
  logoutBtn.addEventListener('click', () => {
      localStorage.setItem('loggedIn', false);
      window.location.href = "../Main/main.html";
  });

  deleteAccountBtn.addEventListener('click', () => {
      const password = prompt('Please enter your password to confirm deletion:');
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (password === user.password) {
          localStorage.removeItem('currentUser');
          localStorage.setItem('loggedIn', false);
          window.location.href = "../Main/main.html";
      } else {
          alert('Password is incorrect. Account deletion canceled.');
      }
  });

  backHomeBtn.addEventListener('click', () => {
      window.location.href = "../Main/main.html";
  });

  // Handle profile picture upload
  profilePicInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              cropperContainer.style.display = 'block'; // Show the cropper container
              cropperImage.src = e.target.result; // Load the image into the cropper
              if (cropper) {
                  cropper.destroy(); // Destroy previous instance if it exists
              }
              cropper = new Cropper(cropperImage, {
                  aspectRatio: 1,
                  viewMode: 1,
              });
          };
          reader.readAsDataURL(file);
      }
  });

  // Crop image and update profile picture
  cropBtn.addEventListener('click', function () {
      const canvas = cropper.getCroppedCanvas();
      const croppedImageDataURL = canvas.toDataURL(); // Get cropped image as data URL
      document.getElementById('profile-pic').src = croppedImageDataURL; // Update profile picture

      // Save cropped image to localStorage
      const updatedProfile = JSON.parse(localStorage.getItem('currentUser')) || {};
      updatedProfile.profilePic = croppedImageDataURL; // Save the new profile picture
      localStorage.setItem('currentUser', JSON.stringify(updatedProfile));

      cropperContainer.style.display = 'none'; // Hide cropper container
      cropper.destroy(); // Destroy cropper instance

      loadUserData(); // Reload user data into the overview section
  });

  // Change saved posts button behavior
  const savedPostsBtn = document.getElementById('saved-posts-btn');
  savedPostsBtn.addEventListener('click', () => {
      window.location.href = "../Saved/Saved.html"; // Redirect to saved posts
  });

  // Save changes in the settings form
  const saveBtn = document.getElementById('save-btn');
  saveBtn.addEventListener('click', () => {
      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const birthDate = document.getElementById('birth-date').value;
      const gender = document.getElementById('gender').value;
      const phone = document.getElementById('phone').value;
      const nation = document.getElementById('nation').value;

      // Get current user data
      const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

      // Update user profile with new data
      const updatedProfile = {
          ...currentUser,
          firstName: firstName || currentUser.firstName,
          lastName: lastName || currentUser.lastName,
          email: email || currentUser.email,
          password: password || currentUser.password,
          birthDate: birthDate || currentUser.birthDate,
          gender: gender || currentUser.gender,
          phone: phone || currentUser.phone,
          nation: nation || currentUser.nation,
      };

      localStorage.setItem('currentUser', JSON.stringify(updatedProfile));
      setUsername(); // Update username and picture in the header
      loadUserData(); // Reload user data into the overview section
  });

  function loadUserData() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      document.getElementById('overview-first-name').innerText = user.firstName;
      document.getElementById('overview-last-name').innerText = user.lastName;
      document.getElementById('overview-email').innerText = user.email;
      document.getElementById('overview-phone').innerText = user.phone;
      document.getElementById('overview-nation').innerText = user.nation;
      document.getElementById('overview-gender').innerText = user.gender;
      document.getElementById('overview-birth-date').innerText = user.birthDate;
      document.getElementById('profile-pic').src = user.profilePic || '../default_profile_picture.png'; // Add a default picture

      // Populate settings form with user data
      document.getElementById('first-name').value = user.firstName;
      document.getElementById('last-name').value = user.lastName;
      document.getElementById('email').value = user.email;
      document.getElementById('password').value = user.password;
      document.getElementById('birth-date').value = user.birthDate;
      document.getElementById('gender').value = user.gender;
      document.getElementById('phone').value = user.phone;
      document.getElementById('nation').value = user.nation;
  }

  loadUserData();
});
document.addEventListener('DOMContentLoaded', function () {
    const postContainer = document.getElementById('postContainer');
    const userLoggedIn = localStorage.getItem('loggedIn') === 'true';

    loadPosts();

    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        if (posts.length === 0) {
            postContainer.innerHTML = `
                <p>No posts available.</p>
                <button id="createPostButton">Create Post</button>
            `;
            document.getElementById('createPostButton').addEventListener('click', function () {
                window.location.href = '../Post/Post.html';
            });
            return;
        }

        postContainer.innerHTML = '';
        
        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
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
                <button class="editButton">Edit</button>
                <button class="deleteButton">Delete</button>
            </div>
            `;

            postContainer.appendChild(postElement);

            // Event listeners for the Edit and Delete buttons
            postElement.querySelector('.editButton').addEventListener('click', function () {
                openEditPopup(post, index);
            });

            postElement.querySelector('.deleteButton').addEventListener('click', function () {
                handleDelete(index);
            });
        });
    }

    // Function to open edit pop-up with pre-filled post data
    function openEditPopup(post, index) {
        const editPopup = document.getElementById('editPopup');
        const titleInput = document.getElementById('editTitle');
        const descriptionInput = document.getElementById('editDescription');
        const categoryInput = document.getElementById('editCategory');
        const locationInput = document.getElementById('editLocation');
        const priceInput = document.getElementById('editPrice');
        
        // Populate form fields with existing post data
        titleInput.value = post.title;
        descriptionInput.value = post.description;
        categoryInput.value = post.category;
        locationInput.value = post.location;
        priceInput.value = post.price;

        // Show the popup
        editPopup.style.display = 'block';

        // Event listener for save button in popup
        document.getElementById('saveEdit').onclick = function () {
            // Update post details with new values from input fields
            post.title = titleInput.value;
            post.description = descriptionInput.value;
            post.category = categoryInput.value;
            post.location = locationInput.value;
            post.price = priceInput.value;

            // Update posts in localStorage
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts[index] = post;
            localStorage.setItem('posts', JSON.stringify(posts));

            // Close the popup and refresh posts
            editPopup.style.display = 'none';
            loadPosts();
        };

        // Event listener for cancel button in popup
        document.getElementById('cancelEdit').onclick = function () {
            editPopup.style.display = 'none';
        };
    }

    // Function to handle delete action
    function handleDelete(index) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.splice(index, 1); // Remove the post from array
        localStorage.setItem('posts', JSON.stringify(posts)); // Update localStorage
        loadPosts(); // Refresh posts display
    }
});
window.addEventListener('scroll', () => {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (window.scrollY > 50) {
      sidebar.classList.add('shrinked');
      mainContent.classList.add('shrinked');
    } else {
      sidebar.classList.remove('shrinked');
      mainContent.classList.remove('shrinked');
    }
  });
  