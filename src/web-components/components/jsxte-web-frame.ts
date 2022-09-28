import type { WebFrameAttributes } from "../../shared/web-component-attribute-types";
import { NavigationEventEmitter } from "../navigation-event-emitter/navigation-event-emitter";
import { QueryController } from "../query-controller/query-controller";
import type { FrameLink } from "./frame-link";

class JsxteWebFrame extends HTMLDivElement {
  private onFrameUnmount: (() => void) | undefined = undefined;
  private history: string[] = []; // TODO: make history persistent

  constructor() {
    super();

    if (!this.frameName) {
      this.warnMissingName();
      return;
    }

    const persistedUrl = QueryController.get(this.frameName);
    const initialUrl = this.initialUrl;

    if (!this.isPreloaded)
      if (this.persistentState && persistedUrl !== null) {
        this.loadFrame(persistedUrl);
      } else if (initialUrl) {
        this.loadFrame(initialUrl);
      }
  }

  private setContent(html: string) {
    this.innerHTML = html;
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

  private async loadFrame(url: string) {
    this.validateUrl(url);

    const frameName = this.frameName;

    if (this.persistentState && frameName) {
      QueryController.set(frameName, url);
    }

    this.history.push(url);

    const response = await fetch(url, { method: "GET" });

    if (response.ok) this.setContent(await response.text());
    else this.setContent(this.getFailureComponent());
  }

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

  private getFailureComponent() {
    // eslint-disable-next-line quotes
    return /* html */ `<h2 style="color: red;">Something went wrong.</h2>`;
  }

  private retrieveCustomAttribute<T extends keyof WebFrameAttributes>(
    name: T
  ): WebFrameAttributes[T] | undefined {
    return this.getAttribute(name) as WebFrameAttributes[T];
  }

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

  connectedCallback() {
    if (this.frameName) {
      const removeNavListener = NavigationEventEmitter.on(
        "navigate",
        (event) => {
          if (event.frame === this.frameName) {
            this.loadFrame(event.url);
          }
        }
      );

      const removeGoBackListener = NavigationEventEmitter.on(
        "goback",
        (event) => {
          if (event.frame === this.frameName) {
            this.history.pop();
            const url = this.history[this.history.length - 1];
            if (url) this.loadFrame(url);
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
}

customElements.define("jsxte-web-frame", JsxteWebFrame, { extends: "div" });
