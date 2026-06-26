import { addI18nMessages, useLocale, getLocale } from "./locale/index.js";
import Affix from "./affix/index.js";
import Alert from "./alert/index.js";
import Anchor from "./anchor/index.js";
import AutoComplete from "./auto-complete/index.js";
import Avatar from "./avatar/index.js";
import BackTop from "./back-top/index.js";
import Badge from "./badge/index.js";
import Breadcrumb from "./breadcrumb/index.js";
import Button from "./button/index.js";
import Calendar from "./calendar/index.js";
import Card from "./card/index.js";
import Carousel from "./carousel/index.js";
import Cascader from "./cascader/index.js";
import Checkbox from "./checkbox/index.js";
import Collapse from "./collapse/index.js";
import ColorPicker from "./color-picker/index.js";
import Comment from "./comment/index.js";
import ConfigProvider from "./config-provider/index.js";
import DatePicker from "./date-picker/index.js";
import Descriptions from "./descriptions/index.js";
import Divider from "./divider/index.js";
import Drawer from "./drawer/index.js";
import Dropdown from "./dropdown/index.js";
import Empty from "./empty/index.js";
import Form from "./form/index.js";
import Grid from "./grid/index.js";
import Icon from "./icon-component/index.js";
import Image from "./image/index.js";
import Input from "./input/index.js";
import InputNumber from "./input-number/index.js";
import InputTag from "./input-tag/index.js";
import Layout from "./layout/index.js";
import Link from "./link/index.js";
import List from "./list/index.js";
import Mention from "./mention/index.js";
import Menu from "./menu/index.js";
import Message from "./message/index.js";
import Modal from "./modal/index.js";
import Notification from "./notification/index.js";
import PageHeader from "./page-header/index.js";
import Pagination from "./pagination/index.js";
import Popconfirm from "./popconfirm/index.js";
import Popover from "./popover/index.js";
import Progress from "./progress/index.js";
import Radio from "./radio/index.js";
import Rate from "./rate/index.js";
import ResizeBox from "./resize-box/index.js";
import Result from "./result/index.js";
import Scrollbar from "./scrollbar/index.js";
import Select from "./select/index.js";
import Skeleton from "./skeleton/index.js";
import Slider from "./slider/index.js";
import Space from "./space/index.js";
import Spin from "./spin/index.js";
import Split from "./split/index.js";
import Statistic from "./statistic/index.js";
import Steps from "./steps/index.js";
import Switch from "./switch/index.js";
import Table from "./table/index.js";
import Tabs from "./tabs/index.js";
import Tag from "./tag/index.js";
import Textarea from "./textarea/index.js";
import TimePicker from "./time-picker/index.js";
import Timeline from "./timeline/index.js";
import Tooltip from "./tooltip/index.js";
import Transfer from "./transfer/index.js";
import Tree from "./tree/index.js";
import TreeSelect from "./tree-select/index.js";
import Trigger from "./trigger/index.js";
import Typography from "./typography/index.js";
import Upload from "./upload/index.js";
import OverflowList from "./overflow-list/index.js";
import VerificationCode from "./verification-code/index.js";
import Watermark from "./watermark/index.js";
import { useFormItem } from "./_hooks/use-form-item.js";
import AnchorLink from "./anchor/anchor-link.js";
import AvatarGroup from "./avatar/avatar-group.js";
import BreadcrumbItem from "./breadcrumb/breadcrumb-item.js";
import ButtonGroup from "./button/button-group.js";
import CardMeta from "./card/card-meta.js";
import CardGrid from "./card/card-grid.js";
import CarouselItem from "./carousel/carousel-item.js";
import CascaderPanel from "./cascader/cascader-panel.js";
import CheckboxGroup from "./checkbox/checkbox-group.js";
import CollapseItem from "./collapse/collapse-item.js";
import DescriptionsItem from "./descriptions/descriptions-item.js";
import WeekPicker from "./date-picker/pickers/week-picker.js";
import MonthPicker from "./date-picker/pickers/month-picker.js";
import YearPicker from "./date-picker/pickers/year-picker.js";
import QuarterPicker from "./date-picker/pickers/quarter-picker.js";
import RangePicker from "./date-picker/range-picker.js";
import Doption from "./dropdown/dropdown-option.js";
import Dgroup from "./dropdown/dropdown-group.js";
import Dsubmenu from "./dropdown/dropdown-submenu.js";
import DropdownButton from "./dropdown/dropdown-button.js";
import FormItem from "./form/form-item.js";
import Row from "./grid/grid-row.js";
import Col from "./grid/grid-col.js";
import GridItem from "./grid/grid-item.js";
import ImagePreview from "./image/preview.js";
import ImagePreviewAction from "./image/preview-action.js";
import ImagePreviewGroup from "./image/preview-group.js";
import InputGroup from "./input/input-group.js";
import InputSearch from "./input/input-search.js";
import InputPassword from "./input/input-password.js";
import LayoutHeader from "./layout/header.js";
import LayoutContent from "./layout/content.js";
import LayoutFooter from "./layout/footer.js";
import LayoutSider from "./layout/sider.js";
import ListItem from "./list/list-item.js";
import ListItemMeta from "./list/list-item-meta.js";
import MenuItem from "./menu/item.js";
import MenuItemGroup from "./menu/item-group.js";
import SubMenu from "./menu/sub-menu.js";
import RadioGroup from "./radio/radio-group.js";
import Option from "./select/option.js";
import Optgroup from "./select/optgroup.js";
import SkeletonLine from "./skeleton/line.js";
import SkeletonShape from "./skeleton/shape.js";
import Countdown from "./statistic/countdown.js";
import Step from "./steps/step.js";
import Thead from "./table/table-thead.js";
import Td from "./table/table-td.js";
import Th from "./table/table-th.js";
import Tr from "./table/table-tr.js";
import Tbody from "./table/table-tbody.js";
import TableColumn from "./table/table-column.js";
import TabPane from "./tabs/tab-pane.js";
import TimelineItem from "./timeline/item.js";
import TypographyParagraph from "./typography/paragraph.js";
import TypographyTitle from "./typography/title.js";
import TypographyText from "./typography/text.js";
const components = {
  Button,
  Link,
  Typography,
  Divider,
  Grid,
  Layout,
  Space,
  Avatar,
  Badge,
  Calendar,
  Card,
  Carousel,
  Collapse,
  Comment,
  ColorPicker,
  Descriptions,
  Empty,
  Image,
  Scrollbar,
  List,
  Popover,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  InputTag,
  Mention,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  Textarea,
  TimePicker,
  Transfer,
  Tree,
  Upload,
  TreeSelect,
  Alert,
  Drawer,
  Message,
  Modal,
  Notification,
  Popconfirm,
  Progress,
  Result,
  Spin,
  Skeleton,
  Breadcrumb,
  Dropdown,
  Menu,
  PageHeader,
  Pagination,
  Steps,
  Affix,
  Anchor,
  BackTop,
  ConfigProvider,
  ResizeBox,
  Trigger,
  Split,
  Icon,
  OverflowList,
  Watermark,
  VerificationCode
};
const install = (app, options) => {
  for (const key of Object.keys(components)) {
    app.use(components[key], options);
  }
};
const ArcoVue = {
  ...components,
  Alter: Alert,
  AnchorLink,
  AvatarGroup,
  BreadcrumbItem,
  ButtonGroup,
  Calendar,
  CardMeta,
  CardGrid,
  CarouselItem,
  CascaderPanel,
  CheckboxGroup,
  CollapseItem,
  DescriptionsItem,
  WeekPicker,
  MonthPicker,
  YearPicker,
  QuarterPicker,
  RangePicker,
  Doption,
  Dgroup,
  Dsubmenu,
  DropdownButton,
  FormItem,
  Row,
  Col,
  GridItem,
  ImagePreview,
  ImagePreviewAction,
  ImagePreviewGroup,
  InputGroup,
  InputSearch,
  InputPassword,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  LayoutSider,
  ListItem,
  ListItemMeta,
  MenuItem,
  MenuItemGroup,
  SubMenu,
  RadioGroup,
  Option,
  Optgroup,
  SkeletonLine,
  SkeletonShape,
  Countdown,
  Step,
  Thead,
  Td,
  Th,
  Tr,
  Tbody,
  TableColumn,
  TabPane,
  TimelineItem,
  TypographyParagraph,
  TypographyTitle,
  TypographyText,
  install,
  addI18nMessages,
  useLocale,
  getLocale,
  useFormItem
};
export { ArcoVue as default };
