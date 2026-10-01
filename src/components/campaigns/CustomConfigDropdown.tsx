import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Star, Search, X } from 'lucide-react';

export interface ConfigDropdownOption {
  value: string;
  label: string;
  isRecommended?: boolean;
}

interface CustomConfigDropdownProps {
  label?: string;
  badge?: React.ReactNode;
  value?: string;
  options: ConfigDropdownOption[];
  onChange?: (value: string) => void;
  // Multi-select support
  multiSelect?: boolean;
  selectedValues?: string[];
  onMultiChange?: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  withSearch?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export const CustomConfigDropdown: React.FC<CustomConfigDropdownProps> = ({
  label,
  badge,
  value = '',
  options,
  onChange,
  multiSelect = false,
  selectedValues,
  onMultiChange,
  placeholder = 'Select option',
  searchPlaceholder,
  withSearch = true,
  disabled = false,
  className = '',
  triggerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Derive current multi-selection
  const currentMultiValues: string[] = multiSelect
    ? selectedValues !== undefined
      ? selectedValues
      : value
      ? value.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    : [];

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Display label calculation
  let displayLabel = '';
  if (multiSelect) {
    if (currentMultiValues.length === 0) {
      displayLabel = placeholder;
    } else if (currentMultiValues.length === 1) {
      const match = options.find((opt) => opt.value === currentMultiValues[0]);
      displayLabel = match ? match.label : currentMultiValues[0];
    } else {
      // Multiple items selected: join them nicely
      displayLabel = currentMultiValues
        .map((v) => {
          const match = options.find((opt) => opt.value === v);
          return match ? match.label : v;
        })
        .join(', ');
    }
  } else {
    const selectedOption = options.find((opt) => opt.value === value);
    displayLabel = selectedOption ? selectedOption.label : value || placeholder;
  }

  const handleSelectSingle = (val: string) => {
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggleMulti = (val: string) => {
    let next: string[];
    if (currentMultiValues.includes(val)) {
      next = currentMultiValues.filter((v) => v !== val);
    } else {
      next = [...currentMultiValues, val];
    }

    if (onMultiChange) {
      onMultiChange(next);
    }
    if (onChange) {
      onChange(next.join(', '));
    }
  };

  const handleSelectAll = () => {
    const all = options.map((opt) => opt.value);
    if (onMultiChange) {
      onMultiChange(all);
    }
    if (onChange) {
      onChange(all.join(', '));
    }
  };

  const handleClearAll = () => {
    if (onMultiChange) {
      onMultiChange([]);
    }
    if (onChange) {
      onChange('');
    }
  };

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      opt.value.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const hasSelection = multiSelect ? currentMultiValues.length > 0 : Boolean(value);

  return (
    <div
      className={`relative flex flex-col ${isOpen ? 'z-50' : 'z-10'} ${className}`}
      ref={containerRef}
    >
      {/* Label and optional Badge */}
      {(label || badge) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <label className="text-[12px] font-medium text-[#706B62]">
              {label}
            </label>
          )}
          {badge && <div>{badge}</div>}
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 rounded-[6px] text-left text-[13px] flex items-center justify-between transition-colors outline-none cursor-pointer ${
          triggerClassName ? triggerClassName : 'h-[38px]'
        } ${
          disabled
            ? 'bg-[#EFECE6] text-[#A8A299] cursor-not-allowed border border-[#D5D0C7]'
            : isOpen
            ? 'bg-[#FAF9F6] border border-[#1A1816] shadow-2xs'
            : 'bg-white border border-[#DCD5C8] hover:border-[#807A70] shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <span
            className={`truncate ${
              !hasSelection ? 'text-[#807A70]' : 'text-[#1A1816] font-medium'
            }`}
            title={displayLabel}
          >
            {displayLabel}
          </span>
          {!multiSelect &&
            options.find((opt) => opt.value === value)?.isRecommended && (
              <span className="text-[11px] font-medium text-[#EA580C] bg-[#FFF7ED] px-1.5 py-0.2 rounded border border-[#FFEDD5] shrink-0">
                ★ (Recommended)
              </span>
            )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#807A70] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#1A1816]' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover matching Image 1 */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white rounded-[8px] border border-[#D5D0C7] shadow-xl p-2 min-w-[220px] max-h-80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100 font-body">
          {/* Search Bar - styled exactly per Image 1 with orange border */}
          {withSearch && (
            <div className="p-1 pb-2">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#807A70] absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    searchPlaceholder ||
                    `Search ${label ? label.toLowerCase() : 'options'}...`
                  }
                  className="w-full pl-8 pr-7 py-1.5 text-[12.5px] bg-white text-[#1A1816] border border-[#FF5C35] rounded-[6px] outline-none placeholder:text-[#807A70] transition-colors"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 text-[#807A70] hover:text-[#1A1816] p-0.5 rounded cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Multi-select header with Select All / Clear */}
          {multiSelect && (
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#FAF9F6] border-b border-[#ECE7DE] text-[11.5px] text-[#706B62] rounded-t-[4px]">
              <span className="font-medium">
                {currentMultiValues.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[#FF5C35] hover:underline font-medium cursor-pointer"
                >
                  Select All
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[#807A70] hover:text-[#1A1816] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto max-h-56 pt-1 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-[12.5px] text-[#807A70]">
                {searchTerm ? 'No matching results found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = multiSelect
                  ? currentMultiValues.includes(opt.value)
                  : value === opt.value;

                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() =>
                      multiSelect
                        ? handleToggleMulti(opt.value)
                        : handleSelectSingle(opt.value)
                    }
                    className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-[6px] text-[13px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF2ED] text-[#FF5C35] font-semibold'
                        : 'text-[#1A1816] hover:bg-[#F5F2EC] font-normal'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.isRecommended && (
                        <span className="text-[10.5px] font-semibold text-[#EA580C] bg-[#FFF7ED] px-1.5 py-0.2 rounded border border-[#FFEDD5] shrink-0 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-[#EA580C]" />
                          <span>Recommended</span>
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check
                        className="w-4 h-4 text-[#FF5C35] shrink-0"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Done button for multi-select */}
          {multiSelect && (
            <div className="p-1 pt-2 border-t border-[#ECE7DE] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="px-3 py-1 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[12px] font-semibold rounded-[4px] cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
