const menuIconbutton = document.querySelector("[menu-icon-btn]");

const sidebar = document.querySelector("[data-sidebar]");

menuIconbutton.addEventListener("click", () => {
  // open side bar || close sidebar
  sidebar.classList.toggle("open");
});
