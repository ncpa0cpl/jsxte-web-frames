var __defProp = Object.defineProperty;
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

// src/jsxte/components/link.tsx
import { WebFrameContext } from "../contexts/web-frame-context.mjs";
import { jsx } from "jsxte/jsx-runtime";
var Link = (props, context) => {
  const _a = props, { href, frameName } = _a, rest = __objRest(_a, ["href", "frameName"]);
  const linkProps = {};
  const params = new URLSearchParams();
  linkProps["data-href"] = href;
  if (context.has(WebFrameContext)) {
    const frameStack = context.get(WebFrameContext).stack;
    for (const frame of frameStack) {
      params.set(`wf-${frame.name}`, frame.initialUrl);
    }
  }
  if (frameName) {
    linkProps["data-frame"] = frameName;
    params.delete(frameName);
    params.set(`wf-${frameName}`, href);
  } else if (context.has(WebFrameContext)) {
    const ctxFrameName = context.get(WebFrameContext).frameName;
    linkProps["data-frame"] = ctxFrameName;
    params.delete(`wf-${ctxFrameName}`);
    params.set(`wf-${ctxFrameName}`, href);
  }
  return /* @__PURE__ */ jsx("a", __spreadValues(__spreadValues({
    is: "frame-link",
    href: "./?" + params.toString()
  }, linkProps), rest));
};
export {
  Link
};
