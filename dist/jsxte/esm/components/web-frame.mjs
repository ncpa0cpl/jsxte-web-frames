var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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

// src/jsxte/components/web-frame.tsx
import "jsxte";
import { QueryParamsContext } from "../contexts/query-params-context.mjs";
import { WebFrameContext } from "../contexts/web-frame-context.mjs";
import { resolveFrameView } from "../register-frame-view.mjs";
import { jsx, jsxs } from "jsxte/jsx-runtime";
var WebFrame = (props, context) => {
  var _a, _b, _c, _d;
  const stack = context.has(WebFrameContext) ? context.get(WebFrameContext).stack : [];
  let content = props.children;
  let url = (_a = props.initialUrl) != null ? _a : "";
  if (props.persistentState !== false) {
    const queryParams = context.has(QueryParamsContext) ? context.get(QueryParamsContext) : {};
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
    const c = resolveFrameView(url);
    if (c)
      content = c;
  }
  context.set(WebFrameContext, {
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
    "data-is-preloaded": content ? "true" : "false"
  };
  const _e = (_d = props.containerProps) != null ? _d : {}, { is, children } = _e, forwardedProps = __objRest(_e, ["is", "children"]);
  const renderReloadButton = (props2) => {
    return /* @__PURE__ */ jsx("button", __spreadValues({
      "data-frame-reload": true
    }, props2));
  };
  return /* @__PURE__ */ jsxs("div", __spreadProps(__spreadValues(__spreadProps(__spreadValues({}, forwardedProps), {
    is: "jsxte-web-frame"
  }), frameProps), {
    children: [
      /* @__PURE__ */ jsx("template", {
        class: "on-load-template",
        children: /* @__PURE__ */ jsx("div", {
          class: "web-frame-loader",
          children: props.onLoad ? props.onLoad() : /* @__PURE__ */ jsx("h3", {
            children: "Loading..."
          })
        })
      }),
      /* @__PURE__ */ jsx("template", {
        class: "on-error-template",
        children: /* @__PURE__ */ jsx("div", {
          class: "web-frame-error",
          children: props.onError ? props.onError(renderReloadButton) : /* @__PURE__ */ jsx("h3", {
            children: "Something went wrong."
          })
        })
      }),
      /* @__PURE__ */ jsx("div", {
        class: "web-frame-content",
        children: content
      })
    ]
  }));
};
export {
  WebFrame
};
