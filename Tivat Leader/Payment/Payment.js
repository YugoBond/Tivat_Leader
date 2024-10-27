document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const priceSelect = document.getElementById("price");
    const premiumCheckbox = document.getElementById("premium");
    const subtotalDisplay = document.getElementById("subtotal");
    const referrer = document.referrer;
  
    // Set price options based on referrer
    if (referrer.includes("/Post/Post.html")) {
        priceSelect.innerHTML = `
            <option value="10">10 EUR/Month</option>
            <option value="110">110 EUR/Year</option>
            <option value="200">200 EUR/Two Years</option>
        `;
    } else if (referrer.includes("/Main/main.html")) {
        priceSelect.innerHTML = '<option value="price-from-post">Price from Post</option>';
    }

    // Calculate subtotal
    function updateSubtotal() {
        let basePrice = parseFloat(priceSelect.value);
        let premiumPrice = premiumCheckbox.checked ? basePrice * 0.5 : 0;
        let subtotal = basePrice + premiumPrice;
        
        subtotalDisplay.textContent = `${subtotal.toFixed(2)} EUR`; // Update subtotal display
    }

    // Event listeners for price select and premium checkbox
    priceSelect.addEventListener("change", updateSubtotal);
    premiumCheckbox.addEventListener("change", updateSubtotal);

    // Initial subtotal calculation
    updateSubtotal();

    // Form validation and loading popup
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const inputs = form.querySelectorAll("input[type=text], input[type=email], input[type=number]");
        let valid = true;
        // Validate inputs (no empty values)
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                input.style.border = "2px solid red"; // Highlight empty fields
                valid = false;
            } else {
                input.style.border = ""; // Reset border if valid
            }
        });

        if (valid) {
            handlePaymentSuccess();
            showLoadingPopup();
            setTimeout(() => {
                window.location.href = "../Main/main.html"; // Redirect to main page after processing
            }, 6950); // Simulate loading for 6950ms
        }
        
    });

    function showLoadingPopup() {
        const popup = document.createElement("div");
        popup.className = "loading-popup";
        popup.innerHTML = "<p>Processing your payment...</p>";
        document.body.appendChild(popup);
    }

    // Payment success handler
    function handlePaymentSuccess() {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        let lastPost = posts[posts.length - 1];
        if (lastPost) {
            lastPost.isPaid = true;
            
            // Check if user chose a premium option
            const isPremium = document.getElementById("premium").checked; // assuming a premium checkbox
            lastPost.premium = isPremium;
            
            posts[posts.length - 1] = lastPost;
            localStorage.setItem('posts', JSON.stringify(posts));
            window.location.href = '../Main/main.html';
        }
    }
});