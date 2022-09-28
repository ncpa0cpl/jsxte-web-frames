import type { AnchorTagProps, ContextMap, HTMLProps } from "jsxte";
import type { FrameLinkAttributes } from "../../shared/web-component-attribute-types";
import { WebFrameContext } from "../contexts/web-frame-context";

export type LinkProps = {
  href: string;
  frameName?: string;
} & HTMLProps<AnchorTagProps>;

export const Link = (props: LinkProps, context: ContextMap): JSX.Element => {
  const { href, frameName, ...rest } = props;

  const linkProps: Partial<FrameLinkAttributes> = {};
  const params = new URLSearchParams();

  linkProps["data-href"] = href;

  if (context.has(WebFrameContext)) {
    const frameStack = context.get(WebFrameContext).stack;

    for (const frame of frameStack) {
      params.set(`wf-${frame.name}`, frame.initialUrl);
    }
  }

  if (frameName) {
    linkProps["data-frame"] = frameName;
    params.delete(frameName);
    params.set(`wf-${frameName}`, href);
  } else if (context.has(WebFrameContext)) {
    const ctxFrameName = context.get(WebFrameContext).frameName;

    linkProps["data-frame"] = ctxFrameName;
    params.delete(`wf-${ctxFrameName}`);
    params.set(`wf-${ctxFrameName}`, href);
  }

  return (
    <a
      is="frame-link"
      href={"./?" + params.toString()}
      {...linkProps}
      {...rest}
    />
  );
};
