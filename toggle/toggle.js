const card = document.getElementById("card");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
