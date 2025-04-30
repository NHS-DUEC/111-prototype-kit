import { logEvent } from "../modules/utils/event-logging";

const endChatCallout = document.createElement("div");

endChatCallout.classList.add(
  "app-callout",
  "nhsuk-u-reading-width",
  "nhsuk-u-margin-top-5"
);
endChatCallout.innerHTML = `
  <h2>This chat has ended</h2>
  <p>You might want to copy any information the nurse gave you, before you close the chat.</p>
  <div class="nhsuk-action-link">
    <a class="nhsuk-action-link__link" href="/online-chat-booking/survey">
      <svg class="nhsuk-icon nhsuk-icon__arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="36" height="36">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
      </svg>
      <span class="nhsuk-action-link__text">Close chat</span>
    </a>
  </div>
`;

function handleImChatEnded() {
  const chatIframe = document.querySelector("[data-storm-chat-iframe]");

  chatIframe.after(endChatCallout);
  endChatCallout.scrollIntoView({ behavior: "smooth", block: "center" });
}

window.addEventListener(
  "message",
  (event) => {
    if (event.origin !== "https://www.timeforstorm.com") return;

    logEvent(
      "StormWebchatIframeMessage",
      typeof event.data === "object" ? JSON.stringify(event.data) : event.data
    );

    switch (event.data) {
      case "im.chat.ended":
        handleImChatEnded();
        break;

      default:
    }
  },
  false
);
