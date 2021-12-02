import React, { ChangeEvent } from "react";
import { BlockMatch, searchCasingModes, searchModes } from "../utils";
import { executeFind, executeReplaceAll, executeSelectBlocksById, selectOrReplace } from "../actions";

export const FindAndReplace: React.FC<{}> = () => {
  // Constants
  const defaultSearchMode = searchModes[0];
  const defaultSearchCasing = searchCasingModes[0];

  // State
  const findPattern = React.useRef<string>("");
  const replacePattern = React.useRef<string>("");
  const [results, setResults] = React.useState<BlockMatch[] | null>(null);

  const [searchMode, setSearchMode] = React.useState<string>(defaultSearchMode);
  const [searchCasing, setSearchCasing] = React.useState<string>(defaultSearchCasing);

  // Events
  const onSearchModeChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchMode(event.target.value);
  }

  const onSearchCasingChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchCasing(event.target.value);
  }

  const onFindPatternChanged = (event: ChangeEvent<HTMLInputElement>) => {
    findPattern.current = event.target.value;
  };

  const onReplacePatternChanged = (event: ChangeEvent<HTMLInputElement>) => {
    replacePattern.current = event.target.value;
  };

  const onFindSelected = async () => {
    const results = await executeFind(findPattern.current, searchMode, searchCasing === "caseSensitive");
    await executeSelectBlocksById([]);
    setResults(results);
  };

  const onReplaceSelected = async () => {
    await executeReplaceAll(findPattern.current, replacePattern.current, searchMode, searchCasing === "caseSensitive");
  };

  const onResultSelected = async (key: string) => {
    await selectOrReplace(findPattern.current, replacePattern.current, searchMode, searchCasing === "caseSensitive", key);
  };

  // Rendering
  function generateResults() {
    if (results == null) {
      return [];
    }

    const items: JSX.Element[] = [];

    const header = <div key="search-results-header" className="mt-4 py-2 px-3 border border-l-0 border-r-0 border-t-1 border-b-1 border-gray-150 bg-gray-50 text-xs text-gray-400 dark:bg-gray-800 dark:border-interfaceBorder-dark">
      {results.length} result{results.length === 1 ? "" : "s"}
    </div>;

    items.push(header);

    for (const match of results) {
      const content = match.content.map(r => r.isBold === true ? strong(r.text) : r.text);
      const item = <div key={match.block.id} onClick={(e) => onResultSelected(match.block.id)} className="py-3 px-3 border border-l-0 border-r-0 border-b-1 border-t-0 border-gray-100 text-sm text-gray-700 select-none cursor-pointer hover:bg-gray-50 dark:border-interfaceBorder-dark dark:text-gray-300 dark:hover:bg-gray-700">
        {content}
      </div>;

      items.push(item);
    }

    return items;  }
  function strong(text: string): JSX.Element {
    return <strong>{text}</strong>;
  }

  return <div id="page" className="page page-active">
    <section id="find_and_replace_details" className="px-0 pt-2 pb-4">
        <div>
        <fieldset className="px-2">
           <div className="mt-1 bg-white rounded-md -space-y-px">
             <div>
               <input type="text" name="find" id="find" className="inputField rounded-none rounded-tl-md rounded-tr-md dark:bg-gray-900 dark:border-interfaceBorder-dark"
               placeholder="Find" onChange={onFindPatternChanged}/>
             </div>
             <div className="flex -space-x-px">
               <div className="w-1/2 flex-1 min-w-0">
                 <select id="find_type" name="find_type" value={searchMode} onChange={onSearchModeChanged} autoComplete="find_type" className="py-1 pl-2 pr-6 truncate focus:border-gray-300 focus:ring-0 bg-gray-50 text-gray-600 relative block w-full rounded-none bg-transparent focus:z-10 text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                   <option value="contains">Contains</option>
                   <option value="matchWord">Matches Word</option>
                   <option value="regex">Regular Expression</option>
                 </select>
               </div>
               <div className="flex-1 min-w-0">
                <select id="find_case" name="find_case" value={searchCasing} onChange={onSearchCasingChanged} autoComplete="find_case" className="py-1 pl-2 pr-6 truncate focus:border-gray-300 focus:ring-0 bg-gray-50 text-gray-600 relative block w-full rounded-none bg-transparent focus:z-10 text-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                     <option value="ignoreCase">Ignore case</option>
                     <option value="caseSensitive">Match case</option>
                   </select>
               </div>
             </div>
             <div>
                  <input type="text" name="replace" id="replace" className="inputField rounded-none rounded-bl-md rounded-br-md dark:bg-gray-900 dark:border-interfaceBorder-dark"
                  placeholder="Replace" onChange={onReplacePatternChanged}/>
                </div>
           </div>
         </fieldset>
           <div className="mt-2 px-2 flex">
             <button type="button" className="text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none w-1/2 dark:bg-groupBackground-dark dark:text-gray-300 dark:border-gray-700"
             onClick={onReplaceSelected}>
               Replace All
             </button>
             <button type="button" className="ml-2 text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none w-1/2"
             onClick={onFindSelected}>
               Find
             </button>
           </div>
        </div>
        {generateResults()}
      </section>
  </div>;
}