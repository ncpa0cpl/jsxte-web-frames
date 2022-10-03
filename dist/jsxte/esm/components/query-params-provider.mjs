// src/jsxte/components/query-params-provider.tsx
import { QueryParamsContext } from "../contexts/query-params-context.mjs";
import { Fragment, jsx } from "jsxte/jsx-runtime";
var QueryParamsProvider = (props, context) => {
  context.set(QueryParamsContext, props.params);
  return /* @__PURE__ */ jsx(Fragment, {
    children: props.children
  });
};
export {
  QueryParamsProvider
};
