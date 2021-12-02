import React, { ChangeEvent } from "react";
import { CraftBlock } from "@craftdocs/craft-extension-api";
import { executeBlockUpdateAction, executeApplyStyle, executeDynamicAction, executeSort, executeReverseOrder } from "../actions";
import { BlockStyleAction, replaceInvalidCharacters } from "../utils";
import { logToInPageConsole } from "../console";

export const AdvancedActions: React.FC<{}> = () => {
  // Constants
  const styleActions = [
    new Option("Set bold", BlockStyleAction.addBold.toString()),
    new Option("Remove bold", BlockStyleAction.removeBold.toString()),
    new Option("Set italic", BlockStyleAction.addItalic.toString()),
    new Option("Remove italic", BlockStyleAction.removeItalic.toString()),
    new Option("Set highlight", BlockStyleAction.addHighlight.toString()),
    new Option("Remove highlight", BlockStyleAction.removeHighlight.toString())
  ];

  const highlightColors = [
    new Option("Yellow", "yellow"),
    new Option("Lime", "lime"),
    new Option("Green", "green"),
    new Option("Cyan", "cyan"),
    new Option("Blue", "blue"),
    new Option("Purple", "purple"),
    new Option("Pink", "pink"),
    new Option("Red", "red"),
    new Option("Grey", "grey"),
    new Option("Beach gradient", "beachGradient"),
    new Option("Nightsky gradient", "nightSkyGradient"),
    new Option("Sunset gradient", "sunsetGradient"),
    new Option("Orange gradient", "orangeGradient"),
    new Option("Gold gradient", "goldGradient")
  ];

  const defaultStyleAction = styleActions[0];
  const defaultHighlightColor = highlightColors[0];
  const defaultCustomAction = `
// Example action
// Removes inline formatting

if ($.type !== "textBlock") {
  return false;
}

$.content = [{ 
  text: $.content
    .reduce((s, run) => 
      s.concat(run.text), "")
}];

return true;`.trim();

  const actionsGroups: ActionGroup[] = [
    {
      name: "Style",
      actions: [
        new Option("Remove inline formatting", "remove_inline_formatting"),
        new Option("Apply Style", "apply_style"),
      ]
    },
    {
      name: "Structure",
      actions: [
        new Option("Sort alphabetically", "sort"),
        new Option("Reverse order", "reverse_order"),
        new Option("Convert empty toggles to bullet", "convert_empty_toggles_to_bullet")
      ]
    },
    {
      name: "Advanced",
      actions: [
        new Option("Custom Action", "custom_action"),
        new Option("Print blocks to console", "print_to_console")
      ]
    }];

  interface ActionGroup {
    name: string;
    actions: HTMLOptionElement[];
  }

  // State
  const [styleQuery, setStyleQuery] = React.useState<string>("");
  const [styleAction, setStyleAction] = React.useState<string>(defaultStyleAction.value);
  const [highlightColor, setHighlightColor] = React.useState<string>(defaultStyleAction.value);
  const [styleActionOptionsVisible, setStyleActionOptionsVisible] = React.useState<boolean>(false);

  const [customActionValue, setCustomActionValue] = React.useState<string>(defaultCustomAction);
  const [customActionVisible, setCustomActionCheckboxState] = React.useState<boolean>(false);

  // Events
  const onApplyAction = async (type: string) => {
    switch (type) {
      case "sort":
        await executeSort();
        return;
      case "reverse_order":
        await executeReverseOrder();
      case "apply_style":
        const stlyeAction = styleAction as unknown as BlockStyleAction;
        if (stlyeAction == null) {
          return;
        }
        await executeApplyStyle(styleQuery, stlyeAction, highlightColor);
        return;
      case "custom_action":
        await executeDynamicAction(replaceInvalidCharacters(customActionValue));
        return;
      default:
        const blockUpdateAction = getBlockUpdateAction(type);
        if (blockUpdateAction == null) {
          return;
        }
        await executeBlockUpdateAction(blockUpdateAction);
    }
  };

  const onStyleQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setStyleQuery(event.target.value);
  };

  const onCustomActionChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCustomActionValue(event.target.value);
  };

  const onApplyStyle = () => {
    onApplyAction("apply_style");
  };

  const onApplyCustomAction = () => {
    onApplyAction("custom_action");
  };

  const onStyleActionChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setStyleAction(event.target.value);
  };

  const onHighlightColorChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setHighlightColor(event.target.value);
  };

  const onActionSelected = (key: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (key === "apply_style") {
      setStyleActionOptionsVisible(!styleActionOptionsVisible);
      return;
    }
    if (key === "custom_action") {
      setCustomActionCheckboxState(!customActionVisible);
      return;
    }

    onApplyAction(key);
  };

  // Helpers
  function getBlockUpdateAction(type: string):
    ((block: CraftBlock, prev: CraftBlock | null, next: CraftBlock | null) => boolean) | null {
    switch (type) {
      case "remove_inline_formatting":
        return removeInlineFormatting;
      case "print_to_console":
        return printToConsole;
      case "convert_empty_toggles_to_bullet":
        return convertEmptyTogglesToBullet;
      default:
        return null;
    }
  }

  function removeInlineFormatting($: CraftBlock): boolean {
    if ($.type !== "textBlock") {
      return false;
    }
    $.content = [{
      text: $.content.reduce((s, run) => s.concat(run.text), "")
    }];
    return true;
  }

  function printToConsole($: CraftBlock): boolean {
    logToInPageConsole(JSON.stringify($, null, 2));
    return false;
  }

  function convertEmptyTogglesToBullet($: CraftBlock, $prev: CraftBlock | null, $next: CraftBlock | null): boolean {
    if ($.type === "textBlock" && $.listStyle.type === "toggle" && ($next == null || $next.indentationLevel <= $.indentationLevel)) {
      $.listStyle = { type: "bullet" };
      return true;
    }
    return false;
  }

  // Rendering
  const createActions = React.useCallback(() => {
    const items: JSX.Element[] = [];

    for (const group of actionsGroups) {
      const actions: JSX.Element[] = [];

      for (const action of group.actions) {
        actions.push(createAction(action.text, action.value));
      }
      items.push(<div key={group.name} className="mb-8 mt-4 py-2 px-3 border border-l-0 border-r-0 border-t-1 border-b-1 border-gray-150 dark:border-gray-700 text-s text-gray-400 dark:border-interfaceBorder-dark">
        <div className="text-center font-semibold text-sm">
          {group.name}
        </div>
        <div>{actions}</div>
      </div>);
    }
    return items;
  }, [styleActionOptionsVisible, styleQuery, styleAction, customActionVisible, customActionValue, highlightColor]);

  function createAction(name: string, key: string) {
    let options = null;
    if (key === "apply_style" && styleActionOptionsVisible) {
      options = styleActionOptions();
    }
    if (key === "custom_action" && customActionVisible) {
      options = customActionOptions();
    }

    return <div key={key}><button key={key} type="button" onClick={e => onActionSelected(key, e)} className="fullwidth-m-16 m-2 block text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none w-1/2 dark:bg-groupBackground-dark dark:text-gray-300 dark:border-gray-700">
      {name}
    </button>{options}</div>;
  }

  function createStyleActions() {
    return styleActions.map(o => <option key={o.value} value={o.value}>{o.text}</option>);
  }
  
  function createHighlightColors() {
    return highlightColors.map(o => <option key={o.value} value={o.value}>{o.text}</option>);
  }

  function styleActionOptions() {
    return <div className="border m-2 rounded-md dark:border-gray-700">
      <div className="menu-label">Text Pattern</div>
      <input id="code-text-input" className="inputField text-gray-900 rounded-none rounded-tl-md rounded-tr-md dark:bg-gray-900 dark:border-interfaceBorder-dark dark:text-gray-300" type="text" onChange={onStyleQueryChanged} placeholder="Add pattern to find" value={styleQuery} />
      <div className="menu-label">Style</div>
      <select className="dropdown block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
        value={styleAction} onChange={onStyleActionChanged}>{createStyleActions()}</select>
      {styleAction === "addHighlight"
        ? <div><div className="menu-label">Highlight Color</div><select className="dropdown block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          value={highlightColor} onChange={onHighlightColorChanged}>{createHighlightColors()}</select></div>
        : ""}
      <button className="action-button mt-4 mb-2 ml-2 mr-2" onClick={onApplyStyle}>Execute</button>
    </div>;
  }

  function customActionOptions() {
    return <div className="border m-2 rounded-md dark:border-gray-700">
      <div className="menu-label">Action</div>
      <textarea id="custom-action-input" className="text-gray-900 bg-gray-100 mt-2 rounded-none rounded-tl-md rounded-tr-md dark:bg-gray-900 dark:border-interfaceBorder-dark dark:text-gray-300 border-gray-300" onInput={onCustomActionChanged} placeholder="Custom action" value={customActionValue} />

      <button className="action-button mt-4 mb-2 ml-2 mr-2" onClick={onApplyCustomAction}>Apply Action</button>
    </div>;
  }

  return <div className="mt-4">
    {createActions()}
  </div>;
}