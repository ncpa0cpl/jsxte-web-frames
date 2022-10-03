import type { Request, Response } from "express";
import { defineContext } from "jsxte";

export const RequestResponseContext = defineContext<{
  req: Request;
  res: Response;
}>();
