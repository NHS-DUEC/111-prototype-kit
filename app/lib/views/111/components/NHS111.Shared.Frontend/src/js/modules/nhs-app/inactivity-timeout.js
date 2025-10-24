import { LoadingSpinner } from "../loading-spinner";
import { logEvent } from "../utils/event-logging";
import { featureIsEnabled } from "../utils/feature-flags";

import {
  preventBeforeUnloadError,
  disableBeforeUnloadError,
} from "./before-unload-prompt";


export class InactivityTimeout {
  constructor() {
    this.config = {};
    this.timers = [];
    this.overlay = document.createElement("div");
    this.mainElements = document.querySelectorAll(
      "body > header, body > main, body > footer, body > .nhsuk-core, .nhsuk-skip-link" // .nhsuk-core div is in here for the old web project - could be removed when this is decommissioned
    );
    this.keepAliveEnabled = true;
    this.keepAliveTimeout = null;
    this.isActive = true;
    this.lastTimerCheck = 0;
    this.lastCookieRefresh = 0;
    this.lastUserEvent = 0;
    this.externalLinkFollowed = false;
  }

  fetchConfig() {
    return fetch("/auth/reset-timeout")
      .then((response) => response.json())
      .then((data) => {
        this.config = data;
      });
  }

  signOut() {
    fetch("/auth/sign-out");
  }

  tick(elapsedMs) {
    // Once per second
    if (!this.lastTimerCheck || elapsedMs - this.lastTimerCheck >= 1000) {
      this.lastTimerCheck = elapsedMs;
      this.checkTimers();

      if (Date.now() - this.lastUserEvent < 5000) {
        this.handleKeepAlive(); // Resets the timers
      }
    }

    // Once per half inactivity-timeout
    // If the user perpetually keeps the session alive by being active, we need to occasionally refresh the cookies
    if (
      elapsedMs - this.lastCookieRefresh >=
      this.config.timeouts.inactivityTimeout / 2
    ) {
      this.lastCookieRefresh = elapsedMs;
      this.refreshCookies();
    }

    requestAnimationFrame(this.tick.bind(this));
  }

  checkTimers() {
    this.timers.forEach((timer) => {
      if (Date.now() >= timer.due) {
        this.handleTimeout(timer.timeoutType);
      }
    });
  }

  initTimers() {
    this.timers = Object.keys(this.config.timeouts).map((timeoutType) => ({
      due: Date.now() + this.config.timeouts[timeoutType],
      timeoutType,
    }));
  }

  clearTimers() {
    this.timers = [];
  }

  handleTimeout(timeoutType) {
    this.isActive = false;
    this.keepAliveEnabled = false;

    // Once you've handled a timer, don't handle it again in this cycle
    this.timers = this.timers.filter(
      (item) => item.timeoutType !== timeoutType
    );

    switch (timeoutType) {
      case "inactivityTimeout":
        this.handleInactivityTimeout();
        break;

      case "sessionTimeout":
        this.handleSessionTimeout();
        break;

      case "loginTimeout":
        this.handleLoginTimeout();
        break;

      default:
        throw new Error("Unhandled timeout type");
    }
  }

  async refreshCookies() {
    if (this.isActive) {
      logEvent("Timeout", "Refreshing cookies");
      await this.fetchConfig();
    }
  }

  continueHandler() {
    logEvent("Timeout", "User continuing after period of inactivity");
    this.hideOverlay();
    this.refreshCookies();
    this.doKeepAlive();
  }

  hideOverlay() {
    this.keepAliveEnabled = true;
    this.isActive = true;

    this.overlay.remove();

    this.mainElements.forEach((element) => {
      element.style.display = "";
    });
    document.documentElement.classList.remove("app-body-has-full-page-overlay");
  }

  startAgainHandler(e) {
    e.preventDefault();
    const target = e.currentTarget;
    logEvent(
      "Timeout",
      "User returning to start page after period of inactivity"
    );
    preventBeforeUnloadError();
    window.location = target.getAttribute("href");
  }

  handleInactivityTimeout() {
    logEvent("Timeout", "User inactive");

    document.documentElement.classList.add("app-body-has-full-page-overlay");
    this.mainElements.forEach((element) => {
      element.style.display = "none";
    });

    this.overlay.classList.add("app-full-page-overlay");

    const journeyType = document.querySelector(`input[name="JourneyType"]`);

    // Remove nhsuk-core when old web project is decommissioned
    this.overlay.innerHTML = `
    <div class="nhsuk-core">
      <div class="nhsuk-main-wrapper" data-test-id="inactivity-timeout">
        <div class="nhsuk-width-container">
          <h1 class="nhsuk-heading-xl app-u-no-focus-outline" tabindex="-1">Do you want to continue on 111 online?</h1>
          <p>Your session will end after 2 hours of inactivity</p>
          <p>If you do not do anything, you will need to start again. Your progress will not be saved.</p>
          <p>If you feel worse or your symptoms have changed, either use this service again or call 111.</p>

          <button class="nhsuk-button" data-test-id="inactivity-continue">Continue where I left off</button>
          <a href="/auth/confirm-details${
            journeyType && journeyType.value === "EmergencyPrescription"
              ? `?journeyType=EmergencyPrescription`
              : ""
          }" data-test-id="inactivity-start-again" class="nhsuk-button nhsuk-button--secondary">Start again</a>
        </div>
      </div>
    </div>`;

    this.overlay
      .querySelector("button")
      .addEventListener("click", this.continueHandler.bind(this));

    this.overlay
      .querySelector("a")
      .addEventListener("click", this.startAgainHandler.bind(this));

    document.body.appendChild(this.overlay);

    this.overlay.querySelector("h1").focus();
  }

  handleSessionTimeout() {
    logEvent("Timeout", "Session timed out");
    this.signOut();
    disableBeforeUnloadError();

    document.documentElement.classList.add("app-body-has-full-page-overlay");
    this.mainElements.forEach((element) => {
      element.style.display = "none";
    });

    this.overlay.classList.add("app-full-page-overlay");
    // Remove nhsuk-core when old web project is decommissioned
    this.overlay.innerHTML = `
    <div class="nhsuk-core">
      <div class="nhsuk-main-wrapper" data-test-id="session-timeout">
        <div class="nhsuk-width-container">
          <h1 class="nhsuk-heading-xl app-u-no-focus-outline" tabindex="-1">Your 111 online session has ended</h1>
          <p>To protect your data, your session ends if you are inactive for 2 hours</p>
          <p>Your progress has not been saved.</p>
          <p>If you still need advice, either use 111 online again or call 111.</p>
        </div>
      </div>
    </div>`;

    document.body.appendChild(this.overlay);

    this.overlay.querySelector("h1").focus();
  }

  handleLoginTimeout() {
    logEvent("Timeout", "Session ended - returning to NHS App home screen");
    preventBeforeUnloadError();
    nhsapp.navigation.goToHomePage();
  }

  handleKeepAlive() {
    if (this.keepAliveEnabled) {
      this.doKeepAlive();
    }
  }

  doKeepAlive() {
    this.isActive = true;
    this.clearTimers();
    this.initTimers();
  }

  bindEvents() {
    const events = [
      "click",
      "keypress",
      "focus",
      "blur",
      "mousemove",
      "touchstart",
      "wheel",
    ];

    events.forEach((event) => {
      document.body.addEventListener(
        event,
        (e) => {
          if (this.keepAliveEnabled) {
            this.lastUserEvent = Date.now();
          }
        },
        true
      );
    });

    // Bind events to pause the timers when clicking on external links
    Array.from(document.querySelectorAll("a[href^='https://']")).forEach((el) =>
      el.addEventListener("click", this.followExternalLink.bind(this))
    );

    // Resume the timers when closing the popup
    document.addEventListener(
      "visibilitychange",
      this.returnFromExternalLink.bind(this)
    );
  }

  followExternalLink() {
    this.externalLinkFollowed = true;
  }

  async returnFromExternalLink() {
    if (document.visibilityState === "visible" && this.externalLinkFollowed) {
      const loadingSpinner = new LoadingSpinner(this.overlay);
      loadingSpinner.setSpinnerTextTemplate("Please wait");

      if (window.LoadingSpinner.checkSupport()) {
        loadingSpinner.showLoadingSpinner();
      }

      await this.fetchConfig();

      if (this.config.isLoggedIn) {
        this.hideOverlay();
        this.doKeepAlive();
      }

      loadingSpinner.hideLoadingSpinner();

      this.externalLinkFollowed = false;
    }
  }

  async init() {
    this.clearTimers();
    await this.fetchConfig();

    if (!this.config.isLoggedIn) {
      return;
    }

    this.initTimers();
    this.tick();
    this.bindEvents();
  }
}

export async function initInactivityTimeout() {
  if (!featureIsEnabled("NHSAppInactivityTimeout")) {
    return;
  }

  await new InactivityTimeout().init();
}
