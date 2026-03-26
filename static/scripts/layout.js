function fitHeroText() {
  const hero = document.getElementById("hero-heading");
  const container = document.querySelector("#hero .container");

  if (!hero || !container || window.innerWidth <= 800) {
    if (hero) hero.style.fontSize = "";
    return;
  }

  // Calculate based on the 1100px max-width container
  hero.style.fontSize = "100px";
  hero.style.display = "inline-block";

  const textWidth = hero.offsetWidth;
  const availableWidth = container.offsetWidth;

  // Use a slightly smaller multiplier for single column breathing room
  const finalSize = (availableWidth / textWidth) * 100 * 0.95;

  hero.style.fontSize = `${finalSize}px`;
  hero.style.display = "block";
}

window.addEventListener("resize", fitHeroText);
document.addEventListener("DOMContentLoaded", fitHeroText);

// Function to focus the contact form name field
function setupCtaFocus() {
  const cta = document.getElementById("hero-cta");
  const nameField = document.getElementById("name");

  if (cta && nameField) {
    cta.addEventListener("click", (e) => {
      // Allow the smooth scroll anchor to work, then focus
      setTimeout(() => {
        nameField.focus();
      }, 800); // Slight delay to wait for scroll progress
    });
  }
}

// Keep your existing fitHeroText logic here if needed
// ...

document.addEventListener("DOMContentLoaded", () => {
  setupCtaFocus();
});
