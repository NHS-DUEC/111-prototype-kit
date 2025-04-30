export function hideNoJsMessage(form) {
  Array.from(form.querySelectorAll("[data-feedback-nojs-message]")).forEach(
    (item) => item.remove()
  );
}

export function clearErrors(form) {
  const errors = form.querySelectorAll("[data-feedback-error]");
  const formGroups = form.querySelectorAll(".nhsuk-form-group");
  const elementsWithOriginalAria = form.querySelectorAll(
    "[data-original-aria-describedby]"
  );

  Array.from(errors).forEach((item) => item && item.remove());
  Array.from(formGroups).forEach(
    (item) => item && item.classList.remove("nhsuk-form-group--error")
  );
  Array.from(elementsWithOriginalAria).forEach((el) =>
    el.setAttribute("aria-describedBy", el.dataset.originalAriaDescribedby)
  );
}

export function hideAllFormSections(form, formSections) {
  clearErrors(form);

  Array.from(formSections).forEach((element) => {
    element.hidden = true;
  });
}

export function trackOriginalAria(form) {
  // Keep track of any original aria-describedBy attributes so we can restore them when clearing errors
  Array.from(form.querySelectorAll("fieldset, input, textarea")).forEach(
    (el) => {
      if (el.getAttribute("aria-describedBy") !== null) {
        el.setAttribute(
          "data-original-aria-describedby",
          el.getAttribute("aria-describedBy")
        );
      }
    }
  );
}

export function formError(
  form,
  ErrorSummary,
  fieldId,
  errorMessage,
  errorLink = ""
) {
  const template = document.createElement("template");

  clearErrors(form);

  template.innerHTML = `
    <div class="nhsuk-error-summary" data-feedback-error data-test-id="feedback-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1">
      <h2 class="nhsuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div class="nhsuk-error-summary__body">
        <ul class="nhsuk-list nhsuk-error-summary__list">
          <li>
            <a href="#${fieldId}">${errorLink || errorMessage}</a>
          </li>
        </ul>
      </div>
    </div>`;

  const previousErrorSummary = form.querySelector(".nhsuk-error-summary");
  if (previousErrorSummary) {
    previousErrorSummary.remove();
  }

  const errorSummary = template.content;

  form.prepend(errorSummary);
  ErrorSummary();

  const field = form.querySelector(`#${fieldId}`);
  const formGroup = field.closest(".nhsuk-form-group");

  const errorMessageTemplate = document.createElement("template");
  errorMessageTemplate.innerHTML = `<span data-feedback-error data-test-id="feedback-error-message" class="nhsuk-error-message" id="${fieldId}-error">
      <span class="nhsuk-u-visually-hidden">Error:</span> ${errorMessage}
    </span>`;

  if (field.getAttribute("type") === "radio") {
    formGroup.querySelector("legend").after(errorMessageTemplate.content);
    const fieldset = formGroup.querySelector("fieldset");
    fieldset.setAttribute(
      "aria-describedby",
      `${
        fieldset.dataset.originalAriaDescribedby
          ? fieldset.dataset.originalAriaDescribedby
          : ""
      } ${fieldId}-error`
    );
  } else {
    formGroup.querySelector("label").after(errorMessageTemplate.content);
    field.setAttribute(
      "aria-describedby",
      `${
        field.dataset.originalAriaDescribedby
          ? field.dataset.originalAriaDescribedby
          : ""
      } ${fieldId}-error`
    );
  }

  formGroup.classList.add("nhsuk-form-group--error");
}
