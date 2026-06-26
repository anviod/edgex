import NP from "number-precision";
import { NOOP } from "../_utils/dom.js";
import { isFunction, isArray } from "../_utils/is.js";
const getResponse = (xhr) => {
  const res = xhr.responseText || xhr.response;
  if (!res) {
    return void 0;
  }
  const contentType = xhr.getResponseHeader("Content-Type");
  if (contentType && contentType.includes("json")) {
    try {
      return JSON.parse(res);
    } catch {
      return res;
    }
  }
  return res;
};
const getProgressStatus = (status) => {
  switch (status) {
    case "done":
      return "success";
    case "error":
      return "danger";
    default:
      return "normal";
  }
};
const getValue = (obj, fileItem) => {
  if (isFunction(obj)) {
    return obj(fileItem);
  }
  return obj;
};
const uploadRequest = ({
  fileItem,
  action,
  name: originName,
  data: originData,
  headers = {},
  withCredentials = false,
  onProgress = NOOP,
  onSuccess = NOOP,
  onError = NOOP
}) => {
  const name = getValue(originName, fileItem) || "file";
  const data = getValue(originData, fileItem);
  const xhr = new XMLHttpRequest();
  if (withCredentials) {
    xhr.withCredentials = true;
  }
  xhr.upload.onprogress = (e) => {
    const percent = e.total > 0 ? NP.round(e.loaded / e.total, 2) : 0;
    onProgress(percent, e);
  };
  xhr.onerror = function error(e) {
    onError(e);
  };
  xhr.onload = () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      onError(getResponse(xhr));
      return;
    }
    onSuccess(getResponse(xhr));
  };
  const formData = new FormData();
  if (data) {
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
    }
  }
  if (fileItem.file) {
    formData.append(name, fileItem.file);
  }
  xhr.open("post", action != null ? action : "", true);
  for (const key of Object.keys(headers)) {
    xhr.setRequestHeader(key, headers[key]);
  }
  xhr.send(formData);
  return {
    abort() {
      xhr.abort();
    }
  };
};
const isAcceptFile = (file, accept) => {
  if (accept && file) {
    const accepts = isArray(accept) ? accept : accept.split(",").map((x) => x.trim()).filter((x) => x);
    const fileExtension = (file.name.indexOf(".") > -1 ? `.${file.name.split(".").pop()}` : "").toLowerCase();
    return accepts.some((type) => {
      const typeText = type && type.toLowerCase();
      const fileType = (file.type || "").toLowerCase();
      const baseFileType = fileType.split("/")[0];
      if (typeText === fileType || `${baseFileType}${fileExtension.replace(".", "/")}` === typeText) {
        return true;
      }
      if (/^\*(\/\*)?$/.test(typeText)) {
        return true;
      }
      if (/\/\*/.test(typeText)) {
        return fileType.replace(/\/.*$/, "") === typeText.replace(/\/.*$/, "");
      }
      if (/\..*/.test(typeText)) {
        let suffixList = [typeText];
        if (typeText === ".jpg" || typeText === ".jpeg") {
          suffixList = [".jpg", ".jpeg"];
        }
        return suffixList.indexOf(fileExtension) > -1;
      }
      return false;
    });
  }
  return !!file;
};
const loopDirectory = (itemList, accept, callback) => {
  const files = [];
  let restFileCount = 0;
  const onFinish = () => {
    !restFileCount && callback(files);
  };
  const _loopDirectory = (item) => {
    restFileCount += 1;
    if (item == null ? void 0 : item.isFile) {
      item.file((file) => {
        restFileCount -= 1;
        if (isAcceptFile(file, accept)) {
          Object.defineProperty(file, "webkitRelativePath", {
            value: item.fullPath.replace(/^\//, "")
          });
          files.push(file);
        }
        onFinish();
      });
      return;
    }
    if (item == null ? void 0 : item.isDirectory) {
      const reader = item.createReader();
      let flag = false;
      const readEntries = () => {
        reader.readEntries((entries) => {
          if (!flag) {
            restFileCount -= 1;
            flag = true;
          }
          if (entries.length === 0) {
            onFinish();
          } else {
            readEntries();
            entries.forEach(_loopDirectory);
          }
        });
      };
      readEntries();
      return;
    }
    restFileCount -= 1;
    onFinish();
  };
  [].slice.call(itemList).forEach(
    (item) => item.webkitGetAsEntry && _loopDirectory(item.webkitGetAsEntry())
  );
};
const isImage = (file) => {
  var _a;
  return (_a = file.type) == null ? void 0 : _a.includes("image");
};
const getFiles = (fileList, accept) => {
  if (!fileList) {
    return [];
  }
  const files = Array.from(fileList);
  if (accept) {
    return files.filter((file) => {
      return isAcceptFile(file, accept);
    });
  }
  return files;
};
export { getFiles, getProgressStatus, isImage, loopDirectory, uploadRequest };
