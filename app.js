const NHSPrototypeKit = require("nhsuk-prototype-kit");

// Local dependencies
const config = require("./app/config");
const sessionDataDefaults = require("./app/data/session-data-defaults");
const filters = require("./app/filters");
const locals = require("./app/locals");
const routes = require("./app/routes");
const appUtils = require("./app/lib/utils");

/**
 * Additional template lookup paths for Nunjucks views.
 *
 * @type {string[]}
 */
const viewsPath = [
  "app/views/",
  "app/lib/views/",
  "node_modules/nhsapp-frontend/dist",
];

/**
 * Frontend asset entry points used by the prototype build process.
 *
 * @type {string[]}
 */
const entryPoints = [
  "app/assets/sass/main.scss",
  "app/assets/sass/highlight.scss",
  "app/assets/sass/legacy.scss",
  "app/assets/javascript/*.js",
];

/**
 * Initialise and start the NHS prototype app.
 *
 * Configures the kit with application dependencies, registers custom
 * Nunjucks extensions and starts the server on the configured port.
 *
 * @returns {Promise<void>}
 */
async function init() {
  const prototype = await NHSPrototypeKit.init({
    serviceName: config.serviceName,
    buildOptions: {
      entryPoints,
    },
    viewsPath,
    routes,
    locals,
    filters,
    sessionDataDefaults,
  });

  // adds custom 111 nunjucks extensions
  appUtils.addExtensions(prototype.nunjucks);

  prototype.start(config.port);
}

init();
