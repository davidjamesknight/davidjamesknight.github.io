// Dynamic width sizing ------------------------------
function setOptimalColumnWidth(charPerLine = 65) {
  const mainElement = document.getElementById("main");
  const formContainer = document.getElementById("form-container");
  // Get computed styles of the main element
  const mainStyles = getComputedStyle(mainElement);
  const fontFamily = mainStyles.fontFamily;
  const fontSize = parseFloat(mainStyles.fontSize);

  // Create a temporary span to measure character width
  const testElement = document.createElement("span");
  testElement.style.position = "absolute";
  testElement.style.visibility = "hidden";
  testElement.style.whiteSpace = "nowrap";
  testElement.style.fontFamily = fontFamily;
  testElement.style.fontSize = `${fontSize}px`;
  testElement.textContent =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  document.body.appendChild(testElement);

  // Calculate average character width
  const avgCharWidth = testElement.offsetWidth / testElement.textContent.length;

  // Remove test element
  document.body.removeChild(testElement);

  // Calculate optimal column width
  const maxWidth = Math.round(avgCharWidth * charPerLine);

  // Apply max-width to <main> and <form>
  mainElement.style.maxWidth = `${maxWidth}px`;
  mainElement.style.margin = "0 auto"; // Center content
  formContainer.style.maxWidth = `${maxWidth}px`;
  formContainer.style.margin = "0 auto"; // Center content
}

// Run function on page load
document.addEventListener("DOMContentLoaded", () => setOptimalColumnWidth());
