const esBuildPluginTsc = require("esbuild-plugin-tsc")

module.exports = {
  sourcemap: true,
  plugins: [
    esBuildPluginTsc({
      tsconfigPath: "apps/server/tsconfig.json"
    })
  ],
  outExtension: {
    ".js": ".js"
  }
}
