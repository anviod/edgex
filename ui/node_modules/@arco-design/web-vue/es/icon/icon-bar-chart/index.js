import _IconBarChart from "./icon-bar-chart.js";
const IconBarChart = Object.assign(_IconBarChart, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBarChart.name, _IconBarChart);
  }
});
export { IconBarChart as default };
