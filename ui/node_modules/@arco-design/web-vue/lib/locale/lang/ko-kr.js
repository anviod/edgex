"use strict";
const calendarLang = {
  formatYear: "YYYY",
  formatMonth: "MMM YYYY",
  today: "\uC694\uC998",
  view: {
    month: "\uB2EC",
    year: "\uB144",
    week: "\uC8FC",
    day: "\uC77C"
  },
  month: {
    long: {
      January: "\uC77C\uC6D4",
      February: "\uC774\uC6D4",
      March: "\uD589\uC9C4",
      April: "\uC0AC\uC6D4",
      May: "\uC624\uC6D4",
      June: "\uC720\uC6D4",
      July: "\uCE60\uC6D4",
      August: "\uD314\uC6D4",
      September: "\uAD6C\uC6D4",
      October: "\uC2DC\uC6D4",
      November: "\uC2ED\uC77C\uC6D4",
      December: "\uC2ED\uC774\uC6D4"
    },
    short: {
      January: "\uC77C\uC6D4",
      February: "\uC774\uC6D4",
      March: "\uD589\uC9C4",
      April: "\uC0AC\uC6D4",
      May: "\uC624\uC6D4",
      June: "\uC720\uC6D4",
      July: "\uCE60\uC6D4",
      August: "\uD314\uC6D4",
      September: "\uAD6C\uC6D4",
      October: "\uC2DC\uC6D4",
      November: "\uC2ED\uC77C\uC6D4",
      December: "\uC2ED\uC774\uC6D4"
    }
  },
  week: {
    long: {
      self: "\uC8FC",
      monday: "\uC6D4\uC694\uC77C",
      tuesday: "\uD654\uC694\uC77C",
      wednesday: "\uC218\uC694\uC77C",
      thursday: "\uBAA9\uC694\uC77C",
      friday: "\uAE08\uC694\uC77C",
      saturday: "\uD1A0\uC694\uC77C",
      sunday: "\uC77C\uC694\uC77C"
    },
    short: {
      self: "\uC8FC",
      monday: "\uC6D4",
      tuesday: "\uD654",
      wednesday: "\uC218",
      thursday: "\uBAA9",
      friday: "\uAE08",
      saturday: "\uD1A0",
      sunday: "\uC77C"
    }
  }
};
const lang = {
  locale: "ko-KR",
  empty: {
    description: "\uB370\uC774\uD130 \uC5C6\uC74C"
  },
  drawer: {
    okText: "\uACB0\uC815",
    cancelText: "\uCDE8\uC18C"
  },
  popconfirm: {
    okText: "\uACB0\uC815",
    cancelText: "\uCDE8\uC18C"
  },
  modal: {
    okText: "\uACB0\uC815",
    cancelText: "\uCDE8\uC18C"
  },
  pagination: {
    goto: "\uC774\uB3D9",
    page: "\uD398\uC774\uC9C0",
    countPerPage: "\uAE30\uC785 / \uD398\uC774\uC9C0",
    total: "\uCD1D {0}"
  },
  table: {
    okText: "\uACB0\uC815",
    resetText: "\uCD08\uAE30\uD654"
  },
  upload: {
    start: "\uC2A4\uD0C0\uD2B8",
    cancel: "\uCDE8\uC18C",
    delete: "\uC9C0\uC6B0\uB2E4",
    retry: "\uB2E4\uC2DC \uC2DC\uB3C4\uB97C \uD074\uB9AD",
    buttonText: "\uD074\uB9AD \uC5C5\uB85C\uB4DC",
    preview: "\uC2DC\uC0AC",
    drag: "\uC5EC\uAE30\uC5D0\uC11C \uC5C5\uB85C\uB4DC \uD560 \uD30C\uC77C\uC744 \uD074\uB9AD\uD558\uAC70\uB098 \uB4DC\uB798\uADF8\uD558\uC138\uC694",
    dragHover: "\uD30C\uC77C\uC744 \uD574\uC81C\uD558\uACE0 \uC5C5\uB85C\uB4DC \uC2DC\uC791",
    error: "\uC5C5\uB85C\uB4DC \uC2E4\uD328"
  },
  calendar: calendarLang,
  datePicker: {
    view: calendarLang.view,
    month: calendarLang.month,
    week: calendarLang.week,
    placeholder: {
      date: "\uB0A0\uC9DC\uB97C \uC120\uD0DD\uD558\uC138\uC694",
      week: "\uC8FC\uB97C \uC120\uD0DD\uD558\uC138\uC694",
      month: "\uB2EC\uC744 \uC120\uD0DD\uD558\uC138\uC694",
      year: "\uC5F0\uB3C4\uB97C \uC120\uD0DD\uD558\uC138\uC694",
      quarter: "\uBD84\uAE30\uB97C \uC120\uD0DD\uD558\uC138\uC694",
      time: "\uC120\uD0DD \uAE30\uAC04"
    },
    rangePlaceholder: {
      date: ["\uC2DC\uC791\uC77C", "\uC885\uB8CC\uC77C"],
      week: ["\uC8FC \uC2DC\uC791", "\uC8FC \uC885\uB8CC"],
      month: ["\uC2DC\uC791 \uC6D4", "\uC885\uB8CC \uC6D4"],
      year: ["\uC2DC\uC791 \uB144\uB3C4", "\uC5F0\uB9D0"],
      quarter: ["\uBD84\uAE30 \uC2DC\uC791", "\uBD84\uAE30 \uC885\uB8CC"],
      time: ["\uC2DC\uC791 \uC2DC\uAC04", "\uC885\uB8CC \uC2DC\uAC04"]
    },
    selectTime: "\uC120\uD0DD \uAE30\uAC04",
    today: "\uC694\uC998",
    now: "\uC9C0\uAE08",
    ok: "\uACB0\uC815"
  },
  image: {
    loading: "\uB85C\uB529"
  },
  imagePreview: {
    fullScreen: "\uC804\uCCB4 \uD654\uBA74",
    rotateRight: "\uC624\uB978\uCABD\uC73C\uB85C \uD68C\uC804",
    rotateLeft: "\uC67C\uCABD\uC73C\uB85C \uD68C\uC804",
    zoomIn: "\uD655\uB300",
    zoomOut: "\uCD95\uC18C",
    originalSize: "\uC6D0\uB798 \uD06C\uAE30"
  },
  typography: {
    copy: "\uBCF5\uC0AC",
    copied: "\uBCF5\uC0AC \uB428",
    edit: "\uD3B8\uC9D1\uD558\uB2E4",
    collapse: "\uACB9",
    expand: "\uC804\uAC1C \uD558 \uB2E4"
  },
  colorPicker: {
    history: "\uCD5C\uADFC \uC0C9\uC0C1 \uC0AC\uC6A9",
    preset: "\uC2DC\uC2A4\uD15C \uAE30\uBCF8 \uC0C9\uC0C1",
    empty: "\uB370\uC774\uD130 \uC5C6\uC74C"
  }
};
module.exports = lang;
