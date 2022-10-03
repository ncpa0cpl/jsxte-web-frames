import type { Request, Response } from "express";
import { type Express } from "express";
import "jsxte";
declare type RouteFrameViewComponent = JSXTE.Component<{
    req?: Request;
    res?: Response;
}>;
export declare const registerFrameView: <P extends string>(server: Express, path: P, FrameView: RouteFrameViewComponent) => void;
export declare const resolveFrameView: (url: string) => JSX.Element | undefined;
export {};
