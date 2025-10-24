import autosize from "autosize";
import Details from "nhsuk-frontend/packages/components/details/details";
import ErrorSummary from "nhsuk-frontend/packages/components/error-summary/error-summary";

import Button from "../nhsuk-frontend/button/button";
import CharacterCount from "../nhsuk-frontend/character-count/character-count";


import { initClickEvents } from "./modules/click-events";
import { initFeedback } from "./modules/feedback";
import initGoogleServiceMap from "./modules/google-service-map";
import { initInlineSpinners } from "./modules/inline-spinner";
import { initInterstitialForm } from "./modules/interstitial-form";
import initLoadingSpinners from "./modules/loading-spinner";
import { initServiceAuditing } from "./service-auditing";

document.addEventListener("DOMContentLoaded", () => {
  // Initialise nhsuk-frontend modules
  Button();
  CharacterCount();
  Details();
  ErrorSummary();

  // Initialise third party modules
  autosize(document.querySelectorAll("[data-autosize]"));

  // Initialise custom modules
  initClickEvents();
  initFeedback(ErrorSummary);
  initLoadingSpinners();
  initInlineSpinners();
  initServiceAuditing();
  initInterstitialForm();
  initGoogleServiceMap();
});
