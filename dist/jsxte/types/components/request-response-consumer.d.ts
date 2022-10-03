import type { Request, Response } from "express";
import type { ContextMap } from "jsxte";
export declare const RequestResponseConsumer: (props: {
    render: (props: {
        req?: Request;
        res?: Response;
    }) => JSX.Element;
}, context: ContextMap) => JSX.Element;
