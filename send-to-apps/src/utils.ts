import React from "react";

export const catNulls = <T, U>(f: (_: T) => U | null, ts: T[]): U[] => ts.reduce((acc, val) => {
    const u = f(val);
    if (u != null) {
        acc.push(u);
    }
    return acc;
}, [] as U[]);

export function useErrorMessage(fadeInterval: number): [string | null, (message: string) => void] {
    const [message, setMessage] = React.useState<string | null>(null);
    const [timeoutHandle, setTimeoutHandle] = React.useState<number>(0);

    const setErrorMessage = React.useCallback((message: string) => {
        clearTimeout(timeoutHandle);
        setMessage(message);
        const handle = setTimeout(() => setMessage(null), fadeInterval);
        setTimeoutHandle(handle);
    }, [timeoutHandle, setMessage]);

    return [message, setErrorMessage];
}