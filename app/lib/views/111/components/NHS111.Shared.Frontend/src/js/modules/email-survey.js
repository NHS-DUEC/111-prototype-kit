import * as formHelpers from "./utils/form-helpers";

export class EmailSurveyForm {
  constructor(form, ErrorSummary) {
    this.form = form;
    this.formSections = this.form.querySelectorAll(
      "[data-survey-form-section]"
    );
    this.button = this.form.querySelector("[data-email-survey-submit]");
    this.cancelButton = this.form.querySelector("[data-email-survey-cancel]");
    this.ErrorSummary = ErrorSummary;
  }

  init() {
    formHelpers.hideNoJsMessage(this.form);
    formHelpers.trackOriginalAria(this.form);
    this.form.addEventListener("submit", this.formSubmitHandler());

    if (this.cancelButton) {
      this.cancelButton.addEventListener("click", this.cancelHandler());
    }
  }

  formSubmitHandler() {
    return (e) => {
      e.preventDefault();
      this.submitEmail();
    };
  }

  setResponseHeaderAndMessage(responseHeader, responseMessage) {
    formHelpers.hideAllFormSections(this.form, this.formSections);

    const header = document.createElement("h3");
    header.innerHTML = responseHeader;
    this.formSections[0].after(header);

    const message = document.createElement("p");
    message.tabIndex = -1;
    message.innerHTML = responseMessage;
    message.classList.add("nhsuk-u-margin-bottom-0", "app-u-no-focus-outline");
    message.setAttribute("data-test-id", "survey-response");
    header.after(message);

    message.focus();
  }

  cancelHandler() {
    return (e) => {
      e.preventDefault();
      formHelpers.clearErrors(this.form);
      this.setResponseHeaderAndMessage(
        "Thanks for your feedback",
        "We will use it to improve the services we recommend."
      );
    };
  }

  submitEmail() {
    this.button.disabled = true;

    formHelpers.clearErrors(this.form);

    const formData = new FormData(this.form);

    return fetch(this.form.action, {
      method: this.form.method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.IsValid) {
          this.button.disabled = false;

          formHelpers.formError(
            this.form,
            this.ErrorSummary,
            "email",
            data.Message
          );
        } else {
          this.setResponseHeaderAndMessage(data.Header, data.Message);
        }
      });
  }
}

export function initSurvey(ErrorSummary) {
  if (typeof window.fetch === "undefined") {
    return;
  }

  const form = document.querySelector("[data-survey-form]");

  if (form) {
    const emailSurveyForm = new EmailSurveyForm(form, ErrorSummary);
    emailSurveyForm.init();
  }
}
