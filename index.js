const { serveStatic, notFoundHandler, injectParams } = require("./src/handlers");
const { injectCookies } = require("./src/injectCookies");

module.exports = { injectParams, serveStatic, notFoundHandler, injectCookies };
