import { initClickEvents } from "./click-events";
import { logClick, logEvent } from "./utils/event-logging";
import * as formHelpers from "./utils/form-helpers";

export class FeedbackForm {
  constructor(form, ErrorSummary) {
    this.form = form;
    this.formSections = this.form.querySelectorAll(
      "[data-feedback-form-section]"
    );
    this.ErrorSummary = ErrorSummary;
  }

  init() {
    this.setupTellUsButton();
    formHelpers.trackOriginalAria(this.form);
    this.showFormSection(0);
    formHelpers.hideNoJsMessage(this.form);

    // Bind submit handler on the main form
    this.form.addEventListener("submit", this.formSubmitHandler());
  }

  static focusSection(section) {
    const legend = section.querySelector("legend");
    if (legend) {
      legend.tabIndex = -1;
      legend.classList.add("app-u-no-focus-outline");
      legend.focus();
    }
  }

  showFormSection(index) {
    formHelpers.hideAllFormSections(this.form, this.formSections);

    this.formSections[index].hidden = false;
    this.constructor.focusSection(this.formSections[index]);
  }

  submitFeedback() {
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
        formHelpers.hideAllFormSections(this.form, this.formSections);

        if (data === "ContainsTriggerWords") {
          this.setupTriggerWordFeedback();

          const mentalHealthFeedback =
            document.getElementById("mental-health-text");

          if (mentalHealthFeedback) {
            mentalHealthFeedback.remove();
          }
        } else {
          const message = document.createElement("p");
          message.tabIndex = -1;
          message.textContent = data;
          message.classList.add(
            "nhsuk-u-margin-bottom-0",
            "app-u-no-focus-outline"
          );
          message.setAttribute("data-test-id", "feedback-submission-response");
          this.formSections[1].after(message);
          message.focus();
        }
      });
  }

  setupTriggerWordFeedback() {
    const triggerWordMessage = document.createElement("div");
    triggerWordMessage.setAttribute(
      "data-test-id",
      "feedback-submission-response"
    );
    triggerWordMessage.innerHTML = `
      <p>Feedback is used to improve the service. We do not reply to requests for medical help.</p>
      <p>If you need urgent help for mental health, you can:</p>
      <ul>
        <li>visit <a href="https://www.mind.org.uk/need-urgent-help/" target="_blank" rel="noopener" data-event-trigger="click" data-event-value="Feedback with trigger words: Mind website">Mind<span class="nhsuk-u-visually-hidden"> (opens in a new tab)</span></a></li>
        <li>text <a href="https://giveusashout.org/" target="_blank" rel="noopener" data-event-trigger="click" data-event-value="Feedback with trigger words: SHOUT website">SHOUT<span class="nhsuk-u-visually-hidden"> (opens in a new tab)</span></a> to 85258</li>
        <li>phone 116 123 to talk to <a href="https://www.samaritans.org/how-we-can-help/contact-samaritan/" target="_blank" rel="noopener" data-event-trigger="click" data-event-value="Feedback with trigger words: Samaritans website">Samaritans<span class="nhsuk-u-visually-hidden"> (opens in a new tab)</span></a></li>
        <li>find other sources of help on <a href="https://www.nhs.uk/nhs-services/mental-health-services/" target="_blank" rel="noopener" data-event-trigger="click" data-event-value="Feedback with trigger words: NHS.UK mental health services">NHS.UK<span class="nhsuk-u-visually-hidden"> (opens in a new tab)</span></a></li>
      </ul>
      <p>If your life is in immediate danger call 999 or <a href="https://www.nhs.uk/service-search/find-an-accident-and-emergency-service" target="_blank" rel="noopener" data-event-trigger="click" data-event-value="Feedback with trigger words: NHS.UK nearest A&E service">go to your nearest A&E<span class="nhsuk-u-visually-hidden"> (opens in a new tab)</span></a>.</p>
    `;
    triggerWordMessage.classList.add(
      "nhsuk-u-margin-bottom-0",
      "app-u-no-focus-outline"
    );

    this.formSections[1].after(triggerWordMessage);
    triggerWordMessage.focus();
    initClickEvents(triggerWordMessage);
  }

  setupTellUsButton() {
    const tellUsButton = document.createElement("button");
    tellUsButton.classList.add(
      "nhsuk-button",
      "nhsuk-button--secondary",
      "nhsuk-u-margin-top-4"
    );
    tellUsButton.setAttribute("data-test-id", "feedback-tell-us-button");
    tellUsButton.textContent = "Tell us";

    // Submit handler for the 1st page's button
    tellUsButton.addEventListener("click", (e) => {
      e.preventDefault();

      logClick("Tell us");

      const formData = new FormData(this.form);

      switch (formData.get("feedbackChoice")) {
        case "yes":
          this.submitFeedback();
          break;

        case "no":
          this.showFormSection(1);
          break;

        default:
          formHelpers.formError(
            this.form,
            this.ErrorSummary,
            "feedback-choice-yes",
            "Choose an answer"
          );
      }
    });

    this.formSections[0].appendChild(tellUsButton);
  }

  getFeedbackCharacterLimit() {
    return this.form.querySelector(".nhsuk-character-count").dataset.maxlength;
  }

  formSubmitHandler() {
    return (e) => {
      e.preventDefault();

      const formData = new FormData(this.form);

      const characterLimit = this.getFeedbackCharacterLimit();
      const limitExceededBy = formData.get("Text").length - characterLimit;
      const postcodeRegex =
        /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
      const phoneNumberRegex = /(\d[\s()-]*){10}/;
      const emailRegex = /[^\s@]@[^\s@]/;

      if (formData.get("Text").trim().length === 0) {
        formHelpers.formError(
          this.form,
          this.ErrorSummary,
          "feedback-text",
          "Enter your feedback"
        );
      } else if (formData.get("Text").length > characterLimit) {
        formHelpers.formError(
          this.form,
          this.ErrorSummary,
          "feedback-text",
          `Feedback should be fewer than ${characterLimit} characters long`,
          `Feedback should be fewer than ${characterLimit} characters long - you have ${limitExceededBy} character${
            limitExceededBy === 1 ? "" : "s"
          } too many`
        );
      } else if (
        postcodeRegex.test(formData.get("Text")) ||
        phoneNumberRegex.test(formData.get("Text")) ||
        emailRegex.test(formData.get("Text"))
      ) {
        logEvent("FeedbackAttempted", "AttemptContainsPID");
        formHelpers.formError(
          this.form,
          this.ErrorSummary,
          "feedback-text",
          "Your feedback cannot include any personal or contact details"
        );
      } else {
        this.submitFeedback();
      }
    };
  }
}

export function initFeedback(ErrorSummary) {
  // ErrorSummary is injected in here since this script is included across
  // two places - NHS111.Shared.Frontend and NHS111.Web.Frontend
  // The way things are set up would result in two different versions of ErrorSummary
  // being included in NHS111.Web.Frontend. To avoid this, we temporarily inject
  // it into here. This can be removed once NHS111.Web.Frontend is decommisioned.

  // Bail out if we don't have the fetch api. If absent, behaviour will fall back to the non JS route
  if (typeof window.fetch === "undefined") {
    return;
  }

  const form = document.querySelector("[data-feedback-form]");

  if (form) {
    const feedbackForm = new FeedbackForm(form, ErrorSummary);
    feedbackForm.init();
  }
}
