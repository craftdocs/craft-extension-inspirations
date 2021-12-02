import { CraftBlock, MarkdownFlavor } from "@craftdocs/craft-extension-api";
import { taskPaperStringOf } from "./TaskPaper";
import { blockModelToThingsTodo } from "./ThingsJSON";
import { catNulls } from "./utils";

type DeepLink = (markdown: string) => string;
const xCallbackUrl = (
  appName: string,
  xCallbackIsHost: boolean,
  command: string,
  textKey: string
): DeepLink => (
  markdown: string
): string => {
  const host = xCallbackIsHost ? "x-callback-url/" : command;
  const commandI = xCallbackIsHost ? command : "";
  return `${appName}://${host}${commandI}?${textKey}=${markdown}`;
}

const blocksToExport = async (): Promise<CraftBlock[]> => {
  const selection = await craft.editorApi.getSelection();
  if (selection.status === "success" && selection.data.length > 0) {
    return selection.data;
  }

  const doc = await craft.dataApi.getCurrentPage();
  if (doc.status === "success") {
    return [doc.data];
  }

  return [];
};

export async function exportToOmni(): Promise<void> {
  const deeplink = xCallbackUrl("omnifocus", true, "paste", "content");
  const blocks = await blocksToExport();
  const taskpaper = catNulls(
    (block) => taskPaperStringOf(block, 0), blocks
  ).join("\n");
  await craft.editorApi.openURL(deeplink(encodeURIComponent(taskpaper)));
}

export async function exportToThings(): Promise<void> {
  const deeplink = xCallbackUrl("things", true, "json", "data");

  const items = await blocksToExport();

  const blocks = catNulls(blockModelToThingsTodo, items);
  const payload = encodeURIComponent(JSON.stringify(blocks));
  await craft.editorApi.openURL(deeplink(payload));
}

const exportToGenericMarkdownEditor = (
  deepLink: DeepLink,
  flavor: MarkdownFlavor,
  tableSupported: boolean
) => async (): Promise<void> => {
  const items = await blocksToExport();
  const markdown = craft.markdown.craftBlockToMarkdown(items, flavor, {
    tableSupported
  });
  await craft.editorApi.openURL(deepLink(encodeURIComponent(markdown)));
};

export const exportToBear = exportToGenericMarkdownEditor(
  xCallbackUrl("bear", true, "create", "text"),
  "bear",
  false
);

export const exportToDayOne = exportToGenericMarkdownEditor(
  xCallbackUrl("dayone", false, "post", "entry"),
  "common",
  true
);

export const exportToIA = exportToGenericMarkdownEditor(
  xCallbackUrl("ia-writer", false, "new", "text"),
  "common",
  true
);

export const exportToUlysses = exportToGenericMarkdownEditor(
  xCallbackUrl("ulysses", true, "new-sheet", "text"),
  "common",
  false
);
