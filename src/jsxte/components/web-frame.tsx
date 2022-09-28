import "jsxte";
import type { ContextMap } from "jsxte";
import type { WebFrameAttributes } from "../../shared/web-component-attribute-types";
import { QueryParamsContext } from "../contexts/query-params-context";
import { WebFrameContext } from "../contexts/web-frame-context";
import { resolveFrameView } from "../register-frame-view";

declare global {
  namespace JSXTE {
    interface BaseHTMLTagProps {
      is?: string;
    }
  }
}

export type WebFrameProps = JSXTE.PropsWithChildren<{
  name: string;
  initialUrl?: string;
  allowExternalDomains?: boolean;
  allowedDomains?: string[];
  persistentState?: boolean;
  children?: JSXTE.ElementChildren;
  containerProps?: JSX.IntrinsicElements["div"];
  dontPreload?: boolean;
}>;

export const WebFrame = async (
  props: WebFrameProps,
  context: ContextMap
): Promise<JSX.Element> => {
  const stack = context.has(WebFrameContext)
    ? context.get(WebFrameContext).stack
    : [];

  const queryParams = context.has(QueryParamsContext)
    ? context.get(QueryParamsContext)
    : {};

  let content = props.children;
  let url = props.initialUrl ?? "";

  if (`wf-${props.name}` in queryParams) {
    const newUrl = queryParams[`wf-${props.name}`];
    if (newUrl !== undefined) {
      if (typeof newUrl === "string") url = newUrl;
      else if (newUrl.length > 0) url = newUrl[0]!;
    }
  }

  if (!props.dontPreload && !!url) {
    const c = await resolveFrameView(url);
    if (c) content = c;
  }

  context.set(WebFrameContext, {
    frameName: props.name,
    stack: [
      ...stack,
      {
        name: props.name,
        initialUrl: url,
      },
    ],
  });

  const frameProps: WebFrameAttributes = {
    "data-initial-url": url,
    "data-name": props.name,
    "data-allow-external-domains": props.allowExternalDomains
      ? "true"
      : "false",
    "data-allowed-domains": props.allowedDomains?.join(";"),
    "data-persistent-state": props.persistentState ?? true ? "true" : "false",
    "data-is-preloaded": content ? "true" : "false",
  };

  const { is, children, ...forwardedProps } = props.containerProps ?? {};

  return (
    <div {...forwardedProps} is="jsxte-web-frame" {...frameProps}>
      {content}
    </div>
  );
};
