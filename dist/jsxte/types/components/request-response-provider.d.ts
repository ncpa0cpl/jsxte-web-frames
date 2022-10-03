import type { Request, Response } from "express";
import type { ContextMap } from "jsxte";
export declare const RequestResponseProvider: (props: JSXTE.PropsWithChildren<{
    req: Request;
    res: Response;
}>, context: ContextMap) => JSX.Element;
