import * as React from 'react';
const STORAGE_KEY = 'code-analyzer.editorMode';
function readStoredMode() {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw === 'vim' || raw === 'standard')
        return raw;
    return 'standard';
}
export function useEditorMode() {
    const [mode, setMode] = React.useState(readStoredMode);
    React.useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, mode);
        }
        catch {
            // ignore storage errors
        }
    }, [mode]);
    return [mode, setMode];
}
