import type { FrameLinkAttributes } from "../../shared/web-component-attribute-types";
import { NavigationEventEmitter } from "../navigation-event-emitter/navigation-event-emitter";
import { QueryController } from "../query-controller/query-controller";

export class FrameLink extends HTMLAnchorElement {
  private onLinkUnmount: (() => void) | undefined = undefined;

  // #region Utility Methods

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

      href.hash = this.locationHash ?? "";

      this.href = href.toString();
    }
  }

  // #endregion

  // #region Custom Attribute Getters

  get frameName() {
    return this.retrieveCustomAttribute("data-frame");
  }

  get frameHref() {
    return this.retrieveCustomAttribute("data-href");
  }

  get locationHash() {
    return this.retrieveCustomAttribute("data-location-hash");
  }

  // #endregion

  // #region Click Handler

  private handleClick = (event: MouseEvent) => {
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

  // #endregion

  // #region Public Methods

  proposeOwner(frame: string) {
    if (!this.frameName) {
      this.setCustomAttribute("data-frame", frame);
      this.updateOwnHref();
    }
  }

  // #endregion

  // #region Lifecycle Methods

  protected connectedCallback() {
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

  protected disconnectedCallback() {
    if (this.onLinkUnmount) this.onLinkUnmount();
  }

  // #endregion
}

customElements.define("frame-link", FrameLink, { extends: "a" });
