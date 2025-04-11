// Form submission logic with validation
const form = document.getElementById("contact-form");
const name_ = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");
const responseMessage = document.getElementById("response-message");

// Validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidName(name) {
  const nameRegex = /^[A-Za-z\s.'’-]+$/; // Allows letters, spaces, apostrophes, and hyphens
  return nameRegex.test(name);
}

function isValidMessage(msg) {
  const messageRegex = /^[A-Za-z0-9\s.,!?'"()$-]+$/; // Allows letters, numbers, spaces, punctuation, and dollar signs
  return messageRegex.test(msg) && !/[<>{}\[\]]/.test(msg); // Blocks brackets
}

// Form submit event listener
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  console.log(name_.value);
  console.log(email.value);
  console.log(message.value);

  // Clear previous messages
  responseMessage.textContent = "";
  responseMessage.style.color = "";

  // Validate form inputs
  if (!isValidName(name_.value.trim())) {
    responseMessage.textContent =
      "Please enter a valid name (letters, spaces, apostrophes, periods, and hyphens only).";
    responseMessage.style.color = "red";
    return;
  }

  if (!isValidEmail(email.value.trim())) {
    responseMessage.textContent = "Please enter a valid email address.";
    responseMessage.style.color = "red";
    return;
  }

  if (!isValidMessage(message.value.trim())) {
    responseMessage.textContent =
      "Please enter a valid message (letters, numbers, common punctuation, and $ only).";
    responseMessage.style.color = "red";
    return;
  }

  // Prepare form data
  const formData = {
    name: name_.value.trim(),
    email: email.value.trim(),
    message: message.value.trim(),
  };

  // Decode the endpoint URL
  const endpoint = atob(
    "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J6Sm5FSFFjYlUyNG1WamdTYVZWOTN2MzBqcVhLTlVqV0NfS2QwaFNDZXYwRGJ5ekFWbWZfc3N5S3k1SG9hSXNVN28vZXhlYw=="
  );

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      mode: "no-cors", // Prevents CORS errors
    });

    responseMessage.textContent = "Thank you! Your message has been sent.";
    responseMessage.style.color = "green";
    form.reset();
  } catch (error) {
    responseMessage.textContent = "An error occurred. Please try again.";
    responseMessage.style.color = "red";
  }
});
