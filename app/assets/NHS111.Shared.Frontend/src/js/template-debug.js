/**
 * Template debugging toggle button.
 * Will only be enabled when the TemplateDebug environment variable is set to true
 */
const templateDebugControl = document.createElement("div");
templateDebugControl.classList.add("template-debug-toggle");
templateDebugControl.innerHTML = `<label>⌸<input type="checkbox"></label>`;

const templateDebugCheckbox = templateDebugControl.querySelector("input");

const init = () => {
  if (window.localStorage.getItem("template-debug-enabled") === "true") {
    templateDebugCheckbox.checked = true;
    document.documentElement.classList.add("template-debug-enabled");
  } else {
    templateDebugCheckbox.checked = false;
    document.documentElement.classList.remove("template-debug-enabled");
  }
};

// Initial setup on page load
init();

// Update state when localStorage has changed in another tab
window.addEventListener("storage", init);

// Toggle when the checkbox is changed
templateDebugCheckbox.addEventListener("change", () => {
  if (templateDebugCheckbox.checked) {
    document.documentElement.classList.add("template-debug-enabled");
  } else {
    document.documentElement.classList.remove("template-debug-enabled");
  }

  window.localStorage.setItem(
    "template-debug-enabled",
    templateDebugCheckbox.checked
  );
});

document.body.appendChild(templateDebugControl);
