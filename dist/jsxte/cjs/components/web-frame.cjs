"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// src/jsxte/components/web-frame.tsx
var web_frame_exports = {};
__export(web_frame_exports, {
  WebFrame: () => WebFrame
});
module.exports = __toCommonJS(web_frame_exports);
var import_jsxte = require("jsxte");
var import_query_params_context = require("../contexts/query-params-context.cjs");
var import_web_frame_context = require("../contexts/web-frame-context.cjs");
var import_register_frame_view = require("../register-frame-view.cjs");
var import_num_to_str = require("../utils/num-to-str.cjs");
var import_jsx_runtime = require("jsxte/jsx-runtime");
var WebFrame = (props, context) => {
  var _a, _b, _c, _d;
  const stack = context.has(import_web_frame_context.WebFrameContext) ? context.get(import_web_frame_context.WebFrameContext).stack : [];
  let content = props.children;
  let url = (_a = props.initialUrl) != null ? _a : "";
  if (props.persistentState !== false) {
    const queryParams = context.has(import_query_params_context.QueryParamsContext) ? context.get(import_query_params_context.QueryParamsContext) : {};
    if (`wf-${props.name}` in queryParams) {
      const newUrl = queryParams[`wf-${props.name}`];
      if (newUrl !== void 0) {
        if (typeof newUrl === "string")
          url = newUrl;
        else if (newUrl.length > 0)
          url = newUrl[0];
      }
    }
  }
  if (!props.dontPreload && !!url) {
    const c = (0, import_register_frame_view.resolveFrameView)(url);
    if (c)
      content = c;
  }
  context.set(import_web_frame_context.WebFrameContext, {
    frameName: props.name,
    stack: [
      ...stack,
      {
        name: props.name,
        initialUrl: url
      }
    ]
  });
  const frameProps = {
    "data-initial-url": url,
    "data-name": props.name,
    "data-allow-external-domains": props.allowExternalDomains ? "true" : "false",
    "data-allowed-domains": (_b = props.allowedDomains) == null ? void 0 : _b.join(";"),
    "data-persistent-state": ((_c = props.persistentState) != null ? _c : true) ? "true" : "false",
    "data-is-preloaded": content ? "true" : "false",
    "data-min-load-time": props.minimumLoadTime ? (0, import_num_to_str.numToStr)(props.minimumLoadTime) : void 0
  };
  const _e = (_d = props.containerProps) != null ? _d : {}, { is, children } = _e, forwardedProps = __objRest(_e, ["is", "children"]);
  const renderReloadButton = (props2) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", __spreadValues({
      "data-frame-reload": true
    }, props2));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", __spreadProps(__spreadValues(__spreadProps(__spreadValues({}, forwardedProps), {
    is: "jsxte-web-frame"
  }), frameProps), {
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("template", {
        class: "on-load-template",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          style: "display: contents;",
          class: "web-frame-loader",
          children: props.onLoad ? props.onLoad() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
            children: "Loading..."
          })
        })
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("template", {
        class: "on-error-template",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          style: "display: contents;",
          class: "web-frame-error",
          children: props.onError ? props.onError(renderReloadButton) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
            children: "Something went wrong."
          })
        })
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        class: "web-frame-content",
        children: content
      })
    ]
  }));
};
