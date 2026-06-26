const calendarLang = {
  formatYear: "YYYY",
  formatMonth: "MM/YYYY",
  today: "Hoje",
  view: {
    month: "M\xEAs",
    year: "Ano",
    week: "Semana",
    day: "Dia"
  },
  month: {
    long: {
      January: "Janeiro",
      February: "Fevereiro",
      March: "Mar\xE7o",
      April: "Abril",
      May: "Maio",
      June: "Junho",
      July: "Julho",
      August: "Agosto",
      September: "Setembro",
      October: "Outubro",
      November: "Novembro",
      December: "Dezembro"
    },
    short: {
      January: "Jan",
      February: "Fev",
      March: "Mar",
      April: "Abr",
      May: "Mai",
      June: "Jun",
      July: "Jul",
      August: "Ago",
      September: "Set",
      October: "Out",
      November: "Nov",
      December: "Dez"
    }
  },
  week: {
    long: {
      self: "Semana",
      monday: "Segunda-feira",
      tuesday: "Ter\xE7a-feira",
      wednesday: "Quarta-feira",
      thursday: "Quinta-feira",
      friday: "Sexta-feira",
      saturday: "S\xE1bado",
      sunday: "Domingo"
    },
    short: {
      self: "Semana",
      monday: "Seg",
      tuesday: "Ter",
      wednesday: "Qua",
      thursday: "Qui",
      friday: "Sex",
      saturday: "S\xE1b",
      sunday: "Dom"
    }
  }
};
const lang = {
  locale: "pt-PT",
  empty: {
    description: "Sem dados"
  },
  drawer: {
    okText: "Ok",
    cancelText: "Cancelar"
  },
  popconfirm: {
    okText: "Ok",
    cancelText: "Cancelar"
  },
  modal: {
    okText: "Ok",
    cancelText: "Cancelar"
  },
  pagination: {
    goto: "Vamos para",
    page: "P\xE1gina",
    countPerPage: " / P\xE1gina",
    total: "Total: {0}"
  },
  table: {
    okText: "Ok",
    resetText: "Redefinir"
  },
  upload: {
    start: "Iniciar",
    cancel: "Cancelar",
    delete: "Excluir",
    retry: "Clique para tentar novamente",
    buttonText: "Carregar",
    preview: "Visualizar",
    drag: "Clique ou arraste o arquivo para esta \xE1rea para fazer upload",
    dragHover: "Liberar para fazer upload",
    error: "Erro ao carregar"
  },
  calendar: calendarLang,
  datePicker: {
    view: calendarLang.view,
    month: calendarLang.month,
    week: calendarLang.week,
    placeholder: {
      date: "Por favor, selecione a data",
      week: "Por favor, selecione a semana",
      month: "Por favor, selecione o m\xEAs",
      year: "Por favor, selecione o ano",
      quarter: "Por favor, selecione trimestre",
      time: "Por favor, selecione hor\xE1rio"
    },
    rangePlaceholder: {
      date: ["Data de in\xEDcio", "Data de t\xE9rmino"],
      week: ["In\xEDcio da semana", "Fim da semana"],
      month: ["M\xEAs inicial", "M\xEAs final"],
      year: ["Ano inicial", "Ano final"],
      quarter: ["In\xEDcio do trimestre", "Fim do trimestre"],
      time: ["Hora de inicio", "Hora de fim"]
    },
    selectTime: "Selecione a hora",
    today: "Hoje",
    now: "Agora",
    ok: "Ok"
  },
  image: {
    loading: "A carregar"
  },
  imagePreview: {
    fullScreen: "Tela Cheia",
    rotateRight: "Girar para a direita",
    rotateLeft: "Girar para a esquerda",
    zoomIn: "Ampliar",
    zoomOut: "Afastar",
    originalSize: "Tamanho original"
  },
  typography: {
    copied: "Copiado",
    copy: "Copiar",
    expand: "Desdobrar",
    collapse: "dobrar",
    edit: "Editar"
  },
  colorPicker: {
    history: "Cores usadas recentemente",
    preset: "Cor padr\xE3o do sistema",
    empty: "Sem dados"
  }
};
export { lang as default };
