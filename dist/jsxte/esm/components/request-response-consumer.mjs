// src/jsxte/components/request-response-consumer.tsx
import { RequestResponseContext } from "../contexts/request-response-context.mjs";
import { Fragment, jsx } from "jsxte/jsx-runtime";
var RequestResponseConsumer = (props, context) => {
  let req = void 0, res = void 0;
  if (context.has(RequestResponseContext)) {
    const requestResponse = context.get(RequestResponseContext);
    req = requestResponse.req;
    res = requestResponse.res;
  }
  return /* @__PURE__ */ jsx(Fragment, {
    children: props.render({
      req,
      res
    })
  });
};
export {
  RequestResponseConsumer
};
