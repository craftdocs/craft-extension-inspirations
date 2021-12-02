import React from "react";
import { ApiResponse, CraftAPI, CraftTextBlock } from "@craftdocs/craft-extension-api";

export function assertNever(n: never): never {
    throw new Error(`assertNever(${JSON.stringify(n)})`);
}

export const catNulls = <T, U>(
    f: (t: T) => U | null,
    ts: T[]
): U[] => ts.reduce((acc, val) => {
    const u = f(val);
    if (u != null) {
        acc.push(u);
    }
    return acc;
}, [] as U[]);

export function withCraft<T>(
    action: (api: CraftAPI) => T
): T | undefined {
    if (typeof craft === "undefined") {
        return;
    }
    return action(craft);
}

export type Setter<T> = (t: T) => void;

export type Message =
    | { type: "error", error: string }
    | { type: "info", info: string };

type TimeoutHandle = ReturnType<typeof setTimeout>;

export function useMessage(
    fadeInterval: number
): [Message | null, (message: Message) => void] {
    const [message, setMessage] = React.useState<Message | null>(null);
    const [
        timeoutHandle,
        setTimeoutHandle
    ] = React.useState<TimeoutHandle | null>(null);

    const setErrorMessage = React.useCallback((message: Message) => {
        if (timeoutHandle != null) {
            clearTimeout(timeoutHandle);
        }
        setMessage(message);
        const handle = setTimeout(() => setMessage(null), fadeInterval);
        setTimeoutHandle(handle);
    }, [timeoutHandle, setMessage]);

    return [message, setErrorMessage];
}

export function fromApiResponse<T, U>(
    response: ApiResponse<T>,
    defaultValue: U
): T | U {
    if (response.status === "success") {
        return response.data;
    }
    return defaultValue;
}
