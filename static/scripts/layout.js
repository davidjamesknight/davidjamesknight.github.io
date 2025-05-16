// Dynamic width sizing ------------------------------
function setOptimalColumnWidth(charPerLine = 65) {
  const optimizedElements = document.getElementsByClassName("optimal-width");
  const mainElement = document.querySelector("main");
  // const formContainer = document.getElementById("form-container");
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

  [...optimizedElements].forEach((element) => {
    element.style.maxWidth = `${maxWidth}px`;
    element.style.margin = "0 auto";
  });
}

function centerCallToAction() {
  const logoHeight = document
    .getElementById("logo")
    .getBoundingClientRect().height;
  const main = document.getElementById("main");
  main.style.marginTop = `-${logoHeight}px`;
}

// Run function on page load
document.addEventListener("DOMContentLoaded", () => {
  setOptimalColumnWidth();
  centerCallToAction();
});
