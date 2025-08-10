import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export function MainLayout({ children }) {
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsxs("header", { className: "border-b px-4 h-12 flex items-center gap-4", children: [_jsx(Link, { to: "/", className: "font-semibold", children: "CodeLearn" }), _jsxs("nav", { className: "ml-auto flex items-center gap-3 text-sm", children: [_jsx(Link, { className: "underline", to: "/", children: "Courses" }), _jsx(Link, { className: "underline", to: "/dashboard", children: "Dashboard" })] })] }), _jsx("main", { className: "flex-1", children: children }), _jsxs("footer", { className: "border-t px-4 h-12 flex items-center text-xs text-muted-foreground", children: ["\u00A9 ", new Date().getFullYear(), " CodeLearn"] })] }));
}
