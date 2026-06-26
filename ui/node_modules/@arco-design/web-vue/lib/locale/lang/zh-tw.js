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
  locale: "zh-TW",
  empty: {
    description: "\u7121\u8CC7\u6599"
  },
  drawer: {
    okText: "\u78BA\u8A8D",
    cancelText: "\u53D6\u6D88"
  },
  popconfirm: {
    okText: "\u78BA\u8A8D",
    cancelText: "\u53D6\u6D88"
  },
  modal: {
    okText: "\u78BA\u8A8D",
    cancelText: "\u53D6\u6D88"
  },
  pagination: {
    goto: "\u524D\u5F80",
    page: "\u9801",
    countPerPage: "\u9805/\u9801",
    total: "\u5171 {0} \u9805"
  },
  table: {
    okText: "\u78BA\u8A8D",
    resetText: "\u91CD\u7F6E"
  },
  upload: {
    start: "\u958B\u59CB",
    cancel: "\u53D6\u6D88",
    delete: "\u5220\u9664",
    retry: "\u9EDE\u64CA\u91CD\u8A66",
    buttonText: "\u9EDE\u64CA\u4E0A\u50B3",
    preview: "\u9810\u89BD",
    drag: "\u9EDE\u64CA\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u8655\u4E0A\u50B3",
    dragHover: "\u91CB\u653E\u6587\u4EF6\u4E26\u958B\u59CB\u4E0A\u50B3",
    error: "\u4E0A\u50B3\u5931\u6557"
  },
  calendar: calendarLang,
  datePicker: {
    view: calendarLang.view,
    month: calendarLang.month,
    week: calendarLang.week,
    placeholder: {
      date: "\u8ACB\u9078\u64C7\u65E5\u671F",
      week: "\u8ACB\u9078\u64C7\u5468",
      month: "\u8ACB\u9078\u64C7\u6708\u4EFD",
      year: "\u8ACB\u9078\u64C7\u5E74\u4EFD",
      quarter: "\u8ACB\u9078\u64C7\u5B63\u5EA6",
      time: "\u8ACB\u9078\u64C7\u6642\u9593"
    },
    rangePlaceholder: {
      date: ["\u958B\u59CB\u65E5\u671F", "\u7D50\u675F\u65E5\u671F"],
      week: ["\u958B\u59CB\u5468", "\u7D50\u675F\u5468"],
      month: ["\u958B\u59CB\u6708\u4EFD", "\u7D50\u675F\u6708\u4EFD"],
      year: ["\u958B\u59CB\u5E74\u4EFD", "\u7D50\u675F\u5E74\u4EFD"],
      quarter: ["\u958B\u59CB\u5B63\u5EA6", "\u7D50\u675F\u5B63\u5EA6"],
      time: ["\u958B\u59CB\u6642\u9593", "\u7D50\u675F\u6642\u9593"]
    },
    selectTime: "\u9078\u64C7\u6642\u9593",
    today: "\u4ECA\u5929",
    now: "\u6B64\u523B",
    ok: "\u78BA\u8A8D"
  },
  image: {
    loading: "\u8F09\u5165\u4E2D"
  },
  imagePreview: {
    fullScreen: "\u5168\u5C4F",
    rotateRight: "\u5411\u53F3\u65CB\u8F49",
    rotateLeft: "\u5411\u5DE6\u65CB\u8F49",
    zoomIn: "\u653E\u5927",
    zoomOut: "\u7E2E\u5C0F",
    originalSize: "\u539F\u59CB\u5C3A\u5BF8"
  },
  typography: {
    copied: "\u5DF2\u8907\u88FD",
    copy: "\u8907\u88FD",
    expand: "\u5C55\u958B",
    collapse: "\u6298\u758A",
    edit: "\u7DE8\u8F2F"
  },
  form: {
    validateMessages: {
      required: "#{field} \u662F\u5FC5\u586B\u9805",
      type: {
        string: "#{value} \u4E0D\u662F\u5408\u6CD5\u7684\u6587\u672C\u985E\u578B",
        number: "#{value} \u4E0D\u662F\u5408\u6CD5\u7684\u6578\u5B57\u985E\u578B",
        boolean: "#{value} \u4E0D\u662F\u5408\u6CD5\u7684\u5E03\u723E\u985E\u578B",
        array: "#{value} \u4E0D\u662F\u5408\u6CD5\u7684\u6578\u7D44\u985E\u578B",
        object: "#{value} \u4E0D\u662F\u5408\u6CD5\u7684\u5C0D\u50CF\u985E\u578B",
        url: "#{value} \u4E0D\u662F\u5408\u6CD5\u7684 url \u5730\u5740",
        email: "#{value} \u4E0D\u662F\u5408\u6CD5\u7684\u90F5\u7BB1\u5730\u5740",
        ip: "#{value} \u4E0D\u662F\u5408\u6CD5\u7684 IP \u5730\u5740"
      },
      number: {
        min: "`#{value}` \u5C0F\u65BC\u6700\u5C0F\u503C `#{min}`",
        max: "`#{value}` \u5927\u65BC\u6700\u5927\u503C `#{max}`",
        equal: "`#{value}` \u4E0D\u7B49\u65BC `#{equal}`",
        range: "`#{value}` \u4E0D\u5728 `#{min} ~ #{max}` \u7BC4\u570D\u5167",
        positive: "`#{value}` \u4E0D\u662F\u6B63\u6578",
        negative: "`#{value}` \u4E0D\u662F\u8CA0\u6578"
      },
      array: {
        length: "`#{value}` \u500B\u6578\u4E0D\u7B49\u65BC #{length}",
        minLength: "`#{value}` \u500B\u6578\u6700\u5C11\u70BA #{minLength}",
        maxLength: "`#{value}` \u500B\u6578\u6700\u591A\u70BA #{maxLength}",
        includes: "#{value} \u4E0D\u5305\u542B #{includes}",
        deepEqual: "#{value} \u4E0D\u7B49\u65BC #{deepEqual}",
        empty: "`#{value}` \u4E0D\u662F\u7A7A\u6578\u7D44"
      },
      string: {
        minLength: "\u5B57\u7B26\u6578\u6700\u5C11\u70BA #{minLength}",
        maxLength: "\u5B57\u7B26\u6578\u6700\u591A\u70BA #{maxLength}",
        length: "`#{value}` \u5B57\u7B26\u6578\u4E0D\u7B49\u65BC #{length}",
        match: "`#{value}` \u4E0D\u7B26\u5408\u6A21\u5F0F #{pattern}",
        uppercase: "`#{value}` \u4E0D\u662F\u5168\u5927\u5BEB",
        lowercase: "`#{value}` \u4E0D\u662F\u5168\u5C0F\u5BEB"
      },
      object: {
        deepEqual: "`#{value}` \u4E0D\u7B49\u65BC #{deepEqual}",
        hasKeys: "`#{value}` \u4E0D\u5305\u542B\u5B57\u6BB5 #{keys}",
        empty: "`#{value}` \u4E0D\u662F\u5C0D\u8C61"
      },
      boolean: {
        true: "\u671F\u671B\u662F `true`",
        false: "\u671F\u671B\u662F `false`"
      }
    }
  },
  colorPicker: {
    history: "\u6700\u8FD1\u4F7F\u7528\u984F\u8272",
    preset: "\u7CFB\u7D71\u9810\u8A2D\u984F\u8272",
    empty: "\u66AB\u7121"
  }
};
module.exports = lang;
