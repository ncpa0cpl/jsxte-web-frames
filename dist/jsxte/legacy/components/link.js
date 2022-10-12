"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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

// src/jsxte/components/link.tsx
var link_exports = {};
__export(link_exports, {
  Link: () => Link
});
module.exports = __toCommonJS(link_exports);
var import_web_frame_context = require("../contexts/web-frame-context.js");
var import_jsx_runtime = require("jsxte/jsx-runtime");
var Link = (props, context) => {
  const _a = props, { href, frameName } = _a, rest = __objRest(_a, ["href", "frameName"]);
  const linkProps = {};
  const params = new URLSearchParams();
  linkProps["data-href"] = href;
  linkProps["data-location-hash"] = props.locationHash;
  if (context.has(import_web_frame_context.WebFrameContext)) {
    const frameStack = context.get(import_web_frame_context.WebFrameContext).stack;
    for (const frame of frameStack) {
      params.set(`wf-${frame.name}`, frame.initialUrl);
    }
  }
  if (frameName) {
    linkProps["data-frame"] = frameName;
    params.delete(frameName);
    params.set(`wf-${frameName}`, href);
  } else if (context.has(import_web_frame_context.WebFrameContext)) {
    const ctxFrameName = context.get(import_web_frame_context.WebFrameContext).frameName;
    linkProps["data-frame"] = ctxFrameName;
    params.delete(`wf-${ctxFrameName}`);
    params.set(`wf-${ctxFrameName}`, href);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", __spreadValues(__spreadValues({
    is: "frame-link",
    href: "./?" + params.toString()
  }, linkProps), rest));
};
