"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { INDONESIAN_PROVINCES } from "@/data/provinces";
import { cn } from "@/lib/utils";

type ProvinceComboboxProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  className?: string;
};

export default function ProvinceCombobox({
  id: idProp,
  value,
  onChange,
  onBlur,
  invalid = false,
  className,
}: ProvinceComboboxProps) {
  const autoId = useId();
  const inputId = idProp ?? autoId;
  const listboxId = `${inputId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...INDONESIAN_PROVINCES];
    return INDONESIAN_PROVINCES.filter((prov) =>
      prov.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onBlur]);

  const selectProvince = (prov: string) => {
    onChange(prov);
    setQuery(prov);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (event.key === "Enter" && open && activeIndex >= 0 && options[activeIndex]) {
      event.preventDefault();
      selectProvince(options[activeIndex]);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      setQuery(value);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={invalid}
          value={query}
          placeholder="Pilih atau ketik nama provinsi"
          autoComplete="address-level1"
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            setOpen(true);
            setActiveIndex(0);
            const exact = INDONESIAN_PROVINCES.find((prov) => prov === next);
            onChange(exact ?? "");
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setQuery(value);
            onBlur?.();
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full rounded-subtle border border-hairlineDivider bg-white px-3 py-2.5 pr-9 text-sm text-headlineBlack placeholder:text-captionGray focus-visible:border-navyCore",
            invalid && "border-accentRed",
            className
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Buka daftar provinsi"
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-navyCore hover:bg-offWhiteSection"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && options.length > 0 ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-subtle border border-hairlineDivider bg-white py-1 shadow-card"
        >
          {options.map((prov, index) => (
            <li key={prov} role="option" aria-selected={value === prov}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectProvince(prov)}
                className={cn(
                  "flex w-full px-3 py-2 text-left text-sm text-headlineBlack hover:bg-offWhiteSection",
                  (value === prov || index === activeIndex) && "bg-navyCore/5"
                )}
              >
                {prov}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && query.trim() && options.length === 0 ? (
        <div className="absolute z-20 mt-1 w-full rounded-subtle border border-hairlineDivider bg-white px-3 py-2 text-sm text-captionGray shadow-card">
          Provinsi tidak ditemukan.
        </div>
      ) : null}
    </div>
  );
}
