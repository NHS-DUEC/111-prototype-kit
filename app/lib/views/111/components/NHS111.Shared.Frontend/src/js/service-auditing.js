import { logEvent } from "./modules/utils/event-logging";

const getDosData = (inputName) => {
  const inputFields = document.querySelectorAll(`input[name^="${inputName}"]`);

  const inputObject = {};

  inputFields.forEach((input) => {
    const name = input.name;
    const value = input.value;
    inputObject[name] = value;
  });

  return inputObject;
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const getServiceData = (service, dosData) => {
  if (!service) return false;
  const serviceId = service.getAttribute("data-visible-service-id");
  const serviceOfferedElement = service.querySelector("[data-services-offered]");
  const dosDataInput = getKeyByValue(dosData, serviceId);
  const serviceInputId = dosDataInput.substring(0, dosDataInput.lastIndexOf("."));
  let serviceItemData = {};
  const isValidationService = service.hasAttribute("data-validation-service");

  // This checks for instances where multiple CPCS or EP are presented but no particular service is displayed
  // in those scenarios we want to log different data
  if (serviceOfferedElement) {
    serviceItemData.ServiceName = serviceOfferedElement.getAttribute(
      "data-services-offered"
    );
  } else {
    const querySelector = (field) => {
      const element = document.querySelector(
        `input[name='${serviceInputId}.${field}']`
      );
      return element ? element.value : null;
    };

    serviceItemData = {
      ServiceId: serviceId,
      ServiceName: querySelector("Name"),
      ServiceTypeId: querySelector("ServiceType.Id"),
      PostCode: querySelector("PostCode"),
      Distance: querySelector("Distance"),
      ActionAndReferral: querySelector("ActionAndReferral"),
      BookingStandard: querySelector("BookingStandard"),
    };

    if (isValidationService) {
      serviceItemData.ActionAndReferral = `Validation ${serviceItemData.ActionAndReferral}`;
    }
  }

  return serviceItemData;
};

const setEventData = (services, serviceItemsData) => {
  // The total number of services should not include those that haven't had a serviceId set (e.g - CPCS & EP)
  const filteredServices = serviceItemsData.filter(
    (service) => service.ServiceId
  );
  const eventData = {
    NumberOfServices: filteredServices.length,
    Services: serviceItemsData,
  };
  logEvent("ServicesPresented", "", JSON.stringify(eventData));
  return eventData;
};

export const auditSingleVisibleService = (service) => {
  const data = getDosData("DosCheckCapacitySummaryResult.Success.Services");
  const serviceData = getServiceData(service, data);
  const serviceActions = service.querySelectorAll("[data-service-action]");
  let visibleServiceAction = null;

  const serviceActionMap = {
    bookAndGo: "GoTo-Referral",
    bookSlot: "GoTo-Booking",
    directions: "GoTo",
  };

  if (serviceActions.length > 0) {
    serviceActions.forEach((action) => {
      if (!action.hasAttribute("Hidden")) {
        const actionValue = action.getAttribute("data-service-action");
        visibleServiceAction = serviceActionMap[actionValue];
      }
    });
    serviceData.ActionAndReferral = visibleServiceAction;
  }

  return setEventData(service, [serviceData]);
};

export const auditVisibleServices = () => {
  const services = document.querySelectorAll("[data-visible-service-id]");
  const dosData = getDosData("DosCheckCapacitySummaryResult.Success.Services");
  const dispoUnit = document.querySelectorAll(
    "[data-test-id='disposition-unit-1']"
  );
  const isDispoUnit = dispoUnit.length > 0;
  const noITKServicesAreAvailable =
    document.querySelector("[data-no-services]");

  if (services.length <= 0) {
    if (noITKServicesAreAvailable) {
      // Log when no services are available for ITK - e.g. In Call 111 scenario
      logEvent("NoServicesAvailable", "", "");
    }
    return false;
  }

  // This is to allow for dispos like Dx94 where we only want to audit service on "show" click and not on page load
  if (isDispoUnit) {
    dispoUnit.forEach((item) => {
      item.addEventListener(
        "click",
        () => auditSingleVisibleService(services[0]),
        {
          once: true,
        }
      );
    });
    return false;
  }

  const serviceItemsData = Array.from(services).map((target) => {
    return getServiceData(target, dosData);
  });

  return setEventData(services, serviceItemsData);
};

export const initServiceAuditing = () => {
  return auditVisibleServices();
};
