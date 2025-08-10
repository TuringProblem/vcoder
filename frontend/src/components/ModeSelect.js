import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
export function ModeSelect({ mode, onChange, }) {
    return (_jsxs(Select.Root, { value: mode, onValueChange: (v) => onChange(v), children: [_jsxs(Select.Trigger, { className: "inline-flex items-center gap-2 px-2.5 py-1.5 text-m rounded-md border bg-background text-foreground shadow-sm hover:bg-accent/30", children: [_jsx(Select.Value, {}), _jsx(ChevronDown, { className: "h-4 w-4 opacity-70" })] }), _jsx(Select.Portal, { children: _jsx(Select.Content, { className: "z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md", children: _jsxs(Select.Viewport, { className: "p-1", children: [_jsx(Item, { value: "standard", label: "Standard", selected: mode === "standard" }), _jsx(Item, { value: "vim", label: "Vim", selected: mode === "vim" })] }) }) })] }));
}
function Item({ value, label, selected, }) {
    return (_jsxs(Select.Item, { value: value, className: "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground", children: [_jsx("span", { className: "pr-6", children: label }), _jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: selected ? _jsx(Check, { className: "h-4 w-4" }) : null })] }));
}
