export type FrameLinkAttributes = {
  "data-frame"?: string;
  "data-href": string;
  "data-location-hash"?: string;
};

export type WebFrameAttributes = {
  "data-initial-url"?: string;
  "data-name": string;
  "data-allow-external-domains"?: "true" | "false";
  "data-allowed-domains"?: string;
  "data-persistent-state"?: "true" | "false";
  "data-is-preloaded"?: "true" | "false";
  "data-min-load-time"?: `${number}`;
};
