import type { FrameLinkAttributes } from "../../shared/web-component-attribute-types";
import { NavigationEventEmitter } from "../navigation-event-emitter/navigation-event-emitter";
import { QueryController } from "../query-controller/query-controller";

export class FrameLink extends HTMLAnchorElement {
  private onLinkUnmount: (() => void) | undefined = undefined;

  constructor() {
    super();
  }

  private updateOwnHref() {
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

      this.href = href.toString();
    }
  }

  private handleClick = (event: MouseEvent) => {
    const frameName = this.frameName;
    const url = this.frameHref;

    if (frameName && url) {
      event.preventDefault();
      NavigationEventEmitter.emit("navigate", { frame: frameName, url });
    }
  };

  private retrieveCustomAttribute<T extends keyof FrameLinkAttributes>(
    name: T
  ): FrameLinkAttributes[T] | undefined {
    return this.getAttribute(name) as FrameLinkAttributes[T];
  }

  private setCustomAttribute<T extends keyof FrameLinkAttributes>(
    name: T,
    value: Exclude<FrameLinkAttributes[T], undefined>
  ): void {
    this.setAttribute(name, value);
  }

  proposeOwner(frame: string) {
    if (!this.frameName) {
      this.setCustomAttribute("data-frame", frame);
      this.updateOwnHref();
    }
  }

  get frameName() {
    return this.retrieveCustomAttribute("data-frame");
  }

  get frameHref() {
    return this.retrieveCustomAttribute("data-href");
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
    if (this.onLinkUnmount) this.onLinkUnmount();
  }
}

customElements.define("frame-link", FrameLink, { extends: "a" });
