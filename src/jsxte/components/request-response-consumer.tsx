import type { Request, Response } from "express";
import type { ContextMap } from "jsxte";
import { RequestResponseContext } from "../contexts/request-response-context";

export const RequestResponseConsumer = (
  props: {
    render: (props: { req?: Request; res?: Response }) => JSX.Element;
  },
  context: ContextMap
) => {
  let req: Request | undefined = undefined,
    res: Response | undefined = undefined;

  if (context.has(RequestResponseContext)) {
    const requestResponse = context.get(RequestResponseContext);
    req = requestResponse.req;
    res = requestResponse.res;
  }

  return (
    <>
      {props.render({
        req,
        res,
      })}
    </>
  );
};
