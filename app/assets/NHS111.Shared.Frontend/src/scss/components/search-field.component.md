---
name: search-field
---

## Search field

<div class="app-search-field">
  <label class="nhsuk-hint" for="SanitisedSearchTerm">Choose the one symptom that's bothering you most today.</label>
  <div class="app-search-field__inner">
    <input type="search" class=" app-search-field__input" data-test-id="search-box" autocomplete="off" data-val="true" id="SanitisedSearchTerm" name="SanitisedSearchTerm" value="" />
    <button data-test-id="search-button" type="submit" class="app-search-field__button app-search-field__button--with-divider">
      <svg xmlns="http://www.w3.org/2000/svg"  class="app-search-field__icon" viewBox="0 0 18 18" aria-hidden="true" focusable="false" width="22" height="22">
        <g stroke="#005eb8">
          <path d="M12,12l5,5Z" stroke-linejoin="round" stroke-width="1.75"/>
          <circle cx="7" cy="7" r="6" fill="none" stroke-width="1.75" />
        </g>
      </svg>
      <span class="nhsuk-u-visually-hidden">Search</span>
    </button>
  </div>
</div>

---

## Search field with reset button

Reset button should only be displayed when a term has been entered and results are shown

<div class="app-search-field">
  <label class="nhsuk-hint" for="SanitisedSearchTerm">Choose the one symptom that's bothering you most today.</label>
  <div class="app-search-field__inner">
    <input type="search" class=" app-search-field__input" data-test-id="search-box" autocomplete="off" id="SanitisedSearchTerm" name="SanitisedSearchTerm" value="test" />
    <a class="app-search-field__button" href="/Search/Search">
      <svg class="app-search-field__icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="16" height="16">
        <g stroke="#a0a0a0"><path stroke-width="2" stroke-linecap="round" d="m1.226 1.259 13.548 13.482M14.774 1.259 1.226 14.741"/></g>
      </svg>
      <span class="nhsuk-u-visually-hidden">Clear search</span>
    </a>
    <button data-test-id="search-button" type="submit" class="app-search-field__button app-search-field__button--with-divider">
      <svg xmlns="http://www.w3.org/2000/svg"  class="app-search-field__icon" viewBox="0 0 18 18" aria-hidden="true" focusable="false" width="22" height="22">
        <g stroke="#005eb8">
          <path d="M12,12l5,5Z" stroke-linejoin="round" stroke-width="1.75"/>
          <circle cx="7" cy="7" r="6" fill="none" stroke-width="1.75" />
        </g>
      </svg>
      <span class="nhsuk-u-visually-hidden">Search</span>
    </button>
  </div>
</div>

---
