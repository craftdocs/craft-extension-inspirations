import React from "react";
import { GhostConfig } from "./backends/Ghost";
import { MediumConfig } from "./backends/Medium";
import { Setter } from "./utils";

export interface GhostState {
    ghostConfig: Partial<GhostConfig>;
    setUrl: Setter<string>;
    setKey: Setter<string>;
    setGhostConfig: Setter<Partial<GhostConfig>>;
}

export function useGhostConfig(): GhostState {
    const [
        ghostConfig,
        setGhostConfig
    ] = React.useState<Partial<GhostConfig>>({ });

    const setUrl = React.useCallback(
        (url: string) => setGhostConfig({ ...ghostConfig, url }),
        [setGhostConfig, ghostConfig],
    );

    const setKey = React.useCallback(
        (key: string) => setGhostConfig({ ...ghostConfig, key }),
        [setGhostConfig, ghostConfig],
    );

    const memoed = React.useMemo(
        () => ({ ghostConfig, setUrl, setKey, setGhostConfig }),
        [ghostConfig, setUrl, setKey]
    );

    return memoed;
}

export function ghostConfigValid(
    config: Partial<GhostConfig>
): config is GhostConfig {
    return config.key != null && config.url != null;
}

export interface MediumState {
    mediumConfig: Partial<MediumConfig>;
    setToken: Setter<string>;
}

export function useMediumConfig(): MediumState {
    const [
        mediumConfig,
        setMediumConfig
    ] = React.useState<Partial<MediumConfig>>({ });

    const setToken = React.useCallback(
        (token: string) => setMediumConfig({ token }),
        [mediumConfig, setMediumConfig],
    );

    const memoed = React.useMemo(
        () => ({ mediumConfig, setToken }),
        [mediumConfig, setToken]
    );

    return memoed;
}

export function mediumConfigValid(
    config: Partial<MediumConfig>
): config is MediumConfig {
    return config.token != null;
}