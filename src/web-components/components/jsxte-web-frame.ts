import type { WebFrameAttributes } from "../../shared/web-component-attribute-types";
import { NavigationEventEmitter } from "../navigation-event-emitter/navigation-event-emitter";
import { QueryController } from "../query-controller/query-controller";
import type { FrameLink } from "./frame-link";

class JsxteWebFrame extends HTMLDivElement {
  private onFrameUnmount: (() => void) | undefined = undefined;
  private history: string[] = []; // TODO: make history persistent
  private onLoadTemplate: HTMLTemplateElement | null;
  private onErrorTemplate: HTMLTemplateElement | null;
  private contentContainer: HTMLDivElement | null;

  constructor() {
    super();

    this.onLoadTemplate = this.querySelector("> template.on-load-template");
    this.onErrorTemplate = this.querySelector("> template.on-error-template");
    this.contentContainer = this.querySelector("> div.web-frame-content");

    if (!this.frameName) {
      this.warnMissingName();
      return;
    }

    const persistedUrl = QueryController.get(this.frameName);
    const initialUrl = this.initialUrl;

    if (!this.isPreloaded)
      if (this.persistentState && persistedUrl !== null) {
        this.load(persistedUrl);
      } else if (initialUrl) {
        this.load(initialUrl);
      }
  }

  // #region Utility Methods

  private warnMissingName() {
    console.warn(
      "JsxteWebFrame: The frame name is missing. Please provide a name for the frame using the 'data-name' attribute."
    );
  }

  private validateUrl(url: string) {
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

  private retrieveCustomAttribute<T extends keyof WebFrameAttributes>(
    name: T
  ): WebFrameAttributes[T] | undefined {
    return this.getAttribute(name) as WebFrameAttributes[T];
  }

  // #endregion

  // #region Custom Attribute Getters

  get initialUrl(): string | undefined {
    return this.retrieveCustomAttribute("data-initial-url");
  }

  get frameName(): string | undefined {
    return this.retrieveCustomAttribute("data-name");
  }

  get allowExternalDomains(): boolean | undefined {
    const attribute = this.retrieveCustomAttribute(
      "data-allow-external-domains"
    );
    return attribute !== undefined ? Boolean(attribute) : undefined;
  }

  get allowedDomains(): string[] | undefined {
    return this.retrieveCustomAttribute("data-allowed-domains")?.split(";");
  }

  get persistentState(): boolean | undefined {
    const attribute = this.retrieveCustomAttribute("data-persistent-state");
    return attribute !== undefined ? Boolean(attribute) : undefined;
  }

  get isPreloaded(): boolean | undefined {
    const attribute = this.retrieveCustomAttribute("data-is-preloaded");
    return attribute !== undefined ? Boolean(attribute) : undefined;
  }

  // #endregion

  // #region HTML Element Getters

  private getOnLoadTemplate(): HTMLTemplateElement {
    if (!this.onLoadTemplate) {
      throw new Error("JsxteWebFrame: .on-load-template element is missing.");
    }
    return this.onLoadTemplate;
  }

  private getOnErrorTemplate(): HTMLTemplateElement {
    if (!this.onErrorTemplate) {
      throw new Error("JsxteWebFrame: .on-error-template element is missing.");
    }
    return this.onErrorTemplate;
  }

  private getContentContainer(): HTMLDivElement {
    if (!this.contentContainer) {
      throw new Error("JsxteWebFrame: .web-frame-content element is missing.");
    }
    return this.contentContainer;
  }

  // #endregion

  // #region Rendering Methods

  private setContent(html: string) {
    const container = this.getContentContainer();

    container.innerHTML = html;
    const frameName = this.frameName;

    if (frameName) {
      const frameLinks = this.querySelectorAll(
        'a[is="frame-link"]'
      ) as NodeListOf<FrameLink | HTMLAnchorElement>;

      for (const anchor of frameLinks) {
        if ("proposeOwner" in anchor) anchor.proposeOwner(frameName);
      }
    }
  }

  private renderLoader() {
    this.setContent(this.getOnLoadTemplate().innerHTML);
  }

  private renderError() {
    this.setContent(this.getOnErrorTemplate().innerHTML);

    const reloadButtons = this.querySelectorAll(
      "div.web-frame-error button[data-frame-reload]"
    );

    for (const button of reloadButtons) {
      button.addEventListener("click", () => this.reload());
    }
  }

  // #endregion

  // #region Load/Reload Methods

  private async reload() {
    const lastUrl = this.history[this.history.length - 1];

    if (lastUrl) {
      this.renderLoader();
      try {
        const response = await fetch(lastUrl, { method: "GET" });
        const responseData = await response.text();

        if (response.ok) this.setContent(responseData);
        else this.renderError();
      } catch (e) {
        this.renderError();
      }
    }
  }

  private async load(url: string) {
    this.validateUrl(url);

    const frameName = this.frameName;

    if (this.persistentState && frameName) {
      QueryController.set(frameName, url);
    }

    this.history.push(url);

    this.renderLoader();
    try {
      const response = await fetch(url, { method: "GET" });
      const responseData = await response.text();

      if (response.ok) this.setContent(responseData);
      else this.renderError();
    } catch (e) {
      this.renderError();
    }
  }

  // #endregion

  // #region Lifecycle Methods

  protected connectedCallback() {
    this.style.display = "contents";

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
            if (url) this.load(url);
          }
        }
      );

      this.onFrameUnmount = () => {
        removeNavListener();
        removeGoBackListener();
      };
    }
  }

  protected disconnectedCallback() {
    const frameName = this.frameName;

    if (frameName) {
      QueryController.remove(frameName);
    }

    if (this.onFrameUnmount) {
      this.onFrameUnmount();
    }
  }

  // #endregion
}

customElements.define("jsxte-web-frame", JsxteWebFrame, { extends: "div" });
