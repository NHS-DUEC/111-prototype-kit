import { logClick } from "../utils/event-logging";

import { preventBeforeUnloadError } from "./before-unload-prompt";

export function initBackAction() {
  // See NHS111.Web/Views/Shared/_JsBackLink.cshtml template
  // Used on static pages linked from footer such as privacy policy, T&Cs
  // These open in the same "tab" inside the nhs app, and so users need a way back
  const backLink = document.querySelector("[data-js-back-link]");
  if (backLink) {
    if (window.history.length > 1) {
      backLink.addEventListener("click", (e) => {
        e.preventDefault();
        preventBeforeUnloadError();
        logClick("NHS App navigate back");
        window.history.back();
      });
    } else {
      backLink.closest(".nhsuk-back-link").remove();
    }
  }
}
