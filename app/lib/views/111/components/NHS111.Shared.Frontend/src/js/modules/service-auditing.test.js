// import { logEvent } from "./modules/utils/event-logging";
import {
  auditVisibleServices,
  auditSingleVisibleService,
} from "../service-auditing";

import {
  serviceFixture,
  serviceFixtureSingle,
  CPCSFixture,
  validationFixture,
} from "./__fixtures__/service-auditing";
import { logEvent } from "./utils/event-logging";

jest.mock("./utils/event-logging");

describe("auditVisibleServices", () => {
  beforeEach(() => {
    logEvent.mockClear();
    document.body.innerHTML = "";
  });

  test("logs ServicesPresented event when dos services are available and presented", () => {
    document.body.innerHTML = serviceFixture;
    const result = auditVisibleServices();

    expect(logEvent).toHaveBeenCalledWith(
      "ServicesPresented",
      "",
      JSON.stringify(result)
    );
    expect(result.NumberOfServices).toEqual(1);
  });

  test("logs serivces offered for multiple CPCS and EP dispositions", () => {
    document.body.innerHTML = CPCSFixture;

    const CPCSresult = auditVisibleServices();

    expect(logEvent).toHaveBeenCalledWith(
      "ServicesPresented",
      "",
      JSON.stringify(CPCSresult)
    );
    expect(CPCSresult.Services[0].ServiceName).toEqual("Multiple CPCS offered");
    expect(CPCSresult.NumberOfServices).toEqual(0);
  });

  test("does not log event when no services are available and not ITK scenario", () => {
    document.body.innerHTML = "<div></div>";
    const result = auditVisibleServices();

    expect(logEvent).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test("Log event when no services are available for ITK - e.g. In Call 111 scenario", () => {
    document.body.innerHTML = `<div data-no-services></div>`;
    const result = auditVisibleServices();

    expect(logEvent).toHaveBeenCalledWith("NoServicesAvailable", "", "");
    expect(result).toBe(false);
  });

  test("ActionAndReferral is set correctly when service is a validation callback", () => {
    document.body.innerHTML = validationFixture;
    const validationResult = auditVisibleServices();

    expect(logEvent).toHaveBeenCalledWith(
      "ServicesPresented",
      "",
      JSON.stringify(validationResult)
    );
    expect(validationResult.Services[0].ActionAndReferral).toEqual(
      "Validation Callback"
    );
  });
});

describe("auditSingleVisibleService", () => {
  beforeEach(() => {
    logEvent.mockClear();
    document.body.innerHTML = "";
  });

  test("logs ServicesPresented event and set the correct ActionAndReferral", () => {
    document.body.innerHTML = serviceFixtureSingle;

    const service = document.querySelector("[data-visible-service-id]");
    const singleServiceData = auditSingleVisibleService(service);

    expect(logEvent).toHaveBeenCalledWith(
      "ServicesPresented",
      "",
      JSON.stringify(singleServiceData)
    );

    expect(singleServiceData.Services[0].ActionAndReferral).toEqual(
      "GoTo-Referral"
    );
  });
});
