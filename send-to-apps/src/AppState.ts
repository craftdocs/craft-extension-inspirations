export interface AppState {
    messageShown: boolean;
}

const validateAppState = (maybeAppState: any): AppState | null => {
    const messageShown = maybeAppState?.messageShown;
    if (messageShown == null || typeof messageShown != "boolean") {
        return null;
    }

    return {
        messageShown,
    };
}

export const MkAppState = {
    from: (messageShown: boolean): AppState => ({ messageShown }),
    basic: (): AppState => ({ messageShown: false }),
    full: (): AppState => ({ messageShown: true }),
    validate: validateAppState
};

export const AppStateTransitions  = {
    toggleMessage: ({ messageShown }: AppState) => ({ messageShown: !messageShown }),
};
