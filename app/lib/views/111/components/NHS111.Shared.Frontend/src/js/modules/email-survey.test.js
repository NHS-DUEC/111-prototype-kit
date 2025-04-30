import ErrorSummary from "nhsuk-frontend/packages/components/error-summary/error-summary";

import { formHtml } from "./__fixtures__/email-survey";
import { initSurvey, EmailSurveyForm } from "./email-survey";
import * as formHelpers from "./utils/form-helpers";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(JSON.stringify("Thankyou message")),
  })
);

describe("email survey", () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  describe("initSurvey method", () => {
    test("doesn't throw error when no form is present", () => {
      document.body.innerHTML = "";

      initSurvey();

      expect(initSurvey).not.toThrow();
    });

    test("initialises survey class when form is present", () => {
      document.body.innerHTML = formHtml;

      initSurvey();

      expect(document.body.innerHTML).toMatchSnapshot();
    });

    test("bails out if fetch is not present and leaves the form intact (in no-js mode)", () => {
      document.body.innerHTML = formHtml;

      const tempFetch = global.fetch;

      delete global.fetch;
      initSurvey();
      global.fetch = tempFetch;

      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });

  describe("init method", () => {
    test("sets up pages correctly", () => {
      document.body.innerHTML = formHtml;
      const trackOriginalAriaMock = jest.spyOn(
        formHelpers,
        "trackOriginalAria"
      );
      const hideNoJsMessageMock = jest.spyOn(formHelpers, "hideNoJsMessage");

      const emailSurveyForm = new EmailSurveyForm(
        document.querySelector("form"),
        ErrorSummary
      );
      emailSurveyForm.init();

      expect(trackOriginalAriaMock).toHaveBeenCalled();
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
        .spyOn(EmailSurveyForm.prototype, "formSubmitHandler")
        .mockImplementation(() => {
          return submitHandler;
        });

      initSurvey(ErrorSummary);

      document.querySelector("form").submit();

      expect(submitHandlerCalled).toEqual(true);

      formSubmitHandlerMock.mockRestore();
    });
  });
  describe("submitEmail method", () => {
    test("when data from response is invalid displays error content", async () => {
      document.body.innerHTML = formHtml;

      const formErrorMock = jest.spyOn(formHelpers, "formError");

      const clearErrorsMock = jest.spyOn(formHelpers, "clearErrors");

      const emailSurveyForm = new EmailSurveyForm(
        document.querySelector("form"),
        ErrorSummary
      );
      const expectedFormData = {
        "data-1": "value-1",
        "data-2": "value-2",
      };

      const response = {
        IsValid: false,
        Message: "The email address provided is not valid",
      };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(JSON.stringify(response)),
        })
      );

      await emailSurveyForm.submitEmail();

      expect(document.body.innerHTML).toMatchSnapshot();

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost/Survey/EmailSurveyCollection",
        expect.objectContaining({
          body: expect.any(FormData),
          headers: {
            Accept: "application/json",
          },
          method: "post",
        })
      );

      expect(formErrorMock).toHaveBeenCalled();
      expect(clearErrorsMock).toHaveBeenCalled();

      const formData = Array.from(
        global.fetch.mock.calls[0][1].body.entries()
      ).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {}); // reduce form data to an object

      expect(formData).toMatchObject(expectedFormData);
    });

    test("when data from response is valid displays success content", async () => {
      document.body.innerHTML = formHtml;

      const hideAllFormSectionsMock = jest.spyOn(
        formHelpers,
        "hideAllFormSections"
      );

      const clearErrorsMock = jest.spyOn(formHelpers, "clearErrors");

      const emailSurveyForm = new EmailSurveyForm(
        document.querySelector("form"),
        ErrorSummary
      );
      const expectedFormData = {
        "data-1": "value-1",
        "data-2": "value-2",
      };

      const response = {
        IsValid: true,
        Header: "Help Improve 111",
        Message: "We have successfully sent your survey",
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(response),
        })
      );

      await emailSurveyForm.submitEmail();

      expect(document.body.innerHTML).toMatchSnapshot();

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost/Survey/EmailSurveyCollection",
        expect.objectContaining({
          body: expect.any(FormData),
          headers: {
            Accept: "application/json",
          },
          method: "post",
        })
      );

      expect(hideAllFormSectionsMock).toHaveBeenCalled();
      expect(clearErrorsMock).toHaveBeenCalled();

      const formData = Array.from(
        global.fetch.mock.calls[0][1].body.entries()
      ).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {}); // reduce form data to an object

      expect(formData).toMatchObject(expectedFormData);
    });
  });
});
