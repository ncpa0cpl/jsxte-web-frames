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
import "jsxte";
import { renderToHtmlAsync } from "jsxte";
import { QueryParamsProvider } from "./components/query-params-provider.mjs";
import { RequestResponseConsumer } from "./components/request-response-consumer.mjs";
import { RequestResponseProvider } from "./components/request-response-provider.mjs";
import { jsx } from "jsxte/jsx-runtime";
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
        yield renderToHtmlAsync(
          /* @__PURE__ */ jsx(RequestResponseProvider, {
            req,
            res,
            children: /* @__PURE__ */ jsx(QueryParamsProvider, {
              params: queryParams,
              children: /* @__PURE__ */ jsx(FrameView, {
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
  return /* @__PURE__ */ jsx(QueryParamsProvider, {
    params: Object.fromEntries(resolvedRoute.query.entries()),
    children: /* @__PURE__ */ jsx(RequestResponseConsumer, {
      render: ({ req, res }) => /* @__PURE__ */ jsx(resolvedRoute.Component, {
        req,
        res
      })
    })
  });
};
export {
  registerFrameView,
  resolveFrameView
};
