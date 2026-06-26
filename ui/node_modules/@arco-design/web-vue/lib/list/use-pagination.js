"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../_utils/is.js");
const usePagination = (props, { emit }) => {
  var _a, _b;
  const _current = vue.ref(
    is.isObject(props.paginationProps) ? (_a = props.paginationProps.defaultCurrent) != null ? _a : 1 : 1
  );
  const _pageSize = vue.ref(
    is.isObject(props.paginationProps) ? (_b = props.paginationProps.defaultPageSize) != null ? _b : 10 : 10
  );
  const current = vue.computed(
    () => {
      var _a2;
      return is.isObject(props.paginationProps) ? (_a2 = props.paginationProps.current) != null ? _a2 : _current.value : _current.value;
    }
  );
  const pageSize = vue.computed(
    () => {
      var _a2;
      return is.isObject(props.paginationProps) ? (_a2 = props.paginationProps.pageSize) != null ? _a2 : _pageSize.value : _pageSize.value;
    }
  );
  const handlePageChange = (page) => {
    _current.value = page;
    emit("pageChange", page);
  };
  const handlePageSizeChange = (pageSize2) => {
    _pageSize.value = pageSize2;
    emit("pageSizeChange", pageSize2);
  };
  return {
    current,
    pageSize,
    handlePageChange,
    handlePageSizeChange
  };
};
exports.usePagination = usePagination;
