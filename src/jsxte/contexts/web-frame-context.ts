import { defineContext } from "jsxte";

export const WebFrameContext = defineContext<{
  frameName: string;
  stack: { name: string; initialUrl: string }[];
}>();
