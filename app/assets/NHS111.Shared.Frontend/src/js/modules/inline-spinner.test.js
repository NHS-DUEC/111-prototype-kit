jest.mock("./utils/aria-live");

import { initInlineSpinners } from "./inline-spinner";
import { ariaPoliteMessage } from "./utils/aria-live";

const mockSubmit = jest.fn().mockName("Form submit");
const defaultSubmitImplementation =
  window.HTMLFormElement.prototype.requestSubmit;

window.HTMLFormElement.prototype.requestSubmit = mockSubmit;

describe("inline spinner", () => {
  beforeAll(() => {});

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  afterAll(() => {
    window.HTMLFormElement.prototype.requestSubmit =
      defaultSubmitImplementation;
  });

  // Disabled until I can work around JSDOM Warning:
  // (Error: Not implemented: HTMLFormElement.prototype.requestSubmit)
  //
  // describe("bound to a button in a form", () => {
  //   test("shows inline spinner when clicked", (done) => {
  //     document.body.innerHTML = `<form>
  //       <button type="submit" data-inline-spinner id="test-button">Test</button>
  //     </form>
  //     `;

  //     initInlineSpinners();

  //     document.querySelector("#test-button").focus(); // JSDOM doesn't properly set document.activeElement when something is clicked so we have to do it manually
  //     document.querySelector("#test-button").click();

  //     setTimeout(() => {
  //       expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the spinner is shown
  //       expect(ariaPoliteMessage).toHaveBeenCalledWith("Loading");
  //       done();
  //     }, 0);
  //   });
  //
  //   Todo: Add test for clicking a secondary button in the same form without a spinner
  // });

  describe("bound to a clickable element", () => {
    test("shows inline spinner when clicked", (done) => {
      document.body.innerHTML = `<button data-inline-spinner id="test-button">Test</button>`;

      initInlineSpinners();

      document.querySelector("#test-button").focus(); // JSDOM doesn't properly set document.activeElement when something is clicked so we have to do it manually
      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the spinner is shown
        expect(ariaPoliteMessage).toHaveBeenCalledWith("Loading");
        done();
      }, 0);
    });

    test("inline spinner is hidden again when pageshow event fires", (done) => {
      document.body.innerHTML = `<button data-inline-spinner id="test-button">Test</button>`;

      initInlineSpinners();

      document.querySelector("#test-button").focus(); // JSDOM doesn't properly set document.activeElement when something is clicked so we have to do it manually
      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the spinner is shown
        expect(ariaPoliteMessage).toHaveBeenCalledWith("Loading");

        window.dispatchEvent(new Event("pageshow"));
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the spinner is no longer shown
        done();
      }, 0);
    });

    test("shows spinner when conditional spinner evaluates to true", (done) => {
      document.body.innerHTML = `
      <button data-inline-spinner data-inline-spinner-condition="#conditional-element-which-exists" id="test-button">Test</button>
      <div id="conditional-element-which-exists"></div>
      `;

      initInlineSpinners();

      document.querySelector("#test-button").focus(); // JSDOM doesn't properly set document.activeElement when something is clicked so we have to do it manually
      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the spinner is shown
        expect(ariaPoliteMessage).toHaveBeenCalledWith("Loading");
        done();
      }, 0);
    });

    test("doesn't show spinner when conditional spinner evaluates to false", (done) => {
      document.body.innerHTML = `
      <button data-inline-spinner data-inline-spinner-condition="#conditional-element-which-doesnt-exist" id="test-button">Test</button>
      `;

      initInlineSpinners();

      document.querySelector("#test-button").focus(); // JSDOM doesn't properly set document.activeElement when something is clicked so we have to do it manually
      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot();
        done();
      }, 0);
    });

    test("shows spinner and correctly sets / unsets double click prevention", (done) => {
      document.body.innerHTML = `<button data-inline-spinner data-module="nhsuk-button" data-prevent-double-click id="test-button">Test</button>`;

      initInlineSpinners();

      document.querySelector("#test-button").focus(); // JSDOM doesn't properly set document.activeElement when something is clicked so we have to do it manually
      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the spinner is shown
        expect(ariaPoliteMessage).toHaveBeenCalledWith("Loading");
        done();
      }, 0);
    });
  });
});
