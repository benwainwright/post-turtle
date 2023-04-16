const { config } = require("@swc/core/spack");

module.exports = config({
  entry: __dirname + "/src/run.tsx",
  path: __dirname + "/dist",
  target: "node",
});
