interface Workbox {
  addEventListener(event: string, callback: () => void): void;
  register(): void;
  messageSkipWaiting(): void;
}

declare global {
  interface Window {
    workbox?: Workbox;
  }
}
