import { Blog } from "./AppState";

export const CONFIG = {
  ui: {
    borderRadius: 4,
    emphasis: {
      fontSize: 13,
      fontWeight: 700,
    },
    normal: {
      fontSize: 11,
      fontWeight: 500,
    }
  }
};

interface Colors {
  text: {
    full: string,
    strong: string,
    medium: string,
    pale: string,
    error: string,
  },
  background: {
    idle: {
      pale: string;
      shaded: string;
    },
    hover: {
      pale: string;
      shaded: string;
    },
    error: string;
  },
  shadow: {
    idle: string,
    hover: string
  },
  border: {
    normal: string;
    error: string;
  },
  app: string,
  craftBlue: string,
}

const darkModeColors: Colors = {
  text: {
    full: "rgb(244, 244, 244)",
    strong: "rgba(244, 244, 244, 0.9)",
    medium: "rgba(244, 244, 244, 0.7)",
    pale: "rgba(244, 244, 244, 0.4)",
    error: "rgba(209, 85, 85, 0.9)"
  },
  background: {
    idle: {
      pale: "rgb(57, 58, 59)",
      shaded: "rgb(47, 48, 49)",
    },
    hover: {
      pale: "rgb(45, 45, 45)",
      shaded: "rgb(45, 45, 45)"
    },
    error: "rgba(209, 171, 171, 0.9)"
  },
  shadow: {
    idle: "transparent",
    hover: "transparent"
  },
  border: {
    normal: "rgb(56, 56, 56)",
    error: "rgba(209, 45, 45, 0.9)"
  },
  app: "#222222",
  craftBlue: "rgb(49, 103, 226)",
};

const lightModeColors: Colors = {
  text: {
    full: "rgb(0, 0, 0)",
    strong: "rgba(0, 0, 0, 0.9)",
    medium: "rgba(0, 0, 0, 0.7)",
    pale: "rgba(0, 0, 0, 0.4)",
    error: "rgba(209, 85, 85, 0.9)"
  },
  background: {
    idle: {
      pale: "#fcfcfc",
      shaded: "#fafafa"
    },
    hover: {
      pale: "#fefefe",
      shaded: "#f1f1f1"
    },
    error: "rgba(209, 171, 171, 0.9)"
  },
  shadow: {
    idle: "#efefef",
    hover: "#e9e9e9"
  },
  border: {
    normal: "#ececec",
    error: "rgba(209, 45, 45, 0.9)"
  },
  app: "transparent",
  craftBlue: "rgb(49, 103, 226)",
};

export const COLORS = (isDarkMode: boolean): Colors => isDarkMode
  ? darkModeColors
  : lightModeColors;

export const COPY = {
  appName: "Export to Blogs",
  platformHelp: "Exporting to Blogs is not supported in the web app",
  close: "Close",
  apiKey: "API Key",
  siteURL: "Site Url",
  blog: {
    ghost: "Publish to Ghost",
    medium: "Publish to Medium"
  },
  publish: {
    ghost: "Publish to Ghost",
    medium: "Publish to Medium.com"
  },
  config: {
    hide: "Hide Configuration",
    show: "Show Configuration",
  },
  console: "Console",
  exporting: (blog: Blog) => `Publishing to ${blog}...`,
  epxorted: (blog: Blog) => `Published page to ${blog}!`,
  problem: (blog: Blog) => `Problem publishing to ${blog}! Check the logs`
};