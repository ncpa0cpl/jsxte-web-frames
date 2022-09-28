const nodepack = require("@ncpa0cpl/nodepack");
const esbuild = require("esbuild");
const path = require("path");

/**
 * @param {string} p
 * @param {...string} rest
 */
function fromRoot(p, ...rest) {
  return path.resolve(__dirname, "../", p, ...rest);
}

async function main() {
  try {
    await Promise.all([
      nodepack.build({
        target: "es6",
        srcDir: fromRoot("src/jsxte"),
        outDir: fromRoot("dist/jsxte"),
        tsConfig: fromRoot("src/jsxte/tsconfig.build.json"),
        formats: ["cjs", "esm", "legacy"],
        declarations: true,
        exclude: /tsconfig/,
        esbuildOptions: { jsxImportSource: "jsxte" },
      }),
      esbuild.build({
        format: "esm",
        entryPoints: [fromRoot("src/web-components/index.ts")],
        bundle: true,
        outfile: fromRoot("dist/web-components/index.js"),
        platform: "browser",
        tsconfig: fromRoot("src/web-components/tsconfig.build.json"),
      }),
    ]);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
