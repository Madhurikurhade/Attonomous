import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X, Info } from 'lucide-react';
import { ConsentFlagDefinition } from '../../data/governanceData';

interface ConsentFlagDropdownProps {
  channelName: string;
  statusField: string;
  flags: ConsentFlagDefinition[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export const ConsentFlagDropdown: React.FC<ConsentFlagDropdownProps> = ({
  channelName,
  statusField,
  flags,
  selectedValues,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleToggle = (value: string) => {
    const isSelected = selectedValues.some(
      (v) => v.toLowerCase() === value.toLowerCase()
    );
    let next: string[];
    if (isSelected) {
      next = selectedValues.filter((v) => v.toLowerCase() !== value.toLowerCase());
    } else {
      next = [...selectedValues, value];
    }
    onChange(next);
  };

  const handleSelectAll = () => {
    onChange(flags.map((f) => f.value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const filteredFlags = flags.filter(
    (f) =>
      f.value.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      f.meaning.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Requirement: "and while displaying will display only number"
  const displayString =
    selectedValues.length > 0 ? selectedValues.join(', ') : 'None selected';

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${isOpen ? 'z-50' : 'z-10'} ${className}`}
    >
      {/* Trigger Button: Displays ONLY the numbers / values */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[40px] px-3.5 rounded-[8px] text-left text-[13px] flex items-center justify-between transition-colors outline-none cursor-pointer ${
          isOpen
            ? 'bg-[#FAF9F6] border border-[#1A1816] shadow-xs'
            : 'bg-white border border-[#D5D0C7] hover:border-[#807A70] shadow-2xs'
        }`}
        title={`Excluded flags: ${displayString}`}
      >
        <span
          className={`truncate font-mono ${
            selectedValues.length === 0
              ? 'text-[#807A70] italic'
              : 'text-[#1A1816] font-semibold'
          }`}
        >
          {displayString}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#807A70] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#1A1816]' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] right-0 z-50 bg-white rounded-[10px] border border-[#D5D0C7] shadow-xl p-2.5 min-w-[340px] sm:min-w-[400px] max-h-96 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100 font-body">
          {/* Header Note explaining system-wide impact */}
          <div className="px-3 py-2 bg-[#FFF7ED] border border-[#FFEDD5] rounded-[6px] text-[11.5px] text-[#C2410C] font-medium flex items-start gap-2 mb-2">
            <Info className="w-4 h-4 shrink-0 text-[#EA580C] mt-0.5" />
            <div>
              <span className="font-semibold block">System-Wide Exclusion Rule</span>
              Selected flags will exclude matching customers from {channelName} across{' '}
              <strong>all Use Cases</strong>.
            </div>
          </div>

          {/* Search Bar with Orange Focus Border */}
          <div className="relative flex items-center mb-2">
            <Search className="w-4 h-4 text-[#807A70] absolute left-2.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flag or meaning..."
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

          {/* Multi-select Summary Bar */}
          <div className="flex items-center justify-between px-2 py-1 bg-[#FAF9F6] border-b border-[#ECE7DE] text-[11.5px] text-[#706B62] rounded-t-[4px] mb-1">
            <span className="font-medium">
              {selectedValues.length} excluded of {flags.length} flags
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

          {/* Flags List with Full Meaning */}
          <div className="overflow-y-auto max-h-60 space-y-1 pr-0.5">
            {filteredFlags.length === 0 ? (
              <div className="py-4 text-center text-[12.5px] text-[#807A70]">
                No flags matching &ldquo;{searchTerm}&rdquo;
              </div>
            ) : (
              filteredFlags.map((flag) => {
                const isSelected = selectedValues.some(
                  (v) => v.toLowerCase() === flag.value.toLowerCase()
                );

                return (
                  <button
                    type="button"
                    key={flag.value}
                    onClick={() => handleToggle(flag.value)}
                    className={`w-full text-left flex items-start gap-2.5 p-2 rounded-[6px] text-[12.5px] transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FFF2ED] border-[#FFD8CC] text-[#1A1816]'
                        : 'bg-white border-transparent hover:bg-[#FAF9F6] text-[#1A1816]'
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={`w-4 h-4 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                        isSelected
                          ? 'bg-[#FF5C35] border-[#FF5C35] text-white'
                          : 'border-[#C8C2B7] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    {/* Flag number & full meaning */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[12px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-[#FF5C35]/15 text-[#C2410C]'
                              : 'bg-[#EAE5DC] text-[#4A453E]'
                          }`}
                        >
                          {flag.value}
                        </span>
                        <span
                          className={`text-[12.5px] font-medium leading-snug ${
                            isSelected ? 'text-[#C2410C] font-semibold' : 'text-[#1A1816]'
                          }`}
                        >
                          {flag.meaning}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Done Button */}
          <div className="pt-2 mt-1 border-t border-[#ECE7DE] flex items-center justify-between">
            <span className="text-[11px] text-[#807A70]">
              Click to toggle exclusions
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm('');
              }}
              className="px-4 py-1.5 bg-[#FF5C35] hover:bg-[#E04F2E] text-white text-[12px] font-semibold rounded-[6px] cursor-pointer transition-colors shadow-2xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
