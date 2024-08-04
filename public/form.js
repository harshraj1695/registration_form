document.addEventListener('DOMContentLoaded', function() {
    // Populate the states dropdown
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
        "West Bengal"
    ];

    const selectElement = document.getElementById('inputState');
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        selectElement.appendChild(option);
    });

    // Email validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    emailInput.addEventListener('input', function() {
        const emailValue = emailInput.value;
        const validEmailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

        if (validEmailPattern.test(emailValue)) {
            emailError.textContent = '';
        } else {
            emailError.textContent = 'Please enter a valid email address.';
        }
    });

    // Password visibility toggle and validation
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');
    const errorMessage = document.getElementById('error-message');

    if (passwordInput && togglePasswordButton) {
        togglePasswordButton.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePasswordButton.classList.add('fa-eye-slash');
                togglePasswordButton.classList.remove('fa-eye');
            } else {
                passwordInput.type = 'password';
                togglePasswordButton.classList.add('fa-eye');
                togglePasswordButton.classList.remove('fa-eye-slash');
            }
        });
    } else {
        console.error('Password input or toggle button not found.');
    }

    const passwordRequirements = [
        { regex: /.{8,}/, message: "Password must be at least 8 characters long." },
        { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter." },
        { regex: /[a-z]/, message: "Password must contain at least one lowercase letter." },
        { regex: /[0-9]/, message: "Password must contain at least one number." },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "Password must contain at least one allowed special character." }
    ];

    const disallowedCharacters = [
        ' ', ',', '"', "'", ';', '\\', '/', '%', '^', '~', '|', '[', ']', '{', '}', '<', '>'
    ];

    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        let valid = true;
        errorMessage.innerHTML = "";

        for (const requirement of passwordRequirements) {
            if (!requirement.regex.test(password)) {
                errorMessage.innerHTML += `<p>${requirement.message}</p>`;
                valid = false;
            }
        }

        for (const char of password) {
            if (disallowedCharacters.includes(char)) {
                errorMessage.innerHTML += `<p>The character "${char}" is not allowed.</p>`;
                valid = false;
            }
        }

        if (valid) {
            errorMessage.innerHTML = "<p class='valid'>Password is valid.</p>";
        }
    });

    // City validation
    const cityInput = document.getElementById('inputCity');
    const cityErrorMessage = document.getElementById('city-error-message');

    cityInput.addEventListener('input', function() {
        const city = cityInput.value;
        const regex = /^[A-Za-z]+$/;
        if (!regex.test(city)) {
            cityErrorMessage.textContent = "Only alphabets are allowed.";
        } else {
            cityErrorMessage.textContent = "";
        }
    });

    // First and Last Name validation
    function validateInput(inputElement, errorElement) {
        const value = inputElement.value;
        if (/\d/.test(value)) {
            errorElement.style.display = 'block';
        } else {
            errorElement.style.display = 'none';
        }
    }

    document.getElementById('firstName').addEventListener('input', function() {
        validateInput(this, document.getElementById('firstNameError'));
    });

    document.getElementById('lastName').addEventListener('input', function() {
        validateInput(this, document.getElementById('lastNameError'));
    });

    // Form submission
    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent default form submission

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Disable the submit button to prevent multiple submissions

        try {
            const response = await fetch('http://localhost:3000/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Redirect to welcome.html with the first name in query parameters
                window.location.href = `welcome.html?firstName=${encodeURIComponent(data.first_name)}`;
            } else {
                // Handle errors
                console.error('Error:', result.error);
                alert('Submission failed. Please try again.');
                submitButton.disabled = false; // Re-enable the submit button
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
            submitButton.disabled = false; // Re-enable the submit button
        }
    });
});
