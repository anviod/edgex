const calendarLang = {
  formatYear: "YYYY \u5E74",
  formatMonth: "YYYY \u5E74 MM \u6708",
  today: "\u4ECA\u65E5",
  view: {
    month: "\u6708",
    year: "\u5E74",
    week: "\u9031",
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
      self: "\u9031",
      monday: "\u6708\u66DC\u65E5",
      tuesday: "\u706B\u66DC\u65E5",
      wednesday: "\u6C34\u66DC\u65E5",
      thursday: "\u6728\u66DC\u65E5",
      friday: "\u91D1\u66DC\u65E5",
      saturday: "\u571F\u66DC\u65E5",
      sunday: "\u65E5\u66DC\u65E5"
    },
    short: {
      self: "\u9031",
      monday: "\u6708",
      tuesday: "\u706B",
      wednesday: "\u6C34",
      thursday: "\u6728",
      friday: "\u91D1",
      saturday: "\u571F",
      sunday: "\u65E5"
    }
  }
};
const lang = {
  locale: "ja-JP",
  empty: {
    description: "\u30C7\u30FC\u30BF\u306A\u3057"
  },
  drawer: {
    okText: "OK",
    cancelText: "\u30AD\u30E3\u30F3\u30BB\u30EB"
  },
  popconfirm: {
    okText: "OK",
    cancelText: "\u30AD\u30E3\u30F3\u30BB\u30EB"
  },
  modal: {
    okText: "OK",
    cancelText: "\u30AD\u30E3\u30F3\u30BB\u30EB"
  },
  pagination: {
    goto: "\u79FB\u52D5",
    page: "\u30DA\u30FC\u30B8",
    countPerPage: "\u4EF6/\u30DA\u30FC\u30B8",
    total: "\u7DCF\u8A08 {0} \u4EF6"
  },
  table: {
    okText: "OK",
    resetText: "\u30EA\u30BB\u30C3\u30C8"
  },
  upload: {
    start: "\u30B9\u30BF\u30FC\u30C8",
    cancel: "\u30AD\u30E3\u30F3\u30BB\u30EB",
    delete: "\u524A\u9664",
    retry: "\u30EA\u30C8\u30E9\u30A4",
    buttonText: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",
    preview: "\u30D7\u30EC\u30D3\u30E5\u30FC",
    drag: "\u30AF\u30EA\u30C3\u30AF\u307E\u305F\u306F\u30C9\u30E9\u30C3\u30B0\u3057\u3066\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u307E\u3059\u3002",
    dragHover: "\u30C9\u30ED\u30C3\u30D7\u3057\u3066\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3092\u59CB\u3081\u307E\u3059",
    error: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5931\u6557\u3057\u307E\u3057\u305F"
  },
  calendar: calendarLang,
  datePicker: {
    view: calendarLang.view,
    month: calendarLang.month,
    week: calendarLang.week,
    placeholder: {
      date: "\u65E5\u4ED8\u3092\u9078\u629E",
      week: "\u9031\u3092\u9078\u629E",
      month: "\u6708\u3092\u9078\u629E",
      year: "\u5E74\u3092\u9078\u629E",
      quarter: "\u56DB\u534A\u671F\u3092\u9078\u629E",
      time: "\u6642\u9593\u3092\u9078\u629E"
    },
    rangePlaceholder: {
      date: ["\u958B\u59CB\u65E5", "\u7D42\u4E86\u65E5"],
      week: ["\u958B\u59CB\u9031", "\u7D42\u4E86\u9031"],
      month: ["\u958B\u59CB\u6708", "\u7D42\u4E86\u6708"],
      year: ["\u958B\u59CB\u5E74", "\u7D42\u4E86\u5E74"],
      quarter: ["\u958B\u59CB\u56DB\u534A\u671F", "\u7D42\u4E86\u56DB\u534A\u671F"],
      time: ["\u958B\u59CB\u6642\u9593", "\u7D42\u4E86\u6642\u9593"]
    },
    selectTime: "\u6642\u9593\u3092\u9078\u629E",
    today: "\u4ECA\u65E5",
    now: "\u4ECA",
    ok: "OK"
  },
  image: {
    loading: "Loading"
  },
  imagePreview: {
    fullScreen: "\u30D5\u30EB\u30B9\u30AF\u30EA\u30FC\u30F3",
    rotateRight: "\u53F3\u56DE\u308A",
    rotateLeft: "\u5DE6\u56DE\u308A",
    zoomIn: "\u62E1\u5927",
    zoomOut: "\u7E2E\u5C0F",
    originalSize: "\u30C7\u30D5\u30A9\u30EB\u30C8"
  },
  typography: {
    copied: "\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",
    copy: "\u30B3\u30D4\u30FC",
    expand: "\u5C55\u958B",
    collapse: "\u6298\u308B",
    edit: "\u7DE8\u96C6"
  },
  form: {
    validateMessages: {
      required: "#{field} \u304C\u5FC5\u8981\u3067\u3059",
      type: {
        string: "\u306F\u6709\u52B9\u306A\u30C6\u30AD\u30B9\u30C8\u30BF\u30A4\u30D7\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        number: "\u306F\u6709\u52B9\u306A\u6570\u5024\u30BF\u30A4\u30D7\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        boolean: "\u306F\u6709\u52B9\u306A\u30D6\u30FC\u30EB\u578B\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        array: "\u306F\u6709\u52B9\u306A\u914D\u5217\u578B\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        object: "\u306F\u6709\u52B9\u306A\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u30BF\u30A4\u30D7\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        url: "\u306F\u6709\u52B9\u306AURL\u30A2\u30C9\u30EC\u30B9\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        email: "\u306F\u6709\u52B9\u306A\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        ip: "\u306F\u6709\u52B9\u306AIP\u30A2\u30C9\u30EC\u30B9\u3067\u306F\u3042\u308A\u307E\u305B\u3093"
      },
      number: {
        min: "`#{value}` \u306F\u6700\u5C0F\u5024 `#{min}` \u672A\u6E80\u3067\u3059",
        max: "`#{value}` \u306F\u6700\u5927\u5024 `#{max}` \u3088\u308A\u5927\u304D\u3044",
        equal: "`#{value}` \u306F `#{equal}` \u3068\u7B49\u3057\u304F\u3042\u308A\u307E\u305B\u3093",
        range: "`#{value}` \u306F\u7BC4\u56F2 `#{min} ~ #{max}` \u306B\u3042\u308A\u307E\u305B\u3093",
        positive: "`#{value}` \u306F\u6B63\u306E\u6570\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        negative: "`#{value}` \u306F\u8CA0\u306E\u6570\u3067\u306F\u3042\u308A\u307E\u305B\u3093"
      },
      array: {
        length: "`#{value}` \u306F #{length} \u3068\u7B49\u3057\u304F\u3042\u308A\u307E\u305B\u3093",
        minLength: "`#{value}` \u306F\u5C11\u306A\u304F\u3068\u3082 #{minLength}",
        maxLength: "`#{value}`\u306F\u6700\u5927 #{maxLength}",
        includes: "#{value} \u306B\u306F #{includes} \u306F\u542B\u307E\u308C\u307E\u305B\u3093",
        deepEqual: "#{value} \u306F #{deepEqual} \u3068\u7B49\u3057\u304F\u3042\u308A\u307E\u305B\u3093",
        empty: "`#{value}` \u306F\u7A7A\u306E\u914D\u5217\u3067\u306F\u3042\u308A\u307E\u305B\u3093"
      },
      string: {
        minLength: "\u6700\u5C0F\u6587\u5B57\u6570\u306F #{minLength}",
        maxLength: "\u6700\u5927\u6587\u5B57\u6570\u306F #{maxLength}",
        length: "`#{value}` \u6587\u5B57\u6570\u304C #{length} \u3068\u7B49\u3057\u304F\u3042\u308A\u307E\u305B\u3093",
        match: "`#{value}` \u306F\u30D1\u30BF\u30FC\u30F3 #{pattern} \u3068\u4E00\u81F4\u3057\u307E\u305B\u3093",
        uppercase: "`#{value}` \u306F\u3059\u3079\u3066\u5927\u6587\u5B57\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
        lowercase: "`#{value}` \u306F\u3059\u3079\u3066\u5C0F\u6587\u5B57\u3067\u306F\u3042\u308A\u307E\u305B\u3093"
      },
      object: {
        deepEqual: "`#{value}`\u306F#{deepEqual}\u3068\u7B49\u3057\u304F\u3042\u308A\u307E\u305B\u3093",
        hasKeys: "`#{value}` \u306B\u306F\u30D5\u30A3\u30FC\u30EB\u30C9 #{keys} \u304C\u542B\u307E\u308C\u3066\u3044\u307E\u305B\u3093",
        empty: "`#{value}`\u306F\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u3067\u306F\u3042\u308A\u307E\u305B\u3093"
      },
      boolean: {
        true: "`true` \u3067\u3042\u308B\u3068\u671F\u5F85\u3057\u307E\u3059",
        false: "`false` \u3067\u3042\u308B\u3068\u671F\u5F85\u3057\u307E\u3059"
      }
    }
  },
  colorPicker: {
    history: "\u6700\u8FD1\u4F7F\u7528\u3057\u305F\u8272",
    preset: "\u30B7\u30B9\u30C6\u30E0\u306E\u30C7\u30D5\u30A9\u30EB\u30C8\u306E\u8272",
    empty: "\u7A7A\u306E"
  }
};
export { lang as default };
