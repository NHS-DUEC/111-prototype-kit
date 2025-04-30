import { logClick } from "./utils/event-logging";

export function initClickEvents(context = document) {
  const externalLinkTargets = context.querySelectorAll(
    "a[href^='https://']:not([data-event-trigger])"
  );

  externalLinkTargets.forEach((link) => {
    link.setAttribute("data-event-trigger", "click");
    link.setAttribute("data-event-value", link.href);
  });

  const clickTargets = context.querySelectorAll("[data-event-trigger=click]");

  if (clickTargets) {
    Array.from(clickTargets).forEach((target) => {
      target.addEventListener("click", (e) => {
        if (e.isTrusted) {
          logClick(
            e.currentTarget.dataset.eventValue,
            e.currentTarget.dataset.eventAnswerOrder,
            e.currentTarget.dataset.eventAnswerTitle
          );
        }
      });
    });
  }
}
