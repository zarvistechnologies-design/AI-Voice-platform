const themeToggle = document.querySelector(".theme-toggle");
const toggleIcon = document.querySelector(".toggle-icon");
const toggleText = document.querySelector(".toggle-text");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

function updateThemeButton() {
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  toggleIcon.textContent = isDark ? "☀" : "☾";
  toggleText.textContent = isDark ? "Light" : "Dark";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  updateThemeButton();
});

updateThemeButton();
