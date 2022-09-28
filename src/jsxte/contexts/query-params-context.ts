import { defineContext } from "jsxte";

export const QueryParamsContext =
  defineContext<Record<string, string | string[]>>();
