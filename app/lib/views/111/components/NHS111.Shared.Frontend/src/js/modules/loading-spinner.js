import { ariaPoliteMessage } from "./utils/aria-live";

export class LoadingSpinner {
  constructor(el) {
    this.el = el;
    this.setSpinnerTextTemplate(el.dataset.loadingSpinner);
    this.intercept = true;

    this.spinner = document.createElement("div");
    this.spinner.innerHTML = `<div class="app-loading-overlay__inner"><p class="app-loading-overlay__text"></p><div class="app-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`;
    this.spinner.classList.add("app-loading-overlay");
    this.spinnerTextElement = this.spinner.querySelector(
      ".app-loading-overlay__text"
    );
  }

  static checkSupport() {
    if (typeof String.prototype.matchAll !== "function") {
      return false;
    }

    // eslint-disable-next-line no-prototype-builtins
    if (!Element.prototype.hasOwnProperty("remove")) {
      // IE11 can't manage this so bail out
      return false;
    }

    return true;
  }

  setSpinnerTextTemplate(spinnerTextTemplate) {
    this.spinnerTextTemplate = spinnerTextTemplate;
  }

  /**
   * Replaces embedded data in the spinner text template with actual values from hidden fields
   * The embedded data is of the form {{CSS_SELECTOR}} where CSS_SELECTOR is a valid CSS selector
   * targeting a hidden field to be passed to document.querySelector
   *
   * For example, the following template:
   *
   *    Searching for services near to {{[name=CurrentPostcode]}}
   *
   * would look for a field with a name of CurrentPostcode and inject the value from it.
   *
   * @returns {string} Text to be used in the spinner
   */
  processSpinnerTextEmbeddedData() {
    let spinnerText = this.spinnerTextTemplate;
    const dataSelectors = Array.from(
      this.spinnerTextTemplate.matchAll(/{{(.*?)}}/g)
    ).map((match) => match[1]);

    dataSelectors.forEach((selector) => {
      spinnerText = spinnerText.replace(
        `{{${selector}}}`,
        document.querySelector(selector).value
      );
    });

    return spinnerText;
  }

  showLoadingSpinner() {
    const spinnerTextContent = this.processSpinnerTextEmbeddedData();
    this.spinnerTextElement.textContent = spinnerTextContent;

    ariaPoliteMessage(`Please wait - ${spinnerTextContent}`);

    this.el.after(this.spinner);

    setTimeout(this.hideLoadingSpinner.bind(this), 30000); // Hide the loading spinner again after 30s as a safety net - let people try again
  }

  hideLoadingSpinner() {
    this.spinner.remove();
  }

  handleEvent(e) {
    const target = e.currentTarget;
    if (this.intercept) {
      e.preventDefault();
      this.showLoadingSpinner();

      // Fire off the original event, but make sure we don't intercept it again
      this.intercept = false;

      setTimeout(() => {
        if (this.el.tagName.toLowerCase() === "form") {
          target.submit();
        } else {
          target.click();
        }

        this.intercept = true;
      }, 100); // Non zero delay to allow voiceover time to register the aria message
    }
  }

  init() {
    if (this.el.tagName.toLowerCase() === "form") {
      this.el.addEventListener("submit", this.handleEvent.bind(this));
    } else {
      this.el.addEventListener("click", this.handleEvent.bind(this));
    }

    window.addEventListener("pagehide", this.hideLoadingSpinner.bind(this));
    window.addEventListener("pageshow", this.hideLoadingSpinner.bind(this));

    document.body.addEventListener(
      "hide-loading-spinner",
      this.hideLoadingSpinner.bind(this)
    );
  }
}

export default () => {
  if (!LoadingSpinner.checkSupport()) {
    return;
  }

  const loadingSpinnerTriggers = Array.from(
    document.querySelectorAll("[data-loading-spinner]")
  );
  loadingSpinnerTriggers.forEach((el) => {
    new LoadingSpinner(el).init();
  });
};

window.LoadingSpinner = LoadingSpinner; // Expose global for location page. Remove this once it's been refactored to use proper imports
