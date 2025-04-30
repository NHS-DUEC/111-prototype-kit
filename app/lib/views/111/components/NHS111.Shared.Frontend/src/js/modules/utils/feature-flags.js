const featureFlags = JSON.parse(
  document.querySelector("#feature-flags").innerHTML
);

export function featureIsEnabled(featureName) {
  return featureFlags[featureName];
}
