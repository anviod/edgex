"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var _interface = require("./interface.js");
const getFinalValidateStatus = (validateStatus) => {
  let status = "";
  for (const key of Object.keys(validateStatus)) {
    const _status = validateStatus[key];
    if (_status) {
      if (!status || _interface.VALIDATE_STATUSES.indexOf(_status) > _interface.VALIDATE_STATUSES.indexOf(status)) {
        status = validateStatus[key];
      }
    }
  }
  return status;
};
const getFinalValidateMessage = (validateMessage) => {
  const messages = [];
  for (const key of Object.keys(validateMessage)) {
    const _message = validateMessage[key];
    if (_message) {
      messages.push(_message);
    }
  }
  return messages;
};
const getFormElementId = (prefix, field) => {
  const id = field.replace(/[[.]/g, "_").replace(/\]/g, "");
  return prefix ? `${prefix}-${id}` : `${id}`;
};
exports.getFinalValidateMessage = getFinalValidateMessage;
exports.getFinalValidateStatus = getFinalValidateStatus;
exports.getFormElementId = getFormElementId;
