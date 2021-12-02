import { CraftBlock, CraftTextRun, TextHighlightColor } from "@craftdocs/craft-extension-api";
import { BlockStyleAction } from "./pages/main";
import { BlockMatch, createAction, createPredicate, createRegex, getAllBlocks, getBlocks,
  getCurrentPage, getSelectedBlocks, replaceContent, textContent, getSelection, SearchMode } from "./utils";

export async function executeFind(findPattern: string, searchMode: SearchMode, caseSensitive: boolean): Promise<BlockMatch[]> {
  const blocks = await getAllBlocks();

  const matches: BlockMatch[] = [];

  if (findPattern.length === 0) {
    return [];
  }

  blocks.forEach(block => {
    if (block.type == "textBlock") {
      const text = textContent(block);

      const runs: CraftTextRun[] = [];
      let currentIndex = 0;
      let match;
      let lastIndex = -1;
      let matchFound = false;
      const findRegex = createRegex(findPattern, searchMode, caseSensitive, true);

      while ((match = findRegex.exec(text)) !== null) {
        const prefix = {
          text: text.substring(currentIndex, match.index)
        };

        // Adding unmatched parts without highlight
        if (prefix.text.length > 0) {
          runs.push(prefix);
        }

        // Highlighting matched text
        if (match[0].length > 0) {
          runs.push({
            text: match[0],
            isBold: true
          });
          matchFound = true;
        }

        currentIndex = findRegex.lastIndex

        if (match.index === lastIndex) {
          break;
        }
        lastIndex = match.index;
      }

      const suffix = text.substr(currentIndex);
      if (suffix.length > 0) {
        runs.push({
          text: suffix
        });
      }

      if (matchFound && runs.length > 0) {
        matches.push({
          block,
          content: runs
        });
      }
    }
  });

  return matches;
}

export async function selectOrReplace(findPattern: string, replacePattern: string, searchMode: SearchMode,
  caseSensitive: boolean, blockId: string) {
    // First tap selects the block
    // Second tap executes replace

    const blocks = await getSelectedBlocks();

    if (blocks.length === 1 && blocks[0].id === blockId) {
      await executeReplaceAll(findPattern, replacePattern, searchMode, caseSensitive, [blockId]);
    } else {
      await executeSelectBlocksById([blockId]);
    }
}

export async function executeReplaceAll(findPattern: string, replacePattern: string, searchMode: SearchMode,
  caseSensitive: boolean, blockIds?: string[]) {
  if (findPattern.length === 0) {
    return;
  }
  let blocks = await getAllBlocks();
  if (blockIds != null) {
    const blockIdsSet = new Set(blockIds);
    blocks = blocks.filter(b => blockIdsSet.has(b.id));
  }

  const changedBlocks: CraftBlock[] = [];

  blocks.forEach(block => {
    if (block.type == "textBlock") {

      const newContent = replaceContent(block, findPattern, replacePattern, searchMode, caseSensitive);

      if (newContent != null) {
        block.content = newContent;
        changedBlocks.push(block);
      }
    }
  });

  await craft.dataApi.updateBlocks(changedBlocks);
}

export async function executeSelectBlocks(query: string) {
  const currentDocument = await getCurrentPage();

  if (currentDocument == null) {
    return null;
  }

  const predicate = createPredicate(query);

  const blockIds = currentDocument.subblocks.filter(b => predicate(b)).map(b => b.id);

  await craft.editorApi.selectBlocks(blockIds);
}

export async function executeSelectBlocksById(blockIds: string[]) {
  await craft.editorApi.selectBlocks(blockIds);
}

export async function executeDynamicAction(action: string) {
  const actionFunc = createAction(action);
  executeBlockUpdateAction(actionFunc as (block: CraftBlock, prev: CraftBlock | null, next?: CraftBlock | null) => boolean);
}

export async function executeBlockUpdateAction(action: (block: CraftBlock, prev: CraftBlock | null, next: CraftBlock | null) => boolean) {
  const currentDocument = await getCurrentPage();
  let blocks = await getSelection();

  if (blocks.length == 0) {
    blocks = currentDocument.subblocks;
  }
  const indexMap = new Map<string, number>();
  currentDocument.subblocks.forEach((block, index) => {
    indexMap.set(block.id, index);
  });

  const changedBlocks: CraftBlock[] = [];

  blocks.forEach(block => {
    const index = indexMap.get(block.id);
    let prev: CraftBlock | null = null;
    let next: CraftBlock | null = null;
    if (index != null) {
      if (index > 0) {
        prev = currentDocument.subblocks[index-1];
      }
      if (index < currentDocument.subblocks.length - 1) {
        next = currentDocument.subblocks[index+1];
      }
    }
    if(action(block, prev, next)) {
      changedBlocks.push(block);
    }
  });

  if (changedBlocks.length > 0) {
    await craft.dataApi.updateBlocks(changedBlocks);
  }
}

export async function executeSort() {
  await changeOrder(blocks => {
    const blockList: { id: string, text: string }[] = blocks.map(b => { return { id: b.id, text: textContent(b) }; });
    blockList.sort((a, b) => a.text.localeCompare(b.text));

    return blockList.map(b => b.id);
  });
}

export async function executeReverseOrder() {
  await changeOrder(blocks => {
    return [...blocks].reverse().map(b => b.id);
  });
}

export async function changeOrder(reorder: (blocks: CraftBlock[]) => string[]) {
  const currentDocument = await getCurrentPage();
  let blocks = await getSelection();
  let orderingSelectedBlocks = true;

  if (blocks.length == 0) {
    blocks = currentDocument.subblocks;
    orderingSelectedBlocks = false;
  }

  if (blocks.length === 0) {
    return;
  }

  const indexMap = new Map<string, number>();
  currentDocument.subblocks.forEach((block, index) => {
    indexMap.set(block.id, index);
  });

  let index = Math.min(...blocks.map(b => indexMap.get(b.id) ?? Number.MAX_VALUE));
  if (index < 0 || index >= currentDocument.subblocks.length) {
    index = 0;
  }

  const blockIds = reorder(blocks);
  await craft.dataApi.moveBlocks(blockIds, {
    type: "indexLocation",
    index,
    pageId: currentDocument.id
  });

  if (orderingSelectedBlocks) {
    await executeSelectBlocksById(blockIds);
  }
}

export async function executeApplyStyle(pattern: string, styleAction: BlockStyleAction, highlightColor?: string) {
  const currentDocument = await getCurrentPage();
  let blocks = await getSelection();

  if (blocks.length == 0) {
    blocks = currentDocument.subblocks;
  }

  if (blocks.length === 0) {
    return;
  }

  if (pattern.length === 0) {
    return;
  }

  const changedBlocks: CraftBlock[] = [];

  blocks.forEach(block => {
    if (block.type !== "textBlock") {
      return;
    }
    const newRuns: CraftTextRun[] = [];
    let changed = false;

    const runsToCheck = block.content;

    while(runsToCheck.length > 0) {
      const run = runsToCheck[0];
      runsToCheck.splice(0,1);

      let regex = new RegExp(pattern, "gi");
      let match = regex.exec(run.text);
    
      if (match != null) {
        changed = true;

        const segments = [
          run.text.substr(0, match.index),
          run.text.substr(match.index, match[0].length),
          run.text.substr(match.index + match[0].length)];

        if (segments[0].length > 0) {
          newRuns.push({
            ...run,
            text: segments[0]
          });
        }

        if (segments[1].length > 0) {
          const modifiedRun = {
            ...run,
            text: segments[1]
          };

          switch (styleAction.toString()) {
            case "addBold":
              modifiedRun.isBold = true;
              break;
            case "removeBold":
              modifiedRun.isBold = false;
              break;
            case "addItalic":
              modifiedRun.isItalic = true;
              break;
            case "removeItalic":
              modifiedRun.isItalic = false;
              break;
            case "addHighlight":
              modifiedRun.highlightColor = highlightColor != null ? (highlightColor as TextHighlightColor) : "yellow";
              break;
            case "removeHighlight":
              modifiedRun.highlightColor = undefined;
              break;
          }
          newRuns.push(modifiedRun);
        }

        if (segments[2].length > 0) {
          if (segments[2] === run.text) {
            newRuns.push(run);
          } else {
            runsToCheck.splice(0, 0, {
              ...run,
              text: segments[2]
            });
          }
        }
      } else {
        newRuns.push(run);
      }
    }

    if (changed) {
      changedBlocks.push({
        ...block,
        content: newRuns
      });
    }
  });

  await craft.dataApi.updateBlocks(changedBlocks);
}
