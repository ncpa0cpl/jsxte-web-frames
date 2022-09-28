import { type Express } from "express";
import "jsxte";
import { renderToHtmlAsync } from "jsxte";
import { QueryParamsProvider } from "./components/query-params-provider";

type ParsedUrl = {
  params: Record<string, string>;
  query: URLSearchParams;
};

class PatternParameter {
  constructor(public name: string, public pattern: string) {}
}

class Route {
  private pathPattern: string;
  private patternParts: Array<string | PatternParameter>;

  constructor(pathPattern: string, public Component: JSXTE.Component) {
    this.pathPattern = pathPattern;
    this.patternParts = pathPattern
      .split("/")
      .filter((p) => p)
      .map((part) => {
        if (part.startsWith(":")) {
          return new PatternParameter(part.slice(1), part);
        }
        return part;
      });
  }

  matches(path: string): boolean {
    const url = new URL(path, "http://localhost");
    const pathParts = url.pathname.split("/").filter((p) => p);

    if (pathParts.length !== this.patternParts.length) {
      return false;
    }

    for (const [index, part] of pathParts.entries()) {
      const patternPart = this.patternParts[index];
      if (typeof patternPart !== "string") continue;
      if (patternPart !== part) {
        return false;
      }
    }

    return true;
  }

  parseUrl(path: string): ParsedUrl {
    const url = new URL(path, "http://localhost");
    const pathParts = url.pathname.split("/").filter((p) => p);
    const params: Record<string, string> = {};

    for (const [index, part] of pathParts.entries()) {
      const patternPart = this.patternParts[index];

      if (!patternPart) throw new Error("Url cannot be parsed.");

      if (typeof patternPart === "string") continue;
      params[patternPart.name] = part;
    }

    return { params, query: url.searchParams };
  }
}

class FrameViewRoutes {
  private static routes: Array<Route> = [];

  static addRoute(pathPattern: string, Component: JSXTE.Component): void {
    this.routes.push(new Route(pathPattern, Component));
  }

  static resolveRoute(
    path: string
  ): (ParsedUrl & { Component: JSXTE.Component }) | undefined {
    for (const route of this.routes) {
      if (route.matches(path)) {
        return { ...route.parseUrl(path), Component: route.Component };
      }
    }
  }
}

export const registerFrameView = <P extends string>(
  server: Express,
  path: P,
  FrameView: JSXTE.Component
) => {
  server.get(path, async (req, res) => {
    const queryParams: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(req.query)) {
      if (Array.isArray(value) && !value.some((v) => typeof v !== "string")) {
        queryParams[key] = value as string[];
      } else if (typeof value === "string") {
        queryParams[key] = [value];
      }
    }

    res.send(
      await renderToHtmlAsync(
        <QueryParamsProvider params={queryParams}>
          <FrameView />
        </QueryParamsProvider>
      )
    );
  });

  FrameViewRoutes.addRoute(path, FrameView);
};

export const resolveFrameView = (url: string) => {
  const resolvedRoute = FrameViewRoutes.resolveRoute(url);

  if (!resolvedRoute) return;

  return renderToHtmlAsync(
    <QueryParamsProvider
      params={Object.fromEntries(resolvedRoute.query.entries())}
    >
      <resolvedRoute.Component />
    </QueryParamsProvider>
  );
};
