import { MutableRefObject, useCallback, useRef, useState } from "react";
import timeAgo from "time-ago";

export function useStateWithRefPair<T>(initValue: T): [T, (v: T) => void, MutableRefObject<T>] {
  const [ value , origSetValue ] = useState<T>(initValue);
  const valueRef = useRef<T>(initValue);

  const setValue = useCallback((v: T) => {
    valueRef.current = v;
    origSetValue(valueRef.current);
  }, [origSetValue]);

  return [ value, setValue, valueRef];
}

export function niceTimeAgo(timeMs: number, isShort: boolean) {
  let timeStr;
  if ((new Date().getTime() - timeMs) < 60 * 1000) {
    timeStr = "Just now";
  } else if (isShort) {
    timeStr = `${timeAgo.ago(timeMs, true) as string} ago`;
    if (new Date().getTime() - timeMs > 1000 * 60 * 60 * 24) {
      // minutes and months are both "m", so using "mo" for month
      timeStr = timeStr.replace("m", "mo");
    }
  } else {
    timeStr = timeAgo.ago(timeMs) as string;
  }
  return timeStr;
}

export function safeJsonParse(jsonStr: string | null | undefined): unknown | null {
  if (jsonStr == null || jsonStr === "") {
    return null;
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    const message = e instanceof Error ? e.message : null;
    console.error("JsonSyntaxError", message);
    return null;
  }
}

export function safeJsonStringify(obj: unknown | null | undefined): string | null {
  if (obj == null) {
    return null;
  }
  try {
    return JSON.stringify(obj);
  } catch (e) {
    const message = e instanceof Error ? e.message : null;
    console.error("TypeError", message);
    return null;
  }
}
