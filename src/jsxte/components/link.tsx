import type { AnchorTagProps, ContextMap, HTMLProps } from "jsxte";
import type { FrameLinkAttributes } from "../../shared/web-component-attribute-types";
import { WebFrameContext } from "../contexts/web-frame-context";

export type LinkProps = {
  href: string;
  frameName?: string;
} & HTMLProps<AnchorTagProps>;

export const Link = (props: LinkProps, context: ContextMap): JSX.Element => {
  const { href, frameName, ...rest } = props;

  if (frameName) {
    const linkProps: FrameLinkAttributes = {
      "data-frame": frameName,
      "data-href": href,
    };

    return <a is="frame-link" {...linkProps} {...rest} />;
  }

  if (context.has(WebFrameContext)) {
    const ctxFrameName = context.get(WebFrameContext).frameName;
    const linkProps: FrameLinkAttributes = {
      "data-frame": ctxFrameName,
      "data-href": href,
    };

    return <a is="frame-link" {...linkProps} {...rest} />;
  }

  const linkProps: FrameLinkAttributes = {
    "data-href": href,
  };

  return <a is="frame-link" {...linkProps} {...rest} />;
};
