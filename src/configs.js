import spokeIcon from "./assets/spoke-icon.png";
import educamakerLogo from "./assets/educamaker-logo.png";

// Read configs from meta tags if available, otherwise use the process.env injected from build.
const configs = {};
const get = (configs, key, defaultValue) => {
  const el = document.querySelector(`meta[name='env:${key.toLowerCase()}']`);
  if (el) {
    configs[key] = el.getAttribute("content");
  } else {
    configs[key] = defaultValue;
  }
};

get(configs, "HUBS_SERVER", process.env.HUBS_SERVER);
get(configs, "RETICULUM_SERVER", process.env.RETICULUM_SERVER);
get(configs, "THUMBNAIL_SERVER", process.env.THUMBNAIL_SERVER);
get(configs, "CORS_PROXY_SERVER", process.env.CORS_PROXY_SERVER);
get(configs, "NON_CORS_PROXY_DOMAINS", process.env.NON_CORS_PROXY_DOMAINS);
get(configs, "SENTRY_DSN", process.env.SENTRY_DSN);
get(configs, "GA_TRACKING_ID", process.env.GA_TRACKING_ID);
get(configs, "BASE_ASSETS_PATH", process.env.BASE_ASSETS_PATH);
get(configs, "IS_MOZ", process.env.IS_MOZ);

if (configs.BASE_ASSETS_PATH) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = configs.BASE_ASSETS_PATH;
}

function fixBaseAssetsPath(path) {
  // eslint-disable-next-line no-undef
  const publicPath = __webpack_public_path__ || "";
  if (!path.startsWith(publicPath)) {
    const normalizedPublicPath = publicPath.endsWith("/") ? publicPath : `${publicPath}/`;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

    if (normalizedPublicPath.endsWith("/assets/") && normalizedPath.startsWith("assets/")) {
      return normalizedPublicPath + normalizedPath.slice("assets/".length);
    }

    return normalizedPublicPath + normalizedPath;
  }

  return path;
}

configs.isMoz = () => configs.IS_MOZ === "true";
configs.name = () => (configs.isMoz() ? "Spoke" : "Scene Editor");
configs.longName = () => (configs.isMoz() ? "Spoke by the Hubs Community" : "Scene Editor");
configs.icon = () => (configs.isMoz() ? fixBaseAssetsPath(spokeIcon) : fixBaseAssetsPath(educamakerLogo));

export default configs;
