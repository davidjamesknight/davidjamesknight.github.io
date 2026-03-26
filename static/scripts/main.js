const startYear = 2009;
const currentYear = new Date().getFullYear();

document.getElementById("current-year").textContent = currentYear;
document.getElementById("years").textContent = currentYear - startYear;

document.getElementById("mailto").addEventListener("click", () => {
  // Encoded mailto to prevent simple scraping
  window.location.href = atob(
    "bWFpbHRvOmxhd0BkYXZpZGphbWVza25pZ2h0LmNvbT9zdWJqZWN0PVRyYWRlbWFyayUyMCYlMjBUVEFCJTIwSW5xdWlyeQ==",
  );
});
