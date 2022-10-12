var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
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

// src/web-components/navigation-event-emitter/navigation-event-emitter.ts
var NavigationEventEmitter = class {
  static emit(name, value) {
    var _a;
    for (const listener of (_a = this.listeners.get(name)) != null ? _a : []) {
      setTimeout(() => listener(value), 0);
    }
  }
  static on(name, callback) {
    var _a;
    const listeners = (_a = this.listeners.get(name)) != null ? _a : [];
    listeners.push(callback);
    this.listeners.set(name, listeners);
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }
};
NavigationEventEmitter.listeners = /* @__PURE__ */ new Map();

// src/web-components/query-controller/query-controller.ts
var QueryController = class {
  static generateKeyedNameFor(name) {
    return `wf-${name}`;
  }
  static set(name, value) {
    const [params, hash] = value.split("#");
    const url = new URL(window.location.href);
    url.searchParams.set(this.generateKeyedNameFor(name), params);
    window.history.pushState({}, "", url.href);
    window.location.hash = hash ? `#${hash}` : "";
    NavigationEventEmitter.emit("has-navigated", null);
  }
  static get(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(this.generateKeyedNameFor(name));
  }
  static remove(name) {
    const url = new URL(window.location.href);
    url.searchParams.delete(this.generateKeyedNameFor(name));
    window.history.replaceState({}, "", url.href);
  }
  static getAllKeyed() {
    const url = new URL(window.location.href);
    const params = /* @__PURE__ */ new Map();
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith("wf-")) {
        params.set(key, value);
      }
    }
    return params;
  }
};

// src/web-components/components/frame-link.ts
var FrameLink = class extends HTMLAnchorElement {
  constructor() {
    super(...arguments);
    this.onLinkUnmount = void 0;
    this.handleClick = (event) => {
      const frameName = this.frameName;
      const hash = this.locationHash;
      let url = this.frameHref;
      if (hash) {
        url += `#${hash}`;
      }
      if (frameName && url) {
        event.preventDefault();
        NavigationEventEmitter.emit("navigate", { frame: frameName, url });
      }
    };
  }
  retrieveCustomAttribute(name) {
    return this.getAttribute(name);
  }
  setCustomAttribute(name, value) {
    this.setAttribute(name, value);
  }
  updateOwnHref() {
    var _a;
    const frameName = this.frameName;
    const frameHref = this.frameHref;
    if (frameName && frameHref) {
      const keyedName = QueryController.generateKeyedNameFor(frameName);
      const href = new URL(window.location.pathname, window.location.origin);
      const params = QueryController.getAllKeyed();
      for (const [key, value] of params.entries()) {
        if (key !== keyedName) {
          href.searchParams.set(key, value);
        }
      }
      href.searchParams.delete(keyedName);
      href.searchParams.set(keyedName, frameHref);
      href.hash = (_a = this.locationHash) != null ? _a : "";
      this.href = href.toString();
    }
  }
  get frameName() {
    return this.retrieveCustomAttribute("data-frame");
  }
  get frameHref() {
    return this.retrieveCustomAttribute("data-href");
  }
  get locationHash() {
    return this.retrieveCustomAttribute("data-location-hash");
  }
  proposeOwner(frame) {
    if (!this.frameName) {
      this.setCustomAttribute("data-frame", frame);
      this.updateOwnHref();
    }
  }
  connectedCallback() {
    this.updateOwnHref();
    const removeOnNavigationListener = NavigationEventEmitter.on(
      "has-navigated",
      () => this.updateOwnHref()
    );
    const onClick = this.handleClick.bind(this);
    this.addEventListener("click", onClick);
    this.onLinkUnmount = () => {
      removeOnNavigationListener();
      this.removeEventListener("click", onClick);
    };
  }
  disconnectedCallback() {
    if (this.onLinkUnmount)
      this.onLinkUnmount();
  }
};
customElements.define("frame-link", FrameLink, { extends: "a" });

// src/web-components/utils/sleep.ts
var sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// src/web-components/utils/with-min-load-time.ts
var withMinLoadTime = (task, minLoadTime) => __async(void 0, null, function* () {
  if (!minLoadTime) {
    return yield task();
  }
  const taskResult = task();
  yield Promise.allSettled([taskResult, sleep(minLoadTime)]);
  return yield taskResult;
});

// src/web-components/utils/fetch-job.ts
var FetchCancelledError = class extends Error {
  constructor() {
    super(...arguments);
    this._isCancelledError = true;
  }
  static is(error) {
    return "_isCancelledError" in error;
  }
};
var FetchJob = class {
  constructor(url, options, minimumLoadTime) {
    this.url = url;
    this.options = options;
    this.minimumLoadTime = minimumLoadTime;
    this._abort = new AbortController();
    this._isCancelled = false;
    this._isFinished = false;
  }
  getResult() {
    if (this._isCancelled) {
      throw new FetchCancelledError("FetchJob cancelled");
    }
    if (!this._result) {
      throw new Error("FetchJob not finished.");
    }
    if (this._result instanceof Error) {
      throw this._result;
    }
    return this._result;
  }
  start() {
    return __async(this, null, function* () {
      if (!this._promise) {
        this._promise = withMinLoadTime(
          () => fetch(this.url, __spreadProps(__spreadValues({}, this.options), {
            signal: this._abort.signal
          })).then(
            (response) => __async(this, null, function* () {
              return {
                data: yield response.text(),
                response
              };
            })
          ),
          this.minimumLoadTime
        );
      } else {
        throw new Error("FetchJob already started");
      }
      yield this._promise.then((r) => {
        this._result = r;
      }).catch((e) => {
        this._result = e;
      });
      this._isFinished = true;
      return this.getResult();
    });
  }
  cancel() {
    return __async(this, null, function* () {
      if (!this._isFinished) {
        this._isCancelled = true;
        this._abort.abort();
      }
    });
  }
};

// src/web-components/components/jsxte-web-frame.ts
var JsxteWebFrame = class extends HTMLDivElement {
  constructor() {
    var _a;
    super();
    this.onFrameUnmount = void 0;
    this.history = [];
    this.lastRequest = void 0;
    this.loaderContainer = document.createElement("div");
    this.loaderContainer.style.display = "none";
    this.onErrorTemplate = this.querySelector(
      ":scope > template.on-error-template"
    );
    this.contentContainer = this.querySelector(
      ":scope > div.web-frame-content"
    );
    const loadNode = (_a = this.querySelector(
      ":scope > template.on-load-template"
    )) == null ? void 0 : _a.content.cloneNode(true);
    if (loadNode)
      this.loaderContainer.prepend(loadNode);
    this.onLoadNode = this.loaderContainer.children[0];
    if (!this.frameName) {
      this.warnMissingName();
      return;
    }
    const persistedUrl = QueryController.get(this.frameName);
    const initialUrl = this.initialUrl;
    if (!this.isPreloaded) {
      if (this.persistentState && persistedUrl !== null) {
        this.load(persistedUrl);
      } else if (initialUrl) {
        this.load(initialUrl);
      }
    }
  }
  warnMissingName() {
    console.warn(
      "JsxteWebFrame: The frame name is missing. Please provide a name for the frame using the 'data-name' attribute."
    );
  }
  validateUrl(url) {
    if (!this.allowExternalDomains) {
      const { origin } = new URL(url, window.location.host);
      const { origin: currentOrigin } = window.location;
      if (origin !== currentOrigin) {
        throw new Error(
          `JsxteWebFrame: Invalid URL: URLs to external sites are not allowed. Url to [${url}]`
        );
      }
      return;
    }
    const allowedDomains = this.allowedDomains;
    if (allowedDomains) {
      const { origin } = new URL(url, window.location.host);
      if (!allowedDomains.includes(origin)) {
        throw new Error(
          `JsxteWebFrame: Invalid URL: URLs to external sites that are not whitelisted are not allowed. Url to [${url}]`
        );
      }
    }
  }
  retrieveCustomAttribute(name) {
    return this.getAttribute(name);
  }
  get initialUrl() {
    return this.retrieveCustomAttribute("data-initial-url");
  }
  get frameName() {
    return this.retrieveCustomAttribute("data-name");
  }
  get allowExternalDomains() {
    const attribute = this.retrieveCustomAttribute(
      "data-allow-external-domains"
    );
    return attribute !== void 0 ? Boolean(attribute) : void 0;
  }
  get allowedDomains() {
    var _a;
    return (_a = this.retrieveCustomAttribute("data-allowed-domains")) == null ? void 0 : _a.split(";");
  }
  get persistentState() {
    const attribute = this.retrieveCustomAttribute("data-persistent-state");
    return attribute !== void 0 ? Boolean(attribute) : void 0;
  }
  get isPreloaded() {
    const attribute = this.retrieveCustomAttribute("data-is-preloaded");
    return attribute !== void 0 ? Boolean(attribute) : void 0;
  }
  get minLoadTime() {
    const t = this.retrieveCustomAttribute("data-min-load-time");
    if (t)
      return Number(t);
    return void 0;
  }
  getOnLoadNode() {
    if (!this.onLoadNode) {
      throw new Error("JsxteWebFrame: .on-load-template element is missing.");
    }
    return this.onLoadNode;
  }
  getOnErrorTemplate() {
    if (!this.onErrorTemplate) {
      throw new Error("JsxteWebFrame: .on-error-template element is missing.");
    }
    return this.onErrorTemplate;
  }
  getContentContainer() {
    if (!this.contentContainer) {
      throw new Error("JsxteWebFrame: .web-frame-content element is missing.");
    }
    return this.contentContainer;
  }
  hideLoader() {
    const loader = this.getOnLoadNode();
    this.loaderContainer.prepend(loader);
  }
  setContent(html) {
    this.hideLoader();
    const container = this.getContentContainer();
    container.innerHTML = html;
    const frameName = this.frameName;
    if (frameName) {
      const frameLinks = this.querySelectorAll(
        'a[is="frame-link"]'
      );
      for (const anchor of frameLinks) {
        if ("proposeOwner" in anchor)
          anchor.proposeOwner(frameName);
      }
    }
  }
  renderLoader() {
    const container = this.getContentContainer();
    container.innerHTML = "";
    container.append(this.getOnLoadNode());
  }
  renderError() {
    this.setContent(this.getOnErrorTemplate().innerHTML);
    const reloadButtons = this.querySelectorAll(
      "div.web-frame-error button[data-frame-reload]"
    );
    for (const button of reloadButtons) {
      button.addEventListener("click", () => this.reload());
    }
  }
  reload() {
    return __async(this, null, function* () {
      var _a;
      const lastUrl = this.history[this.history.length - 1];
      if (lastUrl) {
        this.renderLoader();
        try {
          (_a = this.lastRequest) == null ? void 0 : _a.cancel();
          const request = this.lastRequest = new FetchJob(
            lastUrl,
            { method: "GET" },
            this.minLoadTime
          );
          const { data, response } = yield request.start();
          if (response.ok)
            this.setContent(data);
          else
            this.renderError();
        } catch (e) {
          if (e instanceof Error && FetchCancelledError.is(e))
            return;
          this.renderError();
        }
      }
    });
  }
  load(url) {
    return __async(this, null, function* () {
      var _a;
      this.validateUrl(url);
      const frameName = this.frameName;
      if (this.persistentState && frameName) {
        QueryController.set(frameName, url);
      }
      this.history.push(url);
      this.renderLoader();
      try {
        (_a = this.lastRequest) == null ? void 0 : _a.cancel();
        const request = this.lastRequest = new FetchJob(
          url,
          { method: "GET" },
          this.minLoadTime
        );
        const { data, response } = yield request.start();
        if (response.ok)
          this.setContent(data);
        else
          this.renderError();
      } catch (e) {
        if (e instanceof Error && FetchCancelledError.is(e))
          return;
        this.renderError();
      }
    });
  }
  connectedCallback() {
    this.style.display = "contents";
    this.prepend(this.loaderContainer);
    if (this.frameName) {
      const removeNavListener = NavigationEventEmitter.on(
        "navigate",
        (event) => {
          if (event.frame === this.frameName) {
            this.load(event.url);
          }
        }
      );
      const removeGoBackListener = NavigationEventEmitter.on(
        "goback",
        (event) => {
          if (event.frame === this.frameName) {
            this.history.pop();
            const url = this.history[this.history.length - 1];
            if (url)
              this.load(url);
          }
        }
      );
      this.onFrameUnmount = () => {
        removeNavListener();
        removeGoBackListener();
      };
    }
  }
  disconnectedCallback() {
    const frameName = this.frameName;
    if (frameName) {
      QueryController.remove(frameName);
    }
    if (this.onFrameUnmount) {
      this.onFrameUnmount();
    }
  }
};
customElements.define("jsxte-web-frame", JsxteWebFrame, { extends: "div" });
