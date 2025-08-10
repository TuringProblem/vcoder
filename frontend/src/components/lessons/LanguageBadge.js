import { jsx as _jsx } from "react/jsx-runtime";
import { Badge } from "@/components/ui/badge";
export function LanguageBadge({ language }) {
    return _jsx(Badge, { variant: "outline", className: "capitalize", children: language });
}
