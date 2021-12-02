import React from "react";
import { PageMode } from "./page";
import "../style.css";

interface MainProps {
  setMode: (mode: PageMode) => void;
}

export enum BlockStyleAction {
  addBold = "addBold",
  removeBold = "removeBold",
  addItalic = "addItalic",
  removeItalic = "removeItalic",
  addHighlight = "addHighlight",
  removeHighlight = "removeHighlight",
}

export const Main: React.FC<MainProps> = ({ setMode }) => {
  const onFindAndReplaceSelected = (event: React.MouseEvent<HTMLDivElement>) => {
    setMode("findAndReplace");
  };

  const onAdvancedSelectionSelected = (event: React.MouseEvent<HTMLDivElement>) => {
    setMode("advancedSelection");
  };

  const onAdvancedActionsSelected = (event: React.MouseEvent<HTMLDivElement>) => {
    setMode("advancedActions");
  };

  return <main className="flex-1 overflow-y-auto">
    <div id="mainMenu" className="mx-2 mt-2 mb-4">
  {/* FIND AND REPLACE */}
  <div className="gridItem" onClick={onFindAndReplaceSelected}>
    <div>
      <span className="gridItem_icon bg-pink-50 text-pink-700">
      {/* Heroicon name: document-search */}
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
        </svg>
      </span>
    </div>
    <div className="mt-2 cursor-pointer">
      <h3 className="text-base font-medium">
        <div id="mainMenu_find_and_replace" className="focus:outline-none">
          {/* Extend touch target to entire panel */}
          <span className="absolute inset-0" aria-hidden="true"></span>
          Find & Replace
        </div>
      </h3>
      <p className="mt-0.5 text-sm text-secondaryText dark:text-secondaryText-dark">
        Use advanced & regex based queries to find & replace content 
      </p>
    </div>
    <span className="gridItem_arrow group-hover:text-gray-400 dark:group-hover:text-gray-100" aria-hidden="true">
        {/* Heroicon name: arrow-right */}
      <svg xmlns="http://www.w3.org/2000/svg" className="svgIcon" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </span>
  </div>
  {/* ADVANCED SELECTION */}
  <div className="gridItem" onClick={onAdvancedSelectionSelected}>
    <div>
      <span className="gridItem_icon bg-purple-50 text-purple-700">
        {/* Heroicon name: clipboard-list */}
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </span>
    </div>
    <div className="mt-2 cursor-pointer">
      <h3 className="text-base font-medium">
        <div id="mainMenu_advanced_selection" className="focus:outline-none">
          {/* Extend touch target to entire panel */}
          <span className="absolute inset-0" aria-hidden="true"></span>
          Advanced Selection
        </div>
      </h3>
      <p className="mt-0.5 text-sm text-secondaryText dark:text-secondaryText-dark">
       Select blocks on your page according to a diverse set of criterias
      </p>
    </div>
    <span className="gridItem_arrow group-hover:text-gray-400 dark:group-hover:text-gray-100" aria-hidden="true">
      {/* Heroicon name: arrow-right */}
      <svg xmlns="http://www.w3.org/2000/svg" className="svgIcon" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </span>
  </div>
  {/* ACTIONS */}
  <div className="gridItem" onClick={onAdvancedActionsSelected}>
    <div>
      <span className="gridItem_icon bg-blue-50 text-blue-700">
        {/* Heroicon name: ligthning-bolt */}
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
         </svg>
      </span>
    </div>
    <div className="mt-2 cursor-pointer">
      <h3 id="mainMenu_storageApi" className="text-base font-medium">
        <div className="focus:outline-none">
          {/* Extend touch target to entire panel */}
          <span className="absolute inset-0" aria-hidden="true"></span>
          Advanced Actions
        </div>
      </h3>
      <p className="mt-0.5 text-sm text-secondaryText dark:text-secondaryText-dark">
        Apply actions on selected blocks like sorting, styling and many more
      </p>
    </div>
    <span className="gridItem_arrow group-hover:text-gray-400 dark:group-hover:text-gray-100" aria-hidden="true">
      {/* Heroicon name: arrow-right */}
      <svg xmlns="http://www.w3.org/2000/svg" className="svgIcon" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </span>
  </div>
</div>
</main>;
}