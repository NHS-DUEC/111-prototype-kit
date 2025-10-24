import { initBackAction } from "./modules/nhs-app/back-action";
import { initBeforeUnloadPrompt } from "./modules/nhs-app/before-unload-prompt";
import { initInactivityTimeout } from "./modules/nhs-app/inactivity-timeout";

document.addEventListener("DOMContentLoaded", () => {
  initInactivityTimeout();
  initBeforeUnloadPrompt();
  initBackAction();
});
