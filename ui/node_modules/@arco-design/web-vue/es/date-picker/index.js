import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _DatePicker from "./pickers/date-picker.js";
import WeekPicker from "./pickers/week-picker.js";
export { default as WeekPicker } from "./pickers/week-picker.js";
import MonthPicker from "./pickers/month-picker.js";
export { default as MonthPicker } from "./pickers/month-picker.js";
import YearPicker from "./pickers/year-picker.js";
export { default as YearPicker } from "./pickers/year-picker.js";
import QuarterPicker from "./pickers/quarter-picker.js";
export { default as QuarterPicker } from "./pickers/quarter-picker.js";
import RangePicker from "./range-picker.js";
export { default as RangePicker } from "./range-picker.js";
const DatePicker = Object.assign(_DatePicker, {
  WeekPicker,
  MonthPicker,
  YearPicker,
  QuarterPicker,
  RangePicker,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _DatePicker.name, _DatePicker);
    app.component(componentPrefix + YearPicker.name, YearPicker);
    app.component(componentPrefix + QuarterPicker.name, QuarterPicker);
    app.component(componentPrefix + MonthPicker.name, MonthPicker);
    app.component(componentPrefix + WeekPicker.name, WeekPicker);
    app.component(componentPrefix + RangePicker.name, RangePicker);
  }
});
export { DatePicker as default };
