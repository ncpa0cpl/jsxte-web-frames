// src/jsxte/components/query-params-provider.tsx
import { QueryParamsContext } from "../contexts/query-params-context.mjs";
import { Fragment, jsx } from "jsxte/jsx-runtime";
var QueryParamsProvider = (props, context) => {
  if (context.has(QueryParamsContext))
    context.update(QueryParamsContext, props.params);
  else
    context.set(QueryParamsContext, props.params);
  return /* @__PURE__ */ jsx(Fragment, {
    children: props.children
  });
};
export {
  QueryParamsProvider
};
