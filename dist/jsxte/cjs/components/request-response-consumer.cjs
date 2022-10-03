"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/jsxte/components/request-response-consumer.tsx
var request_response_consumer_exports = {};
__export(request_response_consumer_exports, {
  RequestResponseConsumer: () => RequestResponseConsumer
});
module.exports = __toCommonJS(request_response_consumer_exports);
var import_request_response_context = require("../contexts/request-response-context.cjs");
var import_jsx_runtime = require("jsxte/jsx-runtime");
var RequestResponseConsumer = (props, context) => {
  let req = void 0, res = void 0;
  if (context.has(import_request_response_context.RequestResponseContext)) {
    const requestResponse = context.get(import_request_response_context.RequestResponseContext);
    req = requestResponse.req;
    res = requestResponse.res;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
    children: props.render({
      req,
      res
    })
  });
};
