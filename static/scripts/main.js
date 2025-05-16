const startYear = 2009;
const currentYear = new Date().getFullYear();
const numericString = (string) => string.replace(/\D/g, ""); /* Numbers only */
console.log(currentYear);
document.getElementById("current-year").textContent = currentYear;
document.getElementById("years").textContent = currentYear - startYear;
document.getElementById("mailto").addEventListener("click", () => {
  window.location.href = atob(
    "bWFpbHRvOmxhd0BkYXZpZGphbWVza25pZ2h0LmNvbT9zdWJqZWN0PUFwcGVsbGF0ZSUyMFN1cHBvcnQlMjBJbnF1aXJ5"
  );
});
