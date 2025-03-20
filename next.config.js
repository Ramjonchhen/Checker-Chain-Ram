/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["@multiversx/sdk-dapp"])

const path = require("path")

const nextConfig = withTM({
  reactStrictMode: true,
  images: {
    loader: "akamai",
    domains: ["*"],
    path: ""
  },
  env: {
    APP_URL: process.env.APP_URL
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    })
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    config.resolve.modules.push(path.resolve("./"))

    return config
  }
})
module.exports = nextConfig
