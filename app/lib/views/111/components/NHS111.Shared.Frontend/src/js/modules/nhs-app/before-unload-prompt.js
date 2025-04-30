import { featureIsEnabled } from "../utils/feature-flags";

let shouldPreventUnload = true;
let beforeUnloadPromptEnabled = true;

export function disableBeforeUnloadError() {
  beforeUnloadPromptEnabled = false;
}

export function preventBeforeUnloadError() {
  shouldPreventUnload = false;
  setTimeout(() => {
    shouldPreventUnload = true;
  }, 5);
}

export function initBeforeUnloadPrompt() {
  if (!featureIsEnabled("NHSAppBeforeUnloadPrompt")) {
    return;
  }

  document.body.addEventListener("click", (e) => {
    preventBeforeUnloadError();
  });

  window.addEventListener("pageshow", (e) => {
    shouldPreventUnload = true;
  });

  window.addEventListener("beforeunload", (e) => {
    if (shouldPreventUnload && beforeUnloadPromptEnabled) {
      e.returnValue =
        "Do you want to leave 111 online? Your progress will not be saved.";
      return false;
    }

    return null;
  });
}
