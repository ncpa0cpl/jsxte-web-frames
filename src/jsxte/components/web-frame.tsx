import "jsxte";
import type { ContextMap } from "jsxte";
import type { WebFrameAttributes } from "../../shared/web-component-attribute-types";
import { WebFrameContext } from "../contexts/web-frame-context";

declare global {
  namespace JSXTE {
    interface BaseHTMLTagProps {
      is?: string;
    }
  }
}

export type WebFrameProps = {
  initialUrl: string;
  name: string;
  allowExternalDomains?: boolean;
  allowedDomains?: string[];
  persistentState?: boolean;
};

export const WebFrame = (
  props: WebFrameProps,
  context: ContextMap
): JSX.Element => {
  context.set(WebFrameContext, { frameName: props.name });

  const frameProps: WebFrameAttributes = {
    "data-initial-url": props.initialUrl,
    "data-name": props.name,
    "data-allow-external-domains": props.allowExternalDomains
      ? "true"
      : "false",
    "data-allowed-domains": props.allowedDomains?.join(";"),
    "data-persistent-state": props.persistentState ?? true ? "true" : "false",
  };

  return <div is="jsxte-web-frame" {...frameProps} />;
};
