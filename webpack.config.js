const path = require("path");

module.exports = {
  entry: "./public/script.js", // Entry point for bundling (path to your script.js file)
  output: {
    filename: "bundle.js", // Output bundled file name
    path: path.resolve(__dirname, "public"), // Output directory (use public directory to serve it)
  },
  externals: {
    uppy: "require('@uppy/core')",
  },
};
