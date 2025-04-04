export const formHtml = `<form
data-test-id="feedback-content"
action="/Feedback/SubmitFeedback"
method="post"
target="_blank"
data-feedback-form
autocomplete="off"
>
<input
  type="hidden"
  name="UserId"
  value="c0604133-7150-442d-afbe-957f19902546"
/>

<input type="hidden" name="PageData.Page" value="ModuleZero" />
<input type="hidden" name="PageData.TxNumber" value="" />
<input type="hidden" name="PageData.QuestionId" value="" />
<input type="hidden" name="PageData.StartingPathwayNo" value="" />
<input type="hidden" name="PageData.StartingPathwayTitle" value="" />
<input type="hidden" name="PageData.Gender" value="Indeterminate" />
<input type="hidden" name="PageData.Age" value="" />
<input type="hidden" name="PageData.PathwayNo" value="" />
<input type="hidden" name="PageData.PathwayTitle" value="" />
<input type="hidden" name="PageData.DxCode" value="" />
<input type="hidden" name="PageData.SearchString" value="" />
<input type="hidden" name="PageData.Campaign" value="" />
<input type="hidden" name="PageData.Source" value="" />
<input type="hidden" name="PageData.StartUrl" value="default" />

<div class="nhsuk-form-group" data-feedback-form-section>
  <fieldset class="nhsuk-fieldset">
    <legend class="nhsuk-fieldset__legend nhsuk-fieldset__legend--m">
      Does the page make sense?
    </legend>
    <div class="nhsuk-radios">
      <div class="nhsuk-radios__item">
        <input
          class="nhsuk-radios__input"
          id="feedback-choice-yes"
          name="feedbackChoice"
          type="radio"
          value="yes"
        />
        <label
          class="nhsuk-label nhsuk-radios__label"
          for="feedback-choice-yes"
          >Yes</label
        >
      </div>

      <div class="nhsuk-radios__item">
        <input
          class="nhsuk-radios__input"
          id="feedback-choice-no"
          name="feedbackChoice"
          type="radio"
          value="no"
        />
        <label
          class="nhsuk-label nhsuk-radios__label"
          for="feedback-choice-no"
          >No</label
        >
      </div>
    </div>
  </fieldset>
</div>

<div data-feedback-form-section>
  <fieldset class="nhsuk-fieldset">
    <legend
      class="nhsuk-fieldset__legend nhsuk-fieldset__legend--m nhsuk-u-margin-bottom-0"
      data-test-id="feedback-explanation-1"
    >
      Tell us how to make this page easier to understand
    </legend>

    <br />

    <div
      class="nhsuk-character-count"
      data-module="nhsuk-character-count"
      data-maxlength="1200"
    >
      <div class="nhsuk-form-group">
        <div
          class="app-callout app-callout--info"
          id="feedback-contact-warning"
        >
          <p data-test-id="feedback-explanation-2">
            Do <strong>not</strong> leave any personal or contact information.
            No one will reply to requests for medical help or contact you.
          </p>
        </div>

        <label for="feedback-text" class="nhsuk-label">Your feedback</label>
        <textarea
          class="nhsuk-textarea nhsuk-js-character-count"
          id="feedback-text"
          name="Text"
          rows="5"
          data-test-id="feedback-textarea"
          aria-describedby="feedback-text-info"
          data-autosize
        ></textarea>
      </div>

      <div
        class="nhsuk-hint nhsuk-character-count__message"
        id="feedback-text-info"
      >
        You can enter up to 1200 characters
      </div>
    </div>
  </fieldset>

  <button
    data-test-id="send-feedback-button"
    data-event-trigger="click"
    data-event-value="Send feedback"
    class="nhsuk-button nhsuk-u-margin-bottom-2"
    type="submit"
  >
    Send feedback
  </button>
  <p class="nhsuk-hint" data-feedback-nojs-message>
    (Opens in a new tab or window)
  </p>
</div>
</form>`;
