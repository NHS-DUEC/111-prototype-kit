jest.mock("./utils/event-logging");

import ErrorSummary from "nhsuk-frontend/packages/components/error-summary/error-summary";

import { formHtml } from "./__fixtures__/feedback";
import { initFeedback, FeedbackForm } from "./feedback";
import { logClick } from "./utils/event-logging";
import * as formHelpers from "./utils/form-helpers";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve("Thankyou message"),
  })
);

describe("feedback", () => {
  beforeEach(() => {
    logClick.mockClear();
    global.fetch.mockClear();
  });

  describe("initFeedback method", () => {
    const setupTellUsButtonMock = jest.spyOn(
      FeedbackForm.prototype,
      "setupTellUsButton"
    );

    beforeEach(() => {
      setupTellUsButtonMock.mockClear();
    });

    test("doesn't throw error when no form is present", () => {
      document.body.innerHTML = "";

      expect(initFeedback).not.toThrow();
    });

    test("initialises feedback class when form is present", () => {
      document.body.innerHTML = formHtml;

      initFeedback();

      expect(document.body.innerHTML).toMatchSnapshot();
    });

    test("bails out if fetch is not present and leaves the form intact (in no-js mode)", () => {
      document.body.innerHTML = formHtml;

      const tempFetch = global.fetch;

      delete global.fetch;
      initFeedback();
      global.fetch = tempFetch;

      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });

  describe("init method", () => {
    test("sets up pages correctly, showing page 1 by default", () => {
      document.body.innerHTML = formHtml;

      const setupTellUsButtonMock = jest.spyOn(
        FeedbackForm.prototype,
        "setupTellUsButton"
      );
      const trackOriginalAriaMock = jest.spyOn(
        formHelpers,
        "trackOriginalAria"
      );
      const showFormSectionMock = jest.spyOn(
        FeedbackForm.prototype,
        "showFormSection"
      );
      const hideNoJsMessageMock = jest.spyOn(formHelpers, "hideNoJsMessage");

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );
      feedbackForm.init();

      expect(setupTellUsButtonMock).toHaveBeenCalled();
      expect(trackOriginalAriaMock).toHaveBeenCalled();
      expect(showFormSectionMock).toHaveBeenCalledWith(0);
      expect(hideNoJsMessageMock).toHaveBeenCalled();

      expect(document.body.innerHTML).toMatchSnapshot();
    });

    test("sets up form submit handler correctly", () => {
      // Submit feedback method and calls to window.fetch etc tested later, this test just needs to check the submit handler is wired up correctly
      document.body.innerHTML = formHtml;

      let submitHandlerCalled = false;

      const submitHandler = function dummySubmitHandler(e) {
        e.preventDefault();
        submitHandlerCalled = true;
      };

      const formSubmitHandlerMock = jest
        .spyOn(FeedbackForm.prototype, "formSubmitHandler")
        .mockImplementation(() => {
          return submitHandler;
        });

      initFeedback(ErrorSummary);

      document.querySelector("form").submit();

      expect(submitHandlerCalled).toEqual(true);

      formSubmitHandlerMock.mockRestore();
    });
  });

  describe("focusSection method", () => {
    test("places focus on the legend inside the fieldset", () => {
      document.body.innerHTML = `
        <fieldset><legend>1</legend></fieldset>
        <fieldset><legend>2</legend></fieldset>
        <fieldset data-test-id="fieldset"><legend data-test-id="legend">3</legend></fieldset>
        <fieldset><legend>4</legend></fieldset>
      `;

      const fieldset = document.querySelector("[data-test-id=fieldset]");

      FeedbackForm.focusSection(fieldset);

      expect(document.activeElement.dataset.testId).toEqual("legend");
    });
  });

  describe("showFormSection method", () => {
    test("shows the appropriate section and hides others", () => {
      document.body.innerHTML = `
      <form>
        <div data-feedback-form-section></div>
        <div data-feedback-form-section></div>
        <div data-feedback-form-section>
          <fieldset><legend data-test-id="legend">Legend</legend></fieldset>
        </div>
        <div data-feedback-form-section></div>
        <div data-feedback-form-section></div>
      </form>
      `;

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );
      feedbackForm.showFormSection(2);

      expect(document.body.innerHTML).toMatchSnapshot();
      expect(document.activeElement.dataset.testId).toEqual("legend");
    });
  });

  describe("submitFeedback method", () => {
    test("clears down the form and submits the data", async () => {
      document.body.innerHTML = `
      <form method="post">
        <input name="data-1" value="value-1">
        <input name="data-2" value="value-2">
        <div data-feedback-form-section></div>
        <div data-feedback-form-section>
          <div data-feedback-error></div>
          <div class="nhsuk-form-group nhsuk-form-group--error"></div>
          <div data-feedback-error></div>
          <div class="nhsuk-form-group nhsuk-form-group--error"></div>
          <div data-original-aria-describedby="foo"></div>
          <div data-original-aria-describedby="bar"></div>
        </div>
      </form>
      `;

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      const expectedFormData = {
        "data-1": "value-1",
        "data-2": "value-2",
      };

      await feedbackForm.submitFeedback();

      expect(document.body.innerHTML).toMatchSnapshot();

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost/",
        expect.objectContaining({
          body: expect.any(FormData),
          headers: {
            Accept: "application/json",
          },
          method: "post",
        })
      );

      const formData = Array.from(
        global.fetch.mock.calls[0][1].body.entries()
      ).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {}); // reduce form data to an object

      expect(formData).toMatchObject(expectedFormData);
    });

    test("calls setupTriggerWordFeedback when response is 'ContainsTriggerWords'", async () => {
      global.fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce("ContainsTriggerWords"),
      });

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      const spy = jest
        .spyOn(feedbackForm, "setupTriggerWordFeedback")
        .mockImplementation(() => {});

      await feedbackForm.submitFeedback();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("setupTellUsButton method", () => {
    beforeEach(() => {
      logClick.mockClear();
      global.fetch.mockClear();
    });

    test("correctly creates the button", () => {
      document.body.innerHTML = `
      <form>
        <div data-feedback-form-section></div>
        <div data-feedback-form-section></div>
      </form>
      `;

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );
      feedbackForm.setupTellUsButton();

      expect(document.body.innerHTML).toMatchSnapshot();
    });

    test("submits the form if 'yes' is selected", (done) => {
      document.body.innerHTML = formHtml;

      const expectedFormData = {
        Text: "",
        feedbackChoice: "yes",
      };

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );
      feedbackForm.setupTellUsButton();
      feedbackForm.showFormSection(0);

      document.querySelector("#feedback-choice-yes").click();
      document.querySelector("[data-test-id=feedback-tell-us-button]").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot();

        expect(document.activeElement.dataset.testId).toEqual(
          "feedback-submission-response"
        );

        expect(logClick).toHaveBeenCalledWith("Tell us");

        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost/Feedback/SubmitFeedback",
          expect.objectContaining({
            body: expect.any(FormData),
            headers: {
              Accept: "application/json",
            },
            method: "post",
          })
        );

        const formData = Array.from(
          global.fetch.mock.calls[0][1].body.entries()
        ).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {}); // reduce form data to an object

        expect(formData).toMatchObject(expectedFormData);

        done();
      }, 0);
    });

    test("moves the form from page 1 to page 2 if 'no' is selected", () => {
      document.body.innerHTML = formHtml;

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );
      feedbackForm.setupTellUsButton();
      feedbackForm.showFormSection(0);

      document.querySelector("#feedback-choice-no").click();
      document.querySelector("[data-test-id=feedback-tell-us-button]").click();

      expect(document.body.innerHTML).toMatchSnapshot();

      expect(document.activeElement.dataset.testId).toEqual(
        "feedback-explanation-1"
      );

      expect(logClick).toHaveBeenCalledWith("Tell us");
    });

    test("triggers form validation if nothing selected, and leaves first page showing", () => {
      document.body.innerHTML = formHtml;

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );
      feedbackForm.setupTellUsButton();
      feedbackForm.showFormSection(0);

      document.querySelector("[data-test-id=feedback-tell-us-button]").click();

      expect(document.body.innerHTML).toMatchSnapshot();

      expect(document.activeElement.dataset.testId).toEqual(
        "feedback-error-summary"
      );

      expect(logClick).toHaveBeenCalledWith("Tell us");
    });
  });

  describe("getFeedbackCharacterLimit method", () => {
    test("finds the correct value from the html", () => {
      document.body.innerHTML = formHtml;
      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      expect(feedbackForm.getFeedbackCharacterLimit()).toEqual("1200");
    });
  });

  describe("formSubmitHandler method", () => {
    const formErrorMock = jest.spyOn(formHelpers, "formError");
    const getFeedbackCharacterLimitMock = jest.spyOn(
      FeedbackForm.prototype,
      "getFeedbackCharacterLimit"
    );
    const submitFeedback = jest.spyOn(FeedbackForm.prototype, "submitFeedback");

    beforeEach(() => {
      global.fetch.mockClear();
      formErrorMock.mockClear();
      getFeedbackCharacterLimitMock.mockClear();
      submitFeedback.mockClear();
    });

    test("returns a function ready to be bound to the form", () => {
      document.body.innerHTML = formHtml;
      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      const submitHandler = feedbackForm.formSubmitHandler();
      const e = { preventDefault: jest.fn() };

      submitHandler(e);

      expect(typeof submitHandler).toEqual("function");
      expect(e.preventDefault).toHaveBeenCalled();
    });

    test("raises form validation errors if the feedback text is zero length", () => {
      document.body.innerHTML = formHtml;
      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      const submitHandler = feedbackForm.formSubmitHandler();
      const e = { preventDefault: jest.fn() };

      submitHandler(e);

      expect(getFeedbackCharacterLimitMock).toHaveBeenCalled();
      expect(formErrorMock).toHaveBeenCalledWith(
        document.querySelector("form"),
        ErrorSummary,
        "feedback-text",
        "Enter your feedback"
      );
      expect(submitFeedback).not.toHaveBeenCalled();
    });

    test("raises form validation errors if the feedback text contains only whitespace", () => {
      document.body.innerHTML = formHtml;
      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      const whiteSpaceCharacters = [
        " ", // Normal space
        String.fromCodePoint(9), // Tab character
      ];

      document.querySelector("textarea").value =
        whiteSpaceCharacters.join("\n");

      const submitHandler = feedbackForm.formSubmitHandler();
      const e = { preventDefault: jest.fn() };

      submitHandler(e);

      expect(getFeedbackCharacterLimitMock).toHaveBeenCalled();
      expect(formErrorMock).toHaveBeenCalledWith(
        document.querySelector("form"),
        ErrorSummary,
        "feedback-text",
        "Enter your feedback"
      );
      expect(submitFeedback).not.toHaveBeenCalled();
    });

    test("raises form validation errors if the feedback text is greater than 1200 in length", () => {
      document.body.innerHTML = formHtml;
      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      document.querySelector("textarea").value = "a".repeat(1201);

      const submitHandler = feedbackForm.formSubmitHandler();
      const e = { preventDefault: jest.fn() };

      submitHandler(e);

      expect(getFeedbackCharacterLimitMock).toHaveBeenCalled();
      expect(formErrorMock).toHaveBeenCalledWith(
        document.querySelector("form"),
        ErrorSummary,
        "feedback-text",
        "Feedback should be fewer than 1200 characters long",
        "Feedback should be fewer than 1200 characters long - you have 1 character too many"
      );
      expect(submitFeedback).not.toHaveBeenCalled();
    });

    test("calls the submitFeedback method if no validation errors", () => {
      document.body.innerHTML = formHtml;
      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      document.querySelector("#feedback-choice-no").click();
      document.querySelector("textarea").value = "a".repeat(1200);

      const submitHandler = feedbackForm.formSubmitHandler();
      const e = { preventDefault: jest.fn() };

      submitHandler(e);

      expect(getFeedbackCharacterLimitMock).toHaveBeenCalled();
      expect(formErrorMock).not.toHaveBeenCalled();
      expect(submitFeedback).toHaveBeenCalled();
    });
  });

  describe("setupTriggerWordFeedback method", () => {
    test("handles 'ContainsTriggerWords' response correctly", async () => {
      global.fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce("ContainsTriggerWords"),
      });

      document.body.innerHTML = formHtml;

      const feedbackForm = new FeedbackForm(
        document.querySelector("form"),
        ErrorSummary
      );

      await feedbackForm.submitFeedback();

      const triggerWordMessage = document.querySelector(
        "[data-test-id='feedback-submission-response']"
      );
      expect(triggerWordMessage).not.toBeNull();

      expect(triggerWordMessage.innerHTML).toContain(
        "Feedback is used to improve the service."
      );
      expect(triggerWordMessage.innerHTML).toContain(
        "If you need urgent help for mental health"
      );

      expect(triggerWordMessage.classList).toContain("nhsuk-u-margin-bottom-0");
      expect(triggerWordMessage.classList).toContain("app-u-no-focus-outline");
    });
  });
});
