import React, { useState, useRef, useEffect } from 'react';
import { UseCaseState, ChannelContentConfig, ThemeOption } from '../../types';
import { CHANNELS_AVAILABLE, VENDORS_BY_CHANNEL, THEMES_BY_VENDOR } from '../../data/mockData';
import { MultiSelectDropdown } from '../MultiSelectDropdown';
import { AlertCircle, AlertTriangle, Check, ChevronDown, Search, X } from 'lucide-react';

interface Step4Props {
  state: UseCaseState;
  updateState: (updates: Partial<UseCaseState>) => void;
  onNext: () => void;
  onBack: () => void;
  onGoToStep2?: () => void;
}

export const Step4ChannelsContent: React.FC<Step4Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [themeSearch, setThemeSearch] = useState<Record<string, string>>({});
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [channelSearchQuery, setChannelSearchQuery] = useState('');
  const channelDropdownRef = useRef<HTMLDivElement>(null);
  const channelSearchInputRef = useRef<HTMLInputElement>(null);

  const allAvailableChannels = CHANNELS_AVAILABLE || ['WhatsApp', 'RCS', 'SMS'];

  // Close channel dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (channelDropdownRef.current && !channelDropdownRef.current.contains(event.target as Node)) {
        setIsChannelDropdownOpen(false);
      }
    }
    if (isChannelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => channelSearchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChannelDropdownOpen]);

  // Channel toggle handlers directly modifying state.selectedChannels
  const handleToggleChannel = (channelName: string) => {
    const exists = state.selectedChannels.includes(channelName);
    const updated = exists
      ? state.selectedChannels.filter((c) => c !== channelName)
      : [...state.selectedChannels, channelName];

    const updatedConfigs = { ...state.channelConfigs };
    if (!exists && !updatedConfigs[channelName]) {
      updatedConfigs[channelName] = { vendors: [], themes: [] };
    }

    updateState({
      selectedChannels: updated,
      channelConfigs: updatedConfigs,
    });
    if (errors.channels) setErrors((prev) => ({ ...prev, channels: '' }));
  };

  const handleSelectAllChannels = () => {
    const updatedConfigs = { ...state.channelConfigs };
    allAvailableChannels.forEach((ch) => {
      if (!updatedConfigs[ch]) {
        updatedConfigs[ch] = { vendors: [], themes: [] };
      }
    });
    updateState({
      selectedChannels: [...allAvailableChannels],
      channelConfigs: updatedConfigs,
    });
    if (errors.channels) setErrors((prev) => ({ ...prev, channels: '' }));
  };

  const handleClearAllChannels = () => {
    updateState({ selectedChannels: [] });
    if (errors.channels) setErrors((prev) => ({ ...prev, channels: '' }));
  };

  const getChannelConfig = (ch: string): ChannelContentConfig => {
    return state.channelConfigs[ch] || { vendors: [], themes: [] };
  };

  const handleVendorsChange = (ch: string, newVendors: string[]) => {
    const prevConfig = getChannelConfig(ch);

    // Filter themes to only those belonging to remaining selected vendors
    const availableThemesForVendors = newVendors.flatMap(
      (v) => THEMES_BY_VENDOR[v] || []
    );
    const validThemeIds = availableThemesForVendors.map((t) => t.id);
    const filteredThemes = prevConfig.themes.filter((tid) => validThemeIds.includes(tid));

    const updatedConfigs = {
      ...state.channelConfigs,
      [ch]: {
        vendors: newVendors,
        themes: filteredThemes,
      },
    };

    updateState({ channelConfigs: updatedConfigs });
    if (errors[ch]) setErrors((prev) => ({ ...prev, [ch]: '' }));
  };

  const handleToggleTheme = (ch: string, themeId: string) => {
    const prevConfig = getChannelConfig(ch);
    let newThemes: string[];
    if (prevConfig.themes.includes(themeId)) {
      newThemes = prevConfig.themes.filter((id) => id !== themeId);
    } else {
      newThemes = [...prevConfig.themes, themeId];
    }

    const updatedConfigs = {
      ...state.channelConfigs,
      [ch]: {
        ...prevConfig,
        themes: newThemes,
      },
    };

    updateState({ channelConfigs: updatedConfigs });
    if (errors[ch]) setErrors((prev) => ({ ...prev, [ch]: '' }));
  };

  const handleSelectAllThemes = (ch: string, availableThemes: ThemeOption[]) => {
    const prevConfig = getChannelConfig(ch);
    const allIds = availableThemes.map((t) => t.id);
    const merged = Array.from(new Set([...prevConfig.themes, ...allIds]));
    const updatedConfigs = {
      ...state.channelConfigs,
      [ch]: { ...prevConfig, themes: merged },
    };
    updateState({ channelConfigs: updatedConfigs });
  };

  const handleClearAllThemes = (ch: string) => {
    const prevConfig = getChannelConfig(ch);
    const updatedConfigs = {
      ...state.channelConfigs,
      [ch]: { ...prevConfig, themes: [] },
    };
    updateState({ channelConfigs: updatedConfigs });
  };

  // Validation before proceed to Review
  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    if (state.selectedChannels.length === 0) {
      newErrors.channels = 'Please select at least one channel';
    } else {
      state.selectedChannels.forEach((ch) => {
        const cfg = getChannelConfig(ch);
        if (cfg.vendors.length === 0) {
          newErrors[ch] = `Please select at least one vendor for ${ch}`;
        } else if (cfg.themes.length === 0) {
          newErrors[ch] = `Please select at least one theme for ${ch}`;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-body">
      {/* ── The White Form Card Container ─────────────────────────────────── */}
      <div className="w-full bg-white rounded-[12px] p-6 sm:p-8 md:p-10 border border-[#E2DDD5] shadow-xs space-y-7">
        {/* ── Select Channel Dropdown ─────────── */}
        <div className="pb-3 border-b border-[#ECE7DE]">
          <div className="w-full sm:w-72 relative" ref={channelDropdownRef}>
            <label className="text-[13px] font-medium text-[#1A1816] mb-1.5 block">
              Select Channel
            </label>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
              className={`w-full min-h-[42px] px-3.5 py-2 rounded-[8px] text-left text-[14px] flex items-center justify-between transition-colors duration-150 outline-none cursor-pointer ${
                isChannelDropdownOpen
                  ? 'bg-[#F9F7F4] border border-[#DCD5C8] shadow-xs'
                  : 'bg-white border border-[#DCD5C8] hover:bg-[#F9F7F4]'
              }`}
            >
              <span className={`truncate pr-2 font-medium ${state.selectedChannels.length === 0 ? 'text-[#807A70]' : 'text-[#1A1816]'}`}>
                {state.selectedChannels.length === 0
                  ? 'Select Channel'
                  : state.selectedChannels.length === 1
                  ? state.selectedChannels[0]
                  : `${state.selectedChannels.length} selected`}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#807A70] transition-transform duration-200 flex-shrink-0 ${
                  isChannelDropdownOpen ? 'rotate-180 text-[#1A1816]' : ''
                }`}
              />
            </button>

            {errors.channels && (
              <span className="text-[11px] text-[#DC2626] mt-1 font-medium block">
                {errors.channels}
              </span>
            )}

            {/* Dropdown Menu */}
            {isChannelDropdownOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-white rounded-[8px] border border-[#DCD5C8] shadow-lg p-2.5 w-full min-w-[260px] animate-in fade-in zoom-in-95 duration-100">
                {/* Header Controls: Search + Select all / Clear all */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#ECE7DE]">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-[#807A70] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      ref={channelSearchInputRef}
                      type="text"
                      value={channelSearchQuery}
                      onChange={(e) => setChannelSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-8 pr-2 py-1 text-[12px] bg-[#FAF9F7] text-[#1A1816] border border-[#DCD5C8] rounded-[5px] outline-none focus:bg-white placeholder:text-[#807A70]"
                    />
                  </div>

                  {/* Select all | Clear all in coral/orange */}
                  <div className="flex items-center text-[11px] font-semibold text-[#FF5C35] whitespace-nowrap pl-1">
                    <button
                      type="button"
                      onClick={handleSelectAllChannels}
                      className="hover:underline hover:text-[#E54A25] cursor-pointer"
                    >
                      Select all
                    </button>
                    <span className="mx-1 text-[#DCD5C8]">|</span>
                    <button
                      type="button"
                      onClick={handleClearAllChannels}
                      className="hover:underline hover:text-[#E54A25] cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                {/* Channel options list */}
                <div className="max-h-56 overflow-y-auto pr-0.5 space-y-1">
                  {allAvailableChannels
                    .filter((c) => c.toLowerCase().includes(channelSearchQuery.toLowerCase()))
                    .map((channelName) => {
                      const isSelected = state.selectedChannels.includes(channelName);
                      return (
                        <div
                          key={channelName}
                          onClick={() => handleToggleChannel(channelName)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[13px] cursor-pointer transition-colors duration-100 ${
                            isSelected
                              ? 'bg-[#FFF2ED] text-[#1A1816] font-medium'
                              : 'hover:bg-[#F5F2EC] text-[#3A3631]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#1A1816] border border-[#1A1816]'
                                  : 'border border-[#807A70] bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white stroke-[2.5]" />}
                            </span>
                            <span className="truncate">{channelName}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Columns for each channel (matching Image 3) ─────────── */}
        {state.selectedChannels.length === 0 ? (
          <div className="p-8 rounded-[12px] bg-[#FAF9F7] border border-dashed border-[#DCD5C8] text-center text-[#807A70] text-[13.5px]">
            Please select one or more channels above to configure vendors and themes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {state.selectedChannels.map((channel) => {
              const config = getChannelConfig(channel);
              const availableVendors = VENDORS_BY_CHANNEL[channel] || ['Infobip', 'Netcore'];
              const q = themeSearch[channel] || '';

              // Gather all themes for selected vendors grouped by vendor
              const vendorThemeGroups = config.vendors.map((vendorName) => {
                const themes = (THEMES_BY_VENDOR[vendorName] || []).filter((t) =>
                  t.name.toLowerCase().includes(q.toLowerCase())
                );
                return { vendorName, themes };
              });

              const allAvailableThemesForChannel = config.vendors.flatMap(
                (v) => THEMES_BY_VENDOR[v] || []
              );

              return (
                <div
                  key={channel}
                  className="bg-[#F5F2EB] rounded-[12px] p-5 space-y-4 shadow-2xs"
                >
                  {/* Channel Header Pill Centered */}
                  <div className="flex items-center justify-center">
                    <span className="px-5 py-1 rounded-[6px] bg-[#E3DDD4] text-[#1A1816] text-[13px] font-semibold">
                      {channel}
                    </span>
                  </div>

                  {/* Select Vendor Dropdown */}
                  <div className="space-y-1">
                    <MultiSelectDropdown
                      label="Select Vendor"
                      placeholder="Select vendor"
                      options={availableVendors}
                      selectedValues={config.vendors}
                      onChange={(v) => handleVendorsChange(channel, v)}
                    />
                  </div>

                  {/* Select Themes Section */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#1A1816] block">
                      Select Themes
                    </label>

                    {/* Search themes input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#807A70] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={q}
                        onChange={(e) =>
                          setThemeSearch((prev) => ({ ...prev, [channel]: e.target.value }))
                        }
                        placeholder="Search themes..."
                        disabled={config.vendors.length === 0}
                        className="w-full h-[38px] pl-8 pr-3 text-[13px] bg-white border border-[#DCD5C8] rounded-[6px] outline-none hover:border-[#807A70] focus:border-[#1A1816] placeholder:text-[#807A70] disabled:bg-[#F3EFE9] disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Controls row: Select all | Clear all on left, count (e.g. 3/21) on right */}
                    <div className="flex items-center justify-between text-[11.5px] px-0.5 pt-0.5">
                      <div className="flex items-center text-[#FF5C35] font-semibold">
                        <button
                          type="button"
                          disabled={config.vendors.length === 0}
                          onClick={() =>
                            handleSelectAllThemes(channel, allAvailableThemesForChannel)
                          }
                          className="hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Select all
                        </button>
                        <span className="mx-1 text-[#DCD5C8]">|</span>
                        <button
                          type="button"
                          disabled={config.vendors.length === 0}
                          onClick={() => handleClearAllThemes(channel)}
                          className="hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Clear all
                        </button>
                      </div>

                      <div className="text-[12px] text-[#807A70] font-data">
                        {config.themes.length}/{allAvailableThemesForChannel.length}
                      </div>
                    </div>

                    {/* White box container for themes list (matching Image 3) */}
                    <div className="bg-white rounded-[8px] border border-[#DCD5C8] p-3 h-[290px] overflow-y-auto space-y-3.5 shadow-2xs">
                      {config.vendors.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center text-[12px] text-[#807A70] px-4">
                          Select a vendor above to view available themes
                        </div>
                      ) : vendorThemeGroups.every((g) => g.themes.length === 0) ? (
                        <div className="h-full flex items-center justify-center text-center text-[12px] text-[#807A70]">
                          No themes match your search
                        </div>
                      ) : (
                        vendorThemeGroups.map((group) => {
                          if (group.themes.length === 0) return null;
                          return (
                            <div key={group.vendorName} className="space-y-1">
                              <div className="text-[11px] font-bold text-[#1A1816] uppercase tracking-wider pb-1 border-b border-[#ECE7DE]">
                                {group.vendorName}
                              </div>
                              <div className="space-y-0.5">
                                {group.themes.map((theme) => {
                                  const isThemeSelected = config.themes.includes(theme.id);
                                  return (
                                    <div
                                      key={theme.id}
                                      onClick={() => handleToggleTheme(channel, theme.id)}
                                      className="flex items-center justify-between py-1.5 px-1 rounded-[4px] cursor-pointer hover:bg-[#FAF8F5] transition-colors"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                        <span
                                          className={`w-4 h-4 rounded-[3px] flex items-center justify-center flex-shrink-0 transition-colors ${
                                            isThemeSelected
                                              ? 'bg-[#1A1816] border border-[#1A1816]'
                                              : 'border border-[#9CA3AF] bg-white'
                                          }`}
                                        >
                                          {isThemeSelected && (
                                            <Check className="w-3 h-3 text-white stroke-[2.5]" />
                                          )}
                                        </span>
                                        <span className="text-[13px] text-[#1A1816] truncate font-normal">
                                          {theme.name}
                                        </span>
                                      </div>
                                      <span
                                        className={`text-[12.5px] font-data font-medium flex-shrink-0 ${
                                          theme.templateCount === 0
                                            ? 'text-[#DC2626]'
                                            : 'text-[#1A1816]'
                                        }`}
                                      >
                                        {theme.templateCount}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Validation error for this channel */}
                  {errors[channel] && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-medium pt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors[channel]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom Actions Bar ── */}
      <div className="flex items-center justify-between pt-4 pb-12">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-2 rounded-[8px] text-[13.5px] font-medium bg-[#E8E4DD] text-[#4A453E] hover:bg-[#DDD8D0] transition-colors cursor-pointer"
        >
          Back
        </button>

        <button
          type="button"
          onClick={validateAndProceed}
          className="px-8 py-2 rounded-[8px] text-[13.5px] font-medium bg-[#E8E4DD] text-[#4A453E] hover:bg-[#DDD8D0] hover:text-[#1A1816] transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};
