function setCurrentYear() {
  const year = new Date().getFullYear();

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = year;
  });
}

function setupMobileMenu() {
  const menuButton = document.querySelector(".menu");
  const navigation = document.querySelector(".nav");

  if (!menuButton || !navigation) return;

  menuButton.addEventListener("click", () => {
    const menuIsOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(menuIsOpen));
  });
}

function setupDemoForms() {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;

      const originalLabel = submitButton.textContent;
      submitButton.textContent = "Berhasil ✓";
      submitButton.disabled = true;

      window.setTimeout(() => {
        submitButton.textContent = originalLabel;
        submitButton.disabled = false;
        form.reset();
      }, 2200);
    });
  });
}

setCurrentYear();
setupMobileMenu();
setupDemoForms();
