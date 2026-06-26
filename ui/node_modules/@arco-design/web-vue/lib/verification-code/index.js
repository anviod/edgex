"use strict";
var globalConfig = require("../_utils/global-config.js");
var verificationCode = require("./verification-code.js");
const VerificationCode = Object.assign(verificationCode, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + verificationCode.name, verificationCode);
  }
});
module.exports = VerificationCode;
