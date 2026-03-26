// Full form.js for Google Sheets Submission
const form = document.getElementById("contact-form");
const name_ = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");
const responseMessage = document.getElementById("response-message");

/** * Validation Functions
 * These ensure the data is clean before hitting your Google Script
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidName(name) {
  const nameRegex = /^[A-Za-z\s.'’-]+$/;
  return nameRegex.test(name);
}

function isValidMessage(msg) {
  const messageRegex = /^[A-Za-z0-9\s.,!?'"()$-]+$/;
  return messageRegex.test(msg) && !/[<>{}\[\]]/.test(msg);
}

/**
 * Form Submit Event Listener
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Stop page reload

  // Clear previous UI states
  responseMessage.textContent = "Sending...";
  responseMessage.style.color = "black";

  const trimmedName = name_.value.trim();
  const trimmedEmail = email.value.trim();
  const trimmedMessage = message.value.trim();

  // 1. Run Validations
  if (!isValidName(trimmedName)) {
    responseMessage.textContent =
      "Please enter a valid name (letters, spaces, and hyphens only).";
    responseMessage.style.color = "red";
    return;
  }

  if (!isValidEmail(trimmedEmail)) {
    responseMessage.textContent = "Please enter a valid email address.";
    responseMessage.style.color = "red";
    return;
  }

  if (!isValidMessage(trimmedMessage)) {
    responseMessage.textContent =
      "Please enter a valid message (no brackets [] or {} allowed).";
    responseMessage.style.color = "red";
    return;
  }

  // 2. Prepare Payload
  // URLSearchParams is used so the data is parsed correctly by Google's e.parameter
  const params = new URLSearchParams();
  params.append("name", trimmedName);
  params.append("email", trimmedEmail);
  params.append("message", trimmedMessage);

  // 3. Decode the obscured Endpoint
  const endpoint = atob(
    "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4UDYxWlE5ZGcycDNVZGlGNmtiMnVrZThXZkdwdUZVdVBjaTFXWmJ6elZRTFIyVUstTE50SlZVSW1KTjk5NkJGcEQvZXhlYw==",
  );

  try {
    // 4. Execute Request
    // mode: "no-cors" is required for Google Apps Script endpoints to avoid CORS errors
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    // 5. Success UI Update
    responseMessage.textContent = "Thank you! Your message has been sent.";
    responseMessage.style.color = "green";
    form.reset(); // Clear the form for the next user
  } catch (error) {
    console.error("Submission Error:", error);
    responseMessage.textContent = "An error occurred. Please try again.";
    responseMessage.style.color = "red";
  }
});
