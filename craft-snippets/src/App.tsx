import * as React from "react"
import * as ReactDOM from "react-dom"
import { BlockLocation, CraftBlock, CraftBlockInsert, DevicePlatform } from "@craftdocs/craft-extension-api";
import { BlockSnippet } from "./Types";
import { v4 as uuid } from "uuid";
import { useStateWithRefPair, safeJsonParse, safeJsonStringify } from "./Utils";
import { DropdownDarkStyles, SnippetRow } from "./SnippetRow";
import styled, { createGlobalStyle } from "styled-components";
import { Colors } from "./Colors";

const STORAGE_KEY = "craftSnippets";
const LOG_PREFIX = "[Craft Snippets]";

// This is the main React component, which is rendered into the div defined in index.html
const App: React.FC<{}> = () => {

  const [snippets, setSnippets, snippetsRef] = useStateWithRefPair<BlockSnippet[]>([]);
  const [startAsEditedId, setStartAsEditedId] = React.useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [platform, setPlatform] = React.useState<DevicePlatform>("Web");

  // just to avoid flashing the empty state while snippets are fetched from storageApi
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // load saved snippets from storage
  React.useEffect(() => {
    craft.storageApi.get(STORAGE_KEY).then(apiRes => {
      ReactDOM.unstable_batchedUpdates(() => {
        if (apiRes.status === "success") {
          const snippets = safeJsonParse(apiRes.data) as (BlockSnippet[] | null) ?? [];
          setSnippets(snippets);
        } else {
          console.error(`${LOG_PREFIX} Error loading saved Craft Snippets: ${apiRes.message}`);
        }
        setIsLoaded(true);
      });
    }).catch((e: any) => {
      console.error(`${LOG_PREFIX} Error loading saved Craft Snippets: ${e.message}`);
      setIsLoaded(true);
    });
  }, []);

  // save snippets to storage
  const saveSnippetsToStorage = React.useCallback((data: BlockSnippet[]) => {
    const snippetStr = safeJsonStringify(data);
    if (snippetStr != null) {
      craft.storageApi.put(STORAGE_KEY, snippetStr).then(apiRes => {
        if (apiRes.status === "error") {
          console.error(`${LOG_PREFIX} Error saving Craft Snippets: ${apiRes.message}`);
        }
      });
    }
  }, []);

  // updating snippets both in state and storage
  const updateSnippets = React.useCallback((newSnippets: BlockSnippet[]) => {
    setSnippets(newSnippets)
    saveSnippetsToStorage(newSnippets);
  }, [saveSnippetsToStorage]);

  // subscibing to color scheme of environment (dark/light)
  React.useLayoutEffect(() => {
    craft.env.setListener((env) => {
      setIsDarkMode(env.colorScheme === "dark");
      setPlatform(env.platform);
      // for 3rd pary style integration (eg rc-menu)
      if (env.colorScheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    })
  }, []);

  React.useEffect(() => {
    if (startAsEditedId != null) {
      setStartAsEditedId(null);
    }
  }, [startAsEditedId]);
  
  const onCaptureSelection = React.useCallback(async () => {
    const selectionRes = await craft.editorApi.getSelection();
    if (selectionRes.status === "success" && selectionRes.data.length > 0) {
      const newSnippet: BlockSnippet = {
        id: uuid(),
        name: defaultTitleForSnippet(selectionRes.data),
        blocks: selectionRes.data,
        createdMs: Date.now()
      };
      const newSnippets: BlockSnippet[] = [
        newSnippet,
        ...snippetsRef.current,
      ];

      ReactDOM.unstable_batchedUpdates(() => {
        updateSnippets(newSnippets);
        // native webview have some issues with input handling, so going into rename mode on the new snippet only on Web for now
        if (platform === "Web") {
          setStartAsEditedId(newSnippet.id);
        }
      });
    }
  }, [platform]);

  const onInsertClicked = async (snippet: CraftBlock[]) => {    
    // figuring out location to insert blocks at
    const currentPageRes = await craft.dataApi.getCurrentPage();
    if (currentPageRes.status === "error") {
      console.error(`${LOG_PREFIX} Error fetching current page: ${currentPageRes.message}`);
      return;
    }
    const currentPageId = currentPageRes.data.id;
    
    let location: BlockLocation | undefined;

    const selectionRes = await craft.editorApi.getSelection();
    if (selectionRes.status === "success" && selectionRes.data.length > 0) {
      const blockIdToInsertAfter = selectionRes.data[selectionRes.data.length - 1].id;
      location = craft.location.afterBlockLocation(currentPageId, blockIdToInsertAfter);
    }

    // some handling for not yet supported block types
    let finalBlocksToInsert: Array<CraftBlock | CraftBlockInsert> = snippet;
    const notSupportedTypes = snippet.map(block => block.type).filter(type => !isBlockTypeSupported(type));
    if (notSupportedTypes.length > 0) {
      finalBlocksToInsert = [...snippet, createNotSupportedNote(new Set(notSupportedTypes))];
    }

    const addResult = await craft.dataApi.addBlocks(finalBlocksToInsert, location);
    if (addResult.status === "error") {
      console.error(`${LOG_PREFIX} Error inserting snippet: ${addResult.message}`);
      return;
    }
  }

  const onDeleteClicked = React.useCallback((idx: number) => {
    const newSnippets = snippetsRef.current.slice(0);
    newSnippets.splice(idx, 1);
    updateSnippets(newSnippets);
  }, [snippetsRef]);

  const onRenameClicked = React.useCallback((idx: number, newName: string) => {
    const renamedSnippet = {
      ...snippetsRef.current[idx],
      name: newName
    };
    const newSnippets = snippetsRef.current.slice(0);
    newSnippets.splice(idx, 1, renamedSnippet);
    updateSnippets(newSnippets);
  }, [snippetsRef]);

  return <>
    <GlobalStyles />
    <DropdownDarkStyles />
    <ExtensionContainer bgColor={Colors.background(isDarkMode)} >
      <ExtensionHeader borderColor={Colors.separator(isDarkMode)}>
        <StyledTextSpan fontSize={13} isWiderSpaced={true} weight={500} textColor={Colors.text(isDarkMode)}>
          Craft Snippets
        </StyledTextSpan>
      </ExtensionHeader>
      <ScrollingSnippetsContainer>
        <div>
          <FullWidthButton onClick={onCaptureSelection}
            bgColor={Colors.craftBlue(isDarkMode)}
            textColor={Colors.background(isDarkMode)}
          >
            Save selected
          </FullWidthButton>
          <SnippetList style={{marginTop: "12px"}}>
            {snippets.map((snippet, idx) => (
              <SnippetRow key={snippet.id}
                onClick={() => onInsertClicked(snippet.blocks)}
                onDelete={() => onDeleteClicked(idx)}
                onRename={(newName: string) => onRenameClicked(idx, newName)}
                snippet={snippet}
                isDarkMode={isDarkMode}
                startAsEdited={startAsEditedId === snippet.id}
              />
            ))}
          </SnippetList>
          {snippets.length === 0 && isLoaded && 
            <div style={{padding: "0 10px", textAlign: "center"}} >
              <StyledTextSpan fontSize={13} isWiderSpaced={true} textColor={Colors.text(isDarkMode, !isDarkMode ? 0.6 : 0.9)}>
                Select some Craft blocks to save them as reusable snippets or templates that you can insert anytime later
              </StyledTextSpan>
            </div>
          }
        </div>
      </ScrollingSnippetsContainer>
    </ExtensionContainer>
  </>;
}

function defaultTitleForSnippet(blocks: CraftBlock[]): string {
  let textContent;
  const maxPeakAhead = 5;
  const peakedSubBlocks = blocks.slice(0, maxPeakAhead);
  for (const block of peakedSubBlocks) {
    if (block.type === "textBlock" && block.content.length > 0) {
      textContent = block.content.map(run => run.text).join("");
      break;
    }
  }
  
  if (textContent == null || textContent === "") {
    return "Untitled blocks";
  }

  return textContent.length <= 64 ? textContent : textContent.substr(0, 64).concat("...");
}

function createNotSupportedNote(types: Set<CraftBlock["type"]>) {
  return craft.blockFactory.textBlock({
    content: [
      { text: "!", isBold: true, isCode: true},
      { text: ` Skipped some content (${Array.from(types).join(", ")})`, isBold: true},
      { text: "\nNote that some block types cannot yet be added to documents in the CraftX Developer Preview. Coming soon!" }
    ],
    hasBlockDecoration: true,
    color: "blue1",
    style: {alignmentStyle: "center"}
  });
}

function isBlockTypeSupported(type: CraftBlock["type"]): boolean {
  switch (type) {
    case "textBlock":
    case "horizontalLineBlock":
    case "codeBlock":
      return true;
    default:
      return false;
  }
}

const GlobalStyles = createGlobalStyle`
  html, body, #react-root {
    height: 100%;
  }
  body {
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizelegibility;
    font-variant-numeric: lining-nums;
    -moz-font-feature-settings: "lnum" 1;
    -webkit-font-feature-settings: "lnum" 1;
    font-feature-settings: "lnum" 1;
  }
  html, body {
    padding: 0;
    margin: 0;
    font-family: system-ui, -apple-system;
  }
`;


const ExtensionContainer = styled.div<{bgColor: string}>`
  user-select: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.bgColor};
  transition: .3s;
`;

const ExtensionHeader = styled.div<{borderColor: string}>`
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${props => props.borderColor};
`;

const FullWidthButton = styled.div<{bgColor: string, textColor: string}>`
  height: 36px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  justify-content: center;
  letter-spacing: 0.3px;
  background-color: ${props => props.bgColor};
  &:hover {
    opacity: 0.85;
  }
  color: ${props => props.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  box-shadow: 0px 1px 2px rgba(0,0,0,0.12);
`;

const ScrollingSnippetsContainer = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
`;

const SnippetList = styled.div`
  display: grid;
  column-count: 1;
  gap: 8px;
`;

interface StyledTextSpanProps {
  fontSize: number;
  weight?: number;
  textColor?: string;
  isWiderSpaced?: boolean;
}

const StyledTextSpan = styled.span<StyledTextSpanProps>`
  font-size: ${props => props.fontSize}px;
  ${props => props.weight != null ? `font-weight: ${props.weight};` : ""};
  ${props => props.textColor != null ? `color: ${props.textColor};` : ""};
  ${props => props.isWiderSpaced ? "letter-spacing: 0.3px;" : ""};
`;


export function initApp() {
  ReactDOM.render(<App />, document.getElementById("react-root"))
}
