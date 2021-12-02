import { CraftBlock } from "@craftdocs/craft-extension-api";

export interface BlockSnippet {
    id: string;
    name: string;
    blocks: CraftBlock[];
    createdMs: number;
}