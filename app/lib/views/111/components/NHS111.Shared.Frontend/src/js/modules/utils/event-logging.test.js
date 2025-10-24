const {
  getHiddenFieldValue,
  getGender,
  getDxCode,
  createAuditEntry,
  logEvent,
} = require("./event-logging");

describe("createAuditEntry method", () => {
  test("minimal example returns expected data", () => {
    expect(createAuditEntry("Clicked", "event value here")).toMatchObject({
      AnswerOrder: "",
      AnswerTitle: "",
      QuestionNo: "",
      QuestionTitle: "",
      age: "",
      campaign: "",
      campaignSource: "",
      dxCode: "",
      eventKey: "Clicked",
      eventValue: "event value here",
      eventData: "",
      gender: "",
      journeyId: "",
      page: "/",
      pathwayId: "",
      pathwayTitle: "",
      postCodePart: "",
    });
  });

  test("with hidden fields present in DOM returns expected data", () => {
    document.body.innerHTML = `
    <input type="hidden" name="JourneyId" value="1">
    <input type="hidden" name="Campaign" value="2">
    <input type="hidden" name="whatever" value="Dx123">
    <input type="hidden" name="Whatever.CurrentPostcode" value="PL11LP">
    <input type="hidden" name="Whatever.PathwayId" value="4">
    <input type="hidden" name="Whatever.PathwayTitle" value="5">
    <input type="hidden" name="Source" value="6">
    <input type="hidden" name="QuestionNo" value="7">
    <input type="hidden" name="Title" value="8">
    <input type="hidden" name="Whatever.Age" value="9">
    <input type="hidden" name="Whatever.Gender" value="Male">
    `;

    expect(createAuditEntry("Clicked", "event value here")).toMatchObject({
      AnswerOrder: "",
      AnswerTitle: "",
      QuestionNo: "7",
      QuestionTitle: "8",
      age: "9",
      campaign: "2",
      campaignSource: "6",
      dxCode: "Dx123",
      eventKey: "Clicked",
      eventValue: "event value here",
      eventData: "",
      gender: "Male",
      journeyId: "1",
      page: "/",
      pathwayId: "4",
      pathwayTitle: "5",
      postCodePart: "PL1",
    });
  });

  test("with multiple hidden fields present in DOM returns expected data", () => {
    document.body.innerHTML = `
    <input type="hidden" name="JourneyId" value="1">
    <input type="hidden" name="Campaign" value="2">
    <input type="hidden" name="whatever" value="Dx123">
    <input type="hidden" name="Whatever.CurrentPostcode" value="PL11LP">
    <input type="hidden" name="Whatever.PathwayId" value="4">
    <input type="hidden" name="Whatever.PathwayTitle" value="5">
    <input type="hidden" name="Source" value="6">
    <input type="hidden" name="QuestionNo" value="7">
    <input type="hidden" name="Title" value="8">
    <input type="hidden" name="Whatever.Age" value="9">
    <input type="hidden" name="Whatever.Gender" value="Male">

    <input type="hidden" name="SecondSetOfFields.whatever" value="Dx456">
    <input type="hidden" name="SecondSetOfFields.CurrentPostcode" value="BS34PQ">
    <input type="hidden" name="SecondSetOfFields.PathwayId" value="14">
    <input type="hidden" name="SecondSetOfFields.PathwayTitle" value="15">
    <input type="hidden" name="SecondSetOfFields.Age" value="19">
    <input type="hidden" name="SecondSetOfFields.Gender" value="Female">
    `;

    expect(createAuditEntry("Clicked", "event value here")).toMatchObject({
      AnswerOrder: "",
      AnswerTitle: "",
      QuestionNo: "7",
      QuestionTitle: "8",
      age: "9",
      campaign: "2",
      campaignSource: "6",
      dxCode: "Dx123",
      eventKey: "Clicked",
      eventValue: "event value here",
      eventData: "",
      gender: "Male",
      journeyId: "1",
      page: "/",
      pathwayId: "4",
      pathwayTitle: "5",
      postCodePart: "PL1",
    });
  });

  test("with hidden fields in DOM and answerOrder, answerTitle returns expected data", () => {
    document.body.innerHTML = `
    <input type="hidden" name="JourneyId" value="1">
    <input type="hidden" name="Campaign" value="2">
    <input type="hidden" name="whatever" value="Dx123">
    <input type="hidden" name="Whatever.CurrentPostcode" value="PL11LP">
    <input type="hidden" name="Whatever.PathwayId" value="4">
    <input type="hidden" name="Whatever.PathwayTitle" value="5">
    <input type="hidden" name="Source" value="6">
    <input type="hidden" name="QuestionNo" value="7">
    <input type="hidden" name="Title" value="8">
    <input type="hidden" name="Whatever.Age" value="9">
    <input type="hidden" name="Whatever.Gender" value="Male">
    `;

    expect(
      createAuditEntry("Clicked", "event value here", "", 3, "answer title")
    ).toMatchObject({
      AnswerOrder: 3,
      AnswerTitle: "answer title",
      QuestionNo: "7",
      QuestionTitle: "8",
      age: "9",
      campaign: "2",
      campaignSource: "6",
      dxCode: "Dx123",
      eventKey: "Clicked",
      eventValue: "event value here",
      eventData: "",
      gender: "Male",
      journeyId: "1",
      page: "/",
      pathwayId: "4",
      pathwayTitle: "5",
      postCodePart: "PL1",
    });
  });
});

describe("logEvent method", () => {
  const { navigator } = window;

  beforeAll(() => {
    delete window.navigator;
    window.navigator = { sendBeacon: jest.fn() };
  });

  afterAll(() => {
    window.navigator = navigator;
  });

  test("calls navigator.sendBeacon with the correct data", () => {
    document.body.innerHTML = `
    <input type="hidden" name="JourneyId" value="1">
    <input type="hidden" name="Campaign" value="2">
    <input type="hidden" name="whatever" value="Dx123">
    <input type="hidden" name="Whatever.CurrentPostcode" value="PL11LP">
    <input type="hidden" name="Whatever.PathwayId" value="4">
    <input type="hidden" name="Whatever.PathwayTitle" value="5">
    <input type="hidden" name="Source" value="6">
    <input type="hidden" name="QuestionNo" value="7">
    <input type="hidden" name="Title" value="8">
    <input type="hidden" name="Whatever.Age" value="9">
    <input type="hidden" name="Whatever.Gender" value="Male">
    `;

    logEvent(
      "Clicked",
      "event value",
      "event data",
      "answer order",
      "answer title"
    );

    const expectedFormData = new FormData();
    expectedFormData.append("journeyId", "1");
    expectedFormData.append("campaign", "2");
    expectedFormData.append("dxCode", "Dx123");
    expectedFormData.append("postCodePart", "PL1");
    expectedFormData.append("pathwayId", "4");
    expectedFormData.append("pathwayTitle", "5");
    expectedFormData.append("campaignSource", "6");
    expectedFormData.append("QuestionNo", "7");
    expectedFormData.append("QuestionTitle", "8");
    expectedFormData.append("age", "9");
    expectedFormData.append("gender", "Male");
    expectedFormData.append("AnswerOrder", "answer order");
    expectedFormData.append("AnswerTitle", "answer title");
    expectedFormData.append("eventKey", "Clicked");
    expectedFormData.append("eventValue", "event value");
    expectedFormData.append("eventData", "event data");
    expectedFormData.append("page", "/");

    const mockCall = window.navigator.sendBeacon.mock.calls[0];
    expect(mockCall[0]).toBe("/Auditing/Log");
    expect(Array.from(mockCall[1].entries()).sort()).toEqual(
      Array.from(expectedFormData.entries()).sort()
    );
  });
});

describe("getHiddenFieldValue method", () => {
  test("returns correct value when field is present in DOM", () => {
    document.body.innerHTML = `<input type="hidden" name="foo" value="bar">`;
    expect(getHiddenFieldValue("foo")).toBe("bar");
  });

  test("returns correct value when field is present in DOM prefixed where it's name is prefixed by something", () => {
    document.body.innerHTML = `<input type="hidden" name="something.foo" value="bar">`;
    expect(getHiddenFieldValue("foo", true)).toBe("bar");
  });

  test("returns empty string when field is not present in DOM", () => {
    document.body.innerHTML = `<input type="hidden" name="foo" value="bar">`;
    expect(getHiddenFieldValue("something-else")).toBe("");
  });
});

describe("getGender method", () => {
  test("returns empty string when hidden field absent", () => {
    document.body.innerHTML = `<input type="hidden" name="foo" value="bar">`;
    expect(getGender()).toBe("");
  });

  test("returns male when set to male", () => {
    document.body.innerHTML = `<input type="hidden" name="Gender" value="Male">`;
    expect(getGender()).toBe("Male");
  });

  test("returns female when set to female", () => {
    document.body.innerHTML = `<input type="hidden" name="Gender" value="Female">`;
    expect(getGender()).toBe("Female");
  });

  test("returns empty string when set to indeterminate", () => {
    document.body.innerHTML = `<input type="hidden" name="Gender" value="Indeterminate">`;
    expect(getGender()).toBe("");
  });
});

describe("getDxCode method", () => {
  test("returns empty string if field not found", () => {
    document.body.innerHTML = `<input type="hidden" name="foo" value="bar">`;
    expect(getDxCode()).toBe("");
  });

  test("returns DxCode if single field starting with Dx is found", () => {
    document.body.innerHTML = `<input type="hidden" name="foo" value="Dx123">`;
    expect(getDxCode()).toBe("Dx123");
  });

  test("returns first DxCode if multiple fields starting with Dx are found", () => {
    document.body.innerHTML = `
            <input type="hidden" name="foo" value="Dx123">
            <input type="hidden" name="bar" value="Dx456">
            <input type="hidden" name="wibble" value="Dx789">
        `;
    expect(getDxCode()).toBe("Dx123");
  });
});
