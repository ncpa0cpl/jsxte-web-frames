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

// src/jsxte/components/query-params-provider.tsx
var query_params_provider_exports = {};
__export(query_params_provider_exports, {
  QueryParamsProvider: () => QueryParamsProvider
});
module.exports = __toCommonJS(query_params_provider_exports);
var import_query_params_context = require("../contexts/query-params-context.cjs");
var import_jsx_runtime = require("jsxte/jsx-runtime");
var QueryParamsProvider = (props, context) => {
  if (context.has(import_query_params_context.QueryParamsContext))
    context.update(import_query_params_context.QueryParamsContext, props.params);
  else
    context.set(import_query_params_context.QueryParamsContext, props.params);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {
    children: props.children
  });
};
