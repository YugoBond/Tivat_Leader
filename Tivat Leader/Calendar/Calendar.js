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



// Calendar functionality
document.addEventListener('DOMContentLoaded', function () {
    const calendarHeader = document.getElementById('calendarHeader');
    const weekdaysContainer = document.getElementById('weekdaysContainer');
    const daysContainer = document.getElementById('daysContainer');
    const eventModal = document.getElementById('eventModal');
    const eventViewModal = document.getElementById('eventViewModal');
    const eventViewModalContent = document.getElementById('eventViewModalContent');
    const addEventBtn = document.getElementById('addEventBtn');
    const submitEventBtn = document.getElementById('submitEventBtn');
    const cancelEventModalBtn = document.getElementById('cancelEventBtn');

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    // Array for weekday names
    const weekdayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    // Event storage, each day can hold multiple events
    let events = {};

    function renderCalendar(month, year) {
        daysContainer.innerHTML = ''; // Clear previous calendar
        weekdaysContainer.innerHTML = ''; // Clear previous weekdays
        const firstDay = new Date(year, month).getDay(); // Day of the week the month starts on
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Number of days in the month

        // Set the header (month and year)
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        calendarHeader.innerHTML = `${monthNames[month]} ${year}`;

        // Render weekday names
        weekdayNames.forEach(function (weekday) {
            const weekdayBox = document.createElement('div');
            weekdayBox.classList.add('weekday');
            weekdayBox.innerText = weekday;
            weekdaysContainer.appendChild(weekdayBox);
        });

        // Create empty boxes for the first week
        const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1; // Adjust for Sunday start (0 index)
        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyBox = document.createElement('div');
            emptyBox.classList.add('day-box', 'empty');
            daysContainer.appendChild(emptyBox);
        }

        // Create day boxes
for (let day = 1; day <= daysInMonth; day++) {
  const dayBox = document.createElement('div');
  dayBox.classList.add('day-box');

  // Format the date string to check for events
  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Check if there are events for the day
  if (events[dateString] && events[dateString].length > 0) {
      dayBox.classList.add('event'); // Add class for days with events
      // Removed opacity change
  }

  dayBox.innerText = day;

  // Add event handler for clicking the day
  dayBox.addEventListener('click', function () {
      displayEventsForDay(day);
  });

  daysContainer.appendChild(dayBox);
}}

    // Display events for a selected day
function displayEventsForDay(day) {
    eventViewModalContent.innerHTML = '<div class="modal-header">Events</div>';
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventList = events[dateString] || [];

    // Sort events by time
    eventList.sort((a, b) => {
        return a.time.localeCompare(b.time); // Sort by time string
    });

    if (eventList.length > 0) {
        eventList.forEach(event => {
            const eventDetail = document.createElement('div');
            eventDetail.classList.add('event-detail');
            eventDetail.innerHTML = `
                <h4>${event.title}</h4>
                <img src="${event.poster}" alt="Event Poster">
                <p>${event.description}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong></p> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}" target="_blank">${event.location}</a></p>
                <p><strong>Organizer:</strong> ${event.organizer}</p>
            `;
            eventViewModalContent.appendChild(eventDetail);
            const hr = document.createElement('hr');
            eventViewModalContent.appendChild(hr);
        });
    } else {
        eventViewModalContent.innerHTML += '<p>No events for this day.</p>';
    }
    eventViewModal.style.display = 'flex'; // Show the modal
}

    // Open Add Event modal
    addEventBtn.addEventListener('click', function () {
        eventModal.style.display = 'flex'; // Show the modal
    });

    // Close the modal when clicking the cancel button
cancelEventModalBtn.addEventListener('click', function () {
  eventModal.style.display = 'none'; // Hide modal
});

    // Hide modal when clicking outside modal content
    window.onclick = function(event) {
        if (event.target === eventModal) {
            eventModal.style.display = 'none'; // Hide modal
        }
        if (event.target === eventViewModal) {
            eventViewModal.style.display = 'none'; // Hide modal
        }
    };

    // Submit Event functionality
    submitEventBtn.addEventListener('click', function () {
        const eventDate = document.getElementById('eventDate').value;
        const eventTitle = document.getElementById('eventTitle').value;
        const eventDescription = document.getElementById('eventDescription').value;
        const eventTime = document.getElementById('eventTime').value;
        const eventLocation = document.getElementById('eventLocation').value;
        const eventOrganizer = document.getElementById('eventOrganizer').value;
        const eventPoster = document.getElementById('eventPoster').files[0];

        // Check if all required fields are filled
        if (!eventDate || !eventTitle || !eventDescription || !eventTime || !eventLocation || !eventOrganizer) {
            alert('Please fill out all fields.');
            return;
        }

        // Create a new event object
        const newEvent = {
            title: eventTitle,
            description: eventDescription,
            time: eventTime,
            location: eventLocation,
            organizer: eventOrganizer,
            poster: URL.createObjectURL(eventPoster) // Create a URL for the uploaded file
        };

        // Use the date input as the key to store events
        if (!events[eventDate]) {
            events[eventDate] = [];
        }
        events[eventDate].push(newEvent);

        // Reset the modal inputs
        document.getElementById('eventDate').value = '';
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDescription').value = '';
        document.getElementById('eventTime').value = '';
        document.getElementById('eventLocation').value = '';
        document.getElementById('eventOrganizer').value = '';
        document.getElementById('eventPoster').value = '';

        // Close the modal
        eventModal.style.display = 'none';

        // Re-render the calendar to reflect the new event
        renderCalendar(currentMonth, currentYear);
    });

    renderCalendar(currentMonth, currentYear); // Initial render
});
document.querySelectorAll('.category-dropdown .dropdown a').forEach(link => {
  
  link.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    const category = link.dataset.category; // Use dataset to get the category
    window.location.href = `../Search/search.html?category=${encodeURIComponent(category)}`; // Redirect to search.html
  });
});