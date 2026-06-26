import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Table from "./table.js";
import Thead from "./table-thead.js";
export { default as Thead } from "./table-thead.js";
import Tbody from "./table-tbody.js";
export { default as Tbody } from "./table-tbody.js";
import Tr from "./table-tr.js";
export { default as Tr } from "./table-tr.js";
import Th from "./table-th.js";
export { default as Th } from "./table-th.js";
import Td from "./table-td.js";
export { default as Td } from "./table-td.js";
import TableColumn from "./table-column.js";
export { default as TableColumn } from "./table-column.js";
const Table = Object.assign(_Table, {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Column: TableColumn,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Table.name, _Table);
    app.component(componentPrefix + Thead.name, Thead);
    app.component(componentPrefix + Tbody.name, Tbody);
    app.component(componentPrefix + Tr.name, Tr);
    app.component(componentPrefix + Th.name, Th);
    app.component(componentPrefix + Td.name, Td);
    app.component(componentPrefix + TableColumn.name, TableColumn);
  }
});
export { Table as default };
