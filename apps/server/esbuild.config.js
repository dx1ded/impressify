const esBuildPluginTsc = require("esbuild-plugin-tsc")

module.exports = {
  sourcemap: process.env.NODE_ENV === "development",
  plugins: [
    esBuildPluginTsc({
      tsconfigPath: "apps/server/tsconfig.json"
    })
  ],
  outExtension: {
    ".js": ".js"
  }
}
