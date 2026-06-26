"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var table = require("./table.js");
var tableThead = require("./table-thead.js");
var tableTbody = require("./table-tbody.js");
var tableTr = require("./table-tr.js");
var tableTh = require("./table-th.js");
var tableTd = require("./table-td.js");
var tableColumn = require("./table-column.js");
const Table = Object.assign(table, {
  Thead: tableThead,
  Tbody: tableTbody,
  Tr: tableTr,
  Th: tableTh,
  Td: tableTd,
  Column: tableColumn,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + table.name, table);
    app.component(componentPrefix + tableThead.name, tableThead);
    app.component(componentPrefix + tableTbody.name, tableTbody);
    app.component(componentPrefix + tableTr.name, tableTr);
    app.component(componentPrefix + tableTh.name, tableTh);
    app.component(componentPrefix + tableTd.name, tableTd);
    app.component(componentPrefix + tableColumn.name, tableColumn);
  }
});
exports.Thead = tableThead;
exports.Tbody = tableTbody;
exports.Tr = tableTr;
exports.Th = tableTh;
exports.Td = tableTd;
exports.TableColumn = tableColumn;
exports["default"] = Table;
