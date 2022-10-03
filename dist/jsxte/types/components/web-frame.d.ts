import "jsxte";
import type { ContextMap } from "jsxte";
declare global {
    namespace JSXTE {
        interface BaseHTMLTagProps {
            is?: string;
        }
    }
}
export declare type WebFrameProps = JSXTE.PropsWithChildren<{
    name: string;
    initialUrl?: string;
    allowExternalDomains?: boolean;
    allowedDomains?: string[];
    persistentState?: boolean;
    children?: JSXTE.ElementChildren;
    containerProps?: JSX.IntrinsicElements["div"];
    dontPreload?: boolean;
    onLoad?: () => JSX.Element;
    onError?: (reloadButton: JSXTE.Component<JSX.IntrinsicElements["button"]>) => JSX.Element;
}>;
export declare const WebFrame: (props: WebFrameProps, context: ContextMap) => JSX.Element;
