import { getPartPostCode } from "./postcode-utils";

export function getHiddenFieldValue(name, nameEndsWith = false) {
  const fields = nameEndsWith
    ? document.querySelectorAll(`[name$="${name}"]`)
    : document.getElementsByName(name);

  if (fields.length > 0) {
    return fields[0].value;
  }

  return "";
}

export function getGender() {
  const gender = getHiddenFieldValue("Gender", true);

  if (["male", "female"].includes(gender.toLowerCase())) return gender;

  return "";
}

export function getDxCode() {
  // find the DxCode by searching for any input with value starting Dx
  const dxCode = document.querySelector('input[value^="Dx"]');

  if (dxCode) {
    return dxCode.value;
  }

  return "";
}

export function createAuditEntry(
  eventKey,
  eventValue,
  eventData = "",
  answerOrder = "",
  answerTitle = ""
) {
  return {
    journeyId: getHiddenFieldValue("JourneyId", true),
    campaign: getHiddenFieldValue("Campaign"),
    dxCode: getDxCode(),
    postCodePart: getPartPostCode(getHiddenFieldValue("CurrentPostcode", true)),
    pathwayId: getHiddenFieldValue("PathwayId", true),
    pathwayTitle: getHiddenFieldValue("PathwayTitle", true),
    campaignSource: getHiddenFieldValue("Source"),
    QuestionNo: getHiddenFieldValue("QuestionNo"),
    QuestionTitle: getHiddenFieldValue("Title"),
    age: getHiddenFieldValue("Age", true),
    gender: getGender(),
    eventKey,
    eventValue,
    eventData,
    page: window.location.pathname,
    AnswerOrder: answerOrder,
    AnswerTitle: answerTitle,
  };
}

export function logEvent(
  eventKey,
  eventValue,
  eventData,
  answerOrder,
  answerTitle
) {
  const formData = new FormData();
  const auditEntry = createAuditEntry(
    eventKey,
    eventValue,
    eventData,
    answerOrder,
    answerTitle
  );

  Object.entries(auditEntry).forEach((item) => {
    const [key, value] = item;
    formData.append(key, value);
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/Auditing/Log", formData);
  }
}

export function logClick(eventValue, answerOrder, answerTitle) {
  logEvent("Clicked", eventValue, "", answerOrder, answerTitle);
}
