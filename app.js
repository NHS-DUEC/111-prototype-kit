const NHSPrototypeKit = require("nhsuk-prototype-kit");

// Local dependencies
const config = require("./app/config");
const sessionDataDefaults = require("./app/data/session-data-defaults");
const filters = require("./app/filters");
const locals = require("./app/locals");
const routes = require("./app/routes");
const appUtils = require("./app/lib/utils");
const EmbedExtension = require("./app/lib/extensions/embed");
const RepeatExtension = require("./app/lib/extensions/repeat");

const viewsPath = [
  "app/views/",
  "app/lib/views/",
  "node_modules/nhsapp-frontend/dist",
];

const entryPoints = [
  "app/assets/sass/main.scss",
  "app/assets/sass/highlight.scss",
  "app/assets/sass/legacy.scss",
  "app/assets/javascript/*.js",
];

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

  prototype.nunjucks.addExtension("EmbedExtension", new EmbedExtension());
  prototype.nunjucks.addExtension("RepeatExtension", new RepeatExtension());

  prototype.start(config.port);
}

init();
