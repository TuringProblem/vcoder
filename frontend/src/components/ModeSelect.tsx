import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { EditorMode } from '@/lib/useEditorMode'

export function ModeSelect({ mode, onChange }: { mode: EditorMode; onChange: (m: EditorMode) => void }) {
  return (
    <Select.Root value={mode} onValueChange={(v) => onChange(v as EditorMode)}>
      <Select.Trigger className="inline-flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md border bg-background text-foreground shadow-sm hover:bg-accent/30">
        <Select.Value />
        <ChevronDown className="h-4 w-4 opacity-70" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
          <Select.Viewport className="p-1">
            <Item value="standard" label="Standard" selected={mode === 'standard'} />
            <Item value="vim" label="Vim" selected={mode === 'vim'} />
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

function Item({ value, label, selected }: { value: string; label: string; selected?: boolean }) {
  return (
    <Select.Item
      value={value}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
    >
      <span className="pr-6">{label}</span>
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        {selected ? <Check className="h-4 w-4" /> : null}
      </span>
    </Select.Item>
  )
}
