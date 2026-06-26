"use strict";
var index$2 = require("./locale/index.js");
var index$10 = require("./affix/index.js");
var index = require("./alert/index.js");
var index$11 = require("./anchor/index.js");
var index$t = require("./auto-complete/index.js");
var index$a = require("./avatar/index.js");
var index$12 = require("./back-top/index.js");
var index$b = require("./badge/index.js");
var index$W = require("./breadcrumb/index.js");
var index$3 = require("./button/index.js");
var index$1 = require("./calendar/index.js");
var index$c = require("./card/index.js");
var index$d = require("./carousel/index.js");
var index$u = require("./cascader/index.js");
var index$v = require("./checkbox/index.js");
var index$e = require("./collapse/index.js");
var index$g = require("./color-picker/index.js");
var index$f = require("./comment/index.js");
var index$13 = require("./config-provider/index.js");
var index$w = require("./date-picker/index.js");
var index$h = require("./descriptions/index.js");
var index$6 = require("./divider/index.js");
var index$N = require("./drawer/index.js");
var index$X = require("./dropdown/index.js");
var index$i = require("./empty/index.js");
var index$x = require("./form/index.js");
var index$7 = require("./grid/index.js");
var index$17 = require("./icon-component/index.js");
var index$j = require("./image/index.js");
var index$y = require("./input/index.js");
var index$z = require("./input-number/index.js");
var index$A = require("./input-tag/index.js");
var index$8 = require("./layout/index.js");
var index$4 = require("./link/index.js");
var index$l = require("./list/index.js");
var index$B = require("./mention/index.js");
var index$Y = require("./menu/index.js");
var index$O = require("./message/index.js");
var index$P = require("./modal/index.js");
var index$Q = require("./notification/index.js");
var index$Z = require("./page-header/index.js");
var index$_ = require("./pagination/index.js");
var index$R = require("./popconfirm/index.js");
var index$m = require("./popover/index.js");
var index$S = require("./progress/index.js");
var index$C = require("./radio/index.js");
var index$D = require("./rate/index.js");
var index$14 = require("./resize-box/index.js");
var index$T = require("./result/index.js");
var index$k = require("./scrollbar/index.js");
var index$E = require("./select/index.js");
var index$V = require("./skeleton/index.js");
var index$F = require("./slider/index.js");
var index$9 = require("./space/index.js");
var index$U = require("./spin/index.js");
var index$16 = require("./split/index.js");
var index$n = require("./statistic/index.js");
var index$$ = require("./steps/index.js");
var index$G = require("./switch/index.js");
var index$o = require("./table/index.js");
var index$p = require("./tabs/index.js");
var index$q = require("./tag/index.js");
var index$H = require("./textarea/index.js");
var index$I = require("./time-picker/index.js");
var index$r = require("./timeline/index.js");
var index$s = require("./tooltip/index.js");
var index$J = require("./transfer/index.js");
var index$K = require("./tree/index.js");
var index$M = require("./tree-select/index.js");
var index$15 = require("./trigger/index.js");
var index$5 = require("./typography/index.js");
var index$L = require("./upload/index.js");
var index$18 = require("./overflow-list/index.js");
var index$1a = require("./verification-code/index.js");
var index$19 = require("./watermark/index.js");
var useFormItem = require("./_hooks/use-form-item.js");
var anchorLink = require("./anchor/anchor-link.js");
var avatarGroup = require("./avatar/avatar-group.js");
var breadcrumbItem = require("./breadcrumb/breadcrumb-item.js");
var buttonGroup = require("./button/button-group.js");
var cardMeta = require("./card/card-meta.js");
var cardGrid = require("./card/card-grid.js");
var carouselItem = require("./carousel/carousel-item.js");
var cascaderPanel = require("./cascader/cascader-panel.js");
var checkboxGroup = require("./checkbox/checkbox-group.js");
var collapseItem = require("./collapse/collapse-item.js");
var descriptionsItem = require("./descriptions/descriptions-item.js");
var weekPicker = require("./date-picker/pickers/week-picker.js");
var monthPicker = require("./date-picker/pickers/month-picker.js");
var yearPicker = require("./date-picker/pickers/year-picker.js");
var quarterPicker = require("./date-picker/pickers/quarter-picker.js");
var rangePicker = require("./date-picker/range-picker.js");
var dropdownOption = require("./dropdown/dropdown-option.js");
var dropdownGroup = require("./dropdown/dropdown-group.js");
var dropdownSubmenu = require("./dropdown/dropdown-submenu.js");
var dropdownButton = require("./dropdown/dropdown-button.js");
var formItem = require("./form/form-item.js");
var gridRow = require("./grid/grid-row.js");
var gridCol = require("./grid/grid-col.js");
var gridItem = require("./grid/grid-item.js");
var preview = require("./image/preview.js");
var previewAction = require("./image/preview-action.js");
var previewGroup = require("./image/preview-group.js");
var inputGroup = require("./input/input-group.js");
var inputSearch = require("./input/input-search.js");
var inputPassword = require("./input/input-password.js");
var header = require("./layout/header.js");
var content = require("./layout/content.js");
var footer = require("./layout/footer.js");
var sider = require("./layout/sider.js");
var listItem = require("./list/list-item.js");
var listItemMeta = require("./list/list-item-meta.js");
var item = require("./menu/item.js");
var itemGroup = require("./menu/item-group.js");
var subMenu = require("./menu/sub-menu.js");
var radioGroup = require("./radio/radio-group.js");
var option = require("./select/option.js");
var optgroup = require("./select/optgroup.js");
var line = require("./skeleton/line.js");
var shape = require("./skeleton/shape.js");
var countdown = require("./statistic/countdown.js");
var step = require("./steps/step.js");
var tableThead = require("./table/table-thead.js");
var tableTd = require("./table/table-td.js");
var tableTh = require("./table/table-th.js");
var tableTr = require("./table/table-tr.js");
var tableTbody = require("./table/table-tbody.js");
var tableColumn = require("./table/table-column.js");
var tabPane = require("./tabs/tab-pane.js");
var item$1 = require("./timeline/item.js");
var paragraph = require("./typography/paragraph.js");
var title = require("./typography/title.js");
var text = require("./typography/text.js");
const components = {
  Button: index$3["default"],
  Link: index$4,
  Typography: index$5["default"],
  Divider: index$6,
  Grid: index$7["default"],
  Layout: index$8["default"],
  Space: index$9,
  Avatar: index$a["default"],
  Badge: index$b,
  Calendar: index$1,
  Card: index$c["default"],
  Carousel: index$d["default"],
  Collapse: index$e["default"],
  Comment: index$f,
  ColorPicker: index$g,
  Descriptions: index$h["default"],
  Empty: index$i,
  Image: index$j["default"],
  Scrollbar: index$k,
  List: index$l["default"],
  Popover: index$m,
  Statistic: index$n["default"],
  Table: index$o["default"],
  Tabs: index$p["default"],
  Tag: index$q,
  Timeline: index$r["default"],
  Tooltip: index$s,
  AutoComplete: index$t,
  Cascader: index$u["default"],
  Checkbox: index$v["default"],
  DatePicker: index$w["default"],
  Form: index$x["default"],
  Input: index$y["default"],
  InputNumber: index$z,
  InputTag: index$A,
  Mention: index$B,
  Radio: index$C["default"],
  Rate: index$D,
  Select: index$E["default"],
  Slider: index$F,
  Switch: index$G,
  Textarea: index$H,
  TimePicker: index$I,
  Transfer: index$J,
  Tree: index$K,
  Upload: index$L,
  TreeSelect: index$M,
  Alert: index,
  Drawer: index$N,
  Message: index$O,
  Modal: index$P,
  Notification: index$Q,
  Popconfirm: index$R,
  Progress: index$S,
  Result: index$T,
  Spin: index$U,
  Skeleton: index$V["default"],
  Breadcrumb: index$W["default"],
  Dropdown: index$X["default"],
  Menu: index$Y["default"],
  PageHeader: index$Z,
  Pagination: index$_,
  Steps: index$$["default"],
  Affix: index$10,
  Anchor: index$11["default"],
  BackTop: index$12,
  ConfigProvider: index$13,
  ResizeBox: index$14,
  Trigger: index$15,
  Split: index$16,
  Icon: index$17,
  OverflowList: index$18,
  Watermark: index$19,
  VerificationCode: index$1a
};
const install = (app, options) => {
  for (const key of Object.keys(components)) {
    app.use(components[key], options);
  }
};
const ArcoVue = {
  ...components,
  Alter: index,
  AnchorLink: anchorLink,
  AvatarGroup: avatarGroup,
  BreadcrumbItem: breadcrumbItem,
  ButtonGroup: buttonGroup,
  Calendar: index$1,
  CardMeta: cardMeta,
  CardGrid: cardGrid,
  CarouselItem: carouselItem,
  CascaderPanel: cascaderPanel,
  CheckboxGroup: checkboxGroup,
  CollapseItem: collapseItem,
  DescriptionsItem: descriptionsItem,
  WeekPicker: weekPicker,
  MonthPicker: monthPicker,
  YearPicker: yearPicker,
  QuarterPicker: quarterPicker,
  RangePicker: rangePicker,
  Doption: dropdownOption,
  Dgroup: dropdownGroup,
  Dsubmenu: dropdownSubmenu,
  DropdownButton: dropdownButton,
  FormItem: formItem,
  Row: gridRow,
  Col: gridCol,
  GridItem: gridItem,
  ImagePreview: preview,
  ImagePreviewAction: previewAction,
  ImagePreviewGroup: previewGroup,
  InputGroup: inputGroup,
  InputSearch: inputSearch,
  InputPassword: inputPassword,
  LayoutHeader: header,
  LayoutContent: content,
  LayoutFooter: footer,
  LayoutSider: sider,
  ListItem: listItem,
  ListItemMeta: listItemMeta,
  MenuItem: item,
  MenuItemGroup: itemGroup,
  SubMenu: subMenu,
  RadioGroup: radioGroup,
  Option: option,
  Optgroup: optgroup,
  SkeletonLine: line,
  SkeletonShape: shape,
  Countdown: countdown,
  Step: step,
  Thead: tableThead,
  Td: tableTd,
  Th: tableTh,
  Tr: tableTr,
  Tbody: tableTbody,
  TableColumn: tableColumn,
  TabPane: tabPane,
  TimelineItem: item$1,
  TypographyParagraph: paragraph,
  TypographyTitle: title,
  TypographyText: text,
  install,
  addI18nMessages: index$2.addI18nMessages,
  useLocale: index$2.useLocale,
  getLocale: index$2.getLocale,
  useFormItem: useFormItem.useFormItem
};
module.exports = ArcoVue;
