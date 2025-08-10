import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export function NavigationControls({ prev, next }) {
    return (_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("div", { children: prev ? _jsx(Button, { asChild: true, variant: "outline", children: _jsx(Link, { to: prev, children: "Previous" }) }) : _jsx("span", {}) }), _jsx("div", { children: next ? _jsx(Button, { asChild: true, children: _jsx(Link, { to: next, children: "Next" }) }) : _jsx("span", {}) })] }));
}
