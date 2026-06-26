"use strict";
var iconBarChart = require("./icon-bar-chart.js");
const IconBarChart = Object.assign(iconBarChart, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBarChart.name, iconBarChart);
  }
});
module.exports = IconBarChart;
