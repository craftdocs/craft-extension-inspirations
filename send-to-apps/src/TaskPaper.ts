import { CraftBlock } from "@craftdocs/craft-extension-api";

const stringOf = (str: string, length: number) => Array.from({ length }).map(() => str).join("");

export function taskPaperStringOf(block: CraftBlock, startingIndent: number): string | null {
    if (block.type !== "textBlock") {
        return null;
    }

    let result: string = "";

    result += stringOf("\t", startingIndent + block.indentationLevel);


    if (block.listStyle.type === "todo") {
        result += "- "
    }

    const content = block.content.reduce((acc, val) => acc + val.text.replace(/\n/g, " · "), "");
    result += content;

    if (block.subblocks.length > 0
        || block.style.textStyle === "title"
        || block.style.textStyle === "subtitle"
    ) {
        result += ":";
    }

    result += "\n";

    for (const subblock of block.subblocks) {
        const text = taskPaperStringOf(subblock, startingIndent + block.indentationLevel);
        if (text != null) {
            result += text;
        }
    }

    return result;
}