"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var datePicker = require("./pickers/date-picker.js");
var weekPicker = require("./pickers/week-picker.js");
var monthPicker = require("./pickers/month-picker.js");
var yearPicker = require("./pickers/year-picker.js");
var quarterPicker = require("./pickers/quarter-picker.js");
var rangePicker = require("./range-picker.js");
const DatePicker = Object.assign(datePicker, {
  WeekPicker: weekPicker,
  MonthPicker: monthPicker,
  YearPicker: yearPicker,
  QuarterPicker: quarterPicker,
  RangePicker: rangePicker,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + datePicker.name, datePicker);
    app.component(componentPrefix + yearPicker.name, yearPicker);
    app.component(componentPrefix + quarterPicker.name, quarterPicker);
    app.component(componentPrefix + monthPicker.name, monthPicker);
    app.component(componentPrefix + weekPicker.name, weekPicker);
    app.component(componentPrefix + rangePicker.name, rangePicker);
  }
});
exports.WeekPicker = weekPicker;
exports.MonthPicker = monthPicker;
exports.YearPicker = yearPicker;
exports.QuarterPicker = quarterPicker;
exports.RangePicker = rangePicker;
exports["default"] = DatePicker;
