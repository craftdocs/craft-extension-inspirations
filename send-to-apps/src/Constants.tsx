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
  app: string
}

const darkModeColors: Colors = {
  text: {
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
  app: "#222222"
};

const lightModeColors: Colors = {
  text: {
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
  app: "transparent"
};

export const COLORS = (isDarkMode: boolean): Colors => isDarkMode ? darkModeColors : lightModeColors;

export const COPY = {
  sendTo: "Send to...",
  transferYourContent: "Transfer your content with one click to either of the applications below.",
  ifYouHaveBlocksSelected: "If you have blocks selected, it will send the selection only, otherwise the currently opened page.",
  youllNeedToInstall: "You'll need to install the selected app first on your Mac in order for this extension to work.",
  hideMessage: "Hide Message",
  help: "Help",
  installApp: "Install App",
  removeFromList: "Remove From List"
};
