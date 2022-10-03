// src/jsxte/components/request-response-provider.tsx
import { RequestResponseContext } from "../contexts/request-response-context.mjs";
import { Fragment, jsx } from "jsxte/jsx-runtime";
var RequestResponseProvider = (props, context) => {
  context.set(RequestResponseContext, {
    req: props.req,
    res: props.res
  });
  return /* @__PURE__ */ jsx(Fragment, {
    children: props.children
  });
};
export {
  RequestResponseProvider
};
