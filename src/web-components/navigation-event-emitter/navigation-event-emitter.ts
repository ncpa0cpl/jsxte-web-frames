export type NavigationEventData = {
  frame: string;
  url: string;
};

export type NavigationEventListener = (params: NavigationEventData) => void;

export type EventType = "navigate" | "goback" | "has-navigated";

export type Event<T extends EventType> = {
  navigate: NavigationEventData;
  goback: { frame: string };
  "has-navigated": null;
}[T];

export class NavigationEventEmitter {
  private static listeners = new Map<EventType, Event<any>[]>();

  static emit<T extends EventType>(name: T, value: Event<T>) {
    for (const listener of this.listeners.get(name) ?? []) {
      setTimeout(() => listener(value), 0);
    }
  }

  static on<T extends EventType>(name: T, callback: (value: Event<T>) => void) {
    const listeners = this.listeners.get(name) ?? [];
    listeners.push(callback);
    this.listeners.set(name, listeners);

    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }
}
