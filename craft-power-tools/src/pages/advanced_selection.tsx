import React, { ChangeEvent } from "react";
import { createPattern, replaceInvalidCharacters } from "../utils";
import { executeSelectBlocks } from "../actions";
import { searchCasingModes, searchModes } from "../utils";

export const AdvancedSelection: React.FC<{}> = () => {
  // Constants
  const defaultSearchMode = searchModes[0];
  const defaultSearchCasing = searchCasingModes[0];

  const typeOptions = [
    new Option("Any Type", ""),
    new Option("Text", "textBlock"),
    new Option("Code", "codeBlock"),
    new Option("Table", "tableBlock"),
    new Option("Url", "urlBlock"),
    new Option("Image", "imageBlock"),
    new Option("Video", "videoBlock"),
    new Option("File", "fileBlock"),
    new Option("Drawing", "drawingBlock"),
    new Option("Line", "horizontalLineBlock"),
  ];

  const textStyleOptions = [
    new Option("Any Text Style", ""),
    new Option("Title", "title"),
    new Option("Subtitle", "subtitle"),
    new Option("Heading", "heading"),
    new Option("Strong", "strong"),
    new Option("Body", "body"),
    new Option("Caption", "caption"),
    new Option("Page", "page"),
    new Option("Card", "card")
  ];

  const listStyleOptions = [
    new Option("Any List Style", ""),
    new Option("Bullet", "bullet"),
    new Option("Numbered", "numbered"),
    new Option("Todo", "todo"),
    new Option("Toggle", "toggle"),
    new Option("No List Style", "none")
  ];

  const defaultTypeOption = typeOptions[0];
  const defaultTextStyleOption = textStyleOptions[0];
  const defaultListStyleOption = listStyleOptions[0];

  // State
  const [contentQuery, setContentQuery] = React.useState("");
  const [searchMode, setSearchMode] = React.useState<string>(defaultSearchMode);
  const [searchCasing, setSearchCasing] = React.useState<string>(defaultSearchCasing);

  const [typeQuery, setTypeQuery] = React.useState<string>(defaultTypeOption.value);
  const [textStyleQuery, setTextStyleQuery] = React.useState<string>(defaultTextStyleOption.value);
  const [listStyleQuery, setListStyleQuery] = React.useState<string>(defaultListStyleOption.value);

  const [isCustomQuery, setIsCustomQuery] = React.useState(false);
  const [customQueryValue, setCustomQueryValue] = React.useState<string>("");
  const [customQueryVisible, setCustomQueryVisible] = React.useState<boolean>(false);
  const [customQueryStyle, setCustomQueryStyle] = React.useState<any>({"display": "none"});

  // Events
  const onSearchModeChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchMode(event.target.value);
  }

  const onSearchCasingChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchCasing(event.target.value);
  }

  const onContentQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsCustomQuery(false);
    setContentQuery(event.target.value);
  };

  const onExecuteSelect = () => {
    executeSelectBlocks(replaceInvalidCharacters(customQueryValue));
  };

  const onTypeQueryChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setIsCustomQuery(false);
    setTypeQuery(event.target.value);
  }

  const onTextStyleQueryChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setIsCustomQuery(false);
    setTextStyleQuery(event.target.value);
  }

  const onListStyeQueryChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setIsCustomQuery(false);
    setListStyleQuery(event.target.value);
  };

  const onCustomQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomQueryValue(event.target.value);
    setIsCustomQuery(true);
    resetQueryOptions();
  };

  React.useEffect(() => {
    if (isCustomQuery) {
      return;
    }
    updateCustomQuery();
  }, [typeQuery, textStyleQuery, listStyleQuery, contentQuery, isCustomQuery, searchMode, searchCasing]);

  // Helpers
  function updateCustomQuery() {
    if (isCustomQuery) {
      return;
    }
    const contentQuery = generateContentQuery();
    const typeQuery = generateTypeQuery();
    const textStyleQuery = generateTextStyleQuery();
    const listStyleQuery = generateListStyleQuery();

    let finalQuery = "";

    if (contentQuery != null) {
      finalQuery += (finalQuery.length == 0 ? "" : " && ") + contentQuery;
    }
    if (typeQuery != null) {
      finalQuery += (finalQuery.length == 0 ? "" : " && ") + typeQuery;
    }
    if (textStyleQuery != null) {
      finalQuery += (finalQuery.length == 0 ? "" : " && ") + textStyleQuery;
    }
    if (listStyleQuery != null) {
      finalQuery += (finalQuery.length == 0 ? "" : " && ") + listStyleQuery;
    }

    if (finalQuery.length === 0) {
      finalQuery = "true";
    }

    setCustomQueryValue(finalQuery);
  }

  function addSlashes(str: string) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  }
  
  function generateTypeQuery(): string | null {
    switch (typeQuery) {
      case "":
        return null;
      default:
        return `$.type === "${typeQuery}"`;
    }
  }

  function generateContentQuery(): string | null {
    if (contentQuery === "") {
      return null;
    }

    const finalPattern = createPattern(contentQuery, searchMode);
    const flags = searchCasing === "caseSensitive" ? "" : "i";
    return `textContent($).match(new RegExp(\`${addSlashes(finalPattern)}\`, "${flags}"))`;
  }

  function generateTextStyleQuery(): string | null {
    switch (textStyleQuery) {
      case "":
        return null;
      default:
        return `$.type === "textBlock" && $.style.textStyle === "${textStyleQuery}"`;
    }
  }

  function generateListStyleQuery(): string | null {
    switch (listStyleQuery) {
      case "":
        return null;
      default:
        return `$.listStyle.type === "${listStyleQuery}"`;
    }
  }

  function resetQueryOptions() {
    setContentQuery("");
    setTypeQuery(defaultTypeOption.value);
    setTextStyleQuery(defaultTextStyleOption.value);
    setListStyleQuery(defaultListStyleOption.value);
  }
  
  const customQueryCheckboxChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomQueryVisible(event.target.checked);
    
    if (event.target.checked) {
      setCustomQueryStyle({});
    } else {
      setCustomQueryStyle({"display": "none"});
    }
  };

  // Rendering
  function createTypeOptions() {
    return typeOptions.map(o => <option key={o.value} value={o.value}>{o.text}</option>);
  }

  function createTextStyleOptions() {
    return textStyleOptions.map(o => <option key={o.value} value={o.value}>{o.text}</option>);
  }
  
  function createListStyleOptions() {
    return listStyleOptions.map(o => <option key={o.value} value={o.value}>{o.text}</option>);
  }

  return <div id="page" className="page page-active mt-4">
    <input id="simple-text-input" className="border-gray-300 dark:bg-gray-900 dark:border-interfaceBorder-dark dark:text-gray-300" type="text" onChange={onContentQueryChange} placeholder="Text" value={contentQuery} />
    <div className="fullwidth-m-16 flex -space-x-px">
      <div className="w-1/2 flex-1 min-w-0">
        <select id="find_type" name="find_type" value={searchMode} onChange={onSearchModeChanged} autoComplete="find_type" className="fullwidth-m-8 m-2 py-1 pl-2 pr-6 truncate focus:border-gray-300 focus:ring-0 text-gray-600 relative block w-full rounded-none bg-transparent focus:z-10 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
          <option value="contains">Contains</option>
          <option value="matchWord">Matches Word</option>
          <option value="regex">Regular Expression</option>
        </select>
      </div>
      <div className="flex-1 min-w-0">
        <select id="find_case" name="find_case" value={searchCasing} onChange={onSearchCasingChanged} autoComplete="find_case" className="fullwidth-m-8 m-2 ml-4 py-1 pl-2 pr-6 truncate focus:border-gray-300 focus:ring-0 text-gray-600 relative block w-full rounded-none bg-transparent focus:z-10 text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
          <option value="ignoreCase">Ignore case</option>
          <option value="caseSensitive">Match case</option>
        </select>
      </div>
    </div>
    <div className="border-t border-interfaceBorder dark:border-interfaceBorder-dark mt-1 pt-4">
      <select className="dropdown block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
         value={typeQuery} onChange={onTypeQueryChanged}>{createTypeOptions()}</select>
      <select className="dropdown block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
         value={textStyleQuery} onChange={onTextStyleQueryChanged}>{createTextStyleOptions()}</select>
      <select className="dropdown block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
         value={listStyleQuery} onChange={onListStyeQueryChanged}>{createListStyleOptions()}</select>

      <input type="checkbox" className="mb-2 ml-3 mt-2 mr-2" id="custom-query" onChange={customQueryCheckboxChecked} />
      <label className="label" htmlFor="custom-query">Custom Query</label>
      <input id="code-text-input" className="border-gray-300 dark:bg-gray-900 dark:border-interfaceBorder-dark dark:text-gray-300" type="text" onChange={onCustomQueryChanged} placeholder="Custom query" value={customQueryValue} style={customQueryStyle} />

      <button className="action-button ml-2 mr-2 mt-2" onClick={onExecuteSelect}>Find & Select Blocks</button>
    </div>
  </div>;
}