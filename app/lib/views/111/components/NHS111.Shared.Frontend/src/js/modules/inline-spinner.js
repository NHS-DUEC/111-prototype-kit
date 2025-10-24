import { ariaPoliteMessage } from "./utils/aria-live";

export class InlineSpinner {
  constructor(el) {
    this.el = el;
    this.intercept = true;
    this.originalText = this.el.textContent;
    this.isDoubleClickPrevented = !!this.el.dataset.preventDoubleClick;
    this.spinner = document.createElement("span");
    this.spinner.innerHTML = `<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>`;
    this.spinner.classList.add("app-inline-spinner");
  }

  showInlineSpinner() {
    ariaPoliteMessage(`Loading`);
    this.el.setAttribute("disabled", "");
    this.el.textContent = "Please wait";
    this.el.appendChild(this.spinner);
  }

  hideLoadingSpinner() {
    this.spinner.remove();
    this.el.removeAttribute("disabled");
    this.el.textContent = this.originalText;
  }

  shouldShowSpinner() {
    // Based on the data-inline-spinner-condition attribute - look for elements that meet the criteria and only show spinner if they exist
    // This is used on question pages to only show the spinner if a radio button with a nextNodeLabel of outcome is checked
    if (this.el.dataset.inlineSpinnerCondition) {
      return !!document.querySelector(this.el.dataset.inlineSpinnerCondition);
    }

    return true;
  }

  handleEvent(e) {
    if (this.shouldShowSpinner() && this.intercept) {
      e.preventDefault();
      this.showInlineSpinner();

      // Fire off the original event, but make sure we don't intercept it again
      this.intercept = false;

      setTimeout(() => {
        this.el.removeAttribute("disabled");

        if (this.isDoubleClickPrevented) {
          this.el.removeAttribute("data-prevent-double-click");
        }

        this.el.click();
        this.el.setAttribute("disabled", "");

        if (this.isDoubleClickPrevented) {
          this.el.setAttribute("data-prevent-double-click", "true");
        }

        setTimeout(this.hideLoadingSpinner.bind(this), 30000); // Hide the loading spinner again after 30s as a safety net - let people try again

        this.intercept = true;
      }, 100); // Non zero delay to allow voiceover time to register the aria message
    }
  }

  init() {
    if (this.el.form) {
      this.el.form.addEventListener("submit", this.handleEvent.bind(this));
    } else {
      this.el.addEventListener("click", this.handleEvent.bind(this));
    }

    window.addEventListener("pagehide", this.hideLoadingSpinner.bind(this));
    window.addEventListener("pageshow", this.hideLoadingSpinner.bind(this));
  }
}

export function initInlineSpinners() {
  // eslint-disable-next-line no-prototype-builtins
  if (!Element.prototype.hasOwnProperty("remove")) {
    // IE11 can't manage this so bail out
    return;
  }

  const inlineSpinnerTriggers = Array.from(
    document.querySelectorAll("[data-inline-spinner]")
  );
  inlineSpinnerTriggers.forEach((el) => {
    new InlineSpinner(el).init();
  });
}
