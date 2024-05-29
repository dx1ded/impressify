const esBuildPluginTsc = require("esbuild-plugin-tsc")

module.exports = {
  sourcemap: true,
  plugins: [esBuildPluginTsc({
    tsconfigPath: "apps/server/tsconfig.app.json"
  })],
  outExtension: {
    ".js": ".js"
  }
}
