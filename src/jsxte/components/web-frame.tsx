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
  onLoad?: () => JSX.Element;
  onError?: (
    reloadButton: JSXTE.Component<JSX.IntrinsicElements["button"]>
  ) => JSX.Element;
}>;

export const WebFrame = (
  props: WebFrameProps,
  context: ContextMap
): JSX.Element => {
  const stack = context.has(WebFrameContext)
    ? context.get(WebFrameContext).stack
    : [];

  let content = props.children;
  let url = props.initialUrl ?? "";

  if (props.persistentState !== false) {
    const queryParams = context.has(QueryParamsContext)
      ? context.get(QueryParamsContext)
      : {};

    if (`wf-${props.name}` in queryParams) {
      const newUrl = queryParams[`wf-${props.name}`];
      if (newUrl !== undefined) {
        if (typeof newUrl === "string") url = newUrl;
        else if (newUrl.length > 0) url = newUrl[0]!;
      }
    }
  }

  if (!props.dontPreload && !!url) {
    const c = resolveFrameView(url);
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

  const renderReloadButton = (props: JSX.IntrinsicElements["button"]) => {
    return <button data-frame-reload {...props} />;
  };

  return (
    <div {...forwardedProps} is="jsxte-web-frame" {...frameProps}>
      <template class="on-load-template">
        <div class="web-frame-loader">
          {props.onLoad ? props.onLoad() : <h3>Loading...</h3>}
        </div>
      </template>
      <template class="on-error-template">
        <div class="web-frame-error">
          {props.onError ? (
            props.onError(renderReloadButton)
          ) : (
            <h3>Something went wrong.</h3>
          )}
        </div>
      </template>
      <div class="web-frame-content">{content}</div>
    </div>
  );
};
