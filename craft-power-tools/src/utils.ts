import { CraftBlock, CraftTextBlock, CraftTextRun } from "@craftdocs/craft-extension-api";

export enum BlockStyleAction {
    addBold = "addBold",
    removeBold = "removeBold",
    addItalic = "addItalic",
    removeItalic = "removeItalic",
    addHighlight = "addHighlight",
    removeHighlight = "removeHighlight",
  }

export interface BlockMatch {
    block: CraftTextBlock;
    content: CraftTextRun[];
}

export const searchModes = [
    "contains",
    "matchWord",
    "regex"
];

export const searchCasingModes = [
    "ignoreCase",
    "caseSensitive"
];

export type SearchMode = typeof searchModes[number];

export function subBlocks(block: CraftBlock): CraftBlock[] {
    if (block.type === "textBlock") {
        return block.subblocks;
    } else {
        return [];
    }
}

export function createPattern(text: string, searchMode: SearchMode): string {
    switch (searchMode) {
        case "contains":
            return escapeRegExp(text);
        case "matchWord":
            return `\\b${escapeRegExp(text)}\\b`;
        default:
            return text;
    }
}

export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function createRegex(findPattern: string, searchMode: SearchMode, caseSensitive: boolean, global: boolean): RegExp {
    const finalPattern = createPattern(findPattern, searchMode);
    let flags = "";
    if (global) {
        flags += "g";
    }
    if (!caseSensitive) {
        flags += "i";
    }
    let regex = new RegExp(finalPattern, flags);
    return regex;
}

export async function getAllBlocks(): Promise<CraftBlock[]> {
    const currentDocument = await getCurrentPage();
    return subBlocks(currentDocument);
}

export async function getCurrentPage() {
    return (await craft.dataApi.getCurrentPage()).data as CraftTextBlock;
}
export async function getSelection() {
    return (await craft.editorApi.getSelection()).data ?? [];
}

export async function getSelectedBlocks(): Promise<CraftBlock[]> {
    return (await craft.editorApi.getSelection()).data ?? [];
}

export async function getBlocks(): Promise<CraftBlock[]> {
    const currentDocument = await getCurrentPage();
    let blocks = (await craft.editorApi.getSelection()).data ?? [];

    if (currentDocument == null) {
        return [];
    }

    if (blocks.length == 0) {
        blocks = subBlocks(currentDocument);
    }

    return blocks;
}

export function replaceContent(block: CraftTextBlock, findPattern: string, replacePattern: string,
    searchMode: SearchMode, caseSensitive: boolean): CraftTextRun[] | null {

    let finalRuns: CraftTextRun[] | null = null;

    let searchIndex = 0;
    let iterations = 0;
    while (true) {
        const text = stringFromRuns(finalRuns ?? block.content);
        const findRegex = createRegex(findPattern, searchMode, caseSensitive, false);

        // We replace on the full text, so formatting doesn't break the search
        const newText = replaceText(text, searchIndex, findRegex, replacePattern);

        if (newText === text) {
            return finalRuns;
        }

        // We need to calculate the diff, so we can reapply it on the individual runs
        const diffRange = findDiffRange(text, newText);

        if (diffRange == null) {
            return finalRuns;
        }

        const replacement = findReplacement(text, newText, diffRange);

        // Apply changes to all necessary runs
        const newContent = replaceRange(finalRuns ?? block.content, diffRange, replacement);
        searchIndex = diffRange[0] + replacePattern.length;

        if (text === stringFromRuns(newContent)) {
            return finalRuns;
        }

        finalRuns = newContent;

        iterations++;
        if (iterations > 100) {
            return finalRuns;
        }
    }
}

export function replaceText(text: string, afterIndex: number, regex: RegExp, replacePattern: string): string {
    const prefix = text.substr(0, afterIndex);
    const searchText = text.substr(prefix.length);

    if (searchText.length === 0) {
        return text;
    }
    const newText = searchText.replace(regex, replacePattern);
    return prefix + newText;
}

export function replaceRange(content: CraftTextRun[], range: [number, number], replacement: string): CraftTextRun[] {
    let currentIndex = 0;
    const start = range[0];
    const end = range[1];

    const newContent: CraftTextRun[] = [];

    let replacementAdded = false;

    for (const run of content) {
        if (replacementAdded) {
            if (currentIndex + run.text.length <= end) {
                currentIndex += run.text.length;
            } else {
                const partialText = run.text.substring(end - currentIndex + 1);
                currentIndex += run.text.length;
                if (partialText.length > 0) {
                    newContent.push({
                        ...run,
                        text: partialText
                    });
                }
            }
        } else {
            if (start < currentIndex + run.text.length) {
                const mergedText = run.text.substr(0, start - currentIndex)
                    + replacement + run.text.substr(end - currentIndex + 1);
                newContent.push({
                    ...run,
                    text: mergedText
                });
                currentIndex += run.text.length;
                replacementAdded = true;
            } else {
                currentIndex += run.text.length;
                newContent.push(run);
            }
        }
    }
    return newContent;
}

export function findReplacement(text: string, newText: string, range: [number, number]) {
    let start = range[0];
    let commonSuffixLength = (text.length - 1 - range[1]);

    return newText.substr(start, newText.length - start - commonSuffixLength);
}

export function findDiffRange(text: string, newText: string): [number, number] | null {
    let startIndex = -1;
    let endIndex = -1;

    if (text === newText) {
        return null;
    }

    for (let i = 0; i < text.length; i++) {
        startIndex = i;

        if (i >= newText.length) {
            break;
        }

        if (text[i] !== newText[i]) {
            break;
        }
    }

    if (startIndex === -1) {
        return [text.length - 1, text.length - 1];
    }

    for (let i = 0; text.length - 1 - i >= startIndex; i++) {
        endIndex = text.length - 1 - i;

        if (i >= newText.length) {
            break;
        }

        if (text[text.length - 1 - i] !== newText[newText.length - 1 - i]) {
            break;
        }
    }

    if (endIndex === -1) {
        endIndex = text.length - 1;
    }

    return [startIndex, endIndex];
}

export function textContent(block: CraftBlock): string {
    if (block.type !== "textBlock") {
        return "";
    }

    return stringFromRuns(block.content);
}

export function stringFromRuns(runs: CraftTextRun[]): string {
    return runs.reduce((s, run) => s + run.text, "");
}

export function createPredicate(query: string) {
    let func = function ($: CraftBlock) { return true; };
    eval(`func = function ($) { return ${query}; };`);
    return func;
}

export function createAction(action: string): Function {
    let func = function ($: CraftBlock, $prev: CraftBlock | null, $next: CraftBlock | null) { return true; };
    eval(`func = function ($, $prev, $next) { ${action} };`);
    return func;
}

export function replaceInvalidCharacters(code: string): string {
    return code
        .replace("‟", "\"")
        .replace("‟", "\"")
        .replace("…", "...");
}