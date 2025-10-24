---
name: button
---

## Search call to action button

Currently used on the main categories page to link to the search page.

NHS style buttons should be used for the most part - this button is styled
differently since it is not necessarily the main call to action on the
categories page but the icon provides additional affordance that helps
people find the search function.

<a class="nhsuk-button app-button--tertiary" href="#">
    <svg xmlns="http://www.w3.org/2000/svg" class="app-button__icon" viewBox="0 0 18 18" aria-hidden="true" focusable="false" width="24" height="24">
        <g stroke="#fff">
            <path d="M12,12l5,5Z" stroke-linejoin="round" stroke-width="1.75"/>
            <circle cx="7" cy="7" r="6" fill="none" stroke-width="1.75" />
        </g>
    </svg>
    <span>Search our A to Z</span>
</a>

## Link button

Styles a button to look like a link. `.app-button--full-stop` adds a full stop after the link with CSS, due to it being a block element.

<p>
  Take our <button class="app-button--link app-button--full-stop" >a short survey (opens in a new tab or window)</button>
<p>
