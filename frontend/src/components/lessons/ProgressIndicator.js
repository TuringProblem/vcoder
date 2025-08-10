import { jsx as _jsx } from "react/jsx-runtime";
export function ProgressIndicator({ percent }) {
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    return (_jsx("div", { className: "w-full bg-muted rounded h-2", "aria-label": "Progress", children: _jsx("div", { className: "bg-primary h-2 rounded", style: { width: `${p}%` } }) }));
}
