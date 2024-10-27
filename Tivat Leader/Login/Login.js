document.addEventListener("DOMContentLoaded", function () {
    const predefinedUsers = [
        { email: 'admin@example.com', password: 'AdminPassword123!', role: 'admin' },
        { email: 'user@example.com', password: 'UserPassword123!', role: 'user' }
    ];

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const formTitle = document.getElementById('form-title');

    const switchToSignupLink = document.getElementById('switch-to-signup-link');
    const switchToLoginLink = document.getElementById('switch-to-login-link');
    const switchToForgotPasswordLink = document.getElementById('switch-to-forgot-password-link');
    const switchToLoginFromForgotLink = document.getElementById('switch-to-login-link-from-forgot');

    // Switching between Login and Sign Up
    switchToSignupLink.addEventListener('click', function () {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        forgotPasswordForm.style.display = 'none';
        formTitle.textContent = 'Sign Up';
        document.title = 'Sign Up';
    });

    switchToLoginLink.addEventListener('click', function () {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        forgotPasswordForm.style.display = 'none';
        formTitle.textContent = 'Login';
        document.title = 'Login';
    });

    switchToForgotPasswordLink.addEventListener('click', function () {
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        forgotPasswordForm.style.display = 'block';
        formTitle.textContent = 'Forgot Password';
        document.title = 'Forgot Password';
    });

    switchToLoginFromForgotLink.addEventListener('click', function () {
        forgotPasswordForm.style.display = 'none';
        loginForm.style.display = 'block';
        formTitle.textContent = 'Login';
        document.title = 'Login';
    });

    // Toggle password visibility for login
    const togglePassword = document.getElementById('toggle-password');
    const loginPassword = document.getElementById('password');
    togglePassword.addEventListener('click', function () {
        if (loginPassword.type === 'password') {
            loginPassword.type = 'text';
            togglePassword.classList.replace('bx-show', 'bx-hide');
        } else {
            loginPassword.type = 'password';
            togglePassword.classList.replace('bx-hide', 'bx-show');
        }
    });

    // Toggle password visibility for sign-up
    const toggleSignupPassword = document.getElementById('toggle-signup-password');
    const signupPassword = document.getElementById('signup-password');
    toggleSignupPassword.addEventListener('click', function () {
        if (signupPassword.type === 'password') {
            signupPassword.type = 'text';
            toggleSignupPassword.classList.replace('bx-show', 'bx-hide');
        } else {
            signupPassword.type = 'password';
            toggleSignupPassword.classList.replace('bx-hide', 'bx-show');
        }
    });

    // Toggle password visibility for repeat password
    const toggleRepeatPassword = document.getElementById('toggle-repeat-password');
    const repeatPassword = document.getElementById('repeat-password');
    toggleRepeatPassword.addEventListener('click', function () {
        if (repeatPassword.type === 'password') {
            repeatPassword.type = 'text';
            toggleRepeatPassword.classList.replace('bx-show', 'bx-hide');
        } else {
            repeatPassword.type = 'password';
            toggleRepeatPassword.classList.replace('bx-hide', 'bx-show');
        }
    });

    // Basic form validation for sign-up
    document.getElementById('signup-btn').addEventListener('click', function (event) {
        event.preventDefault();

        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const repeatPassword = document.getElementById('repeat-password').value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        if (!firstName || !lastName) {
            alert("Please enter your first and last name.");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email.");
            return;
        }

        if (!passwordRegex.test(password)) {
            alert("Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
            return;
        }

        if (password !== repeatPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Save the new user data to localStorage (for simplicity)
        const newUser = { firstName, lastName, email, password, role: 'user' }; // Assign 'user' role for sign-ups
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Show loading and redirect
        showLoading();
        setTimeout(() => {
            window.location.href = '../Main/main.html'; // Redirect after 3 seconds
        }, 6950);
    });

    // Basic form validation for login
    document.getElementById('login-btn').addEventListener('click', function (event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Check predefined users
        const user = predefinedUsers.find(user => user.email === email && user.password === password);
        
        if (user) {
            // If a predefined user is found
            const currentUser = {
                firstName: user.role === 'admin' ? 'Danilo' : 'John', // Replace with actual first name from user data
                lastName: 'M', // You can change this based on your needs
                email: user.email,
                role: user.role
            };

            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showLoading();
            setTimeout(() => {
                window.location.href = '../Main/main.html'; // Redirect after 3 seconds
            }, 6950);
        } else {
            alert("Invalid email or password.");
        }
    });

    // Forgot Password Form validation (just email)
    document.getElementById('forgot-password-btn').addEventListener('click', function (event) {
        event.preventDefault();
        const email = document.getElementById('forgot-password-email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email.");
            return;
        }

        alert("Password reset instructions have been sent to your email.");
    });

    // Function to show loading
    function showLoading() {
        const loadingContainer = document.getElementById('loading-container');
        loadingContainer.style.display = 'flex'; // Show the loading container
        loginForm.style.display = 'none'; // Hide the login form
        signupForm.style.display = 'none'; // Hide the signup form
        forgotPasswordForm.style.display = 'none'; // Hide the forgot password form
    }
});
