jest.mock("./utils/aria-live");

import initLoadingSpinners from "./loading-spinner";
import { ariaPoliteMessage } from "./utils/aria-live";

const mockSubmit = jest.fn().mockName("Form submit");
const defaultSubmitImplementation = window.HTMLFormElement.prototype.submit;

describe("loading spinner", () => {
  beforeAll(() => {
    window.HTMLFormElement.prototype.submit = mockSubmit;
  });

  beforeEach(() => {
    mockSubmit.mockClear();
    ariaPoliteMessage.mockClear();
  });

  afterAll(() => {
    window.HTMLFormElement.prototype.submit = defaultSubmitImplementation;
  });

  describe("bound to a form", () => {
    test("shows loading overlay when submitted", (done) => {
      document.body.innerHTML = `<form id="test-form" data-loading-spinner="Overlay text">
        <button type="submit" id="test-button">Test</button>
      </form>
      `;

      initLoadingSpinners();

      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the overlay is shown
        expect(mockSubmit).toHaveBeenCalled();
        expect(mockSubmit.mock.calls.length).toBe(1);
        expect(ariaPoliteMessage).toHaveBeenCalledWith(
          "Please wait - Overlay text"
        );
        done();
      }, 100);
    });
  });

  describe("bound to a clickable element", () => {
    test("shows loading overlay when clicked", (done) => {
      document.body.innerHTML = `<button data-loading-spinner="Overlay text" id="test-button">Test</button>`;

      initLoadingSpinners();

      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the overlay is shown
        expect(ariaPoliteMessage).toHaveBeenCalledWith(
          "Please wait - Overlay text"
        );
        done();
      }, 0);
    });

    test("inline spinner is hidden again when pageshow event fires", (done) => {
      document.body.innerHTML = `<button data-loading-spinner="Overlay text" id="test-button">Test</button>`;

      initLoadingSpinners();

      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the overlay is shown
        expect(ariaPoliteMessage).toHaveBeenCalledWith(
          "Please wait - Overlay text"
        );

        window.dispatchEvent(new Event("pageshow"));
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the overlay is no longer shown
        done();
      }, 0);
    });

    test("inline spinner is hidden again when the custom hide-loading-spinner event fires", (done) => {
      document.body.innerHTML = `<button data-loading-spinner="Overlay text" id="test-button">Test</button>`;

      initLoadingSpinners();

      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the overlay is shown
        expect(ariaPoliteMessage).toHaveBeenCalledWith(
          "Please wait - Overlay text"
        );

        const event = new CustomEvent("hide-loading-spinner", {
          bubbles: true,
        });

        document.querySelector("#test-button").dispatchEvent(event);

        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the overlay is no longer shown
        done();
      }, 0);
    });

    test("loads custom data from hidden fields when shown", (done) => {
      document.body.innerHTML = `
      <input type="hidden" id="find-by-id" value="Hidden fields by ID" />
      <input type="hidden" name="find-by-name" value="Hidden fields by name" />
      <input type="hidden" data-attribute="find-by-data-attribute" value="Hidden fields by data attribute" />

      <button data-loading-spinner="by ID: {{#find-by-id}} | by name: {{[name=find-by-name]}} | by data attribute: {{[data-attribute]}}" id="test-button">Test</button>`;

      initLoadingSpinners();

      document.querySelector("#test-button").click();

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot(); // Assert that the overlay is shown
        expect(ariaPoliteMessage).toHaveBeenCalledWith(
          "Please wait - by ID: Hidden fields by ID | by name: Hidden fields by name | by data attribute: Hidden fields by data attribute"
        );
        done();
      }, 0);
    });
  });
});
