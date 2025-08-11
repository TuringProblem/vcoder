"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockAnalyze } from "@/pages/dev-view/lib/api";
import type { AnalysisResponse, Language } from "@/types/analysis";
import { useEditorStore } from "@/pages/dev-view/store";

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export function useCodeAnalysis(language: Language, code: string) {
  const debounced = useDebounced({ language, code }, 300);
  const { pushHistory } = useEditorStore.getState();

  const query = useQuery<AnalysisResponse>({
    queryKey: ["analysis", debounced.language, debounced.code],
    queryFn: async () => {
      const res = await mockAnalyze(debounced.language, debounced.code);
      pushHistory(res);
      return res;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return query;
}
