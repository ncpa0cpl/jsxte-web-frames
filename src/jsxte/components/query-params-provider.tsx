import type { ContextMap } from "jsxte";
import { QueryParamsContext } from "../contexts/query-params-context";

export const QueryParamsProvider = (
  props: JSXTE.PropsWithChildren<{
    params: Record<string, string | string[]>;
  }>,
  context: ContextMap
) => {
  if (context.has(QueryParamsContext))
    context.update(QueryParamsContext, props.params);
  else context.set(QueryParamsContext, props.params);

  return <>{props.children}</>;
};
