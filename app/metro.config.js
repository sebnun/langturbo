const { getSentryExpoConfig } = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname, {
  annotateReactComponents: true,
});

// https://github.com/expo/expo/issues/36384
// And better auth
config.resolver.unstable_enablePackageExports = true;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "zustand" || moduleName.startsWith("zustand/")) {
    //? Resolve to its CommonJS entry (fallback to main/index.js)
    return {
      type: "sourceFile",
      //? require.resolve will pick up the CJS entry (index.js) since "exports" is bypassed
      filePath: require.resolve(moduleName),
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
