import { NavigationEventEmitter } from "../navigation-event-emitter/navigation-event-emitter";

export class QueryController {
  static generateKeyedNameFor(name: string) {
    return `wf-${name}`;
  }

  static set(name: string, value: string) {
    const [params, hash] = value.split("#") as [string] & string[];

    const url = new URL(window.location.href);
    url.searchParams.set(this.generateKeyedNameFor(name), params);
    window.history.pushState({}, "", url.href);
    window.location.hash = hash ? `#${hash}` : "";
    NavigationEventEmitter.emit("has-navigated", null);
  }

  static get(name: string) {
    const url = new URL(window.location.href);
    return url.searchParams.get(this.generateKeyedNameFor(name));
  }

  static remove(name: string) {
    const url = new URL(window.location.href);
    url.searchParams.delete(this.generateKeyedNameFor(name));
    window.history.replaceState({}, "", url.href);
  }

  static getAllKeyed() {
    const url = new URL(window.location.href);
    const params = new Map<string, string>();
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith("wf-")) {
        params.set(key, value);
      }
    }
    return params;
  }
}
