# Webchat stylesheets

This folder contains stylesheets for third party webchat providers.

These are set as entrypoints in the webpack config, and result in files being output into the build meaning that they will end up on the CDN. However, depending on provider, they may not actually be referenced via the CDN. They are excluded from the manifest.json and so cannot be referenced from our frontend web apps. They are simply included in this folder for ease of building the stylesheets - making use of the existing pipelines that are set up etc.

Differences relative to other stylesheet entrypoints:
- excluded from manifest.json
- output filenames do not contain a cachebuster - useful in case providers ever do want to reference the file via our CDN


## Providers

Provider specific details can be found below.

### Storm

Storm webchat styles are emailed to the provider who will then upload them to their production environment.
