const calendarLang = {
  formatYear: "YYYY",
  formatMonth: "MMMM YYYY",
  today: "H\xF4m nay",
  view: {
    month: "Th\xE1ng",
    year: "N\u0103m",
    week: "Tu\u1EA7n",
    day: "Ng\xE0y"
  },
  month: {
    long: {
      January: "Th\xE1ng M\u1ED9t",
      February: "Th\xE1ng Hai",
      March: "Th\xE1ng Ba",
      April: "Th\xE1ng T\u01B0",
      May: "Th\xE1ng N\u0103m",
      June: "Th\xE1ng S\xE1u",
      July: "Th\xE1ng B\u1EA3y",
      August: "Th\xE1ng T\xE1m",
      September: "Th\xE1ng Ch\xEDn",
      October: "Th\xE1ng M\u01B0\u1EDDi",
      November: "Th\xE1ng M\u01B0\u1EDDi M\u1ED9t",
      December: "Th\xE1ng M\u01B0\u1EDDi Hai"
    },
    short: {
      January: "Thg1",
      February: "Thg2",
      March: "Thg3",
      April: "Thg4",
      May: "Thg5",
      June: "Thg6",
      July: "Thg7",
      August: "Thg8",
      September: "Thg9",
      October: "Thg10",
      November: "Thg11",
      December: "Thg12"
    }
  },
  week: {
    long: {
      self: "Tu\u1EA7n",
      monday: "Th\u01B0\u0301 Hai",
      tuesday: "Th\u01B0\u0301 Ba",
      wednesday: "Th\u01B0\u0301 T\u01B0",
      thursday: "Th\u01B0\u0301 N\u0103m",
      friday: "Th\u01B0\u0301 Sa\u0301u",
      saturday: "Th\u01B0\u0301 Ba\u0309y",
      sunday: "Chu\u0309 Nh\xE2\u0323t"
    },
    short: {
      self: "Tu\u1EA7n",
      monday: "T2",
      tuesday: "T3",
      wednesday: "T\u01B0",
      thursday: "N\u0103m",
      friday: "Sa\u0301u",
      saturday: "Ba\u0309y",
      sunday: "CN"
    }
  }
};
const lang = {
  locale: "vi-VN",
  empty: {
    description: "Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u"
  },
  drawer: {
    okText: "\u0110\u1ED3ng \xFD",
    cancelText: "H\u1EE7y b\u1ECF"
  },
  popconfirm: {
    okText: "\u0110\u1ED3ng \xFD",
    cancelText: "H\u1EE7y b\u1ECF"
  },
  modal: {
    okText: "\u0110\u1ED3ng \xFD",
    cancelText: "H\u1EE7y b\u1ECF"
  },
  pagination: {
    goto: "\u0110i t\u1EDBi",
    page: "Trang",
    countPerPage: "s\u1EA3n ph\u1EA9m/trang",
    total: "T\u1ED5ng s\u1ED1 {0}"
  },
  table: {
    okText: "\u0110\u1ED3ng \xFD",
    resetText: "Thi\u1EBFt l\u1EADp l\u1EA1i"
  },
  upload: {
    start: "B\u1EAFt \u0111\u1EA7u",
    cancel: "H\u1EE7y b\u1ECF",
    delete: "X\xF3a b\u1ECF",
    retry: "Nh\u1EA5p \u0111\u1EC3 th\u1EED l\u1EA1i",
    buttonText: "Nh\u1EA5p \u0111\u1EC3 t\u1EA3i l\xEAn",
    preview: "Xem tr\u01B0\u1EDBc",
    drag: "Nh\u1EA5p ho\u1EB7c k\xE9o th\u1EA3 t\u1EADp tin v\xE0o \u0111\xE2y \u0111\u1EC3 t\u1EA3i l\xEAn",
    dragHover: "Th\u1EA3 t\u1EADp tin v\xE0 b\u1EAFt \u0111\u1EA7u t\u1EA3i l\xEAn",
    error: "L\u1ED7i t\u1EA3i l\xEAn"
  },
  calendar: calendarLang,
  datePicker: {
    view: calendarLang.view,
    month: calendarLang.month,
    week: calendarLang.week,
    placeholder: {
      date: "Vui l\xF2ng ch\u1ECDn m\u1ED9t ng\xE0y",
      week: "Vui l\xF2ng ch\u1ECDn m\u1ED9t tu\u1EA7n",
      month: "Vui l\xF2ng ch\u1ECDn m\u1ED9t th\xE1ng",
      year: "Vui l\xF2ng ch\u1ECDn m\u1ED9t n\u0103m",
      quarter: "Vui l\xF2ng ch\u1ECDn m\u1ED9t ph\u1EA7n t\u01B0",
      time: "Vui l\xF2ng ch\u1ECDn m\u1ED9t"
    },
    rangePlaceholder: {
      date: ["Ng\xE0y b\u1EAFt \u0111\u1EA7u", "Ng\xE0y k\u1EBFt th\xFAc"],
      week: ["Tu\u1EA7n b\u1EAFt \u0111\u1EA7u", "Tu\u1EA7n k\u1EBFt th\xFAc"],
      month: ["Th\xE1ng b\u1EAFt \u0111\u1EA7u", "Th\xE1ng k\u1EBFt th\xFAc"],
      year: ["N\u0103m b\u1EAFt \u0111\u1EA7u", "N\u0103m k\u1EBFt th\xFAc"],
      quarter: ["Qu\xFD b\u1EAFt \u0111\u1EA7u", "Qu\xFD k\u1EBFt th\xFAc"],
      time: ["Gi\u1EDD b\u1EAFt \u0111\u1EA7u", "Gi\u1EDD k\u1EBFt th\xFAc"]
    },
    selectTime: "Vui l\xF2ng ch\u1ECDn th\u1EDDi gian",
    today: "H\xF4m nay",
    now: "B\xE2y gi\u1EDD",
    ok: "\u0110\u1ED3ng \xFD"
  },
  image: {
    loading: "\u0110ang t\u1EA3i"
  },
  imagePreview: {
    fullScreen: "To\xE0n m\xE0n h\xECnh",
    rotateRight: "Xoay sang ph\u1EA3i",
    rotateLeft: "Xoay sang tr\xE1i",
    zoomIn: "Ph\xF3ng to",
    zoomOut: "Thu nh\u1ECF",
    originalSize: "K\xEDch th\u01B0\u1EDBc g\u1ED1c"
  },
  typography: {
    copied: "\u0110\xE3 sao ch\xE9p",
    copy: "Sao ch\xE9p",
    expand: "M\u1EDF r\u1ED9ng",
    collapse: "Thu g\u1ECDn",
    edit: "Ch\u1EC9nh s\u1EEDa"
  },
  colorPicker: {
    history: "M\xE0u s\u1EAFc \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng g\u1EA7n \u0111\xE2y",
    preset: "M\xE0u m\u1EB7c \u0111\u1ECBnh c\u1EE7a h\u1EC7 th\u1ED1ng",
    empty: "Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u"
  }
};
export { lang as default };
