export const serviceFixture = `
  <div class="service-details-wrapper" data-visible-service-id="1483092428"></div>
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Id" value="1483092428">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].ServiceType.Id" value="46">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Name" value="Urgent Care Centre - Chorley" />
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Distance" value="12.6">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].PostCode" value="PR7 1PP">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].BookingStandard" value="CareConnect">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].ActionAndReferral" value="GoTo-Referral">
`;

export const dosDataFixture = {
  "DosCheckCapacitySummaryResult.Success.Services[0].ActionAndReferral":
    "GoTo-Referral",
  "DosCheckCapacitySummaryResult.Success.Services[0].BookingStandard":
    "CareConnect",
  "DosCheckCapacitySummaryResult.Success.Services[0].Distance": "12.6",
  "DosCheckCapacitySummaryResult.Success.Services[0].Name":
    "Urgent Care Centre - Chorley",
  "DosCheckCapacitySummaryResult.Success.Services[0].PostCode": "PR7 1PP",
  "DosCheckCapacitySummaryResult.Success.Services[0].ServiceType.Id": "46",
  "DosCheckCapacitySummaryResult.Success.Services[0].Id": "1483092428",
};

export const serviceFixtureSingle = `
  <details class="service-listing" data-visible-service-id="111923" open>
    <div data-service-action="bookAndGo"></div>
    <div data-service-action="bookSlot" hidden></div>
    <div data-service-action="directions" hidden></div>
  </details>
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Id" value="111923">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].ServiceType.Id" value="105">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Name" value="Emergency Department Royal Blackburn Hospital - Blackburn" />
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Distance" value="0.6">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].PostCode" value="BB2 3HH">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].BookingStandard" value="CareConnect">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].ActionAndReferral" value="GoTo">
`;

export const CPCSFixture = `
  <div data-visible-service-id="1483092428">
    <div data-services-offered="Multiple CPCS offered">
    </div>
  </div>
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Id" value="1483092428">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].ServiceType.Id" value="46">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Name" value="Urgent Care Centre - Chorley" />
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Distance" value="12.6">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].PostCode" value="PR7 1PP">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].BookingStandard" value="CareConnect">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].ActionAndReferral" value="GoTo-Referral">
`;

export const validationFixture = `
  <div class="form-group measure" data-visible-service-id="1483092428" data-validation-service>
  <div>
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Id" value="1483092428">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].ServiceType.Id" value="46">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Name" value="Urgent Care Centre - Chorley" />
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].Distance" value="12.6">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].PostCode" value="PR7 1PP">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].BookingStandard" value="CareConnect">
  <input type="hidden" name="DosCheckCapacitySummaryResult.Success.Services[0].ActionAndReferral" value="Callback">
`;
