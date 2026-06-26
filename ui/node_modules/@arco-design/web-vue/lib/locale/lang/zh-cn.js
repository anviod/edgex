"use strict";
const calendarLang = {
  formatYear: "YYYY \u5E74",
  formatMonth: "YYYY \u5E74 MM \u6708",
  today: "\u4ECA\u5929",
  view: {
    month: "\u6708",
    year: "\u5E74",
    week: "\u5468",
    day: "\u65E5"
  },
  month: {
    long: {
      January: "\u4E00\u6708",
      February: "\u4E8C\u6708",
      March: "\u4E09\u6708",
      April: "\u56DB\u6708",
      May: "\u4E94\u6708",
      June: "\u516D\u6708",
      July: "\u4E03\u6708",
      August: "\u516B\u6708",
      September: "\u4E5D\u6708",
      October: "\u5341\u6708",
      November: "\u5341\u4E00\u6708",
      December: "\u5341\u4E8C\u6708"
    },
    short: {
      January: "\u4E00\u6708",
      February: "\u4E8C\u6708",
      March: "\u4E09\u6708",
      April: "\u56DB\u6708",
      May: "\u4E94\u6708",
      June: "\u516D\u6708",
      July: "\u4E03\u6708",
      August: "\u516B\u6708",
      September: "\u4E5D\u6708",
      October: "\u5341\u6708",
      November: "\u5341\u4E00\u6708",
      December: "\u5341\u4E8C\u6708"
    }
  },
  week: {
    long: {
      self: "\u5468",
      monday: "\u5468\u4E00",
      tuesday: "\u5468\u4E8C",
      wednesday: "\u5468\u4E09",
      thursday: "\u5468\u56DB",
      friday: "\u5468\u4E94",
      saturday: "\u5468\u516D",
      sunday: "\u5468\u65E5"
    },
    short: {
      self: "\u5468",
      monday: "\u4E00",
      tuesday: "\u4E8C",
      wednesday: "\u4E09",
      thursday: "\u56DB",
      friday: "\u4E94",
      saturday: "\u516D",
      sunday: "\u65E5"
    }
  }
};
const lang = {
  locale: "zh-CN",
  empty: {
    description: "\u6682\u65E0\u6570\u636E"
  },
  drawer: {
    okText: "\u786E\u5B9A",
    cancelText: "\u53D6\u6D88"
  },
  popconfirm: {
    okText: "\u786E\u5B9A",
    cancelText: "\u53D6\u6D88"
  },
  modal: {
    okText: "\u786E\u5B9A",
    cancelText: "\u53D6\u6D88"
  },
  pagination: {
    goto: "\u524D\u5F80",
    page: "\u9875",
    countPerPage: "\u6761/\u9875",
    total: "\u5171 {0} \u6761"
  },
  table: {
    okText: "\u786E\u5B9A",
    resetText: "\u91CD\u7F6E"
  },
  upload: {
    start: "\u5F00\u59CB",
    cancel: "\u53D6\u6D88",
    delete: "\u5220\u9664",
    retry: "\u70B9\u51FB\u91CD\u8BD5",
    buttonText: "\u70B9\u51FB\u4E0A\u4F20",
    preview: "\u9884\u89C8",
    drag: "\u70B9\u51FB\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u4E0A\u4F20",
    dragHover: "\u91CA\u653E\u6587\u4EF6\u5E76\u5F00\u59CB\u4E0A\u4F20",
    error: "\u4E0A\u4F20\u5931\u8D25"
  },
  calendar: calendarLang,
  datePicker: {
    view: calendarLang.view,
    month: calendarLang.month,
    week: calendarLang.week,
    placeholder: {
      date: "\u8BF7\u9009\u62E9\u65E5\u671F",
      week: "\u8BF7\u9009\u62E9\u5468",
      month: "\u8BF7\u9009\u62E9\u6708\u4EFD",
      year: "\u8BF7\u9009\u62E9\u5E74\u4EFD",
      quarter: "\u8BF7\u9009\u62E9\u5B63\u5EA6",
      time: "\u8BF7\u9009\u62E9\u65F6\u95F4"
    },
    rangePlaceholder: {
      date: ["\u5F00\u59CB\u65E5\u671F", "\u7ED3\u675F\u65E5\u671F"],
      week: ["\u5F00\u59CB\u5468", "\u7ED3\u675F\u5468"],
      month: ["\u5F00\u59CB\u6708\u4EFD", "\u7ED3\u675F\u6708\u4EFD"],
      year: ["\u5F00\u59CB\u5E74\u4EFD", "\u7ED3\u675F\u5E74\u4EFD"],
      quarter: ["\u5F00\u59CB\u5B63\u5EA6", "\u7ED3\u675F\u5B63\u5EA6"],
      time: ["\u5F00\u59CB\u65F6\u95F4", "\u7ED3\u675F\u65F6\u95F4"]
    },
    selectTime: "\u9009\u62E9\u65F6\u95F4",
    today: "\u4ECA\u5929",
    now: "\u6B64\u523B",
    ok: "\u786E\u5B9A"
  },
  image: {
    loading: "\u52A0\u8F7D\u4E2D"
  },
  imagePreview: {
    fullScreen: "\u5168\u5C4F",
    rotateRight: "\u5411\u53F3\u65CB\u8F6C",
    rotateLeft: "\u5411\u5DE6\u65CB\u8F6C",
    zoomIn: "\u653E\u5927",
    zoomOut: "\u7F29\u5C0F",
    originalSize: "\u539F\u59CB\u5C3A\u5BF8"
  },
  typography: {
    copied: "\u5DF2\u590D\u5236",
    copy: "\u590D\u5236",
    expand: "\u5C55\u5F00",
    collapse: "\u6298\u53E0",
    edit: "\u7F16\u8F91"
  },
  form: {
    validateMessages: {
      required: "#{field} \u662F\u5FC5\u586B\u9879",
      type: {
        string: "#{field} \u4E0D\u662F\u5408\u6CD5\u7684\u6587\u672C\u7C7B\u578B",
        number: "#{field} \u4E0D\u662F\u5408\u6CD5\u7684\u6570\u5B57\u7C7B\u578B",
        boolean: "#{field} \u4E0D\u662F\u5408\u6CD5\u7684\u5E03\u5C14\u7C7B\u578B",
        array: "#{field} \u4E0D\u662F\u5408\u6CD5\u7684\u6570\u7EC4\u7C7B\u578B",
        object: "#{field} \u4E0D\u662F\u5408\u6CD5\u7684\u5BF9\u8C61\u7C7B\u578B",
        url: "#{field} \u4E0D\u662F\u5408\u6CD5\u7684 url \u5730\u5740",
        email: "#{field} \u4E0D\u662F\u5408\u6CD5\u7684\u90AE\u7BB1\u5730\u5740",
        ip: "#{field} \u4E0D\u662F\u5408\u6CD5\u7684 IP \u5730\u5740"
      },
      number: {
        min: "`#{value}` \u5C0F\u4E8E\u6700\u5C0F\u503C `#{min}`",
        max: "`#{value}` \u5927\u4E8E\u6700\u5927\u503C `#{max}`",
        equal: "`#{value}` \u4E0D\u7B49\u4E8E `#{equal}`",
        range: "`#{value}` \u4E0D\u5728 `#{min} ~ #{max}` \u8303\u56F4\u5185",
        positive: "`#{value}` \u4E0D\u662F\u6B63\u6570",
        negative: "`#{value}` \u4E0D\u662F\u8D1F\u6570"
      },
      array: {
        length: "`#{field}` \u4E2A\u6570\u4E0D\u7B49\u4E8E #{length}",
        minLength: "`#{field}` \u4E2A\u6570\u6700\u5C11\u4E3A #{minLength}",
        maxLength: "`#{field}` \u4E2A\u6570\u6700\u591A\u4E3A #{maxLength}",
        includes: "#{field} \u4E0D\u5305\u542B #{includes}",
        deepEqual: "#{field} \u4E0D\u7B49\u4E8E #{deepEqual}",
        empty: "`#{field}` \u4E0D\u662F\u7A7A\u6570\u7EC4"
      },
      string: {
        minLength: "\u5B57\u7B26\u6570\u6700\u5C11\u4E3A #{minLength}",
        maxLength: "\u5B57\u7B26\u6570\u6700\u591A\u4E3A #{maxLength}",
        length: "\u5B57\u7B26\u6570\u5FC5\u987B\u662F #{length}",
        match: "`#{value}` \u4E0D\u7B26\u5408\u6A21\u5F0F #{pattern}",
        uppercase: "`#{value}` \u5FC5\u987B\u5168\u5927\u5199",
        lowercase: "`#{value}` \u5FC5\u987B\u5168\u5C0F\u5199"
      },
      object: {
        deepEqual: "`#{field}` \u4E0D\u7B49\u4E8E\u671F\u671B\u503C",
        hasKeys: "`#{field}` \u4E0D\u5305\u542B\u5FC5\u987B\u5B57\u6BB5",
        empty: "`#{field}` \u4E0D\u662F\u5BF9\u8C61"
      },
      boolean: {
        true: "\u671F\u671B\u662F `true`",
        false: "\u671F\u671B\u662F `false`"
      }
    }
  },
  colorPicker: {
    history: "\u6700\u8FD1\u4F7F\u7528\u989C\u8272",
    preset: "\u7CFB\u7EDF\u9884\u8BBE\u989C\u8272",
    empty: "\u6682\u65E0"
  }
};
module.exports = lang;
