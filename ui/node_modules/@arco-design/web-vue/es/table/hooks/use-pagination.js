import { ref, computed } from "vue";
import { isObject } from "../../_utils/is.js";
const usePagination = (props, emit) => {
  var _a, _b;
  const _page = ref(
    isObject(props.pagination) ? (_a = props.pagination.defaultCurrent) != null ? _a : 1 : 1
  );
  const _pageSize = ref(
    isObject(props.pagination) ? (_b = props.pagination.defaultPageSize) != null ? _b : 10 : 10
  );
  const pageSize = computed(
    () => {
      var _a2;
      return isObject(props.pagination) ? (_a2 = props.pagination.pageSize) != null ? _a2 : _pageSize.value : _pageSize.value;
    }
  );
  const page = computed(
    () => {
      var _a2;
      return isObject(props.pagination) ? (_a2 = props.pagination.current) != null ? _a2 : _page.value : _page.value;
    }
  );
  const handlePageChange = (page2) => {
    _page.value = page2;
    emit("pageChange", page2);
  };
  const handlePageSizeChange = (pageSize2) => {
    _pageSize.value = pageSize2;
    emit("pageSizeChange", pageSize2);
  };
  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange
  };
};
export { usePagination };
