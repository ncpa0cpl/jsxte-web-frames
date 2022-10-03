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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/jsxte/register-frame-view.tsx
var register_frame_view_exports = {};
__export(register_frame_view_exports, {
  registerFrameView: () => registerFrameView,
  resolveFrameView: () => resolveFrameView
});
module.exports = __toCommonJS(register_frame_view_exports);
var import_jsxte = require("jsxte");
var import_jsxte2 = require("jsxte");
var import_query_params_provider = require("./components/query-params-provider.cjs");
var import_request_response_consumer = require("./components/request-response-consumer.cjs");
var import_request_response_provider = require("./components/request-response-provider.cjs");
var import_jsx_runtime = require("jsxte/jsx-runtime");
var PatternParameter = class {
  constructor(name, pattern) {
    this.name = name;
    this.pattern = pattern;
  }
};
var Route = class {
  constructor(pathPattern, Component) {
    this.Component = Component;
    this.pathPattern = pathPattern;
    this.patternParts = pathPattern.split("/").filter((p) => p).map((part) => {
      if (part.startsWith(":")) {
        return new PatternParameter(part.slice(1), part);
      }
      return part;
    });
  }
  matches(path) {
    const url = new URL(path, "http://localhost");
    const pathParts = url.pathname.split("/").filter((p) => p);
    if (pathParts.length !== this.patternParts.length) {
      return false;
    }
    for (const [index, part] of pathParts.entries()) {
      const patternPart = this.patternParts[index];
      if (typeof patternPart !== "string")
        continue;
      if (patternPart !== part) {
        return false;
      }
    }
    return true;
  }
  parseUrl(path) {
    const url = new URL(path, "http://localhost");
    const pathParts = url.pathname.split("/").filter((p) => p);
    const params = {};
    for (const [index, part] of pathParts.entries()) {
      const patternPart = this.patternParts[index];
      if (!patternPart)
        throw new Error("Url cannot be parsed.");
      if (typeof patternPart === "string")
        continue;
      params[patternPart.name] = part;
    }
    return { params, query: url.searchParams };
  }
};
var FrameViewRoutes = class {
  static addRoute(pathPattern, Component) {
    this.routes.push(new Route(pathPattern, Component));
  }
  static resolveRoute(path) {
    for (const route of this.routes) {
      if (route.matches(path)) {
        return __spreadProps(__spreadValues({}, route.parseUrl(path)), { Component: route.Component });
      }
    }
  }
};
FrameViewRoutes.routes = [];
var registerFrameView = (server, path, FrameView) => {
  server.get(path, (req, res) => __async(void 0, null, function* () {
    try {
      const queryParams = {};
      for (const [key, value] of Object.entries(req.query)) {
        if (Array.isArray(value) && !value.some((v) => typeof v !== "string")) {
          queryParams[key] = value;
        } else if (typeof value === "string") {
          queryParams[key] = [value];
        }
      }
      res.send(
        yield (0, import_jsxte2.renderToHtmlAsync)(
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_request_response_provider.RequestResponseProvider, {
            req,
            res,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_query_params_provider.QueryParamsProvider, {
              params: queryParams,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrameView, {
                req,
                res
              })
            })
          })
        )
      );
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal server error.");
    }
  }));
  FrameViewRoutes.addRoute(path, FrameView);
};
var resolveFrameView = (url) => {
  const resolvedRoute = FrameViewRoutes.resolveRoute(url);
  if (!resolvedRoute)
    return;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_query_params_provider.QueryParamsProvider, {
    params: Object.fromEntries(resolvedRoute.query.entries()),
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_request_response_consumer.RequestResponseConsumer, {
      render: ({ req, res }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(resolvedRoute.Component, {
        req,
        res
      })
    })
  });
};
