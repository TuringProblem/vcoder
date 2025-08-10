import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from '@/pages/Routing';
import './index.css';
const root = createRoot(document.getElementById('root'));
root.render(_jsx(React.StrictMode, { children: _jsx(AppRouter, {}) }));
