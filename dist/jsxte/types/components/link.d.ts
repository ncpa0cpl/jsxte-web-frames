import type { AnchorTagProps, ContextMap, HTMLProps } from "jsxte";
export declare type LinkProps = {
    href: string;
    frameName?: string;
} & HTMLProps<AnchorTagProps>;
export declare const Link: (props: LinkProps, context: ContextMap) => JSX.Element;
