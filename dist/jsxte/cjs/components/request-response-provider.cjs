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

// src/jsxte/components/request-response-provider.tsx
var request_response_provider_exports = {};
__export(request_response_provider_exports, {
  RequestResponseProvider: () => RequestResponseProvider
});
module.exports = __toCommonJS(request_response_provider_exports);
var import_request_response_context = require("../contexts/request-response-context.cjs");
var import_jsx_runtime = require("jsxte/jsx-runtime");
var RequestResponseProvider = (props, context) => {
  context.set(import_request_response_context.RequestResponseContext, {
    req: props.req,
    res: props.res
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
    children: props.children
  });
};
