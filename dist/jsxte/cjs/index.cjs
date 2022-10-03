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

// src/jsxte/index.ts
var jsxte_exports = {};
__export(jsxte_exports, {
  Link: () => import_link.Link,
  WebFrame: () => import_web_frame.WebFrame,
  registerFrameView: () => import_register_frame_view.registerFrameView
});
module.exports = __toCommonJS(jsxte_exports);
var import_link = require("./components/link.cjs");
var import_web_frame = require("./components/web-frame.cjs");
var import_register_frame_view = require("./register-frame-view.cjs");
