export const formHtml = `<form class="nhsuk-u-margin-top-3" method="post" action="/Survey/EmailSurveyCollection" data-survey-form="" target="_blank">
<input name="data-1" value="value-1">
<input name="data-2" value="value-2">

<div class="nhsuk-form-group nhsuk-u-margin-bottom-0" data-survey-form-section="">
    <p>We would like to know more about your experience using 111 online.</p>

    <p>We will send you a link to a survey in 2 days.</p>

    <p>This is so you can get the help you need before completing the survey.</p>

    <fieldset class="nhsuk-fieldset">
        <div class="nhsuk-form-group">
            <label class="nhsuk-label nhsuk-u-font-weight-bold" for="email">
                Enter your email address
            </label>
            <input class="nhsuk-input nhsuk-u-width-one-half" id="email" name="EmailAddress" type="email" inputmode="email">
        </div>
    </fieldset>

    <button class="nhsuk-button nhsuk-u-margin-top-4" data-email-survey-cancel type="submit">Send</button>
    <button class="nhsuk-button nhsuk-button--secondary nhsuk-u-margin-top-4" data-email-survey-submit type="submit">Send</button>
    <p data-feedback-nojs-message>(Opens in a new tab or window)</p>
</div>
</form>`;
