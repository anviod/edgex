"use strict";
const calendarLang = {
  formatYear: "YYYY",
  formatMonth: "MM/YYYY",
  today: "Aujourd'hui",
  view: {
    month: "Mois",
    year: "Ann\xE9e",
    week: "Semaine",
    day: "Date"
  },
  month: {
    long: {
      January: "Janvier",
      February: "F\xE9vrier",
      March: "Mars",
      April: "Avril",
      May: "Mai",
      June: "Juin",
      July: "Juillet",
      August: "Ao\xFBt",
      September: "Septembre",
      October: "Octobre",
      November: "Novembre",
      December: "D\xE9cembre"
    },
    short: {
      January: "Jan",
      February: "F\xE9v",
      March: "Mar",
      April: "Avr",
      May: "Mai",
      June: "Jun",
      July: "Jul",
      August: "Ao\xFB",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "D\xE9c"
    }
  },
  week: {
    long: {
      self: "Week",
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche"
    },
    short: {
      self: "Week",
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mer",
      thursday: "Jeu",
      friday: "Ven",
      saturday: "Sam",
      sunday: "Dim"
    }
  }
};
const lang = {
  locale: "fr-FR",
  empty: {
    description: "Aucune donn\xE9e"
  },
  drawer: {
    okText: "OK",
    cancelText: "Annuler"
  },
  popconfirm: {
    okText: "OK",
    cancelText: "Annuler"
  },
  modal: {
    okText: "OK",
    cancelText: "Annuler"
  },
  pagination: {
    goto: "Aller \xE0",
    page: "Page",
    countPerPage: "/ page",
    total: "Total {0}"
  },
  table: {
    okText: "OK",
    resetText: "R\xE9initialiser"
  },
  upload: {
    start: "D\xE9marrer",
    cancel: "Annuler",
    delete: "Supprimer",
    retry: "Cliquez pour r\xE9essayer",
    buttonText: "Cliquez pour t\xE9l\xE9charger",
    preview: "Aper\xE7u",
    drag: "Cliquez ou faites glisser les fichiers \xE0 t\xE9l\xE9charger ici",
    dragHover: "Lib\xE9rez le fichier et commencez \xE0 t\xE9l\xE9charger",
    error: "le t\xE9l\xE9chargement a \xE9chou\xE9"
  },
  calendar: calendarLang,
  datePicker: {
    view: calendarLang.view,
    month: calendarLang.month,
    week: calendarLang.week,
    placeholder: {
      date: "S\xE9lectionner une date",
      week: "S\xE9lectionner une semaine",
      month: "S\xE9lectionner un mois",
      year: "S\xE9lectionner une ann\xE9e",
      quarter: "S\xE9lectionner un trimestre",
      time: "S\xE9lectionner l'heure"
    },
    rangePlaceholder: {
      date: ["Date de d\xE9but", "Date de fin"],
      week: ["Semaine de d\xE9but", "Semaine de fin"],
      month: ["Mois de d\xE9but", "Mois de fin"],
      year: ["Ann\xE9e de d\xE9but", "Ann\xE9e de fin"],
      quarter: ["Trimestre de d\xE9but", "Trimestre de fin"],
      time: ["Heure de d\xE9but", "Heure de fin"]
    },
    selectTime: "S\xE9lectionner l'heure",
    today: "Aujourd'hui",
    now: "Maintenant",
    ok: "OK"
  },
  image: {
    loading: "Chargement en cours"
  },
  imagePreview: {
    fullScreen: "Plein \xE9cran",
    rotateRight: "Tourner \xE0 droite",
    rotateLeft: "Tourner vers la gauche",
    zoomIn: "Agrandir",
    zoomOut: "D\xE9zoomer",
    originalSize: "Format original"
  },
  typography: {
    copy: "Copier",
    copied: "Copie effectu\xE9e",
    edit: "\xC9diter",
    collapse: "Plier",
    expand: "\xC9tendre"
  },
  colorPicker: {
    history: "Couleurs historiques",
    preset: "Couleurs pr\xE9d\xE9finies par le syst\xE8me",
    empty: "Aucune donn\xE9e"
  }
};
module.exports = lang;
