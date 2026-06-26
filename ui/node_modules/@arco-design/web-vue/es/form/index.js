import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Form from "./form.js";
import FormItem from "./form-item.js";
export { default as FormItem } from "./form-item.js";
const Form = Object.assign(_Form, {
  Item: FormItem,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Form.name, _Form);
    app.component(componentPrefix + FormItem.name, FormItem);
  }
});
export { Form as default };
