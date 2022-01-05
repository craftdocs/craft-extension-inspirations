import { CraftBlock, CraftTextBlock } from "@craftdocs/craft-extension-api";

type Operation = "create";

interface TodoAttributes {
    title: string;
    notes?: string;
    "completion-date"?: string;
    "checklist-items"?: ThingsChecklistItem[];
    completed?: boolean;
    canceled?: boolean;
}

interface ThingsTodo {
    type: "to-do";
    operation: Operation;
    id: string;
    attributes: TodoAttributes;
}

interface ChecklistItemAttributes {
    title: string;
    completed?: boolean;
    canceled?: boolean;
}

interface ThingsChecklistItem {
    type: "checklist-item";
    attributes: ChecklistItemAttributes;
}

const isTodoChecked = (block: CraftBlock): boolean => (
    block.listStyle.type === "todo"
    && block.listStyle.state === "checked"
);

const completionDate = (block: CraftBlock): string | undefined => isTodoChecked(block)
    ? new Date().toISOString()
    : undefined;

const content = (block: CraftTextBlock): string => block.content.reduce((acc, val) => acc + val.text, "");

export function blockModelToThingsTodo(block: CraftBlock): ThingsTodo | null {
    if (block.type !== "textBlock") {
        return null;
    }

    let notes: string[] = [];
    const checklistItems: ThingsChecklistItem[] = [];
    for (const subblock of block.subblocks) {
        if (subblock.type === "textBlock") {
            if (subblock.listStyle.type === "todo") {
                checklistItems.push({
                    type: "checklist-item",
                    attributes: {
                        title: content(subblock),
                        completed: isTodoChecked(subblock),
                    }
                })
            } else {
                notes.push(content(subblock));
            }
        }
    }

    return {
        type: "to-do",
        operation: "create",
        id: block.id,
        attributes: {
            title: content(block),
            completed: isTodoChecked(block),
            notes: notes.join("\n"),
            "completion-date": completionDate(block),
            "checklist-items": checklistItems,
        }
    };
}