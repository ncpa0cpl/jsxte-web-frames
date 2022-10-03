import { type Express } from "express";
import "jsxte";
export declare const registerFrameView: <P extends string>(server: Express, path: P, FrameView: JSXTE.Component) => void;
export declare const resolveFrameView: (url: string) => JSX.Element | undefined;
