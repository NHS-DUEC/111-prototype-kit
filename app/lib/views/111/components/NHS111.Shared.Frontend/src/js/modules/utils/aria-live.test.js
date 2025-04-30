const { ariaPoliteMessage, ariaAssertiveMessage } = require("./aria-live");

const ariaRemovalDelay = 110;

describe("aria helpers", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="aria-assertive"></div>
      <div id="aria-polite"></div>
    `;
  });
  describe("ariaPoliteMessage", () => {
    test("correctly inserts the message into the dom", (done) => {
      ariaPoliteMessage("Test one");

      expect(document.body.innerHTML).toMatchSnapshot("message present");

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot("message removed");
        done();
      }, ariaRemovalDelay);
    });
  });
  describe("ariaAssertiveMessage", () => {
    test("correctly inserts the message into the dom", (done) => {
      ariaAssertiveMessage("Test one");

      expect(document.body.innerHTML).toMatchSnapshot("message present");

      setTimeout(() => {
        expect(document.body.innerHTML).toMatchSnapshot("message removed");
        done();
      }, ariaRemovalDelay);
    });
  });
});
