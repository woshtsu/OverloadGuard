module.exports = {
  apps: [{
    name: "overloadGuard",
    script: "src/server.js",
    watch: true,
    esm: true,
    env: {
      "NODE_ENV": "development"
    }
  }]
};

