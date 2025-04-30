import ErrorSummary from "nhsuk-frontend/packages/components/error-summary/error-summary";

import { formHtml } from "../__fixtures__/feedback";

import * as formHelpers from "./form-helpers";

describe("hideNoJsMessage method", () => {
  test("hides any no-js messages in the form", () => {
    document.body.innerHTML = `
        <form>
          <p data-feedback-nojs-message>no-JS paragraph</p>
          <p>Normal paragraph</p>
          <p data-feedback-nojs-message>no-JS paragraph</p>
        </form>
      `;

    const feedbackForm = document.querySelector("form");

    formHelpers.hideNoJsMessage(feedbackForm);

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});

describe("clearErrors method", () => {
  test("restores html to original state", () => {
    document.body.innerHTML = `
      <form>
        <div data-feedback-error></div>
        <div class="nhsuk-form-group nhsuk-form-group--error"></div>
        <div data-feedback-error></div>
        <div class="nhsuk-form-group nhsuk-form-group--error"></div>
        <div data-original-aria-describedby="foo"></div>
        <div data-original-aria-describedby="bar"></div>
      </form>
      `;

    const feedbackForm = document.querySelector("form");

    formHelpers.clearErrors(feedbackForm);

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});

describe("hideAllFormSections method", () => {
  test("hides all form sections", () => {
    document.body.innerHTML = `
      <form>
        <div data-feedback-form-section></div>
        <div data-feedback-form-section></div>
      </form>
      `;

    const feedbackForm = document.querySelector("form");
    const feedbackFormSections = feedbackForm.querySelectorAll(
      "[data-feedback-form-section]"
    );

    formHelpers.hideAllFormSections(feedbackForm, feedbackFormSections);

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});

describe("formError method", () => {
  test("correctly sets errors on radio fields", () => {
    document.body.innerHTML = formHtml;

    const feedbackForm = document.querySelector("form");

    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-choice-yes",
      "test error message"
    );

    expect(document.body.innerHTML).toMatchSnapshot();

    expect(document.activeElement.dataset.testId).toEqual(
      "feedback-error-summary"
    );
  });

  test("correctly sets repeated errors on radio fields", () => {
    document.body.innerHTML = formHtml;

    const feedbackForm = document.querySelector("form");

    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-choice-yes",
      "test error message"
    );
    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-choice-yes",
      "a second error message"
    );
    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-choice-yes",
      "a third error message"
    );

    expect(document.body.innerHTML).toMatchSnapshot();

    expect(document.activeElement.dataset.testId).toEqual(
      "feedback-error-summary"
    );
  });

  test("correctly sets errors on textarea field", () => {
    document.body.innerHTML = formHtml;

    const feedbackForm = document.querySelector("form");

    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-text",
      "test error message"
    );

    expect(document.body.innerHTML).toMatchSnapshot();

    expect(document.activeElement.dataset.testId).toEqual(
      "feedback-error-summary"
    );
  });

  test("correctly sets repeated errors on textarea fields", () => {
    document.body.innerHTML = formHtml;

    const feedbackForm = document.querySelector("form");

    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-text",
      "test error message"
    );
    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-text",
      "a second error message"
    );
    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-text",
      "a third error message"
    );

    expect(document.body.innerHTML).toMatchSnapshot();

    expect(document.activeElement.dataset.testId).toEqual(
      "feedback-error-summary"
    );
  });

  test("correctly sets errors on textarea field with different error link relative to message", () => {
    document.body.innerHTML = formHtml;

    const feedbackForm = document.querySelector("form");

    formHelpers.formError(
      feedbackForm,
      ErrorSummary,
      "feedback-text",
      "test error message",
      "test error link"
    );

    expect(document.body.innerHTML).toMatchSnapshot();

    expect(document.activeElement.dataset.testId).toEqual(
      "feedback-error-summary"
    );
  });
});

describe("trackOriginalAria method", () => {
  test("stores original aria-describedby attributes on a temporary data attribute for later use", () => {
    document.body.innerHTML = `
        <form>
          <fieldset aria-describedby="fieldset">
            <input aria-describedby="input">
            <textarea aria-describedby="textarea"></textarea>
          </fieldset>

          <fieldset aria-describedby="fieldset2">
            <input aria-describedby="input2">
            <textarea aria-describedby="textarea2"></textarea>
          </fieldset>
        </form>
      `;

    const feedbackForm = document.querySelector("form");

    formHelpers.trackOriginalAria(feedbackForm);

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
