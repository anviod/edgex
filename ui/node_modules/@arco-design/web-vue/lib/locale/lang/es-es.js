"use strict";
const calendarLang = {
  formatYear: "YYYY",
  formatMonth: "M/YYYY",
  today: "Hoy",
  view: {
    month: "Mes",
    year: "A\xF1o",
    week: "Semana",
    day: "Fecha"
  },
  month: {
    long: {
      January: "Enero",
      February: "Febrero",
      March: "Marzo",
      April: "Abril",
      May: "Mayo",
      June: "Junio",
      July: "Julio",
      August: "Agosto",
      September: "Septiembre",
      October: "Octubre",
      November: "Noviembre",
      December: "Diciembre"
    },
    short: {
      January: "Ene",
      February: "Feb",
      March: "Mar",
      April: "Abr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Ago",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dic"
    }
  },
  week: {
    long: {
      self: "Semana",
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Mi\xE9rcoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "S\xE1bado",
      sunday: "Domingo"
    },
    short: {
      self: "Semana",
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mi\xE9",
      thursday: "Jue",
      friday: "Vie",
      saturday: "S\xE1b",
      sunday: "Dom"
    }
  }
};
const lang = {
  locale: "es-ES",
  empty: {
    description: "No hay datos"
  },
  drawer: {
    okText: "Aceptar",
    cancelText: "Cancelar"
  },
  popconfirm: {
    okText: "Aceptar",
    cancelText: "Cancelar"
  },
  modal: {
    okText: "Aceptar",
    cancelText: "Cancelar"
  },
  pagination: {
    goto: "Ir a",
    page: "P\xE1gina",
    countPerPage: "/ p\xE1gina",
    total: "{0} en total"
  },
  table: {
    okText: "Aceptar",
    resetText: "Reiniciar"
  },
  upload: {
    start: "Comienzo",
    cancel: "Cancelar",
    delete: "Eliminar",
    retry: "Haga clic para intentarlo de nuevo",
    buttonText: "Haga clic para cargar",
    preview: "Vista Previa",
    drag: "Haga clic o arrastre los archivos para cargarlos aqu\xED",
    dragHover: "Libera el archivo y empieza a subir",
    error: "Fallar"
  },
  calendar: calendarLang,
  datePicker: {
    view: calendarLang.view,
    month: calendarLang.month,
    week: calendarLang.week,
    placeholder: {
      date: "Seleccionar fecha",
      week: "Seleccionar semana",
      month: "Elegir un mes",
      year: "Elegir un a\xF1o",
      quarter: "Seleccionar trimestre",
      time: "Seleccionar hora"
    },
    rangePlaceholder: {
      date: ["Fecha inicial", "Fecha final"],
      week: ["Semana inicial", "Semana final"],
      month: ["Mes inicial", "Mes final"],
      year: ["A\xF1o inicial", "A\xF1o final"],
      quarter: ["Trimestre inicial", "Trimestre final"],
      time: ["Seleccionar hora", "Seleccionar hora"]
    },
    selectTime: "Select time",
    today: "Today",
    now: "Now",
    ok: "Ok"
  },
  image: {
    loading: "cargando"
  },
  imagePreview: {
    fullScreen: "Pantalla completa",
    rotateRight: "Gira a la derecha",
    rotateLeft: "Girar a la izquierda",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    originalSize: "Tama\xF1o original"
  },
  typography: {
    copy: "Copiar",
    copied: "Copiado",
    edit: "Editar",
    expand: "Expandir",
    collapse: "Pliegue"
  },
  colorPicker: {
    history: "Colores hist\xF3ricos",
    preset: "Colores predefinidos del sistema",
    empty: "No hay datos"
  }
};
module.exports = lang;
