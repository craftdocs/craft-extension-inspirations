import React from "react";
import { Main } from "./main";
import { FindAndReplace } from "./find_and_replace";
import { AdvancedSelection } from "./advanced_selection";
import { AdvancedActions } from "./advanced_actions";

export type PageMode = "main" | "findAndReplace" | "advancedSelection" | "advancedActions";

interface PageProps {
  mode: PageMode;
  setMode: (mode: PageMode) => void;
}

export const Page: React.FC<PageProps> = ( { mode, setMode }) => {
  const setModeCallback = React.useCallback((mode: PageMode) => {
    setMode(mode);
  }, [mode]);

  switch (mode) {
    case "main":
      return <Main setMode={setModeCallback} />;
    case "findAndReplace":
      return <FindAndReplace />;
    case "advancedSelection":
      return <AdvancedSelection />;
    case "advancedActions":
      return <AdvancedActions />;
  }
}