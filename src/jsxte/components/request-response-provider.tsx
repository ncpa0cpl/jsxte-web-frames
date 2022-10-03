import type { Request, Response } from "express";
import type { ContextMap } from "jsxte";
import { RequestResponseContext } from "../contexts/request-response-context";

export const RequestResponseProvider = (
  props: JSXTE.PropsWithChildren<{
    req: Request;
    res: Response;
  }>,
  context: ContextMap
) => {
  context.set(RequestResponseContext, {
    req: props.req,
    res: props.res,
  });

  return <>{props.children}</>;
};
