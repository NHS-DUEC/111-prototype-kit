export function initInterstitialForm() {
  const form = document.querySelector("[data-interstitial-form]");

  if (form) {
    window.addEventListener("load", () => {
      form.submit();
    });
  }
}
