import React from "react";
import { COLORS } from "./Constants";
import { DarkModeEnabled, Separator } from "./Ui";
import { Setter } from "./utils";

export interface ConsoleEntry {
    entry: JSX.Element;
}

export interface UseConsole {
    entries: ConsoleEntry[],
    log: Setter<ConsoleEntry>
    clear: Setter<void>
}

export function useConsole() {
    const [entries, setEntries] = React.useState<ConsoleEntry[]>([]);

    const log = React.useCallback(
        (entry: ConsoleEntry) => setEntries([...entries, entry]),
        [entries, setEntries]
    );

    const clear = React.useCallback(
        () => setEntries([]),
        [setEntries]
    );

    return { entries, log, clear };
}

export type ConsoleProps = DarkModeEnabled & {
    entries: ConsoleEntry[];
}

export const Console: React.FC<ConsoleProps> = ({ isDarkMode, entries }) => (
    <>
        <Separator color={COLORS(isDarkMode).border.normal} />
        {entries.map(({ entry }, index) => (
            <React.Fragment key={index}>
                {entry}
                <Separator color={COLORS(isDarkMode).border.normal} />
            </React.Fragment>
        ))}
    </>
);